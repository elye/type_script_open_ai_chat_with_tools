import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { ensurePathAllowed } from "./restrictions.ts";

export const listFilesDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "tool_list_files",
    description: "Lists files and folders in a directory.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        dir: {
          type: "string",
          description: "Directory path to list",
        },
      },
      required: ["dir"],
      additionalProperties: false,
    },
  },
};

export type ListFilesParams = {
  dir: string;
};

// (Was: local applyRestriction) now using shared ensurePathAllowed

export const listFiles = async (params: ListFilesParams) => {
  try {
    const resolvedDir = path.resolve(params.dir);
    ensurePathAllowed(resolvedDir);

    const files = await fs.readdir(resolvedDir, { withFileTypes: true });

    const fileList = files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));

    return JSON.stringify(fileList);
  } catch (e) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};
