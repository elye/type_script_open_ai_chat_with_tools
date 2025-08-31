# Elye Agent - AI Chat Interface

A simple, colorful command-line chat interface for interacting with AI models through OpenAI-compatible APIs.

## Features

- 🎨 **Colorful Terminal Interface** - Bold green "YOU:" and yellow "BOT:" prompts
- 🔄 **Continuous Conversation** - Maintains chat history throughout the session
- 🛡️ **Type Safe** - Built with TypeScript for better development experience
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
- Use `Ctrl+C` to quit the application

## Project Structure

```
├── main.ts          # Entry point and application setup
├── ChatBot.ts       # Chat logic and AI interaction
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
- AI response processing
- Terminal output formatting
- **Configurable model support** - Accepts model name as constructor parameter
- **Modular design** - No direct environment variable access

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
| `OPENAI_API_MODEL` | AI model to use | `gpt-4`, `claude-3-sonnet` | ❌ Optional |

**Default Model**: If `OPENAI_API_MODEL` is not specified, the application defaults to `gpt-5-chat-2025-08-07`.

## Terminal Colors

- 🟢 **YOU:** - Bold Green (user input prompt)
- 🟡 **BOT:** - Bold Yellow (AI response label)
- ⚪ **Messages** - Default color (actual conversation content)

The colorful prompts make it easy to distinguish between user input and AI responses in the terminal.

## Development

This is a TypeScript project with a modular architecture:

### **Architecture Improvements**
- **Dependency Injection**: The `ChatBot` class receives its dependencies (client, readline interface, model) via constructor
- **Environment Variable Handling**: Only `main.ts` handles environment variables, keeping concerns separated
- **Configurable Model**: Easy to switch between different AI models without code changes
- **Type Safety**: Full TypeScript support with proper type definitions

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
