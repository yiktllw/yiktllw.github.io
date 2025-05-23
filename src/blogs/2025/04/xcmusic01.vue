<template>
  <div class="blog-container" ref="container">
    <div class="blog" ref="blog">
      <div class="blog-info">
        <h1 class="blog-title">
          {{ currentBlog?.blogInfo.title ?? "Untitled" }}
        </h1>
      </div>
      <p>
        网易云音乐的歌词 api
        返回的歌词类型有两种：逐行歌词（lrc）和逐字歌词（yrc）。
      </p>
      <h2 id="%E7%9B%AE%E6%A0%87" tabindex="-1">目标</h2>
      <p>需要实现的歌词动画包括：</p>
      <ol>
        <li>滚动动画：平滑滚动到当前行</li>
        <li>缩放动画：当前行的缩放从 1.0 缓变为 1.3，上一行反向变化</li>
        <li>逐字歌词动画：从左到右的剪切效果</li>
      </ol>
      <p>逐行歌词可视为逐字歌词的特例：即动画长度为 0 的逐字歌词。</p>
      <h2
        id="%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0"
        tabindex="-1"
      >
        初代方案：基于 CSS 动画的实现
      </h2>
      <p>
        初版应用于 XCMusic
        <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.4"
          >0.2.4</a
        >
        及之前版本。
      </p>
      <p>主要原理是：</p>
      <ol>
        <li>用 <code>requestAnimationFrame</code> 计算滚动动画位置</li>
        <li>CSS 动画处理缩放效果；</li>
        <li><code>clip-path</code> 实现逐字动画，动画时长对应歌词时间</li>
      </ol>
      <pre><code :data-open="codeOpen[0]" class="hljs language-vue" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 15">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(0)" class="language">&lt;VUE&gt;</div><div class="copy-button" @click="copyCode(0)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code"><span class="language-xml"><span class="hljs-comment">&lt;!-- 逐字歌词动画 --&gt;</span>
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
        id="%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D"
        tabindex="-1"
      >
        二代方案：使用 Canvas 绘制歌词
      </h2>
      <p>
        应用于 XCMusic
        <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.5"
          >0.2.5</a
        >
        至
        <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.3.0"
          >0.3.0</a
        >
        版本。
      </p>
      <p>在第一版歌词中，我发现其存在诸多不便利性：</p>
      <ol>
        <li>CSS 动画无法暂停</li>
        <li>过多的 dom 元素导致的内存占用问题</li>
        <li>CSS 动画的自由性太低</li>
      </ol>
      <p>恰好 Canvas 能够完美解决上述问题。</p>
      <p>使用 Canvas 完成歌词的逻辑：</p>
      <ol>
        <li>获取当前系统缩放和应用缩放并适配，防止 Canvas 模糊。</li>
        <li>根据解析后的歌词，计算每一行歌词的位置。</li>
        <li>
          使用 <code>requestAnimationFrame</code> 在每一帧完成：
          <ul>
            <li>获取当前音频的播放进度</li>
            <li>计算当前滚动高度，实现滚动动画</li>
            <li>根据滚动高度与当前行高度的差值，计算缩放动画和字体颜色</li>
            <li>
              计算当前逐字动画位置，并计算 <code>cutX</code> 的位置。<br />
              与第一版歌词类似，在
              <code>scrollY</code> 处画两份歌词：一份为白色，仅显示
              <code>cutX</code> 左侧的部分；另一份为灰色，仅显示
              <code>cutX</code> 右侧的部分。
            </li>
          </ul>
        </li>
        <li>监听用户鼠标滚轮，并执行对应的滚动动画。</li>
      </ol>
      <p>
        纯 JavaScript 实现带来的自由度是极高的--这一版动画的效果也是最好的。
      </p>
      <h2
        id="%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB"
        tabindex="-1"
      >
        最终版本：基于 Web Animations API 和 CSS 的歌词动画
      </h2>
      <p>最终版歌词动画，在 XCMusic 0.3.1（未发布）及之后的版本中使用。</p>
      <p>在版本迭代中,我发现使用 Canvas 绘制歌词存在以下问题：</p>
      <ol>
        <li>
          在使用歌词时，electron 的 GPU
          进程占用的内存会逐步上涨，大约在一整天内从 10MB 以内上涨到 100MB
          左右。而 electron 没有提供 api 来清除 GPU 进程的内存占用
        </li>
        <li>
          放弃使用 DOM
          的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题
        </li>
        <li>
          由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度
        </li>
        <li>画布大小不灵活,无法动态适应布局改变</li>
      </ol>
      <p>
        Web Animations Api 可以在 JavaScript 中操控 CSS
        动画，解决了初代方案中动画灵活性的问题。
      </p>
      <p>
        至于内存占用问题，在加载 100 句歌词
        <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
        (带翻译)后，渲染进程内存占用仅增加了
        5MB。并且这部分内存是能够稳定得到释放的。
      </p>
      <p>使用 Web Animations Api 完成歌词动画的基本过程为：</p>
      <ol>
        <li>
          在获取逐字歌词后，调用
          <code>computeLyricsElements()</code> 函数：这个函数会完成：
          <ul>
            <li>生成歌词对应的 dom 元素，并保存 dom 元素的引用</li>
            <li>为行元素添加行动画(缩放动画)</li>
            <li>为词元素添加从左到右的剪切动画</li>
            <li>暂停所有动画，并保存动画的引用</li>
          </ul>
        </li>
        <li>同时，从逐字歌词生成时间线</li>
        <li>
          使用
          <code>requestAnimationFrame()</code>
          函数，在每一帧监听播放进度，并通过时间线计算是否有需要播放的动画
        </li>
        <li>需要播放动画时，调用 <code>animate.play()</code> 来播放动画。</li>
      </ol>
      <pre><code :data-open="codeOpen[1]" class="hljs language-typescript" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 64">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(1)" class="language">&lt;TYPESCRIPT&gt;</div><div class="copy-button" @click="copyCode(1)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code"><span class="hljs-comment">/** 计算歌词dom和动画 */</span>
