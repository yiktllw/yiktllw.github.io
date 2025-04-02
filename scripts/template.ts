const args = process.argv.slice(2);
import fs from "fs";
import markdownit from "markdown-it";
import anchor from "markdown-it-anchor";
import katex from "markdown-it-katex";
import hilightjs from "highlight.js";
import { readdirSync, statSync } from "node:fs";
import { resolve, relative, parse, join } from "node:path";

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
  const before =
    `<pre>` +
    `<code class="hljs" style="font-family: yiktllw-code">` +
    `<div class="copy-button" @click="copyCode(${copyIndex})">` +
    `<img class="copy-img" :src="copy_svg"/>` +
    `</div>` +
    `<details class="code-details" open="true">` +
    `<summary>${lang}</summary>`;

  const after = `</details></code></pre>`;

  codeToCopy[copyIndex] = str;
  copyIndex++;

  if (lang && hilightjs.getLanguage(lang)) {
    try {
      return (
        before +
        hilightjs.highlight(str, {
          language: lang,
        }).value +
        after
      );
    } catch (__) {
      console.error(__);
    }
  }

  return before + md.utils.escapeHtml(str) + after;
};

md.options.highlight = myHighlight;

const blog = fs.readFileSync(`blogs/${filename}.md`, "utf-8");
const result = md.render(blog);
const vue = `<template>
  <div class="blog">
  ${result}
  </div>
</template>
<script setup lang="ts">
import copy_svg from "@/assets/svg/copy.svg";

const codeToCopy = ${JSON.stringify(codeToCopy)};
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
}
</script> `;

fs.writeFileSync(`src/blogs/${filename}.vue`, vue, "utf-8");

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
const importRoutesStr = blogRoutes
  .map((route) => {
    const filename = route.component.split("/").pop()?.split(".")[0];
    return `import ${filename} from "${route.component}"`;
  })
  .join("\n");

const routes_arr = blogRoutes
  .map((route) => {
    const filename = route.component.split("/").pop()?.split(".")[0];
    return {
      path: `/blog/${filename}`,
      component: filename,
    };
  })
  .map((route) => {
    return `  {\n    path: "${route.path}",\n    component: ${route.component}\n  }`;
  })
  .join(",\n");
const blogRoutesStr = "export const blogRoutes = [\n" + routes_arr + "\n]";

fs.writeFileSync(
  "src/router/blogRoutes.ts",
  importRoutesStr + "\n" + blogRoutesStr,
  "utf-8",
);

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

    return {
      component: route.component,
      blogInfo: {
        title: existing?.blogInfo.title || "", // 保留已有标题或初始化
        createTime: existing?.blogInfo.createTime || now, // 已有值或新时间戳
        lastUpdate: now, // 总是更新最后修改时间
      },
    };
  });
}

// 执行合并并写入文件
const mergedData = mergeMetaData(blogRoutes);
fs.writeFileSync(META_FILE, JSON.stringify(mergedData, null, 2), "utf-8");

console.log(`✅ 成功更新 ${mergedData.length} 条元数据到 ${META_FILE}`);
