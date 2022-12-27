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
}
