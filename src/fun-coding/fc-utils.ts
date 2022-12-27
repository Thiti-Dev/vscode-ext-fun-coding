import * as vscode from "vscode";

type TCSSObject = Record<string, any>;

export class FCUtils {
  public static cssObjectToString(css: TCSSObject): string {
    let value = "";
    const cssString = Object.keys(css)
      .map((setting) => {
        value = css[setting];
        if (typeof value === "string" || typeof value === "number") {
          return `${setting}: ${value};`;
        }
      })
      .join(" ");

    return cssString;
  }

  public static getCurrentCursorPositionVscodeRange() {
    const editor = vscode.window.activeTextEditor!;
    const cursorPosition = editor.selection.active;
    return new vscode.Range(cursorPosition, cursorPosition);
  }

  public static getCurrentFontSize(): number {
    const workSpaceConfiguration = vscode.workspace.getConfiguration();
    return workSpaceConfiguration.get("editor.fontSize") ?? 12;
  }
}
