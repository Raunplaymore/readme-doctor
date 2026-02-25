# readme-doctor

## Product Idea
A CLI tool that scores README quality (0-100), detects missing/weak sections, generates improvement suggestions, and produces unified diff patches that can be applied with --write. Supports CI integration with --min-score and --strict flags.

## Additional Context
Zero-cost tool. No server, no API, no database. Pure local analysis. Should work on any README.md in any project. Target: open-source maintainers, individual developers, and team leads who want consistent README quality.

## Features
- [ ] README score calculation (0-100)
- [ ] Missing/weak section detection
- [ ] Improvement suggestion generation
- [ ] Unified diff patch generation (--write to apply)
- [ ] CI failure conditions (--min-score, --strict)

## Tech Stack
Node.js, TypeScript, commander, picocolors

## Progress
- [ ] Project setup
- [ ] Core features implementation
- [ ] Testing & polish

## Snapshot Log
### v1 - Initial Setup
- Project initialized with pmpt

---
*This document tracks your project progress. Update it as you build.*
*AI instructions are in `pmpt.ai.md` — paste that into your AI tool.*
