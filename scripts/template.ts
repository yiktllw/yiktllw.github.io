const args = process.argv.slice(2);
import fs from "fs";
import markdownit from "markdown-it";
import anchor from "markdown-it-anchor";
import katex from "markdown-it-katex";
import hilightjs from "highlight.js";
import { readdirSync, statSync } from "node:fs";
import path, { resolve, relative, parse, join } from "node:path";

/*******************************
 * 生成 Vue 组件
 *******************************/
const filename = args[0] || process.exit(1);

const md = markdownit({
  html: true,
});
md.use(anchor).use(katex);

const codeToCopy: string[] = [];
let copyIndex = 0;

const myHighlight = (str: string, lang: string) => {
  if (str.endsWith("\n")) str = str.slice(0, -1);
  const before =
    `<pre>` +
    `<code class="hljs" style="font-family: yiktllw-code, serif;">` +
    `<div class="copy-button" @click="copyCode(${copyIndex})">` +
    `<img class="copy-img g-icon" :src="copy_svg"/>` +
    `</div>` +
    `<details class="code-details" open="true">` +
    `<summary>${lang}</summary>`;

  const after = `</details></code></pre>`;

  codeToCopy[copyIndex] = str;
  copyIndex++;

  let highlighted;
  if (lang && hilightjs.getLanguage(lang)) {
    try {
      highlighted = hilightjs.highlight(str, {
        language: lang,
      }).value;
    } catch (__) {
      console.error(__);
      highlighted = md.utils.escapeHtml(str);
    }
  }

  const lines = highlighted.split("\n");
  let output = "";
  let tagStack: string[] = [];
  let pendingLines: string[] = [];

  // 改进的标签解析器
  const parseTags = (line: string) => {
    const tags = line.match(/<\/?([a-z][^\s/>]*)|(\/>)/gi) || [];

    tags.forEach((token) => {
      const isClosing = token.startsWith("</");
      const isSelfClosing = token.endsWith("/>");
      const tagName = token.match(/[a-z][^\s/>]*/i)?.[0]?.toLowerCase();

      if (isSelfClosing) return; // 忽略自闭合标签
      if (!tagName) return;

      if (isClosing) {
        while (tagStack.pop() !== tagName && tagStack.length > 0);
      } else {
        tagStack.push(tagName);
      }
    });
  };

  lines.forEach((line, index) => {
    pendingLines.push(line);
    parseTags(line);

    // 在以下情况闭合包裹：
    // 1. 标签栈完全闭合
    // 2. 最后一行强制闭合
    if (tagStack.length === 0 || index === lines.length - 1) {
      const codeBlock = pendingLines.join("\n");
      output += `<div class="line">${codeBlock}</div>`;
      pendingLines = [];
    }
  });

  codeToCopy[copyIndex] = str;
  copyIndex++;

  return before + output + after;
};

md.options.highlight = myHighlight;

const blog = fs.readFileSync(`blogs/${filename}.md`, "utf-8");
const result = md.render(blog);
const vue = `<template>
  <div class="blog" ref="blog">
    <div class="blog-info">
      <h1 class="blog-title">
        {{ currentBlog?.blogInfo.title ?? "Untitled" }}
      </h1>
      <div class="info">
        <span clas="author">
          <span class="ele-title">作者：</span>{{ author || "无名" }}
        </span>
        <span class="create-time">
          <span class="ele-title">创建时间：</span>{{ formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.createTime ?? 0) }}
        </span>
        <span class="last-update">
          <span class="ele-title">最后修改：</span>{{ formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.lastUpdate ?? 0) }}
        </span>
        <span class="copy-right">
          <span class="ele-title">许可协议：</span><p xmlns:cc="http://creativecommons.org/ns#" ><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></a></p>
        </span>
      </div>
    </div>
    ${result}
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import copy_svg from "@/assets/svg/copy.svg";
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";

const blog = ref<HTMLElement>();
const author = import.meta.env.VITE_AUTHOR;

const utteranc = document.createElement("script");
utteranc.src = "https://utteranc.es/client.js";
utteranc.setAttribute("repo", import.meta.env.VITE_COMMENT_REPO);
utteranc.setAttribute("issue-term", "${filename}");
utteranc.setAttribute("label", "💬comment")
utteranc.setAttribute("theme", \`github-\${window.theme ?? "dark"}\`);
utteranc.setAttribute("crossorigin", "anonymous");
utteranc.setAttribute("async", "true");
nextTick(() => {
  blog.value?.appendChild(utteranc);
  // setTimeout(() => {
  window.mermaid?.initialize({
    startOnLoad: false,
    theme: window.theme === "dark" ? "dark" : "default",
  });
  window.mermaid?.run();
  // }, 1000);
});

const currentBlog = blogs.find((item) => item.component === "@/blogs/${filename}.vue");
document.title = currentBlog?.blogInfo.title ?? "yiktllw的博客";

const codeToCopy = ${JSON.stringify(codeToCopy)};
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
}
</script>`;

