import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";
import fs from "node:fs";
import readline from "readline";
import { startServer as startVite } from "./vite";
import { colorize, colors } from "./color";
import { listFiles } from "./tree";

// 监听路径配置
const WATCH_PATH = "blogs/";

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

const showMiniHelp = () => {
  console.log(colorize(`按h键显示帮助信息`, colors.fg.green));
};

const showHelp = () => {
  console.log(
    colorize(
      `
可用命令：
${colorize("h", colors.fg.green)}    - 显示帮助信息
${colorize("ls", colors.fg.green)}   - 列出所有监听文件
${colorize("new <path/to/filename.md>", colors.fg.green)} - 创建新md文件
${colorize("r <filename>", colors.fg.green)} - 手动触发md文件处理
${colorize("c", colors.fg.green)}    - 清空控制台
${colorize("q", colors.fg.green)}    - 退出程序
`,
      colors.fg.cyan,
    ),
  );
};

function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

const handleCommand = async (input: string) => {
  const [command, ...args] = input.trim().split(/\s+/);

  switch (command.toLowerCase()) {
    case "h":
      clearScreen();
      showHelp();
      break;

    case "c":
      clearScreen();
      break;

    case "ls":
      listFiles(WATCH_PATH);
      break;

    case "new":
      if (args.length === 0) {
        console.log("请指定文件路径，示例: new 2025/03/21/blog1.md");
        return;
      }

      try {
        const filePath = path.resolve(WATCH_PATH, args[0]);
        const dirPath = path.dirname(filePath);
        // 递归创建目录
        fs.mkdirSync(dirPath, { recursive: true });

        // 如果文件不存在则创建
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "");
          clearScreen();
          console.log(`\n✅ 已创建文件: ${filePath}`);
        }
        // 在VSCode中打开
        exec(`code ${filePath}`, (error) => {
          if (error) {
            console.log("VSCode打开失败，请确保已安装并在PATH中添加了code命令");
          }
        });
      } catch (error) {
        console.log(`操作失败: ${error.message}`);
      }
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

showMiniHelp();
const viteProcess = await startVite();

watcher
  .on("ready", () =>
    console.log(
      colorize(`👀 开始监听 Markdown 文件: ${WATCH_PATH}\n`, colors.fg.cyan),
    ),
  )
  .on("change", (filePath) => {
    const blogsDir = "blogs";
    const relativePath = path.relative(blogsDir, filePath);
    const parsed = path.parse(relativePath);
    const filename = path.join(parsed.dir, parsed.name);

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
