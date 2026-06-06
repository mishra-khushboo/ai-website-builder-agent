# 🤖 AI Website Builder Agent

> A terminal-based AI agent that generates complete, ready-to-use websites from natural language descriptions — powered by Google Gemini 2.5 Flash.

---

## 📌 Overview

AI Website Builder Agent is a CLI tool that lets you describe a website in plain English and have it automatically scaffolded and written to disk — complete with `index.html`, `style.css`, and `script.js`. It uses an **agentic loop** architecture where the LLM reasons step-by-step and calls tools (file creation, directory setup) to produce the final output.

No drag-and-drop builders. No templates to fill in. Just describe what you want, and the agent builds it.

---

## ✨ Features

- 🧠 **LLM-powered code generation** via Gemini 2.5 Flash
- 🔁 **Agentic loop** — the model plans, acts, and self-corrects across multiple tool calls
- 📁 **Full project scaffolding** — creates folder structure and writes all source files
- 🛠️ **Tool-use architecture** — uses `executeCommand` (mkdir) and `writeFile` as callable tools
- 💬 **Conversational CLI** — describe any website in natural language and iterate interactively
- 🌍 **Cross-platform** — detects OS and adapts accordingly

---

## 🗂️ Project Structure

```
ai-website-builder-agent/
├── index.js          # Main agent loop and tool definitions
├── package.json
├── package-lock.json
└── .gitignore
```

**Generated output** (per run, in your working directory):
```
<project-name>/
├── index.html
├── style.css
└── script.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/mishra-khushboo/ai-website-builder-agent.git
cd ai-website-builder-agent

# Install dependencies
npm install
```

### Run

```bash
node index.js
```

You'll see:

```
I am a cursor: let's create a website
Ask me anything-->
```

Describe what you want, for example:

```
Ask me anything--> Build a portfolio website for a software engineer with a dark theme, skills section, and contact form
```

The agent will scaffold the project folder and write all files automatically.

---

## 🧠 How It Works

The agent follows a **ReAct-style loop** (Reason → Act → Observe → Repeat):

```
User Prompt
    │
    ▼
Gemini 2.5 Flash (with tools)
    │
    ├──► executeCommand({ command: "mkdir project-name" })
    │         └── creates project directory
    │
    ├──► writeFile({ path: "project-name/index.html", content: "..." })
    │         └── writes HTML file
    │
    ├──► writeFile({ path: "project-name/style.css", content: "..." })
    │         └── writes CSS file
    │
    ├──► writeFile({ path: "project-name/script.js", content: "..." })
    │         └── writes JS file
    │
    ▼
Final summary message → Agent exits loop
```

The full conversation history (including tool calls and results) is maintained across turns so the model always has context for its next action.

---

## 🛠️ Available Tools

| Tool | Purpose | Allowed Commands |
|------|---------|-----------------|
| `executeCommand` | Run terminal commands | `mkdir` only |
| `writeFile` | Write content to a file | Any path and content |

The system prompt strictly constrains the model: `executeCommand` is for directory creation only, and all file content goes through `writeFile`. This prevents unsafe shell operations like `echo`, `cat`, or `touch`.

---

## 📦 Dependencies

| Package | Purpose |
|--------|---------|
| `@google/genai` | Gemini API client |
| `readline-sync` | Synchronous CLI input |
| `dotenv` | Environment variable management |

---

## 💡 Example Prompts

```
Build a landing page for a coffee shop with a menu, hero image placeholder, and footer

Create a personal blog homepage with a dark theme, post cards, and a navbar

Make a to-do list app with add, complete, and delete functionality in vanilla JS

Build a product showcase page for a sneaker brand with a grid layout
```

---

## 🔮 Roadmap / Ideas for Future Development

- [ ] Support for multi-page websites (multiple HTML files)
- [ ] Inject real images via Unsplash API
- [ ] Add a `readFile` tool so the agent can self-review and refactor its output
- [ ] Support additional frameworks (React, Tailwind, Vue)
- [ ] Preview server — auto-launch `localhost` after generation
- [ ] Export as ZIP for download
- [ ] Streaming output so you can watch files being written in real time
- [ ] Switch between LLM providers (Claude, GPT-4o, Gemini)

---

## ⚠️ Known Limitations

- Gemini free-tier has rate limits — if you see a `429` error, wait a moment and retry
- The agent only generates static websites (HTML/CSS/JS) — no backend or database support currently
- Large or complex prompts may require multiple retries for complete output

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Add a license of your choice (MIT recommended).

---

## 👩‍💻 Author

**Khushboo Mishra**
[GitHub](https://github.com/mishra-khushboo) · Built with ❤️ and Gemini
