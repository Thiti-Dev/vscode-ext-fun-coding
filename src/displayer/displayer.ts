import { ComboStage } from "./combo-stage";
import { TypePerformance } from "./type-performance";

export default class Displayer {
  private static typePerformanceInstance = new TypePerformance();
  private static comboStageInstance = new ComboStage();
  constructor() {}

  public static triggerTypePerformanceDisplay() {
    this.typePerformanceInstance.displayPerformance();
  }

  public static triggerComboStageDisplay() {
    this.comboStageInstance.displayComboStage();
  }
}
