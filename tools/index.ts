import { readFileDefinition, readFile, type ReadFileParams  } from "./readFile.ts";
import { listFilesDefinition, listFiles, type ListFilesParams } from "./listFiles.ts";

export const tools = [readFileDefinition, listFilesDefinition];


export const runTool = async (
  toolName: string,
  args: string
): Promise<string> => {
  if (toolName === "tool_list_files") {
    return listFiles(JSON.parse(args) as ListFilesParams);
  } else if (toolName === "tool_read_file") {
    return readFile(JSON.parse(args) as ReadFileParams);
  } else {
    return JSON.stringify({ error: "Unknown tool" });
  }
};
