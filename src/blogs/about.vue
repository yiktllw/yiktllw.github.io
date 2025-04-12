<template>
  <div class="blog-container" ref="container">
    <div class="blog" ref="blog">
      <div class="blog-info">
        <h1 class="blog-title">
          {{ currentBlog?.blogInfo.title ?? "Untitled" }}
        </h1>
        <div class="info">
          <span class="create-time">
            <span class="ele-title">发布于：</span
            >{{
              formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.createTime ?? 0)
            }}
          </span>
          <span class="last-update">
            <span class="ele-title">修改于：</span
            >{{
              formatTime_yyyy_mm_dd_hh_mm(currentBlog?.blogInfo.lastUpdate ?? 0)
            }}
          </span>
          <span class="reading-time">
            <span class="ele-title">阅读时长：</span
            >{{ currentBlog?.blogInfo.readingTime }}分钟
          </span>
          <span
            class="category"
            v-if="currentBlog?.blogInfo.category !== 'default'"
          >
            <span class="ele-title">分类：</span
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
        本博客通过 GitHub Actions 从
        <a href="https://github.com/yiktllw/yiktllw.github.io"
          >yiktllw.github.io</a
        >
        仓库自动构建，未采用任何现有博客框架，旨在兼顾 Markdown
        的编写便利性与开发自由度。
      </p>
      <p>技术方案如下：</p>
      <ol>
        <li>以 Vue 为基础框架</li>
        <li>
          编写 TypeScript 脚本实现：
          <ul>
            <li>
              核心脚本：将 Markdown 解析为 Vue
              组件，自动生成路由配置和文章元数据
            </li>
            <li>
              辅助脚本：实时监听 Markdown 文件变更并同步更新 Vue
              文件，支持开发热更新
            </li>
          </ul>
        </li>
        <li>通过 GitHub Actions 实现自动化部署</li>
      </ol>
      <p><strong>以下为使用本项目构建个人博客的过程。</strong></p>
      <h2 id="%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C" tabindex="-1">准备工作</h2>
      <ol>
        <li>
          <p><strong>克隆仓库</strong></p>
          <ul>
            <li>Fork 本项目到你的 GitHub 账户</li>
            <li>
              将项目源码克隆到本地：
              <pre><code :data-open="codeOpen[0]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 1">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(0)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(0)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">git <span class="hljs-built_in">clone</span> https://github.com/你的用户名/仓库名.git
</div></code></pre>
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
              <pre><code :data-open="codeOpen[1]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 1">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(1)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(1)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">bun add -g vite
</div></code></pre>
            </li>
          </ul>
        </li>
        <li>
          <p><strong>安装依赖</strong></p>
          <pre><code :data-open="codeOpen[2]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 1">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(2)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(2)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">bun install
</div></code></pre>
        </li>
      </ol>
      <h2
        id="%E5%90%AF%E5%8A%A8%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1"
        tabindex="-1"
      >
        启动开发服务
      </h2>
      <p><strong>启动文件监听和开发服务器</strong>：</p>
      <pre><code :data-open="codeOpen[3]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 1">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(3)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(3)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">bun watch
</div></code></pre>
      <p>
        在脚本自动修改路由配置时，Vite
        默认的窗口刷新会影响编辑体验，已禁用该特性。若新增了 md
        文件，请在运行服务的终端窗口中按 <kbd>r</kbd> + <kbd>Enter</kbd> 强制
        HMR 更新，即可预览新文件。
      </p>
      <p><strong>配置评论系统</strong></p>
      <p>
        安装 <a href="https://github.com/apps/utterances">utteranc</a> 到 fork
        的仓库，并修改项目根目录的 <code>.env</code> 文件中对应的信息。
      </p>
      <h2
        id="%E7%BC%96%E5%86%99%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0"
        tabindex="-1"
      >
        编写博客文章
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
      <h2 id="%E5%8F%91%E5%B8%83%E5%88%B0-github-pages" tabindex="-1">
        发布到 GitHub Pages
      </h2>
      <ol>
        <li>
          <p><strong>本地构建预览</strong>：</p>
          <pre><code :data-open="codeOpen[4]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 2">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(4)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(4)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">bun run build  <span class="hljs-comment"># 生成静态文件</span>
bun run preview  <span class="hljs-comment"># 本地预览生产环境效果</span>
</div></code></pre>
        </li>
        <li>
          <p><strong>部署到 GitHub</strong>：</p>
          <pre><code :data-open="codeOpen[5]" class="hljs language-bash" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 3">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(5)" class="language">&lt;BASH&gt;</div><div class="copy-button" @click="copyCode(5)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code">git add .
git commit -m <span class="hljs-string">&quot;更新博客内容&quot;</span>
git push origin main
</div></code></pre>
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
    <div class="sidebar-placeholder">
      <div class="sidebar">
        <div class="toc">
          <div class="toc-title">目录</div>
          <div class="progress-bar" />
          <ul class="depth-0">
            <li>
              <a
                href="#%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C"
                :class="0 === current_heading ? 'active' : 'not-active'"
                >1&nbsp;准备工作</a
              >
            </li>
            <li>
              <a
                href="#%E5%90%AF%E5%8A%A8%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1"
                :class="1 === current_heading ? 'active' : 'not-active'"
                >2&nbsp;启动开发服务</a
              >
            </li>
            <li>
              <a
                href="#%E7%BC%96%E5%86%99%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0"
                :class="2 === current_heading ? 'active' : 'not-active'"
                >3&nbsp;编写博客文章</a
              >
            </li>
            <li>
              <a
                href="#%E5%8F%91%E5%B8%83%E5%88%B0-github-pages"
                :class="3 === current_heading ? 'active' : 'not-active'"
                >4&nbsp;发布到 GitHub Pages</a
              >
            </li>
            <li>
              <a
                href="#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9"
                :class="4 === current_heading ? 'active' : 'not-active'"
                >5&nbsp;注意事项</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";
import copy_svg from "@/assets/svg/copy.svg";
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";

const blog = ref<HTMLElement>();
const heading_offset_top = ref<number[]>([]);
const current_heading = ref<number>(0);
const handleScroll = () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  let _index = 0;
  heading_offset_top.value.forEach((item, index) => {
    if (item < scrollTop + 100) {
      _index = index;
    }
  });
  if (_index !== current_heading.value) current_heading.value = _index;
};
nextTick(() => {
  const headings = document.querySelectorAll(
    ".blog h1, .blog h2, .blog h3, .blog h4, .blog h5, .blog h6",
  );
  headings.forEach((heading) => {
    heading_offset_top.value.push(heading.getBoundingClientRect().top);
  });
  heading_offset_top.value.sort((a, b) => a - b);
  document.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});

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
  "git clone https://github.com/你的用户名/仓库名.git\n",
  "bun add -g vite\n",
  "bun install\n",
  "bun watch\n",
  "bun run build  # 生成静态文件\nbun run preview  # 本地预览生产环境效果\n",
  'git add .\ngit commit -m "更新博客内容"\ngit push origin main\n',
];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};

const codeOpen = ref<boolean[]>([true, true, true, true, true, true]);
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
};
</script>
