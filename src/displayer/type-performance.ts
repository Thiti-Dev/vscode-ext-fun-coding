import * as vscode from "vscode";
import type { DecorationRenderOptions, TextEditorDecorationType } from "vscode";
import { FCPlugin } from "../fun-coding/fc-plugin";
import { FCUtils } from "../fun-coding/fc-utils";

export class TypePerformance {
  private static readonly DEFAULT_CSS = FCUtils.cssObjectToString({
    position: "absolute",
    ["font-family"]: "monospace",
    ["font-weight"]: "900",
    ["z-index"]: 1,
    ["pointer-events"]: "none",
    ["text-align"]: "center",
  });
  private typePerformanceDecoration: TextEditorDecorationType | undefined;
  private typePerformanceTimeout: NodeJS.Timeout | null = null;

  public displayPerformance() {
    this.createTypePerformanceDecoration();
  }
  private createTypePerformanceDecoration() {
    const pastTypeStreak = FCPlugin.getTypeStreak(),
      pastPerf = FCPlugin.getTypeStreakTimePerformance(),
      pastRange = FCPlugin.getLatestCursorPosition(),
      pastEditor = vscode.window.activeTextEditor!;
    const performAnimateDisplay = (frame: number) => {
      this.typePerformanceDecoration?.dispose(); // remove the prev [simulate update]
      const textSize = FCUtils.getCurrentFontSize(), // fixed
        color = "red"; // fixed
      const baseCss = FCUtils.cssObjectToString({
        ["top"]: `-${frame}px`,
        ["font-size"]: textSize + Math.floor(frame / 7.5) + "px",
        ["text-shadow"]: `0px 0px 15px ${color}`,
      });
      const lightThemeCss = FCUtils.cssObjectToString({
        ["-webkit-text-stroke"]: `2px ${color}`,
      });

      const createTypePerformanceDecoration = (
        lightTheme?: boolean
      ): DecorationRenderOptions => {
        return {
          after: {
            margin: `0.5em 0 0 -${Math.floor(frame / 2)}px`,
            contentText:
              frame < 50 ? `${pastTypeStreak} letters` : `in ${pastPerf} sec`,
            color: "#FFFFFF",
            textDecoration: `none; ${TypePerformance.DEFAULT_CSS} ${baseCss} ${
              lightTheme ? lightThemeCss : ""
            }`,
          },
        };
      };

      this.typePerformanceDecoration =
        vscode.window.createTextEditorDecorationType({
          ...createTypePerformanceDecoration(),
          rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
          light: createTypePerformanceDecoration(true),
        });

      pastEditor.setDecorations(this.typePerformanceDecoration, [pastRange]);

      if (frame < 100) {
        setTimeout(() => {
          performAnimateDisplay(frame + 1);
        }, 20);
      } else {
        this.typePerformanceDecoration?.dispose();
      }
    };

    performAnimateDisplay(0);

    // const pastDecor = this.typePerformanceDecoration;
    // setTimeout(() => {
    //   pastDecor.dispose();
    // }, 2500);
  }
}
