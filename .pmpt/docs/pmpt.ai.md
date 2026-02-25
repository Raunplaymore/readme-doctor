<!-- This file is for AI tools only. Do not edit manually. -->
<!-- Paste this into Claude Code, Codex, Cursor, or any AI coding tool. -->

# readme-doctor — Product Development Request

## What I Want to Build
A CLI tool that scores README quality (0-100), detects missing/weak sections, generates improvement suggestions, and produces unified diff patches that can be applied with --write. Supports CI integration with --min-score and --strict flags.

## Additional Context
Zero-cost tool. No server, no API, no database. Pure local analysis. Should work on any README.md in any project. Target: open-source maintainers, individual developers, and team leads who want consistent README quality.

## Key Features
- README score calculation (0-100)
- Missing/weak section detection
- Improvement suggestion generation
- Unified diff patch generation (--write to apply)
- CI failure conditions (--min-score, --strict)

## Tech Stack Preferences
Node.js, TypeScript, commander, picocolors

---

Please help me build this product based on the requirements above.

1. First, review the requirements and ask if anything is unclear.
2. Propose a technical architecture.
3. Outline the implementation steps.
4. Start coding from the first step.

I'll confirm progress at each step before moving to the next.

## Documentation Rule

**Important:** When you make progress, update `.pmpt/docs/pmpt.md` (the human-facing project document) at these moments:
- When architecture or tech decisions are finalized
- When a feature is implemented (mark as done)
- When a development phase is completed
- When requirements change or new decisions are made

Keep the Progress and Snapshot Log sections in pmpt.md up to date.
After significant milestones, run `pmpt save` to create a snapshot.
