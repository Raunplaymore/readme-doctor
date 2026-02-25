import type { ParsedReadme } from './parser.js';

export interface ScoreItem {
  label: string;
  score: number;
  maxScore: number;
  status: 'pass' | 'weak' | 'missing';
  suggestion?: string;
}

export interface ScoreResult {
  total: number;
  maxTotal: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  items: ScoreItem[];
}

interface SectionRule {
  label: string;
  patterns: RegExp[];
  maxScore: number;
  minContentWords: number;
  suggestion: string;
}

const SECTION_RULES: SectionRule[] = [
  {
    label: 'Title / Project Name',
    patterns: [/^.+$/],  // any H1 title
    maxScore: 5,
    minContentWords: 0,
    suggestion: 'Add a clear H1 title at the top of your README.',
  },
  {
    label: 'Description',
    patterns: [/description/i, /about/i, /overview/i, /what is/i],
    maxScore: 15,
    minContentWords: 20,
    suggestion: 'Add a "Description" or "About" section explaining what the project does (at least 20 words).',
  },
  {
    label: 'Installation',
    patterns: [/install/i, /getting started/i, /setup/i, /quick start/i],
    maxScore: 20,
    minContentWords: 10,
    suggestion: 'Add an "Installation" section with step-by-step setup instructions.',
  },
  {
    label: 'Usage',
    patterns: [/usage/i, /how to use/i, /examples?/i, /guide/i],
    maxScore: 20,
    minContentWords: 15,
    suggestion: 'Add a "Usage" section showing how to use the project with examples.',
  },
  {
    label: 'License',
    patterns: [/licen[sc]e/i],
    maxScore: 10,
    minContentWords: 3,
    suggestion: 'Add a "License" section (e.g., "MIT License").',
  },
  {
    label: 'Contributing',
    patterns: [/contribut/i, /how to help/i, /development/i],
    maxScore: 10,
    minContentWords: 10,
    suggestion: 'Add a "Contributing" section to help others contribute.',
  },
];

const BONUS_RULES: { label: string; check: (r: ParsedReadme) => boolean; score: number; suggestion: string }[] = [
  {
    label: 'Code examples',
    check: (r) => r.hasCodeBlocks,
    score: 10,
    suggestion: 'Add code blocks (```) to show usage examples.',
  },
  {
    label: 'Badges',
    check: (r) => r.hasBadges,
    score: 5,
    suggestion: 'Add status badges (CI, npm version, license) at the top.',
  },
  {
    label: 'Sufficient length',
    check: (r) => r.wordCount >= 100,
    score: 5,
    suggestion: 'Expand your README to at least 100 words for adequate coverage.',
  },
];

function findSection(readme: ParsedReadme, rule: SectionRule): { found: boolean; contentWords: number } {
  // Special case: title check
  if (rule.label === 'Title / Project Name') {
    return { found: readme.title !== null, contentWords: 0 };
  }

  // Check explicit sections by heading
  for (const section of readme.sections) {
    for (const pattern of rule.patterns) {
      if (pattern.test(section.heading)) {
        const words = section.content.split(/\s+/).filter(w => w.length > 0).length;
        return { found: true, contentWords: words };
      }
    }
  }

  // Fallback for Description: check if H1 title section has substantial content
  // Many READMEs write the description directly under the title without a separate heading
  if (rule.label === 'Description' && readme.sections.length > 0) {
    const titleSection = readme.sections.find(s => s.level === 1);
    if (titleSection) {
      const words = titleSection.content.split(/\s+/).filter(w => w.length > 0).length;
      if (words >= 10) {
        return { found: true, contentWords: words };
      }
    }
  }

  return { found: false, contentWords: 0 };
}

export function scoreReadme(readme: ParsedReadme): ScoreResult {
  const items: ScoreItem[] = [];

  // Section rules
  for (const rule of SECTION_RULES) {
    const { found, contentWords } = findSection(readme, rule);

    if (!found) {
      items.push({
        label: rule.label,
        score: 0,
        maxScore: rule.maxScore,
        status: 'missing',
        suggestion: rule.suggestion,
      });
    } else if (rule.minContentWords > 0 && contentWords < rule.minContentWords) {
      const partial = Math.round(rule.maxScore * 0.5);
      items.push({
        label: rule.label,
        score: partial,
        maxScore: rule.maxScore,
        status: 'weak',
        suggestion: `"${rule.label}" section exists but is too short. Add more detail (at least ${rule.minContentWords} words).`,
      });
    } else {
      items.push({
        label: rule.label,
        score: rule.maxScore,
        maxScore: rule.maxScore,
        status: 'pass',
      });
    }
  }

  // Bonus rules
  for (const rule of BONUS_RULES) {
    if (rule.check(readme)) {
      items.push({
        label: rule.label,
        score: rule.score,
        maxScore: rule.score,
        status: 'pass',
      });
    } else {
      items.push({
        label: rule.label,
        score: 0,
        maxScore: rule.score,
        status: 'missing',
        suggestion: rule.suggestion,
      });
    }
  }

  const total = items.reduce((sum, i) => sum + i.score, 0);
  const maxTotal = items.reduce((sum, i) => sum + i.maxScore, 0);

  let grade: ScoreResult['grade'];
  if (total >= 80) grade = 'A';
  else if (total >= 60) grade = 'B';
  else if (total >= 40) grade = 'C';
  else if (total >= 20) grade = 'D';
  else grade = 'F';

  return { total, maxTotal, grade, items };
}
