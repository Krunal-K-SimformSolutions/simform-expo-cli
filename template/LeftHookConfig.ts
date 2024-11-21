export const LeftHookConfigTemplate = (): string => {
  return `
    {
      "min_version": "1.0.0",
      "pre-commit": {
        "parallel": true,
        "commands": {
          "lint": {
            "glob": "*.{js,ts,jsx,tsx}",
            "run": "yarn eslint {staged_files}"
          },
          "prettier": {
            "glob": "*.{js,ts,jsx,tsx}",
            "run": "yarn prettier --write {staged_files}"
          },
          "eslint-fix": {
            "glob": "*.{js,ts,jsx,tsx}",
            "run": "yarn eslint --fix {staged_files}"
          },
          "types": {
            "glob": "*.{ts,tsx}",
            "run": "yarn tsc --noEmit"
          },
          "spelling": {
            "glob": "*.{js,ts,jsx,tsx}",
            "run": "yarn cspell lint {staged_files}"
          }
        }
      },
      "commit-msg": {
        "scripts": {
          "msg_checker.sh": {
            "runner": "bash"
          }
        }
      }
    }
  `;
};
