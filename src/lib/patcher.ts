import type { ScoreResult } from './scorer.js';
import type { ParsedReadme } from './parser.js';

export interface Patch {
  description: string;
  original: string;
  patched: string;
}

export function generatePatches(readme: ParsedReadme, result: ScoreResult): Patch | null {
  const missingItems = result.items.filter(i => i.status === 'missing' && i.suggestion);
  const weakItems = result.items.filter(i => i.status === 'weak' && i.suggestion);

  if (missingItems.length === 0 && weakItems.length === 0) return null;

  const lines = [...readme.lines];
  const additions: string[] = [];

  for (const item of missingItems) {
    // Skip bonus items (code examples, badges, sufficient length) — can't auto-generate meaningful content
    if (item.label === 'Code examples' || item.label === 'Badges' || item.label === 'Sufficient length') {
      continue;
    }

    if (item.label === 'Title / Project Name') {
      // Prepend a title if missing
      additions.unshift('# My Project\n');
      continue;
    }

    const sectionContent = getSectionTemplate(item.label);
    if (sectionContent) {
      additions.push(sectionContent);
    }
  }

  if (additions.length === 0) return null;

  const appendix = '\n' + additions.join('\n');
  const patched = readme.raw.trimEnd() + appendix + '\n';

  return {
    description: `Add ${additions.length} missing section(s)`,
    original: readme.raw,
    patched,
  };
}

function getSectionTemplate(label: string): string | null {
  switch (label) {
    case 'Description':
      return '## Description\n\n<!-- TODO: Describe what this project does and why it exists. -->\n';
    case 'Installation':
      return '## Installation\n\n```bash\nnpm install <package-name>\n```\n';
    case 'Usage':
      return '## Usage\n\n```bash\n# TODO: Add usage examples\n```\n';
    case 'License':
      return '## License\n\nMIT\n';
    case 'Contributing':
      return '## Contributing\n\nContributions are welcome! Please open an issue or submit a pull request.\n';
    default:
      return null;
  }
}

export function formatDiff(patch: Patch): string {
  const oldLines = patch.original.split('\n');
  const newLines = patch.patched.split('\n');

  const lines: string[] = [];
  lines.push('--- a/README.md');
  lines.push('+++ b/README.md');

  // Simple append diff — show the added lines at the end
  const commonEnd = oldLines.length;
  const addedLines = newLines.slice(commonEnd);

  if (addedLines.length > 0) {
    lines.push(`@@ -${commonEnd},0 +${commonEnd + 1},${addedLines.length} @@`);
    for (const line of addedLines) {
      lines.push(`+${line}`);
    }
  }

  return lines.join('\n');
}
