<template>
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
          <span class="ele-title">创建时间：</span
          >{{
            formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.createTime ?? 0)
          }}
        </span>
        <span class="last-update">
          <span class="ele-title">最后修改：</span
          >{{
            formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.lastUpdate ?? 0)
          }}
        </span>
        <span class="copy-right">
          <span class="ele-title">许可协议：</span>
          <p xmlns:cc="http://creativecommons.org/ns#">
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
              target="_blank"
              rel="license noopener noreferrer"
              style="display: inline-block"
              >CC BY-NC-SA 4.0<img
                style="
                  height: 22px !important;
                  margin-left: 3px;
                  vertical-align: text-bottom;
                "
                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                alt="" /><img
                style="
                  height: 22px !important;
                  margin-left: 3px;
                  vertical-align: text-bottom;
                "
                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                alt="" /><img
                style="
                  height: 22px !important;
                  margin-left: 3px;
                  vertical-align: text-bottom;
                "
                src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                alt="" /><img
                style="
                  height: 22px !important;
                  margin-left: 3px;
                  vertical-align: text-bottom;
                "
                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
                alt=""
            /></a>
          </p>
        </span>
      </div>
    </div>
    <p>
      本博客通过GitHub Actions从<a
        href="https://github.com/yiktllw/yiktllw.github.io"
        >yiktllw.github.io</a
      >仓库自动构建，未采用任何现有博客框架，旨在兼顾Markdown的编写便利性与开发自由度。
    </p>
    <p>技术方案如下：</p>
    <ol>
      <li>以Vue为基础框架</li>
      <li>
        编写TypeScript脚本实现：
        <ul>
          <li>
            核心脚本：将Markdown解析为Vue组件，自动生成路由配置和文章元数据
          </li>
          <li>
            辅助脚本：实时监听Markdown文件变更并同步更新Vue文件，支持开发热更新
          </li>
        </ul>
      </li>
      <li>通过GitHub Actions实现自动化部署</li>
    </ol>
    <p><strong>以下为使用本项目构建个人博客的过程。</strong></p>
    <h2 id="%E7%9B%AE%E5%BD%95" tabindex="-1">目录</h2>
    <p>
      <a href="#1.%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C">1. 准备工作</a><br />
      <a href="#2.%E5%90%AF%E5%8A%A8%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1"
        >2. 启动开发服务</a
      ><br />
      <a href="#3.%E7%BC%96%E5%86%99%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0"
        >3. 编写博客文章</a
      ><br />
      <a href="#4.%E5%8F%91%E5%B8%83%E5%88%B0-github-pages"
        >4. 发布到GitHub Pages</a
      ><br />
      <a href="#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9">5. 注意事项</a>
    </p>
    <h2 id="1.%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C" tabindex="-1">
      1.准备工作
    </h2>
    <ol>
      <li>
        <p><strong>克隆仓库</strong></p>
        <ul>
          <li>Fork 本项目到你的 GitHub 账户</li>
          <li>
            将项目源码克隆到本地：
            <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(0)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">git <span class="hljs-built_in">clone</span> https://github.com/你的用户名/仓库名.git</div></details></code></pre>
          </li>
        </ul>
      </li>
      <li>
        <p><strong>环境配置</strong></p>
        <ul>
          <li>
            安装 Bun 运行时环境 (<a href="https://bun.sh/docs/installation"
              >官方安装指南</a
            >)
          </li>
          <li>
            安装 Vite 构建工具：
            <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(2)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">bun add -g vite</div></details></code></pre>
          </li>
        </ul>
      </li>
      <li>
        <p><strong>安装依赖</strong></p>
        <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(4)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">bun install</div></details></code></pre>
      </li>
    </ol>
    <h2
      id="2.%E5%90%AF%E5%8A%A8%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1"
      tabindex="-1"
    >
      2.启动开发服务
    </h2>
    <p><strong>启动文件监听</strong>：</p>
    <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(6)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">bun watch</div></details></code></pre>
    <p><strong>启动开发服务器</strong>（新终端窗口）：</p>
    <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(8)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">bun dev</div></details></code></pre>
    <p>访问 <code>http://localhost:5173</code> 预览实时效果</p>
    <p><strong>配置评论系统</strong></p>
    <p>
      安装<a href="https://github.com/apps/utterances">utteranc</a
      >到fork的仓库，并修改项目根目录的<code>.env</code>文件中对应的信息。
    </p>
    <h2
      id="3.%E7%BC%96%E5%86%99%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0"
      tabindex="-1"
    >
      3.编写博客文章
    </h2>
    <ol>
      <li>在项目根目录的 <code>/blogs</code> 文件夹中新建 Markdown 文件</li>
      <li>
        系统会自动完成：
        <ul>
          <li>Markdown → Vue 组件转换（生成至 <code>/src/blogs</code>）</li>
          <li>自动注册路由 <code>/blog/文件名</code></li>
        </ul>
      </li>
      <li>编辑 <code>/src/blogs.json</code> 配置文章标题</li>
    </ol>
    <h2 id="4.%E5%8F%91%E5%B8%83%E5%88%B0-github-pages" tabindex="-1">
      4.发布到 GitHub Pages
    </h2>
    <ol>
      <li>
        <p><strong>本地构建预览</strong>：</p>
        <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(10)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">bun run build  <span class="hljs-comment"># 生成静态文件</span></div><div class="line">bun run preview  <span class="hljs-comment"># 本地预览生产环境效果</span></div></details></code></pre>
      </li>
      <li>
        <p><strong>部署到 GitHub</strong>：</p>
        <pre><code class="hljs" style="font-family: yiktllw-code, serif;"><div class="copy-button" @click="copyCode(12)"><img class="copy-img g-icon" :src="copy_svg"/></div><details class="code-details" open="true"><summary>bash</summary><div class="line">git add .</div><div class="line">git commit -m <span class="hljs-string">&quot;更新博客内容&quot;</span></div><div class="line">git push origin main</div></details></code></pre>
      </li>
      <li>
        <p>自动部署流程：</p>
        <ul>
          <li>GitHub Actions 会自动触发部署</li>
          <li>
            部署完成后访问 <code>https://你的用户名.github.io/仓库名</code>
          </li>
        </ul>
      </li>
    </ol>
    <h2 id="%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9" tabindex="-1">注意事项</h2>
    <ol>
      <li>保持文件监听服务 (<code>bun watch</code>) 持续运行</li>
      <li>确保 GitHub 仓库已启用 Pages 服务（Settings → Pages）</li>
    </ol>
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
utteranc.setAttribute("issue-term", "about");
utteranc.setAttribute("label", "💬comment");
utteranc.setAttribute("theme", `github-${window.theme ?? "dark"}`);
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

const currentBlog = blogs.find(
  (item) => item.component === "@/blogs/about.vue",
);
document.title = currentBlog?.blogInfo.title ?? "yiktllw的博客";

const codeToCopy = [
  "git clone https://github.com/你的用户名/仓库名.git",
  "git clone https://github.com/你的用户名/仓库名.git",
  "bun add -g vite",
  "bun add -g vite",
  "bun install",
  "bun install",
  "bun watch",
  "bun watch",
  "bun dev",
  "bun dev",
  "bun run build  # 生成静态文件\nbun run preview  # 本地预览生产环境效果",
  "bun run build  # 生成静态文件\nbun run preview  # 本地预览生产环境效果",
  'git add .\ngit commit -m "更新博客内容"\ngit push origin main',
  'git add .\ngit commit -m "更新博客内容"\ngit push origin main',
];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};
</script>
