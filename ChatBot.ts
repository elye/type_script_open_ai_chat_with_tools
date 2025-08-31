import OpenAI from "openai";
import readline from "node:readline/promises";

export class ChatBot {
  private client: OpenAI;
  private rl: readline.Interface;
  private conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  constructor(client: OpenAI, rl: readline.Interface) {
    this.client = client;
    this.rl = rl;
  }

  private async getUserInput(): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam> {
    const userInput = await this.rl.question("\u001b[1m\u001b[32mYOU:\u001b[0m ");
    return { role: "user" as const, content: userInput };
  }

  private async getAIResponse(): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const { choices } = await this.client.chat.completions.create({
      model: "claude-sonnet-4-20250514",
      messages: this.conversation,
    });
    return choices[0].message;
  }

  private displayAIResponse(message: OpenAI.Chat.Completions.ChatCompletionMessage): void {
    if (message.content) {
      console.log(`\u001b[1m\u001b[33mBOT:\u001b[0m ${message.content}`);
    }
  }

  public async startChatLoop(): Promise<void> {
    while (true) {
      const userMessage = await this.getUserInput();
      this.conversation.push(userMessage);

      const aiMessage = await this.getAIResponse();
      this.conversation.push(aiMessage);

      this.displayAIResponse(aiMessage);
    }
  }
}
