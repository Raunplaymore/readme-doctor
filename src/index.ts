#!/usr/bin/env node

import { Command } from 'commander';
import { cmdCheck } from './commands/check.js';
import { cmdFix } from './commands/fix.js';

const program = new Command();

program
  .name('readme-doctor')
  .description('Score README quality, detect missing sections, and generate improvement patches')
  .version('0.1.0', '-v, --version');

program
  .command('check', { isDefault: true })
  .description('Score a README and list missing/weak sections')
  .option('-f, --file <path>', 'Path to README file', 'README.md')
  .option('--min-score <score>', 'Fail if score is below this threshold (for CI)')
  .option('--strict', 'Fail if any section is missing or weak (for CI)')
  .action(cmdCheck);

program
  .command('fix')
  .description('Generate patches for missing sections')
  .option('-f, --file <path>', 'Path to README file', 'README.md')
  .option('-w, --write', 'Apply patches directly to the file')
  .action(cmdFix);

program.parse();
