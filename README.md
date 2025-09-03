# Elye Agent - AI Chat Interface with Tools

A lightweight, secure, TypeScript command‑line chat interface for interacting with OpenAI‑compatible APIs, featuring function calling ("tools") for safe file system inspection.

## Features

- 🎨 **Colorized Terminal UX** – Bold green `YOU:`, yellow `BOT:`, blue `USE:` labels
- 🧰 **Tool Calling** – Current tools: read a file (`tool_read_file`), list directory contents (`tool_list_files`), create / update files (`tool_write_file`)
- 🔄 **Streaming Loop** – Continuous conversation with preserved history
- 🛡️ **Type Safe** – End‑to‑end TypeScript types (OpenAI client + tool schemas)
- 🔒 **Security Guardrails** – Path + extension restrictions; blocks hidden & sensitive files
- 🧩 **Modular Architecture** – Clear separation (entrypoint, chatbot core, tool registry, tool impls)
- ⚙️ **Configurable Model** – Select model via env var; sane default if unset
- 🌱 **Minimal Dependencies** – Fast install & no custom build step (run with `tsx`)
- 🚀 **Easy Extensibility** – Add new tools with a tiny definition + execution function

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **OpenAI API Key** or compatible API endpoint

## Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd agentic-ai-coder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

  Create a `.env` file in the root directory:
  ```env
  OPENAI_API_KEY=your-api-key-here
  OPENAI_API_URL=https://api.openai.com/v1   # or another compatible endpoint
  OPENAI_API_MODEL=claude-sonnet-4-20250514  # override if you like
  ```

  **Default Model**: If `OPENAI_API_MODEL` is not set the code currently defaults to `claude-sonnet-4-20250514` (see `main.ts`).

## Usage

Start the chat interface:

```bash
npm start
```

- Type your messages and press Enter
- The AI will respond after each message
- When the AI needs to use tools (like reading files), you'll see blue "USE:" messages
- Use `Ctrl+C` to quit the application

## Example Usage

```
YOU: Can you read the package.json file?
USE: The model needs tool_read_file with arguments: {"path":"package.json"}
BOT: (file content summary ...)

YOU: What files are in the tools directory?
USE: The model needs tool_list_files with arguments: {"dir":"tools"}
BOT: I see: index.ts, readFile.ts, listFiles.ts, writeFile.ts, restrictions.ts ...

YOU: Create a NOTES.md file saying Hello.
USE: The model needs tool_write_file with arguments: {"path":"NOTES.md","content":"Hello","find":""}
BOT: File created successfully.

YOU: Replace Hello with Hello World in NOTES.md
USE: The model needs tool_write_file with arguments: {"path":"NOTES.md","content":"Hello World","find":"Hello"}
BOT: Replacement applied.
```

## Project Structure

```
├── main.ts            # Entry point and application setup
├── ChatBot.ts         # Chat logic and AI interaction loop
├── tools/             # Tool implementations + shared security helpers
│   ├── index.ts       # Tool array + dispatcher
│   ├── readFile.ts    # Secure file reading tool
│   ├── listFiles.ts   # Secure directory listing tool
│   ├── writeFile.ts   # Secure file create / update / find+replace tool
│   └── restrictions.ts# Centralized path & file security guards
├── package.json       # Scripts & deps
├── .env               # Environment variables (create locally)
└── README.md          # Documentation
```

## Architecture

### `main.ts`
- Application initialization
- Environment setup
- Readline interface creation
- OpenAI client configuration

### `ChatBot.ts`
- Chat conversation management
- User input handling with colorful prompts
- AI response processing and tool call handling
- Terminal output formatting with named color constants
- **Configurable model support** - Accepts model name as constructor parameter
- **Modular design** - No direct environment variable access

### `tools/`
- **`index.ts`** – Exports the `tools` array and a `runTool` dispatcher
- **`readFile.ts`** – Reads a single file (after security checks)
- **`listFiles.ts`** – Lists files (name + directory flag) in a directory (after path restriction)
- **`writeFile.ts`** – Creates a file or performs a find+replace update (see parameters below)
- **`restrictions.ts`** – Shared path + file security logic (`ensurePathAllowed`, `ensureFileSecurity`)

#### Tool Security Model
All file-related tools enforce:
1. **Path Allowlist** – Must live inside the current working directory OR `~/Development`.
2. **Sensitive File Blocking** – `.env*`, hidden non‑code files, disallowed extensions are rejected.
3. **Extension Filtering (readFile/writeFile)** – Only programming / config / doc related extensions (see source) or well‑known build filenames.
4. **Write Constraints** – `tool_write_file` cannot create or modify disallowed / sensitive / hidden files.
5. **JSON Output** – Tools always return JSON strings for predictable model consumption.

