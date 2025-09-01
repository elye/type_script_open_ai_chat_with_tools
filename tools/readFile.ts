import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

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

const applyRestriction = (resolvedPath: string) => {
  const currentWorkingDir = process.cwd();
  const developmentPath = path.resolve(path.join(os.homedir(), 'Development'));
  
  const isInCurrentDir = resolvedPath.startsWith(currentWorkingDir);
  const isInDevelopmentDir = resolvedPath.startsWith(developmentPath);
  
  if (!isInCurrentDir && !isInDevelopmentDir) {
    throw new Error(
      "Only allowed to access files inside the current working directory or the ~/Development directory."
    );
  }

  const fileName = path.basename(resolvedPath);
  const fileExtension = path.extname(resolvedPath).toLowerCase();
  
  // Define allowed programming language file extensions
  const allowedExtensions = [
    // Web Technologies
    '.js', '.jsx', '.ts', '.tsx', '.html', '.htm', '.css', '.scss', '.sass', '.less',
    // Popular Programming Languages
    '.py', '.java', '.c', '.cpp', '.cc', '.cxx', '.h', '.hpp',
    '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
    '.clj', '.cljs', '.erl', '.ex', '.exs', '.hs', '.ml', '.fs',
    // Scripting and Shell
    '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    // Data and Config (programming related)
    '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
    // Database
    '.sql', '.sqlite', '.db',
    // Documentation (programming related)
    '.md', '.rst', '.txt',
    // Mobile Development
    '.dart', '.m', '.mm',
    // Assembly and Low Level
    '.asm', '.s',
    // R and Data Science
    '.r', '.R', '.ipynb',
    // Markup and Templates
    '.vue', '.svelte', '.handlebars', '.hbs', '.mustache', '.ejs', '.pug',
    // Build and Package Files
    '.gradle', '.maven', '.sbt', '.cmake', '.make', '.dockerfile'
  ];

  // Check if file has an allowed extension
  if (fileExtension && !allowedExtensions.includes(fileExtension)) {
    throw new Error(
      `Only allowed to read programming language files. File extension '${fileExtension}' is not allowed.`
    );
  }

  // Block files without extensions (unless they're common programming files)
  const allowedFilesWithoutExtension = [
    'Dockerfile', 'Makefile', 'Rakefile', 'Gemfile', 'Podfile',
    'CMakeLists.txt', 'requirements.txt', 'package.json', 'composer.json',
    'README', 'LICENSE', 'CHANGELOG', 'CONTRIBUTING'
  ];
  
  if (!fileExtension && !allowedFilesWithoutExtension.some(allowed => 
    fileName.toUpperCase().includes(allowed.toUpperCase())
  )) {
    throw new Error(
      `Only allowed to read programming language files. File '${fileName}' without extension is not allowed.`
    );
  }

  // Block sensitive and hidden files
  const sensitiveFiles = ['.env', '.env.local', '.env.production', '.env.development'];
  if (sensitiveFiles.includes(fileName) || fileName.startsWith('.env')) {
    throw new Error("Not allowed to read sensitive files.");
  }

  if (fileName.startsWith('.') && !allowedExtensions.includes(fileExtension)) {
    throw new Error("Not allowed to read hidden files.");
  }
};

export const readFile = async (params: ReadFileParams) => {
  try {
    const resolvedPath = path.resolve(params.path);

    applyRestriction(resolvedPath);

    const fileContent = await fs.readFile(resolvedPath, "utf-8");

    return JSON.stringify({ content: fileContent });
  } catch (e) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};
