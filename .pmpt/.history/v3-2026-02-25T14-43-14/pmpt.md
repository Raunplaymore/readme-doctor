# readme-doctor

## Product Idea
A CLI tool that scores README quality (0-100), detects missing/weak sections, generates improvement suggestions, and produces unified diff patches that can be applied with --write. Supports CI integration with --min-score and --strict flags.

## Additional Context
Zero-cost tool. No server, no API, no database. Pure local analysis. Should work on any README.md in any project. Target: open-source maintainers, individual developers, and team leads who want consistent README quality.

## Features
- [x] README score calculation (0-100)
- [x] Missing/weak section detection
- [ ] Improvement suggestion generation
- [ ] Unified diff patch generation (--write to apply)
- [ ] CI failure conditions (--min-score, --strict)

## Tech Stack
Node.js, TypeScript, commander, picocolors

## Progress
- [x] Project setup
- [ ] Core features implementation
- [ ] Testing & polish

## Snapshot Log
### v3 - Core Scoring Logic
- parser.ts: README markdown parsing (sections, headings, code blocks, badges)
- scorer.ts: 100-point scoring system with 6 section rules + 3 bonus rules
- Section rules: Title, Description, Installation, Usage, License, Contributing
- Bonus: code blocks, badges, sufficient length
- Grade system: A(80+) B(60+) C(40+) D(20+) F(<20)

### v2 - Project Scaffolding
- package.json, tsconfig.json, .gitignore created
- commander + picocolors dependencies installed
- src/ directory structure: commands/, lib/
- Initial build passes

### v1 - Initial Setup
- Project initialized with pmpt

---
*This document tracks your project progress. Update it as you build.*
*AI instructions are in `pmpt.ai.md` — paste that into your AI tool.*
