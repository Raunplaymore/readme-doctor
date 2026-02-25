import { existsSync } from 'fs';
import { resolve } from 'path';
import pc from 'picocolors';
import { readReadme, parseReadme } from '../lib/parser.js';
import { scoreReadme } from '../lib/scorer.js';

interface CheckOptions {
  file?: string;
  minScore?: string;
  strict?: boolean;
}

export function cmdCheck(options: CheckOptions): void {
  const filePath = resolve(options.file || 'README.md');

  if (!existsSync(filePath)) {
    console.error(pc.red(`Error: ${filePath} not found.`));
    process.exit(1);
  }

  const raw = readReadme(filePath);
  const readme = parseReadme(raw);
  const result = scoreReadme(readme);

  // Header
  const gradeColor = result.grade === 'A' ? pc.green
    : result.grade === 'B' ? pc.blue
    : result.grade === 'C' ? pc.yellow
    : pc.red;

  console.log('');
  console.log(`  ${pc.bold('README Doctor')}  ${gradeColor(pc.bold(`${result.total}/${result.maxTotal} (${result.grade})`))}`);
  console.log(`  ${pc.dim(filePath)}`);
  console.log('');

  // Items
  for (const item of result.items) {
    const icon = item.status === 'pass' ? pc.green('✓')
      : item.status === 'weak' ? pc.yellow('△')
      : pc.red('✗');
    const score = `${String(item.score).padStart(2)}/${item.maxScore}`;
    console.log(`  ${icon}  ${score}  ${item.label}`);
    if (item.suggestion) {
      console.log(`         ${pc.dim(item.suggestion)}`);
    }
  }

  console.log('');

  // Suggestions summary
  const missing = result.items.filter(i => i.status === 'missing');
  const weak = result.items.filter(i => i.status === 'weak');

  if (missing.length > 0 || weak.length > 0) {
    console.log(`  ${pc.dim('Run')} ${pc.cyan('readme-doctor fix')} ${pc.dim('to generate patches.')}`);
    console.log('');
  }

  // CI exit codes
  if (options.minScore) {
    const min = parseInt(options.minScore, 10);
    if (!isNaN(min) && result.total < min) {
      console.error(pc.red(`  Score ${result.total} is below minimum ${min}. Failing.`));
      process.exit(1);
    }
  }

  if (options.strict && (missing.length > 0 || weak.length > 0)) {
    console.error(pc.red(`  Strict mode: ${missing.length} missing, ${weak.length} weak section(s). Failing.`));
    process.exit(1);
  }
}
