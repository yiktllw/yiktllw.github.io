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
      id="%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8canvas%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D"
      tabindex="-1"
    >
      二代方案：使用Canvas绘制歌词
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
    <h2
      id="%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8Eweb-animations-api%E5%92%8Ccss%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB"
      tabindex="-1"
    >
      最终版本：基于Web Animations API和CSS的歌词动画
    </h2>
    <p>最终版歌词动画，在XCMusic 0.3.1（未发布）及之后的版本中使用。</p>
    <p>在版本迭代中,我发现使用Canvas绘制歌词存在以下问题：</p>
    <ol>
      <li>
        在使用歌词时，electron的GPU进程占用的内存会逐步上涨，大约在一整天内从10MB以内上涨到100MB左右。而electron没有提供api来清除GPU进程的内存占用
      </li>
      <li>
        放弃使用DOM的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题
      </li>
      <li>
        由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度
      </li>
      <li>画布大小不灵活,无法动态适应布局改变</li>
    </ol>
    <p>
      Web Animations Api可以在js中操控CSS动画,
      解决了初代方案中动画灵活性的问题。
    </p>
    <p>
      至于内存占用问题, 在加载100句歌词<sup class="footnote-ref"
        ><a href="#fn1" id="fnref1">[1]</a></sup
      >
      (带翻译)后,
      渲染进程内存占用仅增加了5MB。并且这部分内存是能够稳定得到释放的。
    </p>
    <p>使用Web Animations Api完成歌词动画的基本过程为：</p>
    <ol>
      <li>
        在获取逐字歌词后,
        调用<code>computeLyricsElements()</code>函数：这个函数会完成：
        <ul>
          <li>生成歌词对应的dom元素, 并保存dom元素的引用</li>
          <li>为行元素添加行动画(缩放动画)</li>
          <li>为词元素添加从左到右的剪切动画</li>
          <li>暂停所有动画, 并保存动画的引用</li>
        </ul>
      </li>
      <li>同时, 从逐字歌词生成时间线</li>
      <li>
        使用<code>requestAnimationFrame()</code>函数, 在每一帧监听播放进度,
        并通过时间线计算是否有需要播放的动画
      </li>
      <li>需要播放动画时, 调用<code>animate.play()</code>来播放动画。</li>
    </ol>
    <pre><code :data-open="codeOpen[1]" class="hljs language-typescript" style="font-family: yiktllw-code, serif; position: relative;"><div class="line-numbers"><span v-for="i in 64">{{ i }}</span></div><div class="top-line"><div @click="toggleCodeOpen(1)" class="language">typescript</div><div class="copy-button" @click="copyCode(1)"><img class="copy-img" :src="copy_svg"/></div></div><div class="code"><span class="hljs-comment">/** 计算歌词dom和动画 */</span>
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
              >贝多芬第九交响曲。富特文格勒 / 1951年拜罗伊特音乐节,
              网易云音乐id:22256832</a
            >
            <a href="#fnref1" class="footnote-backref">↩︎</a>
          </p>
        </li>
      </ol>
    </section>
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
  '/** 计算歌词dom和动画 */\nconst computeLyricsElements = () => {\n  // 清空原有的元素和动画\n  // 省略清理代码\n\n  // 生成新的元素，并计算动画\n  animations.value = lyrics.value.flatMap((line, lineIndex) => {\n    const lineKeyframes = [\n      { transform: "scale(1)", opacity: 0 },\n      { transform: "scale(1.3)", opacity: 1 },\n    ];\n    const _lineKeyframes = [\n      { transform: "scale(1)" },\n      { transform: "scale(1.3)" },\n    ];\n    const lineOptions: KeyframeAnimationOptions = {\n      duration: 200,\n      easing: "ease-out",\n      fill: "forwards",\n    };\n\n    // 生成行元素\n    const lineElement = document.createElement("div");\n    lineElement.className = "lyrics-new-line";\n    lineElement.style.transformOrigin = "left center";\n    container.value?.appendChild(lineElement);\n    lineElements.value.push(lineElement);\n\n    // 生成行动画\n    const lineAnimation = lineElement.animate(lineKeyframes, lineOptions);\n    lineAnimation.pause();\n    lineAnimations.value.push(lineAnimation);\n\n    // 生成背景行元素\n    // 生成背景行动画\n    // 生成翻译行元素\n    // 省略部分代码\n\n    // 返回逐字动画\n    return line.words.map((word) => {\n      // 生成逐字元素\n      const wordElement = document.createElement("span");\n      wordElement.innerText = word.text;\n      lineElement.appendChild(wordElement);\n\n      // 生成逐字背景元素\n      // 省略部分代码\n\n      // 生成逐字动画\n      const animateKeyframes = [\n        { clipPath: "inset(0 100% 0 0)" },\n        { clipPath: "inset(0 0 0 0)" },\n      ];\n      const animate = wordElement.animate(animateKeyframes, {\n        duration: word.duration.ms || 1,\n        easing: "linear",\n        fill: "backwards",\n      });\n      animate.pause();\n\n      return animate;\n    });\n  });\n};\n',
];
const copyCode = (index: number) => {
  const code = codeToCopy[index];
  navigator.clipboard.writeText(code);
};

const codeOpen = ref<boolean[]>([true, true]);
const toggleCodeOpen = (index: number) => {
  codeOpen.value[index] = !codeOpen.value[index];
};
</script>
