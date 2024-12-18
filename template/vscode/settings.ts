/**
 *
 */
export const VsCodeSettingsTemplate = (): string => {
  return `
    {
      "files.autoSave": "onFocusChange",
      "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
      ],
      "editor.formatOnSave": true,
      "editor.formatOnPaste": true,
      "javascript.validate.enable": true,
      "typescript.validate.enable": true,
      "json.format.enable": true,
      "editor.tabSize": 2,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "[javascript]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[javascriptreact]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescript]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescriptreact]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[json]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "vscode.json-language-features"
      },
      "[html]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "vscode.html-language-features"
      },
      "[svg]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "jock.svg"
      },
      "[xml]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": true,
        "editor.defaultFormatter": "redhat.vscode-xml"
      },
      "editor.codeActionsOnSave": {
        "source.fixAll": "explicit",
        "source.fixAll.eslint": "explicit"
      },
      "workbench.editor.enablePreview": false,
      "workbench.editor.enablePreviewFromQuickOpen": false
    }
  `;
};
