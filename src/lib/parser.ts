import { readFileSync } from 'fs';

export interface ReadmeSection {
  heading: string;
  level: number;
  content: string;
  lineStart: number;
  lineEnd: number;
}

export interface ParsedReadme {
  raw: string;
  lines: string[];
  title: string | null;
  sections: ReadmeSection[];
  wordCount: number;
  hasCodeBlocks: boolean;
  hasBadges: boolean;
  hasImages: boolean;
  hasLinks: boolean;
}

export function readReadme(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

export function parseReadme(raw: string): ParsedReadme {
  const lines = raw.split('\n');
  const sections: ReadmeSection[] = [];
  let title: string | null = null;

  let currentSection: ReadmeSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

    if (headingMatch) {
      if (currentSection) {
        currentSection.lineEnd = i - 1;
        currentSection.content = lines.slice(currentSection.lineStart + 1, i).join('\n').trim();
        sections.push(currentSection);
      }

      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      if (level === 1 && !title) {
        title = heading;
      }

      currentSection = {
        heading,
        level,
        content: '',
        lineStart: i,
        lineEnd: i,
      };
    }
  }

  if (currentSection) {
    currentSection.lineEnd = lines.length - 1;
    currentSection.content = lines.slice(currentSection.lineStart + 1).join('\n').trim();
    sections.push(currentSection);
  }

  const wordCount = raw.split(/\s+/).filter(w => w.length > 0).length;
  const hasCodeBlocks = /```[\s\S]*?```/.test(raw);
  const hasBadges = /\[!\[.*?\]\(.*?\)\]\(.*?\)/.test(raw) || /!\[.*?badge.*?\]/i.test(raw);
  const hasImages = /!\[.*?\]\(.*?\)/.test(raw);
  const hasLinks = /\[.*?\]\(.*?\)/.test(raw);

  return {
    raw,
    lines,
    title,
    sections,
    wordCount,
    hasCodeBlocks,
    hasBadges,
    hasImages,
    hasLinks,
  };
}
