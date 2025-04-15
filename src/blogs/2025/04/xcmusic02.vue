<template>
  <div class="blog-container" ref="container">
    <div class="blog" ref="blog">
      <div class="blog-info">
        <h1 class="blog-title">
          {{ currentBlog?.blogInfo.title ?? "Untitled" }}
        </h1>
      </div>
      <h2
        id="electron-%E7%9A%84%E6%89%93%E5%8C%85%E6%96%B9%E5%BC%8F"
        tabindex="-1"
      >
        Electron 的打包方式
      </h2>
      <p>
        Electron 采用 Chromium 前端 + NodeJS 后端 + 系统 API 的架构模式<sup
          class="footnote-ref"
          ><a href="#fn1" id="fnref1">[1]</a></sup
        >。软件打包后，Chromium 和 NodeJS 构成了存储空间的主要部分。
      </p>
      <p>
        以 XCMusic 的 Windows 安装包为例：Electron 10+ 打包体积约 60MB，升级至
        Electron 35 后增至 80MB，而我实际编写的应用代码和资源（app.asar）仅占
        15MB。
      </p>
      <p>
        这种打包机制存在显著弊端：每个 Electron 应用都需内置完整的 Chromium
        运行时，导致用户设备可能同时存在数十个重复的 Chromium 实例。
      </p>
      <p>
        <s>喜报：爷的电脑上有 xx 个 Chromium.jpg</s
        ><sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup>
      </p>
      <h2
        id="%E5%85%BC%E5%AE%B9%E6%80%A7-or-%E7%A1%AC%E7%9B%98%E7%A9%BA%E9%97%B4"
        tabindex="-1"
      >
        兼容性 OR 硬盘空间
      </h2>
      <p>
        Tauri 的安装包不包含 Webview 组件，直接调用系统原生 Webview 进行渲染：
      </p>
      <blockquote>
        <p>
          <strong>Minimal Size</strong
          ><sup class="footnote-ref"><a href="#fn3" id="fnref3">[3]</a></sup>
        </p>
        <p>
          By using the OS's native web renderer，the size of a Tauri app can be
          little as 600KB.
        </p>
      </blockquote>
      <p>
        这种设计使得 Tauri 打包后的体积是极小的——我认为这正是 Tauri
        的核心竞争力所在。
      </p>
      <p>
        但是，这种设计也意味着需要开发者适配不同操作系统的 Webview
        特性差异。对于个人开发者而言，跨平台调试所需的时间成本是不得不考虑的问题。
      </p>
      <p>
        如同 VSCode 以性能换取生态优势，Electron 与 Tauri
        的取舍本质上是兼容性与资源占用的权衡。
      </p>
      <h2
        id="%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8...%E5%90%97%3F"
        tabindex="-1"
      >
        内存安全...吗?
      </h2>
      <p>Tauri 在官网上强调：</p>
      <blockquote>
        <p>
          <strong>Maximum Security</strong>
          <sup class="footnote-ref"><a href="#fn3" id="fnref3:1">[3:1]</a></sup>
        </p>
        <p>
          Front-of-mind for the Tauri Team that drives our highest priorities
          and biggest innovations.
        </p>
      </blockquote>
      <blockquote>
        <p>
          <strong>Powered by Rust</strong>
          <sup class="footnote-ref"><a href="#fn3" id="fnref3:2">[3:2]</a></sup>
        </p>
        <p>
          With performance and security at the center, Rust is the language for
          the next generation of apps.
        </p>
      </blockquote>
      <p>
        作为内存安全的系统级语言，Rust 确实为后端代码提供了安全保障。<strong
          ><em>但是</em></strong
        >，正如 Tauri 在其官网上宣传的那样：
      </p>
      <blockquote>
        <p>
          <strong>Frontend Independent</strong>
          <sup class="footnote-ref"><a href="#fn3" id="fnref3:3">[3:3]</a></sup>
        </p>
        <p>
          Bring your existing web stack to Tauri or start that new dream
          project. Tauri supports any frontend framework so you don’t need to
          change your stack.
        </p>
      </blockquote>
      <p>
        Tauri 只在后端使用了 Rust，你可以使用任何语言编写前端：使用 Rust 的
        Dioxus、Yew；使用 JS 的 Vue, React 等。
      </p>
      <p>
        在 XCMusic 中，Electron 后端代码仅 1200 行，而基于 Vue 的前端代码高达
        2.6w 行。这意味着即使迁移至 Tauri，仅有 4% 的代码能享受 Rust
        的内存安全优势。
      </p>
      <p>
        在 XCMusic 中：Tauri 主进程内存占用控制在 10MB 以内，但 Windows Webview
        进程内存消耗约 300MB——与 Electron 渲染进程的占用水平基本持平。
      </p>
      <p>
        由此可见，为获得有限的安全提升而抛弃 Electron
        的兼容性和生态优势，其性价比值得商榷。
      </p>
      <h2 id="%E7%BB%93%E8%AE%BA" tabindex="-1">结论</h2>
      <p>
        对于全新开发的 Windows 桌面应用，采用 Tauri 配合 Rust 前端框架（如
        Dioxus/Yew）是值得考虑的方案。
      </p>
      <p>
        然而就 XCMusic 而言，作为跨平台 Vue 应用，迁移至 Tauri
        难以获得显著的安全增益，是费力不讨好的。
      </p>
      <hr class="footnotes-sep" />
      <section class="footnotes">
        <ol class="footnotes-list">
          <li id="fn1" class="footnote-item">
            <p>
              <a href="https://www.electronjs.org/zh/docs/latest/"
                >简介：Electron</a
              >
              <a href="#fnref1" class="footnote-backref">↩︎</a>
            </p>
          </li>
          <li id="fn2" class="footnote-item">
            <p>
              <a href="https://github.com/xh321/CefDetector.Net"
                >GitHub：检测电脑中有多少个 Chromium 内核的程序</a
              >
              <a href="#fnref2" class="footnote-backref">↩︎</a>
            </p>
          </li>
          <li id="fn3" class="footnote-item">
            <p>
              <a href="https://v2.tauri.app/">Tauri 2.0 官方网站</a>
              <a href="#fnref3" class="footnote-backref">↩︎</a>
              <a href="#fnref3:1" class="footnote-backref">↩︎</a>
              <a href="#fnref3:2" class="footnote-backref">↩︎</a>
              <a href="#fnref3:3" class="footnote-backref">↩︎</a>
            </p>
          </li>
        </ol>
      </section>
    </div>
    <div class="sidebar-placeholder">
      <div class="sidebar-container">
        <div class="nav">
          <div
            class="nav-item selected"
            id="nav_article"
            @click="nav_to('article')"
          >
            文章信息
          </div>
          <div class="nav-item" id="nav_site" @click="nav_to('site')">
            站点概览
          </div>
        </div>
        <div class="nav-content">
          <div class="article toc active" id="article">
            <div class="toc-title">目录</div>
            <div class="progress-bar" />
            <ul class="depth-0">
              <li>
                <a
                  href="#electron-%E7%9A%84%E6%89%93%E5%8C%85%E6%96%B9%E5%BC%8F"
                  :class="0 === current_heading ? 'active' : 'not-active'"
                  >1&nbsp;Electron 的打包方式</a
                >
              </li>
              <li>
                <a
                  href="#%E5%85%BC%E5%AE%B9%E6%80%A7-or-%E7%A1%AC%E7%9B%98%E7%A9%BA%E9%97%B4"
                  :class="1 === current_heading ? 'active' : 'not-active'"
                  >2&nbsp;兼容性 OR 硬盘空间</a
                >
              </li>
              <li>
                <a
                  href="#%E5%86%85%E5%AD%98%E5%AE%89%E5%85%A8...%E5%90%97%3F"
                  :class="2 === current_heading ? 'active' : 'not-active'"
                  >3&nbsp;内存安全...吗?</a
                >
              </li>
              <li>
                <a
                  href="#%E7%BB%93%E8%AE%BA"
                  :class="3 === current_heading ? 'active' : 'not-active'"
                  >4&nbsp;结论</a
                >
              </li>
            </ul>
            <div class="info">
              <span class="create-time">
                <span class="ele-title">创建于：</span
                >{{
                  formatTime_yyyy_mm_dd_hh_mm(
                    currentBlog?.blogInfo.createTime ?? 0,
                  )
                }}
              </span>
              <span class="last-update">
                <span class="ele-title">修改于：</span
                >{{
                  formatTime_yyyy_mm_dd_hh_mm(
                    currentBlog?.blogInfo.lastUpdate ?? 0,
                  )
                }}
              </span>
              <span class="word-count">
                <span class="ele-title">本文字数：</span
                >{{ currentBlog?.blogInfo.wordCount }}字
              </span>
              <span class="reading-time">
                <span class="ele-title">预计阅读时间：</span
                >{{ currentBlog?.blogInfo.readingTime }}分钟
              </span>
              <span
                class="category"
                v-if="currentBlog?.blogInfo.category !== 'default'"
              >
                <span class="ele-title">分类于：</span
                >{{ currentBlog?.blogInfo.category }}
              </span>
              <span class="series" v-if="currentBlog?.blogInfo.series.enable">
                <span class="ele-title">系列：</span
                >{{ currentBlog?.blogInfo.series.name }}
              </span>
              <span class="copy-right">
                <span class="ele-title">许可协议：</span>
                <p xmlns:cc="http://creativecommons.org/ns#">
                  <a
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                    target="_blank"
                    rel="license noopener noreferrer"
                    style="display: inline-block"
                    >CC BY-NC-SA 4.0</a
                  >
                </p>
              </span>
              <span
                class="tags"
                v-if="currentBlog && currentBlog.blogInfo.tags.length > 0"
              >
                <span class="ele-title">标签：</span>
                <span
                  v-for="tag in currentBlog?.blogInfo.tags"
                  class="tag"
                  :key="tag"
                  >{{ tag }}</span
                >
              </span>
            </div>
          </div>
          <div class="site" id="site">标签2的内容</div>
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
};
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
  const content_to_be_hidden = document.getElementById(
    id === "article" ? "site" : "article",
  );

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
  const unselected = document.getElementById(
    "nav_" + (id === "article" ? "site" : "article"),
  );

  if (selected) selected.classList.add("selected");
  if (unselected) unselected.classList.remove("selected");
};

const utteranc = document.createElement("script");
utteranc.src = "https://utteranc.es/client.js";
utteranc.setAttribute("repo", import.meta.env.VITE_COMMENT_REPO);
utteranc.setAttribute("issue-term", "2025/04/xcmusic02");
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
  (item) => item.component === "@/blogs/2025/04/xcmusic02.vue",
);
document.title = currentBlog?.blogInfo.title ?? "yiktllw的博客";

// @ts-ignore
const codeToCopy = [];
// @ts-ignore
const copyCode = (index: number) => {
  // @ts-ignore
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};

const codeOpen = ref<boolean[]>([]);
// @ts-ignore
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
};
</script>
