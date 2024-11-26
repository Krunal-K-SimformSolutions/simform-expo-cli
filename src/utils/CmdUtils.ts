import { spawn, execSync } from 'child_process';
import type { SpawnOptions } from 'child_process';

/**
 * Executes a command using a child process spawned with the option for standard I/O inheritance.
 * @param command - The command executor (e.g., npm, npx, yarn).
 * @param commandLine - An array representing the command and its arguments (e.g., ['create', 'vite']).
 * @param showChildOutput- A boolean for whether to show output of Child Process or Not.By Default it is Set True
 *   The entire command, such as "npx create vite," will be executed.
 * @returns {Promise<void>}
 */
export const cmdRunner = async (
  command: string,
  commandLine: string[],
  options: SpawnOptions = {},
  showChildOutput = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isWindows: boolean = process.platform === 'win32';
    const shell: boolean = isWindows ? true : false;
    const stdioOption = showChildOutput ? 'inherit' : 'ignore';

    const child = spawn(command, commandLine, { stdio: stdioOption, shell, ...options });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve('');
      } else {
        reject(new Error(`Command ${command} ${commandLine.join(' ')} exited with code ${code}`));
      }
    });
  });
};

/**
 * Determines if the macOS dark mode is currently enabled.
 * Executes an AppleScript command to check the dark mode status
 * from the system appearance preferences.
 *
 * @returns {boolean} Returns true if dark mode is enabled; otherwise, false.
 * Defaults to false if an error occurs during execution.
 */
export const isDarkMode = () => {
  try {
    // Run the AppleScript command
    const result = execSync(
      'osascript -e \'tell application "System Events" to get dark mode of appearance preferences\''
    )
      .toString()
      .trim();

    // Return true if dark mode is enabled, otherwise false
    return result === 'true';
  } catch {
    return false; // Default to light mode if there's an error
  }
};
