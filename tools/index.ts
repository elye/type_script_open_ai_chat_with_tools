import { readFileDefinition, readFile, type ReadFileParams  } from "./readFile.ts";
import { listFilesDefinition, listFiles, type ListFilesParams } from "./listFiles.ts";
import { writeFile, writeFileDefinition, type WriteFileParams } from "./writeFile.ts";

export const tools = [readFileDefinition, listFilesDefinition, writeFileDefinition];


export const runTool = async (
  toolName: string,
  args: string
): Promise<string> => {
  if (toolName === "tool_list_files") {
    return listFiles(JSON.parse(args) as ListFilesParams);
  } else if (toolName === "tool_read_file") {
    return readFile(JSON.parse(args) as ReadFileParams);
  } else if (toolName === "tool_write_file") {
    return writeFile(JSON.parse(args) as WriteFileParams);
  }else {
    return JSON.stringify({ error: "Unknown tool" });
  }
};
