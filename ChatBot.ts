import OpenAI from "openai";
import readline from "node:readline/promises";
import { runTool, tools } from "./tools/index.ts";

export class ChatBot {
  private client: OpenAI;
  private rl: readline.Interface;
  private model: string;
  private conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // ANSI color codes for terminal output
  private static readonly COLORS = {
    RESET: '\u001b[0m',
    BOLD: '\u001b[1m',
    USER_GREEN: '\u001b[1m\u001b[32m',
    BOT_YELLOW: '\u001b[1m\u001b[33m',
    TOOL_BLUE: '\u001b[1m\u001b[34m',
  } as const;

  constructor(client: OpenAI, rl: readline.Interface, model: string) {
    this.client = client;
    this.rl = rl;
    this.model = model;
  }

  private async getUserInput(): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam> {
    const userInput = await this.rl.question(`${ChatBot.COLORS.USER_GREEN}YOU:${ChatBot.COLORS.RESET} `);
    return { role: "user" as const, content: userInput };
  }

  private async getAIResponse(): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const { choices } = await this.client.chat.completions.create({
      model: this.model,
      messages: this.conversation,
      tools,
    });
    return choices[0].message;
  }

  private displayAIResponse(message: OpenAI.Chat.Completions.ChatCompletionMessage): void {
    if (message.content) {
      console.log(`${ChatBot.COLORS.BOT_YELLOW}BOT:${ChatBot.COLORS.RESET} ${message.content}`);
    }
  }

  private async handleToolCalls(aiMessage: OpenAI.Chat.Completions.ChatCompletionMessage): Promise<boolean> {
    if (aiMessage.tool_calls) {
      for (const toolCall of aiMessage.tool_calls) {
        if (toolCall.type === 'function') {
          console.log(
            `${ChatBot.COLORS.TOOL_BLUE}USE:${ChatBot.COLORS.RESET} The model needs ${toolCall.function.name} with arguments:`,
            toolCall.function.arguments
          );
          const toolOutput = await runTool(toolCall.function.name, toolCall.function.arguments);
          this.conversation.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: toolOutput,
          });
        }
      }
      return false; // Don't read user input after tool calls
    } else {
      return true; // Read user input when no tool calls
    }
  }

  public async startChatLoop(): Promise<void> {
    let readUserInput = true;

    while (true) {
      if (readUserInput) {
        const userMessage = await this.getUserInput();
        this.conversation.push(userMessage);
      }

      const aiMessage = await this.getAIResponse();
      this.conversation.push(aiMessage);

      this.displayAIResponse(aiMessage);

      readUserInput = await this.handleToolCalls(aiMessage);
    }
  }
}