<span class="hljs-keyword">const</span> <span class="hljs-title function_">computeLyricsElements</span> = (<span class="hljs-params"></span>) =&gt; {
  <span class="hljs-comment">// 清空原有的元素和动画</span>
  <span class="hljs-comment">// 省略清理代码</span>

  <span class="hljs-comment">// 生成新的元素，并计算动画</span>
  animations.<span class="hljs-property">value</span> = lyrics.<span class="hljs-property">value</span>.<span class="hljs-title function_">flatMap</span>(<span class="hljs-function">(<span class="hljs-params">line, lineIndex</span>) =&gt;</span> {
    <span class="hljs-keyword">const</span> lineKeyframes = [
      { <span class="hljs-attr">transform</span>: <span class="hljs-string">&quot;scale(1)&quot;</span>, <span class="hljs-attr">opacity</span>: <span class="hljs-number">0</span> },
      { <span class="hljs-attr">transform</span>: <span class="hljs-string">&quot;scale(1.3)&quot;</span>, <span class="hljs-attr">opacity</span>: <span class="hljs-number">1</span> },
    ];
    <span class="hljs-keyword">const</span> _lineKeyframes = [
      { <span class="hljs-attr">transform</span>: <span class="hljs-string">&quot;scale(1)&quot;</span> },
      { <span class="hljs-attr">transform</span>: <span class="hljs-string">&quot;scale(1.3)&quot;</span> },
    ];
    <span class="hljs-keyword">const</span> <span class="hljs-attr">lineOptions</span>: <span class="hljs-title class_">KeyframeAnimationOptions</span> = {
      <span class="hljs-attr">duration</span>: <span class="hljs-number">200</span>,
      <span class="hljs-attr">easing</span>: <span class="hljs-string">&quot;ease-out&quot;</span>,
      <span class="hljs-attr">fill</span>: <span class="hljs-string">&quot;forwards&quot;</span>,
    };

    <span class="hljs-comment">// 生成行元素</span>
    <span class="hljs-keyword">const</span> lineElement = <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">createElement</span>(<span class="hljs-string">&quot;div&quot;</span>);
    lineElement.<span class="hljs-property">className</span> = <span class="hljs-string">&quot;lyrics-new-line&quot;</span>;
    lineElement.<span class="hljs-property">style</span>.<span class="hljs-property">transformOrigin</span> = <span class="hljs-string">&quot;left center&quot;</span>;
    container.<span class="hljs-property">value</span>?.<span class="hljs-title function_">appendChild</span>(lineElement);
    lineElements.<span class="hljs-property">value</span>.<span class="hljs-title function_">push</span>(lineElement);

    <span class="hljs-comment">// 生成行动画</span>
    <span class="hljs-keyword">const</span> lineAnimation = lineElement.<span class="hljs-title function_">animate</span>(lineKeyframes, lineOptions);
    lineAnimation.<span class="hljs-title function_">pause</span>();
    lineAnimations.<span class="hljs-property">value</span>.<span class="hljs-title function_">push</span>(lineAnimation);

    <span class="hljs-comment">// 生成背景行元素</span>
    <span class="hljs-comment">// 生成背景行动画</span>
    <span class="hljs-comment">// 生成翻译行元素</span>
    <span class="hljs-comment">// 省略部分代码</span>

    <span class="hljs-comment">// 返回逐字动画</span>
    <span class="hljs-keyword">return</span> line.<span class="hljs-property">words</span>.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">word</span>) =&gt;</span> {
      <span class="hljs-comment">// 生成逐字元素</span>
      <span class="hljs-keyword">const</span> wordElement = <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">createElement</span>(<span class="hljs-string">&quot;span&quot;</span>);
      wordElement.<span class="hljs-property">innerText</span> = word.<span class="hljs-property">text</span>;
      lineElement.<span class="hljs-title function_">appendChild</span>(wordElement);

      <span class="hljs-comment">// 生成逐字背景元素</span>
      <span class="hljs-comment">// 省略部分代码</span>

      <span class="hljs-comment">// 生成逐字动画</span>
      <span class="hljs-keyword">const</span> animateKeyframes = [
        { <span class="hljs-attr">clipPath</span>: <span class="hljs-string">&quot;inset(0 100% 0 0)&quot;</span> },
        { <span class="hljs-attr">clipPath</span>: <span class="hljs-string">&quot;inset(0 0 0 0)&quot;</span> },
      ];
      <span class="hljs-keyword">const</span> animate = wordElement.<span class="hljs-title function_">animate</span>(animateKeyframes, {
        <span class="hljs-attr">duration</span>: word.<span class="hljs-property">duration</span>.<span class="hljs-property">ms</span> || <span class="hljs-number">1</span>,
        <span class="hljs-attr">easing</span>: <span class="hljs-string">&quot;linear&quot;</span>,
        <span class="hljs-attr">fill</span>: <span class="hljs-string">&quot;backwards&quot;</span>,
      });
      animate.<span class="hljs-title function_">pause</span>();

      <span class="hljs-keyword">return</span> animate;
    });
  });
};
</div></code></pre>
      <hr class="footnotes-sep" />
      <section class="footnotes">
        <ol class="footnotes-list">
          <li id="fn1" class="footnote-item">
            <p>
              <a href="https://music.163.com/song?id=22256832"
                >贝多芬第九交响曲。富特文格勒 / 1951
                年拜罗伊特音乐节，网易云音乐 id: 22256832</a
              >
              <a href="#fnref1" class="footnote-backref">↩︎</a>
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
                  href="#%E7%9B%AE%E6%A0%87"
                  :class="0 === current_heading ? 'active' : 'not-active'"
                  >1&nbsp;目标</a
                >
              </li>
              <li>
                <a
                  href="#%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0"
                  :class="1 === current_heading ? 'active' : 'not-active'"
                  >2&nbsp;初代方案：基于 CSS 动画的实现</a
                >
              </li>
              <li>
                <a
                  href="#%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D"
                  :class="2 === current_heading ? 'active' : 'not-active'"
                  >3&nbsp;二代方案：使用 Canvas 绘制歌词</a
                >
              </li>
              <li>
                <a
                  href="#%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB"
                  :class="3 === current_heading ? 'active' : 'not-active'"
                  >4&nbsp;最终版本：基于 Web Animations API 和 CSS 的歌词动画</a
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

