import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";

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
  console.log(`📄 检测到 ${filename}.md 变化，正在执行命令...`);
  exec(`bun run scripts/template.ts ${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error.message}`);
      return;
    }
    console.log(`执行成功: ${filename}.md -> ${filename}.vue`);
    stdout && console.log(stdout);
    stderr && console.error(stderr);
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

watcher
  .on("ready", () => console.log(`👀 开始监听 Markdown 文件: ${WATCH_PATH}`))
  .on("change", (filePath) => {
    const filename = path.parse(filePath).name;
    debouncedRun(filename);
  })
  .on("error", (error) => console.error(`监听错误: ${error}`));
