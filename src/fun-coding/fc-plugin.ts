import type { TextDocumentChangeEvent, Range } from "vscode";
import { ICoreEvents } from "../interfaces/core-events";
import { SimulateShaker } from "../simulate-shaker/simulate-shaker";
import Displayer from "../displayer";
import { FCUtils } from "./fc-utils";

interface CoreEventsOverridedMethods extends Omit<ICoreEvents, "onTyping"> {
  onTyping(event: TextDocumentChangeEvent): void;
}

export class FCPlugin implements CoreEventsOverridedMethods {
  private static COMBO_RESULT_AFTER_IDLE_DURATION: number = 1500;
  private static typeStreak: number = 0;
  private static streakStartAt: number = -1;
  private static streakStopAt: number = -1;
  private static latestCursorPositionTheMomentWhenJustTyped: Range;
  private comboResultTimeout: NodeJS.Timeout | undefined;
  constructor(private shakerInstance: SimulateShaker) {}

  public static getLatestCursorPosition() {
    return this.latestCursorPositionTheMomentWhenJustTyped;
  }
  public static getTypeStreak() {
    return this.typeStreak;
  }
  public static getTypeStreakTimePerformance() {
    return (this.streakStopAt - this.streakStartAt) / 1000;
  }
  public static resetStreak() {
    this.streakStartAt = -1;
    this.typeStreak = 0;
  }
  private endTypeStreak() {
    Displayer.triggerTypePerformanceDisplay();
    FCPlugin.resetStreak();
  }
  private increaseTypeStreak() {
    if (FCPlugin.typeStreak === 0)
      FCPlugin.streakStartAt = Date.now(); // stamptation
    else {
      FCPlugin.streakStopAt = Date.now();
    }
    FCPlugin.typeStreak++;

    if (FCPlugin.typeStreak <= 1) return;

    clearTimeout(this.comboResultTimeout);
    this.comboResultTimeout = setTimeout(
      this.endTypeStreak,
      FCPlugin.COMBO_RESULT_AFTER_IDLE_DURATION
    );
  }

  public onTyping(event: TextDocumentChangeEvent): void {
    FCPlugin.latestCursorPositionTheMomentWhenJustTyped =
      FCUtils.getCurrentCursorPositionVscodeRange();

    const text: string = event.contentChanges[0]?.text;
    if (!text || text.length !== 1 || text === " ") {
      return;
    }

    // ─── Streak Management ───────────────────────────────────────
    this.increaseTypeStreak();
    // ─────────────────────────────────────────────────────────────

    // ─── Derive Tasks ────────────────────────────────────────────
    Displayer.triggerComboStageDisplay();
    this.shakerInstance.onTyping();
    // ─────────────────────────────────────────────────────────────
  }
}