// @ts-ignore
const codeToCopy = [
  "<!-- 逐字歌词动画 -->\n<span\n  class=\"item-white font-color-main\"\n  :style=\"{\n    transition: `clip-path ${(word.duration ?? 0) + (word.startTime ?? line.startTime) > currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease`,\n    clipPath:\n      word.startTime <= currentTime ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',\n    color:\n      index === currentLine\n        ? 'var(--font-color-main)'\n        : 'var(--font-color-standard)',\n  }\"\n>\n  {{ word.text }}\n</span>\n",
  '/** 计算歌词dom和动画 */\nconst computeLyricsElements = () => {\n  // 清空原有的元素和动画\n  // 省略清理代码\n\n  // 生成新的元素，并计算动画\n  animations.value = lyrics.value.flatMap((line, lineIndex) => {\n    const lineKeyframes = [\n      { transform: "scale(1)", opacity: 0 },\n      { transform: "scale(1.3)", opacity: 1 },\n    ];\n    const _lineKeyframes = [\n      { transform: "scale(1)" },\n      { transform: "scale(1.3)" },\n    ];\n    const lineOptions: KeyframeAnimationOptions = {\n      duration: 200,\n      easing: "ease-out",\n      fill: "forwards",\n    };\n\n    // 生成行元素\n    const lineElement = document.createElement("div");\n    lineElement.className = "lyrics-new-line";\n    lineElement.style.transformOrigin = "left center";\n    container.value?.appendChild(lineElement);\n    lineElements.value.push(lineElement);\n\n    // 生成行动画\n    const lineAnimation = lineElement.animate(lineKeyframes, lineOptions);\n    lineAnimation.pause();\n    lineAnimations.value.push(lineAnimation);\n\n    // 生成背景行元素\n    // 生成背景行动画\n    // 生成翻译行元素\n    // 省略部分代码\n\n    // 返回逐字动画\n    return line.words.map((word) => {\n      // 生成逐字元素\n      const wordElement = document.createElement("span");\n      wordElement.innerText = word.text;\n      lineElement.appendChild(wordElement);\n\n      // 生成逐字背景元素\n      // 省略部分代码\n\n      // 生成逐字动画\n      const animateKeyframes = [\n        { clipPath: "inset(0 100% 0 0)" },\n        { clipPath: "inset(0 0 0 0)" },\n      ];\n      const animate = wordElement.animate(animateKeyframes, {\n        duration: word.duration.ms || 1,\n        easing: "linear",\n        fill: "backwards",\n      });\n      animate.pause();\n\n      return animate;\n    });\n  });\n};\n',
];
// @ts-ignore
const copyCode = (index: number) => {
  // @ts-ignore
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};

const codeOpen = ref<boolean[]>([true, true]);
// @ts-ignore
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
};
</script>
