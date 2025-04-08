import fs from "node:fs";
import path from "node:path";
import { colorize, colors } from "./color";

const getDisplayWidth = (str: string): number => {
  const stripped = str.replace(/\x1B\[[\d;]*m/g, "");
  let width = 0;
  for (const char of stripped) {
    const code = char.charCodeAt(0);
    width += code >= 0x4e00 && code <= 0x9fff ? 2 : 1;
  }
  return width;
};

export const listFiles = async (WATCH_PATH: string) => {
  try {
    console.log(
      colorize(`\n监听目录 ${WATCH_PATH} 中的文件：`, colors.fg.cyan),
    );
    await processDirectory(WATCH_PATH, "");
    console.log("");
  } catch (error) {
    console.error(colorize("读取目录失败:", colors.fg.red), error);
  }
};

const processDirectory = async (dirPath: string, prefix: string) => {
  try {
    const files = await fs.promises.readdir(dirPath);
    const fileEntries = await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(dirPath, file);
        try {
          return { file, stat: await fs.promises.stat(fullPath) };
        } catch (error) {
          console.error(
            colorize(`无法获取文件状态 ${fullPath}:`, colors.fg.red),
            error,
          );
          return null;
        }
      }),
    );

    // 过滤掉无法获取状态的文件
    const validEntries = fileEntries.filter(
      (entry): entry is NonNullable<typeof entry> => entry !== null,
    );

    // 计算最大时间宽度用于对齐
    const maxTimeWidth = Math.max(
      ...validEntries.map(({ stat }) =>
        getDisplayWidth(
          stat.mtime.toLocaleString("zh-CN", {
            hour12: false,
            dateStyle: "short",
            timeStyle: "short",
          }),
        ),
      ),
    );

    for (let i = 0; i < validEntries.length; i++) {
      const { file, stat } = validEntries[i];
      const fullPath = path.join(dirPath, file);
      const isLastFile = i === validEntries.length - 1;

      const isDir = stat.isDirectory();
      const isMarkdown = file.endsWith(".md");

      // 文件类型和颜色设置
      const fileType = isDir ? "📁" : isMarkdown ? "📄" : "📎";
      const fileNameColor = isDir
        ? colors.fg.blue
        : isMarkdown
          ? colors.fg.green
          : colors.fg.magenta;

      // 格式化修改时间
      const modifiedTime = stat.mtime.toLocaleString("zh-CN", {
        hour12: false,
        dateStyle: "short",
        timeStyle: "short",
      });

      // 构建带样式的文件名部分
      const fileNamePart = `${fileType} ${colorize(file, fileNameColor)}`;

      // 计算所需填充空格
      const totalWidth = 50;
      const currentWidth =
        getDisplayWidth(prefix) + getDisplayWidth(fileNamePart);
      const padding = " ".repeat(Math.max(1, totalWidth - currentWidth));

      // 构建完整输出行
      const line = `${prefix}${fileNamePart}${padding}${colorize(
        modifiedTime,
        colors.fg.gray,
      )}`;

      console.log(line);

      // 递归处理子目录
      if (isDir) {
        const connector = isLastFile ? "    " : "│   ";
        const childPrefix = `${prefix}${connector}`;
        await processDirectory(fullPath, childPrefix);
      }
    }
  } catch (error) {
    console.error(colorize(`无法读取目录 ${dirPath}:`, colors.fg.red), error);
  }
};
