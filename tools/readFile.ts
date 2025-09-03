import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { ensureFileSecurity } from "./restrictions.ts";

export const readFileDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "tool_read_file",
    description: "Reads the content of a file.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file to read",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
};

export type ReadFileParams = {
  path: string;
};


export const readFile = async (params: ReadFileParams) => {
  try {
    const resolvedPath = path.resolve(params.path);

  ensureFileSecurity(resolvedPath);

    const fileContent = await fs.readFile(resolvedPath, "utf-8");

    return JSON.stringify({ content: fileContent });
  } catch (e) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};
