<template>
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
      网易云音乐的歌词api返回的歌词类型有两种：逐行歌词（lrc）和逐字歌词（yrc）。
    </p>
    <h2 id="%E7%9B%AE%E6%A0%87" tabindex="-1">目标</h2>
    <p>需要实现的歌词动画包括：</p>
    <ol>
      <li>滚动动画：平滑滚动到当前行</li>
      <li>缩放动画：当前行的缩放从1.0缓变为1.3，上一行反向变化</li>
      <li>逐字歌词动画：从左到右的剪切效果</li>
    </ol>
    <p>逐行歌词可视为逐字歌词的特例：即动画长度为0的逐字歌词。</p>
    <h2
      id="%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8Ecss%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0"
      tabindex="-1"
    >
      初代方案：基于CSS动画的实现
    </h2>
    <p>
      初版应用于XCMusic
      <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.4">0.2.4</a
      >及之前版本。
    </p>
    <p>主要原理是：</p>
    <ol>
      <li>用<code>requestAnimationFrame</code>计算滚动动画位置</li>
      <li>CSS动画处理缩放效果；</li>
      <li><code>clip-path</code>实现逐字动画，动画时长对应歌词时间</li>
    </ol>
    <pre><code :data-open="codeOpen[0]" class="hljs language-vue" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 15">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(0)" class="language">vue</div><div class="copy-button" @click="copyCode(0)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code"><span class="language-xml"><span class="hljs-comment">&lt;!-- 逐字歌词动画 --&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">span</span>
  <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;item-white font-color-main&quot;</span>
  <span class="hljs-attr">:style</span>=<span class="hljs-string">&quot;{
    transition: `clip-path ${(word.duration ?? 0) + (word.startTime ?? line.startTime) &gt; currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease`,
    clipPath:
      word.startTime &lt;= currentTime ? &#x27;inset(0 0% 0 0)&#x27; : &#x27;inset(0 100% 0 0)&#x27;,
    color:
      index === currentLine
        ? &#x27;var(--font-color-main)&#x27;
        : &#x27;var(--font-color-standard)&#x27;,
  }&quot;</span>
&gt;</span>
  &lbrace;&lbrace; word.text &rbrace;&rbrace;
<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
</span></div></code></pre>
    <h2
      id="%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8canvas%E5%AE%9E%E7%8E%B0"
      tabindex="-1"
    >
      二代方案：使用Canvas实现
    </h2>
    <p>
      应用于XCMusic
      <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.5">0.2.5</a
      >至<a href="https://github.com/yiktllw/XCMusic/releases/tag/0.3.0"
        >0.3.0</a
      >版本。
    </p>
    <p>在第一版歌词中，我发现其存在诸多不便利性：</p>
    <ol>
      <li>CSS动画无法暂停</li>
      <li>过多的dom元素导致的内存占用问题</li>
      <li>CSS动画的自由性太低</li>
    </ol>
    <p>恰好Canvas能够完美解决上述问题。</p>
    <p>使用Canvas完成歌词的逻辑：</p>
    <ol>
      <li>获取当前系统缩放和应用缩放并适配，防止Canvas模糊</li>
      <li>根据解析后的歌词，计算每一行歌词的位置。</li>
      <li>
        使用requestAnimationFrame在每一帧完成：
        <ul>
          <li>获取当前音频的播放进度</li>
          <li>计算当前滚动高度，实现滚动动画</li>
          <li>根据滚动高度与当前行高度的差值，计算缩放动画和字体颜色</li>
          <li>
            计算当前逐字动画位置，并计算<code>cutX</code>的位置。<br />
            与第一版歌词类似，在<code>scrollY</code>处画两份歌词：一份为白色，仅显示<code>cutX</code>左侧的部分；另一份为灰色，仅显示<code>cutX</code>右侧的部分。
          </li>
        </ul>
      </li>
      <li>监听用户鼠标滚轮，并执行对应的滚动动画。</li>
    </ol>
    <p>纯js实现带来的自由度是极高的--这一版动画的效果也是最好的。</p>
    <p><strong>已知的问题</strong>：</p>
    <ol>
      <li>
        在使用歌词时，electron的GPU进程占用的内存会逐步上涨，大约在一整天内从10MB以内上涨到100MB左右。而electron没有提供api来清除GPU进程的内存占用。<s
          >可以通过禁用GPU加速来解决此问题</s
        >
      </li>
      <li>
        放弃使用DOM的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题
      </li>
      <li>
        由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度。<s
          >过几天自己都不知道写了个啥</s
        >
      </li>
    </ol>
    <h2
      id="%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8Eweb-animations-api%E5%92%8Ccss%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB"
      tabindex="-1"
    >
      最终版本：基于Web Animations API和CSS歌词动画
    </h2>
    <p>最终版歌词动画，在XCMusic 0.3.1（未发布）及之后的版本中使用。</p>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import copy_svg from "@/assets/svg/copy.svg";
import blogs from "@/blogs.json";
import { formatTime_yyyy_mm_dd_hh_mm } from "@/utils/time";

const blog = ref<HTMLElement>();

const utteranc = document.createElement("script");
utteranc.src = "https://utteranc.es/client.js";
utteranc.setAttribute("repo", import.meta.env.VITE_COMMENT_REPO);
utteranc.setAttribute("issue-term", "2025/04/xcmusic01");
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
  (item) => item.component === "@/blogs/2025/04/xcmusic01.vue",
);
document.title = currentBlog?.blogInfo.title ?? "yiktllw的博客";

const codeToCopy = [
  "<!-- 逐字歌词动画 -->\n<span\n  class=\"item-white font-color-main\"\n  :style=\"{\n    transition: `clip-path ${(word.duration ?? 0) + (word.startTime ?? line.startTime) > currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease`,\n    clipPath:\n      word.startTime <= currentTime ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',\n    color:\n      index === currentLine\n        ? 'var(--font-color-main)'\n        : 'var(--font-color-standard)',\n  }\"\n>\n  {{ word.text }}\n</span>\n",
];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};

const codeOpen = ref<boolean[]>([true]);
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
};
</script>