if (!fs.existsSync(`src/blogs/${filename}.vue`)) {
  fs.mkdirSync(path.parse(`src/blogs/${filename}.vue`).dir, {
    recursive: true,
  });
}
fs.writeFileSync(`src/blogs/${filename}.vue`, vue, "utf-8");
console.log(`✅ 执行成功: ${filename}.md -> ${filename}.vue`);

/*******************************
 * 生成路由配置
 *******************************/
// 获取项目根目录路径
const PROJECT_ROOT = resolve(process.cwd());
const BLOG_BASE = resolve(PROJECT_ROOT, "src/blogs");

// 递归获取所有.vue文件
function getVueFiles(dir: string, fileList: string[] = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getVueFiles(filePath, fileList);
    } else if (file.endsWith(".vue")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 生成路由配置
function generateRoutes() {
  const files = getVueFiles(BLOG_BASE);

  return files.map((file) => {
    // 获取相对于src/blogs的路径
    const relativePath = relative(BLOG_BASE, file);
    const parsed = parse(relativePath);

    // 处理Windows路径分隔符
    const normalizedPath = parsed.dir.replace(/\\/g, "/");

    // 生成路由路径
    const pathSegments = [
      ...normalizedPath.split("/").filter(Boolean),
      parsed.name,
    ];

    return {
      path: `/blog/${pathSegments.join("/")}`,
      component: `@/blogs/${relativePath.replace(/\\/g, "/")}`,
    };
  });
}

const blogRoutes = generateRoutes();

const routes_arr = blogRoutes
  .map((route) => {
    const filename = route.component.split("/").pop()?.split(".")[0];
    return `  {\n    path: "/blog/${filename}",\n    component: () => import('${route.component}')\n  }`;
  })
  .join(",\n");
const blogRoutesStr = "export const blogRoutes = [\n" + routes_arr + "\n]";

fs.writeFileSync("src/router/blogRoutes.ts", blogRoutesStr, "utf-8");

/*******************************
 * 生成元数据
 *******************************/
const META_FILE = "src/blogs.json";

type BlogMeta = {
  component: string;
  blogInfo: {
    title: string;
    createTime: number;
    lastUpdate: number;
    wordCount: number;
    readingTime: number;
  };
};

// 获取或初始化元数据
function getMetaData(): BlogMeta[] {
  if (!fs.existsSync(META_FILE)) return [];

  try {
    return JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  } catch {
    console.error(`元数据文件 ${META_FILE} 格式错误，初始化为空数组`);
    return [];
  }
}

// 合并新旧数据
function mergeMetaData(routes: Array<{ component: string }>) {
  const now = Date.now();
  const existingData = getMetaData();

  return routes.map((route) => {
    // 查找已有记录
    const existing = existingData.find((m) => m.component === route.component);
    // 计算字数和阅读时间
    const path =
      route.component.substring(2, route.component.length - 4) + ".md";
    console.log(path);
    const { wordCount, readingTime } = countMarkdownWords(path);

    return {
      component: route.component,
      blogInfo: {
        title: existing?.blogInfo.title || "", // 保留已有标题或初始化
        createTime: existing?.blogInfo.createTime || now, // 已有值或新时间戳
        lastUpdate: now, // 总是更新最后修改时间
        wordCount: wordCount,
        readingTime: readingTime,
      },
    };
  });
}

// 执行合并并写入文件
const mergedData = mergeMetaData(blogRoutes);
fs.writeFileSync(META_FILE, JSON.stringify(mergedData, null, 2), "utf-8");

console.log(`✅ 成功更新 ${mergedData.length} 条元数据到 ${META_FILE}`);

/*******************************
 * 统计字数
 *******************************/
interface StatsResult {
  wordCount: number;
  readingTime: number;
}

function countMarkdownWords(filePath: string): StatsResult {
  const content = fs.readFileSync(filePath, "utf-8");

  // 清理内容的正则表达式
  const cleaned = content
    .replace(/<[\s\S]*?>/g, "") // 移除 HTML 标签
    .replace(/!\[.*?\]\(.*?\)/g, "") // 移除图片语法
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 保留链接文字，移除 URL
    .replace(/#{1,6}\s?/g, "") // 移除标题标记
    .replace(/\*{1,2}(.*?)\*{1,2}/g, "$1") // 移除粗体/斜体标记
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1") // 移除下划线格式
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // 移除代码块标记
    .replace(/-{3,}/g, "") // 移除分隔线
    .replace(/^[*-+] .*/gm, "") // 移除列表标记
    .replace(/\s+/g, " ") // 合并多个空格
    .trim();

  // 混合统计逻辑
  let chineseChars = 0;
  let englishWords = 0;

  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const englishWordRegex = /\b[a-zA-Z]+\b/g;

  chineseChars = (cleaned.match(chineseRegex) || []).length;
  englishWords = (cleaned.match(englishWordRegex) || []).length;
  const totalCount = chineseChars + englishWords;

  const chineseTime = chineseChars / 300;
  const englishTime = englishWords / 200;
  const readingTime = Math.ceil(chineseTime + englishTime);

  return {
    wordCount: totalCount,
    readingTime,
  };
}
