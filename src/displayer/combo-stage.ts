import * as vscode from "vscode";
import type { DecorationRenderOptions, TextEditorDecorationType } from "vscode";
import { FCPlugin } from "../fun-coding/fc-plugin";
import { FCUtils } from "../fun-coding/fc-utils";

export class ComboStage {
  private static readonly DEFAULT_CSS = FCUtils.cssObjectToString({
    position: "absolute",
    ["font-family"]: "monospace",
    ["font-weight"]: "900",
    ["z-index"]: 1,
    ["pointer-events"]: "none",
    ["text-align"]: "center",
  });
  private comboStageDecoration: TextEditorDecorationType | undefined;
  private renderedComboStage: number = -1;
  public displayComboStage() {
    const currentComboStage = Math.floor(FCPlugin.getTypeStreak() / 10);
    if (!currentComboStage || this.renderedComboStage === currentComboStage)
      return;
    this.renderedComboStage = currentComboStage;
    this.createcomboStageDecoration();
  }

  private createcomboStageDecoration() {
    this.comboStageDecoration?.dispose();
    const textSize = FCUtils.getCurrentFontSize(), // fixed
      color = `hsl(${100 - FCPlugin.getTypeStreak() * 2}, 100%, 45%)`; // dymamic based on currentTypeStreak
    const baseCss = FCUtils.cssObjectToString({
      top: `-${FCUtils.getCurrentFontSize() * 1.65}px`,
      transform: `rotate(${FCUtils.getRandomNumberBetween(-70, 70)}deg)`,
      ["font-size"]: textSize + "px",
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
          contentText: `${this.renderedComboStage}x`,
          color: "#FFFFFF",
          textDecoration: `none; ${ComboStage.DEFAULT_CSS} ${baseCss} ${
            lightTheme ? lightThemeCss : ""
          }`,
        },
      };
    };

    this.comboStageDecoration = vscode.window.createTextEditorDecorationType({
      ...createComboCountAfterDecoration(),
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
      light: createComboCountAfterDecoration(true),
    });
    const editor = vscode.window.activeTextEditor!;
    editor.setDecorations(this.comboStageDecoration, [
      FCUtils.getCurrentCursorPositionVscodeRange(),
    ]);

    const pastDecor = this.comboStageDecoration;
    setTimeout(() => {
      pastDecor.dispose();
    }, 2000);
  }
}
