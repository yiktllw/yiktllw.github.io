import path from "path";
import fs from "fs";
import { listFilesByExtension, listSubdirectories } from "./tree";

type ICompleterResult = [string[], string];

export function completer(line: string, WATCH_PATH: string): ICompleterResult {
  const completions: string[] = [];
  const command = line.split(" ")[0];
  const result: ICompleterResult = [completions, line];

  const arg0 = line.split(" ")[1];

  switch (command) {
    case "r":
      const files = listFilesByExtension(WATCH_PATH, ".md");
      if (arg0) {
        files
          .filter((file) => file.startsWith(arg0))
          .forEach((file) => {
            completions.push("r " + file);
          });
      } else {
        files.forEach((file) => {
          completions.push("r " + file);
        });
      }
      break;
    case "new":
      const newDirs = listSubdirectories(WATCH_PATH);
      if (arg0) {
        newDirs
          .filter((dir) => dir.startsWith(arg0))
          .forEach((dir) => {
            completions.push("new " + dir + "/");
          });
      } else {
        newDirs.forEach((dir) => {
          completions.push("new " + dir + "/");
        });
      }
      break;
  }

  return [completions, line];
}
