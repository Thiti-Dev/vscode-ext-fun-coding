import * as vscode from "vscode";
import { FCPlugin } from "./fun-coding/fc-plugin";
import { SimulateShaker } from "./simulate-shaker/simulate-shaker";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension loaded");
  const shakerInstance = new SimulateShaker();
  const fcPlugin = new FCPlugin(shakerInstance);
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(fcPlugin.onTyping.bind(fcPlugin))
  );
}

export function deactivate() {
  console.log("Extension unloaded");
}
