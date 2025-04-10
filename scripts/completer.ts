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

export function _completer(
  line: string,
  WATCH_PATH: string,
): [string[], string] {
  const firstSpaceIndex = line.indexOf(" ");

  // 分离命令和参数（保留尾部空格）
  const command =
    firstSpaceIndex === -1 ? line : line.slice(0, firstSpaceIndex);
  const argPart = firstSpaceIndex === -1 ? "" : line.slice(firstSpaceIndex + 1);

  // 仅在命令后存在空格时才进行路径补全
  if ((command === "r" || command === "new") && firstSpaceIndex !== -1) {
    const searchPath = path.join(WATCH_PATH, argPart);

    let dirToSearch = "";
    let baseToMatch = "";

    try {
      const stat = fs.statSync(searchPath);
      if (stat.isDirectory()) {
        dirToSearch = searchPath;
        baseToMatch = "";
      } else {
        dirToSearch = path.dirname(searchPath);
        baseToMatch = path.basename(searchPath);
      }
    } catch (e) {
      // 路径不存在时分解路径
      dirToSearch = path.dirname(searchPath);
      baseToMatch = path.basename(searchPath);
      if (!fs.existsSync(dirToSearch)) return [[], line];
    }

    try {
      const entries = fs.readdirSync(dirToSearch, { withFileTypes: true });
      const suggestions: string[] = [];

      for (const entry of entries) {
        if (!entry.name.startsWith(baseToMatch)) continue;

        // 根据命令类型过滤条目
        const validEntry =
          command === "r"
            ? entry.isDirectory() || entry.name.endsWith(".md")
            : entry.isDirectory();

        if (validEntry) {
          // 构建相对于当前参数的补全建议
          const relativePath = path.join(argPart, entry.name);
          suggestions.push(
            relativePath.replace(/\\/g, "/") + (entry.isDirectory() ? "/" : ""),
          );
        }
      }

      // 关键修复：替换范围限定在参数部分（空格后的内容）
      return [
        suggestions,
        path.join(argPart || " ", baseToMatch).replace(/\\/g, "/"), // 仅替换参数部分
      ];
    } catch (e) {
      return [[], line];
    }
  }

  // 无命令或未输入空格时不补全
  return [[], line];
}
