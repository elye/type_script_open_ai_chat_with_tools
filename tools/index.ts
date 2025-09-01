import { readFileDefinition, readFile, type ReadFileParams  } from "./readFile.ts";

export const tools = [readFileDefinition];


export const runTool = async (
  toolName: string,
  args: string
): Promise<string> => {
  if (toolName === "tool_read_file") {
    return readFile(JSON.parse(args) as ReadFileParams);
  } else {
    return JSON.stringify({ error: "Unknown tool" });
  }
};
