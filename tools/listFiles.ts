import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";

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

const applyRestriction = (resolvedPath: string) => {
  const currentWorkingDir = process.cwd();
  const developmentPath = path.resolve(path.join(homedir(), 'Development'));
      
  const isInCurrentDir = resolvedPath.startsWith(currentWorkingDir);
  const isInDevelopmentDir = resolvedPath.startsWith(developmentPath);
  
  if (!isInCurrentDir && !isInDevelopmentDir) {
    throw new Error(
      "Only allowed to access files inside the current working directory or the ~/Development directory."
    );
  }
};

export const listFiles = async (params: ListFilesParams) => {
  try {
    const resolvedDir = path.resolve(params.dir);

    applyRestriction(resolvedDir);

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
