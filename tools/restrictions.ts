import path from "node:path";
import os from "node:os";

// Centralized security / restriction helpers shared by file tools.

// Allowed programming / config / doc related extensions.
const ALLOWED_EXTENSIONS = [
  // Web Technologies
  '.js', '.jsx', '.ts', '.tsx', '.html', '.htm', '.css', '.scss', '.sass', '.less',
  // Popular Programming Languages
  '.py', '.java', '.c', '.cpp', '.cc', '.cxx', '.h', '.hpp',
  '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
  '.clj', '.cljs', '.erl', '.ex', '.exs', '.hs', '.ml', '.fs',
  // Scripting and Shell
  '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
  // Data and Config
  '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
  // Database
  '.sql', '.sqlite', '.db',
  // Documentation
  '.md', '.rst', '.txt',
  // Mobile
  '.dart', '.m', '.mm',
  // Assembly / Low Level
  '.asm', '.s',
  // Data Science
  '.r', '.R', '.ipynb',
  // Markup / Templates
  '.vue', '.svelte', '.handlebars', '.hbs', '.mustache', '.ejs', '.pug',
  // Build & Package
  '.gradle', '.maven', '.sbt', '.cmake', '.make', '.dockerfile'
];

const ALLOWED_FILES_WITHOUT_EXTENSION = [
  'Dockerfile', 'Makefile', 'Rakefile', 'Gemfile', 'Podfile',
  'CMakeLists.txt', 'requirements.txt', 'package.json', 'composer.json',
  'README', 'LICENSE', 'CHANGELOG', 'CONTRIBUTING'
];

const SENSITIVE_FILES = ['.env', '.env.local', '.env.production', '.env.development'];

/** Ensures the path is within the allowed root directories. */
export const ensurePathAllowed = (resolvedPath: string) => {
  const currentWorkingDir = process.cwd();
  const developmentPath = path.resolve(path.join(os.homedir(), 'Development'));

  const isInCurrentDir = resolvedPath.startsWith(currentWorkingDir);
  const isInDevelopmentDir = resolvedPath.startsWith(developmentPath);

  if (!isInCurrentDir && !isInDevelopmentDir) {
    throw new Error(
      'Only allowed to access files inside the current working directory or the ~/Development directory.'
    );
  }
};

/** Additional file-level security (extensions, sensitive/hidden blocking). */
export const ensureFileSecurity = (resolvedPath: string) => {
  ensurePathAllowed(resolvedPath);

  const fileName = path.basename(resolvedPath);
  const fileExtension = path.extname(resolvedPath).toLowerCase();

  if (fileExtension && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error(
      `Only allowed to read programming language files. File extension '${fileExtension}' is not allowed.`
    );
  }

  if (!fileExtension && !ALLOWED_FILES_WITHOUT_EXTENSION.some(allowed =>
    fileName.toUpperCase().includes(allowed.toUpperCase())
  )) {
    throw new Error(
      `Only allowed to read programming language files. File '${fileName}' without extension is not allowed.`
    );
  }

  if (SENSITIVE_FILES.includes(fileName) || fileName.startsWith('.env')) {
    throw new Error('Not allowed to read sensitive files.');
  }

  if (fileName.startsWith('.') && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error('Not allowed to read hidden files.');
  }
};
