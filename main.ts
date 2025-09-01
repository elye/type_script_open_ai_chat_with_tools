import "dotenv/config";
import OpenAI from "openai";
import process from "node:process";
import readline from "node:readline/promises";
import { ChatBot } from "./ChatBot.ts";

const createReadlineInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.on("SIGINT", () => {
    rl.close();
  });

  rl.on("close", () => {
    console.log("Bye, have nice day!");
    process.exit(0);
  });

  return rl;
};

const createOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
  });
};

const main = async () => {
  console.log("Start Chatting (use 'ctrl-c' to quit)");

  const client = createOpenAIClient();
  const rl = createReadlineInterface();
  const model = process.env.OPENAI_API_MODEL || "claude-sonnet-4-20250514";
  const chatBot = new ChatBot(client, rl, model);

  await chatBot.startChatLoop();
};

main().catch(console.error);