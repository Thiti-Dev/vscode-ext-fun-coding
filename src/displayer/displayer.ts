import { TypePerformance } from "./type-performance";

export default class Displayer {
  private static typePerformanceInstance = new TypePerformance();
  constructor() {}

  public static triggerTypePerformanceDisplay() {
    this.typePerformanceInstance.displayPerformance();
  }
}
