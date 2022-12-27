import * as vscode from "vscode";
import type { DecorationRenderOptions, TextEditorDecorationType } from "vscode";
import { FCPlugin } from "../fun-coding/fc-plugin";
import { FCUtils } from "../fun-coding/fc-utils";

export class TypePerformance {
  private static readonly DEFAULT_CSS = FCUtils.cssObjectToString({
    // position: "absolute",
    // right: "5%",
    // top: "20px",
    ["padding-left"]: "20px",
    ["font-family"]: "monospace",
    ["font-weight"]: "900",
    ["z-index"]: 1,
    ["pointer-events"]: "none",
    ["text-align"]: "center",
  });
  private typePerformanceDecoration: TextEditorDecorationType | undefined;
  private typePerformanceTimeout: NodeJS.Timeout | null = null;
  private editor = vscode.window.activeTextEditor!;

  public displayPerformance() {
    this.createTypePerformanceDecoration();
  }
  private createTypePerformanceDecoration() {
    this.typePerformanceDecoration?.dispose();
    const textSize = 24, // fixed
      color = "red"; // fixed
    const baseCss = FCUtils.cssObjectToString({
      ["font-size"]: textSize,
      ["text-shadow"]: `0px 0px 15px ${color}`,
    });
    const lightThemeCss = FCUtils.cssObjectToString({
      ["-webkit-text-stroke"]: `2px ${color}`,
    });

    const createComboCountAfterDecoration = (
      lightTheme?: boolean
    ): DecorationRenderOptions => {
      return {
        after: {
          margin: "0.5em 0 0 0",
          contentText: `${FCPlugin.getTypeStreak()} letters in ${FCPlugin.getTypeStreakTimePerformance()} sec`,
          color: "#FFFFFF",
          textDecoration: `none; ${TypePerformance.DEFAULT_CSS} ${baseCss} ${
            lightTheme ? lightThemeCss : ""
          }`,
        },
      };
    };

    this.typePerformanceDecoration =
      vscode.window.createTextEditorDecorationType({
        ...createComboCountAfterDecoration(),
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        light: createComboCountAfterDecoration(true),
      });

    const editor = this.editor!;
    const cursorPosition = editor.selection.active;
    const range = new vscode.Range(cursorPosition, cursorPosition);
    this.editor.setDecorations(this.typePerformanceDecoration, [range]);

    const pastDecor = this.typePerformanceDecoration;
    setTimeout(() => {
      pastDecor.dispose();
    }, 2500);
  }
}
