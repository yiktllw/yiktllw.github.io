import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";
import readline from "readline";
import { startServer as startVite } from "./vite";

// 颜色配置
const colors = {
  reset: "\x1b[0m",
  fg: {
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
  },
  bg: {
    black: "\x1b[40m",
  },
};

// 监听路径配置
const WATCH_PATH = "blogs/";

// 颜色工具函数
const colorize = (text: string, colorCode: string) =>
  `${colorCode}${text}${colors.reset}`;

function debounce<F extends (...args: any[]) => void>(fn: F, delay = 500) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const runCommand = (filename: string) => {
  console.log(
    colorize(
      `📄 检测到 ${filename}.md 变化，正在执行命令...`,
      colors.fg.yellow,
    ),
  );
  exec(`bun run scripts/template.ts ${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(colorize(`执行错误: ${error.message}`, colors.fg.red));
      return;
    }
    stdout && console.log(colorize(stdout, colors.fg.gray));
    stderr && console.error(colorize(stderr, colors.fg.red));
  });
};

const debouncedRun = debounce(runCommand, 300);

const watcher = chokidar.watch(WATCH_PATH, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const showHelp = () => {
  console.log(
    colorize(
      `
可用命令：
${colorize("h", colors.fg.green)}    - 显示帮助信息
${colorize("ls", colors.fg.green)}   - 列出所有监听文件
${colorize("r <filename>", colors.fg.green)} - 手动触发md文件处理
${colorize("c", colors.fg.green)}    - 清空控制台
${colorize("q", colors.fg.green)}    - 退出程序
`,
      colors.fg.cyan,
    ),
  );
};

const listFiles = async () => {
  try {
    const files = await fs.readdir(WATCH_PATH);
    console.log(
      colorize(`\n监听目录 ${WATCH_PATH} 中的文件：`, colors.fg.cyan),
    );

    for (const [index, file] of files.entries()) {
      const fullPath = path.join(WATCH_PATH, file);
      const stat = await fs.stat(fullPath);
      const isDir = stat.isDirectory();
      const isMarkdown = file.endsWith(".md");

      const fileType = isDir ? "📁" : isMarkdown ? "📄" : "📎";
      const fileNameColor = isDir
        ? colors.fg.blue
        : isMarkdown
          ? colors.fg.green
          : colors.fg.magenta;

      const modifiedTime = stat.mtime.toLocaleString("zh-CN", {
        hour12: false,
        dateStyle: "short",
        timeStyle: "short",
      });

      console.log(
        colorize(`${(index + 1).toString().padStart(2)}.`, colors.fg.gray) +
          ` ${fileType} ` +
          colorize(file.padEnd(25), fileNameColor) +
          colorize(modifiedTime, colors.fg.gray),
      );
    }
    console.log("");
  } catch (error) {
    console.error(colorize("读取目录失败:", colors.fg.red), error);
  }
};

const handleCommand = async (input: string) => {
  const [command, ...args] = input.trim().split(/\s+/);

  switch (command.toLowerCase()) {
    case "h":
      showHelp();
      break;

    case "c":
      process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
      console.log(
        colorize(
          "\n🚀 Markdown文件监听服务已启动",
          colors.fg.cyan + colors.bg.black,
        ),
      );
      showHelp();
      break;

    case "ls":
      listFiles();
      break;

    case "o":
      break;
    case "u":
      break;

    case "r":
      if (!args.length) {
        return;
      }
      const filename = args[0].replace(/\.md$/i, "");
      runCommand(filename);
      console.log(colorize(`手动触发处理文件: ${filename}.md`, colors.fg.cyan));
      break;

    case "q":
      console.log(colorize("\n🛑 停止监听并退出程序", colors.fg.red));
      watcher.close().then(() => {
        if (viteProcess) {
          viteProcess.close();
        }
        process.exit(0);
      });
      break;

    default:
      console.log(colorize('未知命令，输入 "h" 查看帮助', colors.fg.yellow));
      break;
  }
};

console.log(
  colorize("\n🚀 文件监听服务已启动", colors.fg.cyan + colors.bg.black),
);

const viteProcess = await startVite();
showHelp();

watcher
  .on("ready", () =>
    console.log(
      colorize(`👀 开始监听 Markdown 文件: ${WATCH_PATH}\n`, colors.fg.cyan),
    ),
  )
  .on("change", (filePath) => {
    const filename = path.parse(filePath).name;
    debouncedRun(filename);
  })
  .on("error", (error) =>
    console.error(colorize(`监听错误: ${error}`, colors.fg.red)),
  );

rl.on("line", (input) => {
  handleCommand(input);
});

process.on("SIGINT", () => {
  console.log(colorize("\n🛑 停止监听并退出程序", colors.fg.red));
  watcher.close().then(() => {
    if (viteProcess) {
      viteProcess.close();
    }
    process.exit(0);
  });
});
