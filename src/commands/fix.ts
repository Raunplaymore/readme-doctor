import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import pc from 'picocolors';
import { readReadme, parseReadme } from '../lib/parser.js';
import { scoreReadme } from '../lib/scorer.js';
import { generatePatches, formatDiff } from '../lib/patcher.js';

interface FixOptions {
  file?: string;
  write?: boolean;
}

export function cmdFix(options: FixOptions): void {
  const filePath = resolve(options.file || 'README.md');

  if (!existsSync(filePath)) {
    console.error(pc.red(`Error: ${filePath} not found.`));
    process.exit(1);
  }

  const raw = readReadme(filePath);
  const readme = parseReadme(raw);
  const result = scoreReadme(readme);

  const patch = generatePatches(readme, result);

  if (!patch) {
    console.log(pc.green('  No patches needed — README looks good!'));
    return;
  }

  console.log('');
  console.log(`  ${pc.bold('README Doctor Fix')}  ${patch.description}`);
  console.log('');

  if (options.write) {
    writeFileSync(filePath, patch.patched, 'utf-8');
    console.log(pc.green(`  ✓ Applied patch to ${filePath}`));

    // Show new score
    const newReadme = parseReadme(patch.patched);
    const newResult = scoreReadme(newReadme);
    console.log(`  Score: ${result.total} → ${pc.green(String(newResult.total))}/${newResult.maxTotal}`);
  } else {
    console.log(formatDiff(patch));
    console.log('');
    console.log(`  ${pc.dim('Run')} ${pc.cyan('readme-doctor fix --write')} ${pc.dim('to apply this patch.')}`);
  }

  console.log('');
}
