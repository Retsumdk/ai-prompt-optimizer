# AI Prompt Optimizer

[![Build](https://github.com/Retsumdk/ai-prompt-optimizer/workflows/CI/badge.svg)](https://github.com/Retsumdk/ai-prompt-optimizer/actions)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1.0.0-orange.svg)](https://github.com/Retsumdk/ai-prompt-optimizer/releases/tag/v1.0.0)

Analyze and optimize AI prompts for better results using pattern matching and best practices.

## Features

- **Prompt Analysis**: Identify strength, vagueness, and clarity issues
- **Recommendations**: Provide actionable improvements based on best practices
- **Scoring**: Rate prompts on multiple dimensions (clarity, specificity, structure)
- **Best Practices Database**: Built-in prompt templates and optimization patterns

## Installation

```bash
npm install -g ai-prompt-optimizer
# or
npm install ai-prompt-optimizer
```

## Usage

```bash
# Analyze a prompt
ai-prompt-optimizer analyze "Your prompt here"

# Interactive mode
ai-prompt-optimizer optimize
```

## Example

```bash
$ ai-prompt-optimizer analyze "Write a blog post about AI"

Prompt scored: 65/100

## Recommendations:
1. Add specific output format guidelines
2. Include tone/style preferences
3. Define target audience
4. Add length constraints
```

## 🔗 Related Repos

- [prompt-version-control](https://github.com/Retsumdk/prompt-version-control) — Version control for AI prompts
- [ai-response-validator](https://github.com/Retsumdk/ai-response-validator) — Validate AI responses
- [agent-workflow-orchestrator](https://github.com/Retsumdk/agent-workflow-orchestrator) — Orchestrate agent workflows

## License

MIT License - see [LICENSE](LICENSE) for details.