#### `tool_write_file` Parameters
| Field | Meaning | Behavior |
|-------|---------|----------|
| `path` | Target file path | Must pass security checks |
| `content` | New content or replacement text | Overwrites or replaces depending on `find` |
| `find` | Text to search for (can be empty string) | Empty => create/overwrite whole file; non-empty => string replace first/all JS replace occurrences |

Note: Current implementation performs a simple `String.replace` (first occurrence). Future enhancement: global / regex replace.

## Dependencies

### Runtime Dependencies
- **`openai`** – API client (chat + tool calling)
- **`dotenv`** – Environment variable loading

### Development Dependencies
- **`tsx`** - TypeScript execution
- **`@types/node`** - Node.js TypeScript definitions

## Configuration

The application uses environment variables for configuration:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your API key | `sk-...` | ✅ Yes |
| `OPENAI_API_URL` | API endpoint URL | `https://api.openai.com/v1` | ✅ Yes |
| `OPENAI_API_MODEL` | AI model to use | `gpt-4`, `claude-sonnet-4-20250514` | ❌ Optional |

**Default Model (current)**: `claude-sonnet-4-20250514` (centralized in `main.ts`).

## Terminal Colors

- 🟢 **YOU:** - Bold Green (user input prompt)
- 🟡 **BOT:** - Bold Yellow (AI response label)
- 🔵 **USE:** - Bold Blue (tool usage indicator)
- ⚪ **Messages** - Default color (actual conversation content)

The colorful prompts make it easy to distinguish between user input, AI responses, and tool usage in the terminal.

## Security Features

### File Access Restrictions
The AI agent includes built-in security features to prevent unauthorized file access:

- **Directory Restrictions**: Only allows access to:
  - Current working directory
  - `~/Development` folder and its subdirectories
  
- **File Type Restrictions**: Only programming-related files are accessible:
  - Web technologies (`.js`, `.ts`, `.html`, `.css`, etc.)
  - Programming languages (`.py`, `.java`, `.c`, `.cpp`, `.go`, `.rs`, etc.)
  - Configuration files (`.json`, `.yaml`, `.toml`, etc.)
  - Documentation files (`.md`, `.txt`, etc.)
  - Build files (`Dockerfile`, `Makefile`, `package.json`, etc.)

- **Blocked Files**:
  - Sensitive files (`.env*` files)
  - Hidden files (unless they're programming-related)
  - Binary files and non-programming content

### Tool Safety
- All tool execution is logged with blue "USE:" indicators
- Tool arguments are displayed for transparency
- File access attempts outside allowed directories are blocked with clear error messages

## Development

This is a TypeScript project with a modular architecture:

### **Architecture Improvements**
- **Tool Integration**: Modular tool system with secure file access
- **Dependency Injection**: The `ChatBot` class receives its dependencies (client, readline interface, model) via constructor
- **Environment Variable Handling**: Only `main.ts` handles environment variables, keeping concerns separated
- **Configurable Model**: Easy to switch between different AI models without code changes
- **Security-First Design**: Built-in restrictions prevent unauthorized file access
- **Type Safety**: Full TypeScript support with proper type definitions
- **Color-Coded Output**: Named constants for ANSI color codes improve maintainability

### **Making Changes**
1. Edit the `.ts` files
2. The `tsx` runner handles TypeScript compilation automatically
3. No build step required for development

### **Testing Different Models**
Change `OPENAI_API_MODEL` in `.env` (hot applied on next run) or edit the fallback in `main.ts`.

## Adding a New Tool
1. Create `tools/yourTool.ts` exporting:
  - A `<name>Definition: OpenAI.Chat.Completions.ChatCompletionTool`
  - An executor function returning a JSON string
2. Import & append the definition + executor logic in `tools/index.ts`.
3. Keep outputs small & structured (JSON) for best model grounding.

Example skeleton:
```ts
export const myToolDefinition = { /* OpenAI tool schema */ };
export const myTool = async (params: MyParams) => JSON.stringify({ result: 'ok' });
```

## Roadmap Ideas
- Streaming partial responses
- Improved error surface (pretty print JSON)
- Optional logging verbosity flag
- Unit tests around restriction logic
- Token usage reporting

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

Private project – not for public distribution.

## Author

Elye
