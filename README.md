# Elye Agent - AI Chat Interface with Tools

A powerful command-line chat interface for interacting with AI models through OpenAI-compatible APIs, featuring tool integration and secure file access.

## Features

- 🎨 **Colorful Terminal Interface** - Bold green "YOU:", yellow "BOT:", and blue "USE:" prompts
- �️ **Tool Integration** - AI can read files and execute tools within secure boundaries
- �🔄 **Continuous Conversation** - Maintains chat history throughout the session
- 🛡️ **Type Safe** - Built with TypeScript for better development experience
- 🔒 **Secure File Access** - Restricted to programming files within Development directory
- 🎯 **Clean Architecture** - Modular design with separated concerns
- ⚙️ **Configurable Model** - Easily switch between different AI models
- 🔧 **Environment-based Configuration** - Flexible setup via environment variables
- ⚡ **Fast Setup** - Quick to install and run

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
   OPENAI_API_URL=your-api-endpoint-here
   OPENAI_API_MODEL=your-preferred-model-name
   ```
   
   **Note**: If `OPENAI_API_MODEL` is not specified, it defaults to `gpt-5-chat-2025-08-07`.

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
BOT: I can see this is a TypeScript project called "elye-agent" with dependencies including OpenAI and dotenv...

YOU: What files are in the tools directory?
USE: The model needs tool_read_file with arguments: {"path":"tools"}
BOT: I can see there are two files in the tools directory: index.ts and readFile.ts...
```

## Project Structure

```
├── main.ts          # Entry point and application setup
├── ChatBot.ts       # Chat logic and AI interaction
├── tools/           # Tool implementations and definitions
│   ├── index.ts     # Tool registry and execution
│   └── readFile.ts  # File reading tool with security restrictions
├── package.json     # Dependencies and scripts
├── .env            # Environment variables (create this)
└── README.md       # This file
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
- **`index.ts`** - Tool registry, definitions, and execution logic
- **`readFile.ts`** - Secure file reading tool with restrictions:
  - Only allows access to current working directory or ~/Development folder
  - Restricted to programming language files only
  - Blocks sensitive files (.env, hidden files, etc.)

## Dependencies

### Runtime Dependencies
- **`openai`** - OpenAI API client
- **`dotenv`** - Environment variable loading

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

**Default Model**: If `OPENAI_API_MODEL` is not specified, the application defaults to `claude-sonnet-4-20250514`.

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
Simply change the `OPENAI_API_MODEL` environment variable or modify the default in `main.ts`.

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## License

Private project - not for public distribution.

## Author

Elye
