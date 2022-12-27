import * as vscode from "vscode";
import type { TextEditor, TextEditorDecorationType } from "vscode";
import { ICoreEvents } from "../interfaces/core-events";
import { FCPlugin } from "../fun-coding/fc-plugin";

type TTextDecorationPos =
  | "negative-x"
  | "negative-y"
  | "positive-x"
  | "positive-y";

export class SimulateShaker implements ICoreEvents {
  private shakeDecorations: vscode.TextEditorDecorationType[] = [];
  private editor: TextEditor | undefined;
  private fullRange = [
    new vscode.Range(
      new vscode.Position(0, 0),
      new vscode.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    ),
  ];
  private simulateUnShakeTimeout: NodeJS.Timeout | null = null;
  constructor() {
    //init smth
    this.init(); // shake enabled by default
  }
  private getCreatedTextDecoration(
    type: TTextDecorationPos
  ): TextEditorDecorationType {
    const creationOrder: TTextDecorationPos[] = [
      "negative-x",
      "positive-x",
      "negative-y",
      "positive-y",
    ];
    return this.shakeDecorations[creationOrder.indexOf(type)];
  }
  private init() {
    this.editor = vscode.window.activeTextEditor;

    const nX = vscode.window.createTextEditorDecorationType({
      textDecoration: `none; margin-left: 0px;`,
    });

    const pX = vscode.window.createTextEditorDecorationType({
      textDecoration: `none; margin-left: 5px;`,
    });
    const nY = vscode.window.createTextEditorDecorationType({
      textDecoration: `none; line-height:inherit`,
    });

    const pY = vscode.window.createTextEditorDecorationType({
      textDecoration: `none; line-height:${3 / 2 + 1};`,
    });

    this.shakeDecorations = [nX, pX, nY, pY];
  }
  private simulateUnShake() {
    this.shakeDecorations.forEach((decoration) => {
      try {
        this.editor?.setDecorations(decoration, []);
      } catch {}
    });
  }
  private simulateShaking() {
    const { editor } = this;
    if (!editor) return;
    const xRanges = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
      let textStart =
        editor.document.lineAt(i).firstNonWhitespaceCharacterIndex;
      xRanges.push(
        new vscode.Range(
          new vscode.Position(i, textStart),
          new vscode.Position(i, textStart + 1)
        )
      );
    }

    if (Math.random() > 0.5) {
      editor.setDecorations(this.getCreatedTextDecoration("negative-x"), []);
      editor.setDecorations(
        this.getCreatedTextDecoration("positive-x"),
        xRanges
      );
    } else {
      editor.setDecorations(this.getCreatedTextDecoration("positive-x"), []);
      editor.setDecorations(
        this.getCreatedTextDecoration("negative-x"),
        xRanges
      );
    }

    if (Math.random() > 0.5) {
      editor.setDecorations(this.getCreatedTextDecoration("negative-y"), []);
      editor.setDecorations(
        this.getCreatedTextDecoration("positive-y"),
        this.fullRange
      );
    } else {
      editor.setDecorations(this.getCreatedTextDecoration("positive-y"), []);
      editor.setDecorations(
        this.getCreatedTextDecoration("negative-y"),
        this.fullRange
      );
    }

    this.simulateUnShakeTimeout && clearTimeout(this.simulateUnShakeTimeout);
    this.simulateUnShakeTimeout = setTimeout(
      this.simulateUnShake.bind(this),
      500
    );
  }
  private endSimulation() {
    this.shakeDecorations.forEach((decor) => decor.dispose());
  }
  public onTyping() {
    if (FCPlugin.getTypeStreak() <= 20) return;
    this.simulateShaking(); // perform the shake
  }
}
