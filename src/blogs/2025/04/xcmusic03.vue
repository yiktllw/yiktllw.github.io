<template>
  <div class="blog-container" ref="container">
    <div class="blog" ref="blog">
      <div class="blog-info">
        <h1 class="blog-title">
          {{ currentBlog?.blogInfo.title ?? "Untitled" }}
        </h1>
      </div>
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
utteranc.setAttribute("issue-term", "2025/04/xcmusic03");
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
  (item) => item.component === "@/blogs/2025/04/xcmusic03.vue",
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
