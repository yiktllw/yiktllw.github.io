const args = process.argv.slice(2);
import fs from "fs";
import markdownit from "markdown-it";
import footnote from "markdown-it-footnote";
import anchor from "markdown-it-anchor";
import katex from "markdown-it-katex";
import hilightjs from "highlight.js";
import { readdirSync, statSync } from "node:fs";
import path, { resolve, relative, parse, join } from "node:path";
import { colors, colorize } from "./color";
import { generateToc } from "./md-toc";
import { getMarkdownSummary } from "./md-abstract";

const startTime = Date.now();

hilightjs.registerLanguage("vue", (hljs) => {
  return {
    name: "Vue",
    subLanguage: "xml",
    contains: [
      {
        begin: /<script(\s*lang\s*=\s*['"]?(ts|typescript)['"]?)?\s*>/,
        end: /<\/script>/,
        subLanguage: "javascript",
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /<style(\s*lang\s*=\s*['"]?(scss|sass|less|stylus)['"]?)?\s*>/,
        end: /<\/style>/,
        subLanguage: "css",
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /<template>/,
        end: /<\/template>/,
        subLanguage: "xml",
        excludeBegin: true,
        excludeEnd: true,
      },
    ],
  };
});

/*******************************
 * 生成 Vue 组件
 *******************************/
const filename = args[0] || process.exit(1);

const md = markdownit({
  html: true,
  breaks: true,
});
md.use(anchor).use(katex).use(footnote);

const codeToCopy: string[] = [];
let copyIndex = 0;

const hljs = (str: string, lang: string) => {
  codeToCopy[copyIndex] = str;
  let result = hilightjs.highlight(str, { language: lang }).value;
  result = result
    .replace(/\{\{/g, "&lbrace;&lbrace;")
    .replace(/\}\}/g, "&rbrace;&rbrace;");
  const lineCount = (result.match(/\n/g) || []).length;
  // side effect
  const beforeTemplate =
    `<pre><code :data-open="codeOpen[${copyIndex}]" class="hljs language-${lang}" style="font-family: yiktllw-code, serif; position: relative;">` +
    `<div class="line-numbers"><span v-for="i in ${lineCount}">{{ i }}</span></div>` +
    `<div class="top-line"><div @click="toggleCodeOpen(${copyIndex})" class="language">&lt;${lang.toUpperCase()}&gt;</div><div class="copy-button" @click="copyCode(${copyIndex})"><img class="copy-img" :src="copy_svg"/></div></div>` +
    `<div class="code">`;
  const afterTemplate = `</div></code></pre>`;

  copyIndex++;
  return beforeTemplate + result + afterTemplate;
};

md.options.highlight = hljs;

const blog = fs.readFileSync(`blogs/${filename}.md`, "utf-8");
const result = md.render(blog);
const [_headings, headings_html_str] = generateToc(blog);

const vue = `<template>
<div class="blog-container" ref="container">
  <div class="blog" ref="blog">
    <div class="blog-info">
      <h1 class="blog-title">
        {{ currentBlog?.blogInfo.title ?? "Untitled" }}
      </h1>
    </div>
    ${result}
  </div>
  <div class="sidebar-placeholder">
    <div class="sidebar-container">
      <div class="nav">
        <div class="nav-item selected" id="nav_article" @click="nav_to('article')">文章信息</div>
        <div class="nav-item" id="nav_site" @click="nav_to('site')">站点概览</div>
      </div>
      <div class="nav-content">
        <div class="article toc active" id="article">
          ${headings_html_str === "" ? "" : `<div class="toc-title">目录</div>\n<div class="progress-bar"/>` + headings_html_str}
          <div class="info">
            <span class="create-time">
              <span class="ele-title">创建于：</span>{{ formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.createTime ?? 0) }}
            </span>
            <span class="last-update">
              <span class="ele-title">修改于：</span>{{ formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.lastUpdate ?? 0) }}
            </span>
            <span class="word-count">
              <span class="ele-title">本文字数：</span>{{ currentBlog?.blogInfo.wordCount }}字
            </span>
            <span class="reading-time">
              <span class="ele-title">预计阅读时间：</span>{{ currentBlog?.blogInfo.readingTime }}分钟
            </span>
            <span class="category" v-if="currentBlog?.blogInfo.category !== 'default'">
              <span class="ele-title">分类于：</span>{{ currentBlog?.blogInfo.category }}
            </span>
            <span class="series" v-if="currentBlog?.blogInfo.series.enable">
              <span class="ele-title">系列：</span>{{ currentBlog?.blogInfo.series.name }}
            </span>
            <span class="copy-right">
              <span class="ele-title">许可协议：</span><p xmlns:cc="http://creativecommons.org/ns#" ><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0</a></p>
            </span>
            <span class="tags" v-if="currentBlog && currentBlog.blogInfo.tags.length > 0">
              <span class="ele-title">标签：</span>
              <span v-for="tag in currentBlog?.blogInfo.tags" class="tag" :key="tag">{{ tag }}</span>
            </span>
          </div>
        </div>
        <div class="site" id="site">
          标签2的内容
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";
// @ts-ignore
import copy_svg from "@/assets/svg/copy.svg";
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";

const blog = ref<HTMLElement>();
const heading_offset_top = ref<number[]>([]);
const current_heading = ref<number>(0);
const handleScroll = () => {
  const scrollTop =
    (document.documentElement.scrollTop || document.body.scrollTop) + 100;
  let _index = 0;
  for (const [index, item] of heading_offset_top.value.entries()) {
    if (scrollTop > item) {
      if (
        heading_offset_top.value[index + 1] &&
        scrollTop < heading_offset_top.value[index + 1]
      ) {        
        _index = index;
        break;
      } else if (index === heading_offset_top.value.length - 1) {
        _index = index;
      }
    }
  }
  if (_index !== current_heading.value) current_heading.value = _index;
}
nextTick(() => {
  const headings = document.querySelectorAll(
    ".blog h2, .blog h3, .blog h4, .blog h5, .blog h6",
  ) as NodeListOf<HTMLElement>;
  headings.forEach((heading) => {
    heading_offset_top.value.push(heading.offsetTop);
  });
  heading_offset_top.value.map((a) => -a);
  heading_offset_top.value.sort((a, b) => a - b);
  document.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});

const nav_to = (id: "article" | "site") => {
  const content = document.getElementById(id);
  const content_to_be_hidden = document.getElementById(id === "article" ? "site" : "article");

  if (content_to_be_hidden) {
    content_to_be_hidden.classList.remove("active");
    if (content) {
      content.style.display = "block";
      content.style.position = "absolute";
    }
    setTimeout(() => {
      if (content) {
        content.classList.add("active");
        content.style.position = "initial";
      }
      content_to_be_hidden.style.display = "none";
    }, 200);
  } else {
    if (content) content.classList.add("active");
  }
  
  const selected = document.getElementById("nav_" + id);
  const unselected = document.getElementById("nav_" + (id === "article" ? "site" : "article"));
  
  if (selected) selected.classList.add("selected");
  if (unselected) unselected.classList.remove("selected");
}

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

// @ts-ignore
const codeToCopy = ${JSON.stringify(codeToCopy)};
// @ts-ignore
const copyCode = (index: number) => {
  // @ts-ignore
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
}

const codeOpen = ref<boolean[]>([
  ${codeToCopy.map((_) => `true`).join(",")}
]);
// @ts-ignore
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
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

// const routes_arr = blogRoutes
//   .map((route) => {
//     const filename = route.component
//       .slice(8, -4)
//       .replace(/\//g, "_")
//       .replace(/\\/g, "_");
//     return `  {\n    path: "/blog/${filename}",\n    component: () => import('${route.component}')\n  }`;
//   })
//   .join(",\n");
// const blogRoutesStr = "export const blogRoutes = [\n" + routes_arr + "\n]";

// fs.writeFileSync("src/router/blogRoutes.ts", blogRoutesStr, "utf-8");

/*******************************
 * 生成元数据
 *******************************/
const META_FILE = "src/blogs.json";

type BlogMeta = {
  /** 组件路径 */
  component: string;
  /** 路由路径 */
  route_path: string;
  blogInfo: {
    /** 标题 */
    title: string;
    /** 摘要 */
    abstract: string;
    /** 创建时间 */
    createTime: number;
    /** 最后修改时间 */
    lastUpdate: number;
    /** 字数 */
    wordCount: number;
    /** 预计阅读时间 */
    readingTime: number;
    /** 分类 */
    category: string;
    /** 标签 */
    tags: string[];
    /** 系列，用于连载 */
    series: {
      enable: boolean;
      name: string;
    };
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
function mergeMetaData(routes: Array<{ component: string }>): BlogMeta[] {
  const now = Date.now();
  const existingData = getMetaData();

  return routes
    .map((route) => {
      const isCurrent =
        filename === route.component.slice(8, -4) ||
        filename === route.component.slice(8, -4) + ".md";

      // 查找已有记录
      const existing = existingData.find(
        (m) => m.component === route.component,
      );
      const path =
        route.component.substring(2, route.component.length - 4) + ".md";

      const _filename = route.component
        .slice(8, -4)
        .replace(/\//g, "_")
        .replace(/\\/g, "_");
      const route_path = `/blog/${_filename}`;

      // 计算字数和阅读时间
      const { wordCount, readingTime } = countMarkdownWords(path);

      // 从md生成摘要
      let abstract = existing?.blogInfo.abstract ?? "";
      if (abstract === "" || abstract === "...")
        abstract = getMarkdownSummary(blog, 200);

      return {
        component: route.component,
        route_path,
        blogInfo: {
          title: existing?.blogInfo.title || "", // 保留已有标题或初始化
          abstract,
          createTime: existing?.blogInfo.createTime || now, // 已有值或新时间戳
          lastUpdate: isCurrent ? now : (existing?.blogInfo.lastUpdate ?? now),
          wordCount: wordCount,
          readingTime: readingTime,
          category: existing?.blogInfo.category || "default", // 默认分类
          tags: existing?.blogInfo.tags || [],
          series: {
            enable: existing?.blogInfo.series.enable || false,
            name: existing?.blogInfo.series.name || "",
          },
        },
      };
    })
    .sort((a, b) => b.blogInfo.createTime - a.blogInfo.createTime);
}

// 执行合并并写入文件
const mergedData = mergeMetaData(blogRoutes).sort(
  (a, b) => b.blogInfo.createTime - a.blogInfo.createTime,
);
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

const endTime = Date.now();
const duration = endTime - startTime;
console.warn(colorize("🕒 执行时间: " + duration + "毫秒", colors.fg.yellow));
