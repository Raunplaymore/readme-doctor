# readme-doctor

Score your README quality (0–100), detect missing or weak sections, and generate unified diff patches to fix them.

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g readme-doctor
```

Or run directly with npx:

```bash
npx readme-doctor
```

## Usage

### Check README quality

```bash
readme-doctor check
```

Output:

```
  README Doctor  65/100 (B)
  /path/to/README.md

  ✓   5/5   Title / Project Name
  ✓  15/15  Description
  ✓  20/20  Installation
  ✓  20/20  Usage
  ✗   0/10  License
  ✗   0/10  Contributing
  ✓  10/10  Code examples
  ✗   0/5   Badges
  ✗   0/5   Sufficient length
```

The `check` command is the default — just running `readme-doctor` works the same.

### Generate fix patches

```bash
readme-doctor fix
```

Shows a unified diff with suggested sections. Apply patches directly:

```bash
readme-doctor fix --write
```

### Options

| Flag | Description |
|------|-------------|
| `-f, --file <path>` | Path to README file (default: `README.md`) |
| `--min-score <n>` | Exit with code 1 if score is below threshold |
| `--strict` | Exit with code 1 if any section is missing or weak |
| `-w, --write` | Apply fix patches directly to the file |

### CI Integration

```yaml
# GitHub Actions example
- run: npx readme-doctor --min-score 60
```

```yaml
# Strict mode — fail on any missing section
- run: npx readme-doctor --strict
```

## Scoring

| Section | Max Points |
|---------|-----------|
| Title / Project Name | 5 |
| Description | 15 |
| Installation | 20 |
| Usage | 20 |
| License | 10 |
| Contributing | 10 |
| Code examples (bonus) | 10 |
| Badges (bonus) | 5 |
| Sufficient length (bonus) | 5 |
| **Total** | **100** |

Grades: **A** (80+), **B** (60+), **C** (40+), **D** (20+), **F** (<20)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a pull request

## License

MIT
