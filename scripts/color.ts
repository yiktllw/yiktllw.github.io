// 颜色配置
export const colors = {
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

// 颜色工具函数
export const colorize = (text: string, colorCode: string) =>
  `${colorCode}${text}${colors.reset}`;
