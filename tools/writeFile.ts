import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { ensureFileSecurity } from "./restrictions.ts";

export const writeFileDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "tool_write_file",
    description:
    "Creates a new file or updates an existing file with the specified content. Can also edit files by finding and replacing text.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file to create or update",
        },
        content: {
          type: "string",
          description:
            "Content to write to the file or the replacement text when using find",
        },
        find: {
          type: "string",
          description:
            "Text to find and replace in an existing file. If empty, the entire content will be overwritten or a new file created.",
        },
      },
      required: ["path", "content", "find"],
      additionalProperties: false,
    },
  },
};

export type WriteFileParams = {
  path: string;
  content: string;
  find: string;
};

const doesFileExist = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

export const writeFile = async (params: WriteFileParams) => {
  try {
    const resolvedPath = path.resolve(params.path);
    ensureFileSecurity(resolvedPath);

    const fileExists = await doesFileExist(resolvedPath);

    if (!fileExists || !params.find) {
      await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
      await fs.writeFile(resolvedPath, params.content, "utf-8");
      return JSON.stringify({
        success: true,
        path: resolvedPath,
        operation: "create-file",
      });
    } else {
      const existingContent = await fs.readFile(resolvedPath, "utf-8");
      const newContent = existingContent.replace(params.find, params.content);
      await fs.writeFile(resolvedPath, newContent, "utf-8");
      return JSON.stringify({
        success: true,
        path: resolvedPath,
        operation: "find-replace",
        replaced: existingContent !== newContent,
      });
    }
  } catch (e) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};
