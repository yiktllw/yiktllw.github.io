import{c as x}from"./copy-BNUq0S91.js";import{d as M,r as E,n as S,o as O,b as P,c as m,a as s,e as d,t as o,u as t,f as T,g as c,h as F,F as D,i as I,j as f,k as u}from"./index-DtTbJCdN.js";import"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";const L={class:"blog-container",ref:"container"},X={class:"blog-info"},N={class:"blog-title"},$={class:"info"},U={class:"create-time"},V={class:"last-update"},W={class:"reading-time"},Y={key:0,class:"category"},z={key:1,class:"series"},G=["data-open"],J={class:"line-numbers"},R={class:"top-line"},H=["src"],Q=["data-open"],Z={class:"line-numbers"},ss={class:"top-line"},ns=["src"],as={class:"sidebar-placeholder"},ts={class:"sidebar"},es={class:"toc"},ls={class:"depth-0"},cs=M({__name:"xcmusic01",setup(is){const v=E(),j=E([]),r=E(0),y=()=>{const a=document.documentElement.scrollTop||document.body.scrollTop;let n=0;j.value.forEach((l,g)=>{l<a+100&&(n=g)}),n!==r.value&&(r.value=n)};S(()=>{document.querySelectorAll(".blog h1, .blog h2, .blog h3, .blog h4, .blog h5, .blog h6").forEach(n=>{j.value.push(n.getBoundingClientRect().top)}),j.value.sort((n,l)=>n-l),document.addEventListener("scroll",y)}),O(()=>{document.removeEventListener("scroll",y)});const i=document.createElement("script");i.src="https://utteranc.es/client.js",i.setAttribute("repo","yiktllw/yiktllw.github.io"),i.setAttribute("issue-term","2025/04/xcmusic01"),i.setAttribute("label","💬comment"),i.setAttribute("theme",`github-${window.theme??"dark"}`),i.setAttribute("crossorigin","anonymous"),i.setAttribute("async","true"),S(()=>{var a,n,l;(a=v.value)==null||a.appendChild(i),(n=window.mermaid)==null||n.initialize({startOnLoad:!1,theme:window.theme==="dark"?"dark":"default"}),(l=window.mermaid)==null||l.run()});const e=P.find(a=>a.component==="@/blogs/2025/04/xcmusic01.vue");document.title=(e==null?void 0:e.blogInfo.title)??"yiktllw的博客";const K=[`<!-- 逐字歌词动画 -->
<span
  class="item-white font-color-main"
  :style="{
    transition: \`clip-path \${(word.duration ?? 0) + (word.startTime ?? line.startTime) > currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease\`,
    clipPath:
      word.startTime <= currentTime ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
    color:
      index === currentLine
        ? 'var(--font-color-main)'
        : 'var(--font-color-standard)',
  }"
>
  {{ word.text }}
</span>
`,`/** 计算歌词dom和动画 */
const computeLyricsElements = () => {
  // 清空原有的元素和动画
  // 省略清理代码

  // 生成新的元素，并计算动画
  animations.value = lyrics.value.flatMap((line, lineIndex) => {
    const lineKeyframes = [
      { transform: "scale(1)", opacity: 0 },
      { transform: "scale(1.3)", opacity: 1 },
    ];
    const _lineKeyframes = [
      { transform: "scale(1)" },
      { transform: "scale(1.3)" },
    ];
    const lineOptions: KeyframeAnimationOptions = {
      duration: 200,
      easing: "ease-out",
      fill: "forwards",
    };

    // 生成行元素
    const lineElement = document.createElement("div");
    lineElement.className = "lyrics-new-line";
    lineElement.style.transformOrigin = "left center";
    container.value?.appendChild(lineElement);
    lineElements.value.push(lineElement);

    // 生成行动画
    const lineAnimation = lineElement.animate(lineKeyframes, lineOptions);
    lineAnimation.pause();
    lineAnimations.value.push(lineAnimation);

    // 生成背景行元素
    // 生成背景行动画
    // 生成翻译行元素
    // 省略部分代码

    // 返回逐字动画
    return line.words.map((word) => {
      // 生成逐字元素
      const wordElement = document.createElement("span");
      wordElement.innerText = word.text;
      lineElement.appendChild(wordElement);

      // 生成逐字背景元素
      // 省略部分代码

      // 生成逐字动画
      const animateKeyframes = [
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0 0 0)" },
      ];
      const animate = wordElement.animate(animateKeyframes, {
        duration: word.duration.ms || 1,
        easing: "linear",
        fill: "backwards",
      });
      animate.pause();

      return animate;
    });
  });
};
`],A=a=>{const n=K[a];navigator.clipboard.writeText(n)},h=E([!0,!0]),b=a=>{h.value[a]=!h.value[a]};return(a,n)=>{var l,g,w,B,C,_,k,q;return u(),m("div",L,[s("div",{class:"blog",ref_key:"blog",ref:v},[s("div",X,[s("h1",N,o(((l=t(e))==null?void 0:l.blogInfo.title)??"Untitled"),1),s("div",$,[s("span",U,[n[4]||(n[4]=s("span",{class:"ele-title"},"发布于：",-1)),c(o(t(F)(((g=t(e))==null?void 0:g.blogInfo.createTime)??0)),1)]),s("span",V,[n[5]||(n[5]=s("span",{class:"ele-title"},"修改于：",-1)),c(o(t(F)(((w=t(e))==null?void 0:w.blogInfo.lastUpdate)??0)),1)]),s("span",W,[n[6]||(n[6]=s("span",{class:"ele-title"},"阅读时长：",-1)),c(o((B=t(e))==null?void 0:B.blogInfo.readingTime)+"分钟 ",1)]),((C=t(e))==null?void 0:C.blogInfo.category)!=="default"?(u(),m("span",Y,[n[7]||(n[7]=s("span",{class:"ele-title"},"分类：",-1)),c(o((_=t(e))==null?void 0:_.blogInfo.category),1)])):T("",!0),(k=t(e))!=null&&k.blogInfo.series.enable?(u(),m("span",z,[n[8]||(n[8]=s("span",{class:"ele-title"},"系列：",-1)),c(o((q=t(e))==null?void 0:q.blogInfo.series.name),1)])):T("",!0),n[9]||(n[9]=s("span",{class:"copy-right"},[s("span",{class:"ele-title"},"许可协议："),s("p",{"xmlns:cc":"http://creativecommons.org/ns#"},[s("a",{href:"https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1",target:"_blank",rel:"license noopener noreferrer",style:{display:"inline-block"}},[c("CC BY-NC-SA 4.0"),s("img",{style:{height:"22px !important","margin-left":"3px","vertical-align":"text-bottom"},src:"https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1",alt:""}),s("img",{style:{height:"22px !important","margin-left":"3px","vertical-align":"text-bottom"},src:"https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1",alt:""}),s("img",{style:{height:"22px !important","margin-left":"3px","vertical-align":"text-bottom"},src:"https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1",alt:""}),s("img",{style:{height:"22px !important","margin-left":"3px","vertical-align":"text-bottom"},src:"https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1",alt:""})])])],-1))])]),n[12]||(n[12]=d('<p> 网易云音乐的歌词 api 返回的歌词类型有两种：逐行歌词（lrc）和逐字歌词（yrc）。 </p><h2 id="%E7%9B%AE%E6%A0%87" tabindex="-1">目标</h2><p>需要实现的歌词动画包括：</p><ol><li>滚动动画：平滑滚动到当前行</li><li>缩放动画：当前行的缩放从 1.0 缓变为 1.3，上一行反向变化</li><li>逐字歌词动画：从左到右的剪切效果</li></ol><p>逐行歌词可视为逐字歌词的特例：即动画长度为 0 的逐字歌词。</p><h2 id="%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0" tabindex="-1"> 初代方案：基于 CSS 动画的实现 </h2><p> 初版应用于 XCMusic <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.4">0.2.4</a> 及之前版本。 </p><p>主要原理是：</p><ol><li>用 <code>requestAnimationFrame</code> 计算滚动动画位置</li><li>CSS 动画处理缩放效果；</li><li><code>clip-path</code> 实现逐字动画，动画时长对应歌词时间</li></ol>',9)),s("pre",null,[s("code",{"data-open":h.value[0],class:"hljs language-vue",style:{"font-family":"yiktllw-code, serif",position:"relative"}},[s("div",J,[(u(),m(D,null,I(15,p=>s("span",null,o(p),1)),64))]),s("div",R,[s("div",{onClick:n[0]||(n[0]=p=>b(0)),class:"language"},"<VUE>"),s("div",{class:"copy-button",onClick:n[1]||(n[1]=p=>A(0))},[s("img",{class:"copy-img",src:t(x)},null,8,H)])]),n[10]||(n[10]=d(`<div class="code"><span class="language-xml"><span class="hljs-comment">&lt;!-- 逐字歌词动画 --&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">span</span>
  <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;item-white font-color-main&quot;</span>
  <span class="hljs-attr">:style</span>=<span class="hljs-string">&quot;{
    transition: \`clip-path \${(word.duration ?? 0) + (word.startTime ?? line.startTime) &gt; currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease\`,
    clipPath:
      word.startTime &lt;= currentTime ? &#39;inset(0 0% 0 0)&#39; : &#39;inset(0 100% 0 0)&#39;,
    color:
      index === currentLine
        ? &#39;var(--font-color-main)&#39;
        : &#39;var(--font-color-standard)&#39;,
  }&quot;</span>
&gt;</span>
  {{ word.text }}
<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
</span></div>`,1))],8,G)]),n[13]||(n[13]=d('<h2 id="%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D" tabindex="-1"> 二代方案：使用 Canvas 绘制歌词 </h2><p> 应用于 XCMusic <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.5">0.2.5</a> 至 <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.3.0">0.3.0</a> 版本。 </p><p>在第一版歌词中，我发现其存在诸多不便利性：</p><ol><li>CSS 动画无法暂停</li><li>过多的 dom 元素导致的内存占用问题</li><li>CSS 动画的自由性太低</li></ol><p>恰好 Canvas 能够完美解决上述问题。</p><p>使用 Canvas 完成歌词的逻辑：</p><ol><li>获取当前系统缩放和应用缩放并适配，防止 Canvas 模糊。</li><li>根据解析后的歌词，计算每一行歌词的位置。</li><li> 使用 <code>requestAnimationFrame</code> 在每一帧完成： <ul><li>获取当前音频的播放进度</li><li>计算当前滚动高度，实现滚动动画</li><li>根据滚动高度与当前行高度的差值，计算缩放动画和字体颜色</li><li> 计算当前逐字动画位置，并计算 <code>cutX</code> 的位置。<br> 与第一版歌词类似，在 <code>scrollY</code> 处画两份歌词：一份为白色，仅显示 <code>cutX</code> 左侧的部分；另一份为灰色，仅显示 <code>cutX</code> 右侧的部分。 </li></ul></li><li>监听用户鼠标滚轮，并执行对应的滚动动画。</li></ol><p> 纯 JavaScript 实现带来的自由度是极高的--这一版动画的效果也是最好的。 </p><h2 id="%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB" tabindex="-1"> 最终版本：基于 Web Animations API 和 CSS 的歌词动画 </h2><p>最终版歌词动画，在 XCMusic 0.3.1（未发布）及之后的版本中使用。</p><p>在版本迭代中,我发现使用 Canvas 绘制歌词存在以下问题：</p><ol><li> 在使用歌词时，electron 的 GPU 进程占用的内存会逐步上涨，大约在一整天内从 10MB 以内上涨到 100MB 左右。而 electron 没有提供 api 来清除 GPU 进程的内存占用 </li><li> 放弃使用 DOM 的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题 </li><li> 由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度 </li><li>画布大小不灵活,无法动态适应布局改变</li></ol><p> Web Animations Api 可以在 JavaScript 中操控 CSS 动画, 解决了初代方案中动画灵活性的问题。 </p><p> 至于内存占用问题, 在加载 100 句歌词 <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> (带翻译)后, 渲染进程内存占用仅增加了 5MB。并且这部分内存是能够稳定得到释放的。 </p><p>使用 Web Animations Api 完成歌词动画的基本过程为：</p><ol><li> 在获取逐字歌词后, 调用 <code>computeLyricsElements()</code> 函数：这个函数会完成： <ul><li>生成歌词对应的 dom 元素, 并保存 dom 元素的引用</li><li>为行元素添加行动画(缩放动画)</li><li>为词元素添加从左到右的剪切动画</li><li>暂停所有动画, 并保存动画的引用</li></ul></li><li>同时, 从逐字歌词生成时间线</li><li> 使用 <code>requestAnimationFrame()</code> 函数, 在每一帧监听播放进度, 并通过时间线计算是否有需要播放的动画 </li><li>需要播放动画时, 调用 <code>animate.play()</code> 来播放动画。</li></ol>',16)),s("pre",null,[s("code",{"data-open":h.value[1],class:"hljs language-typescript",style:{"font-family":"yiktllw-code, serif",position:"relative"}},[s("div",Z,[(u(),m(D,null,I(64,p=>s("span",null,o(p),1)),64))]),s("div",ss,[s("div",{onClick:n[2]||(n[2]=p=>b(1)),class:"language"},"<TYPESCRIPT>"),s("div",{class:"copy-button",onClick:n[3]||(n[3]=p=>A(1))},[s("img",{class:"copy-img",src:t(x)},null,8,ns)])]),n[11]||(n[11]=d(`<div class="code"><span class="hljs-comment">/** 计算歌词dom和动画 */</span>
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
</div>`,1))],8,Q)]),n[14]||(n[14]=d('<hr class="footnotes-sep"><section class="footnotes"><ol class="footnotes-list"><li id="fn1" class="footnote-item"><p><a href="https://music.163.com/song?id=22256832">贝多芬第九交响曲。富特文格勒 / 1951 年拜罗伊特音乐节, 网易云音乐 id: 22256832</a><a href="#fnref1" class="footnote-backref">↩︎</a></p></li></ol></section>',2))],512),s("div",as,[s("div",ts,[s("div",es,[n[15]||(n[15]=s("div",{class:"toc-title"},"目录",-1)),n[16]||(n[16]=s("div",{class:"progress-bar"},null,-1)),s("ul",ls,[s("li",null,[s("a",{href:"#%E7%9B%AE%E6%A0%87",class:f(r.value===0?"active":"not-active")},"1 目标",2)]),s("li",null,[s("a",{href:"#%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0",class:f(r.value===1?"active":"not-active")},"2 初代方案：基于 CSS 动画的实现",2)]),s("li",null,[s("a",{href:"#%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D",class:f(r.value===2?"active":"not-active")},"3 二代方案：使用 Canvas 绘制歌词",2)]),s("li",null,[s("a",{href:"#%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB",class:f(r.value===3?"active":"not-active")},"4 最终版本：基于 Web Animations API 和 CSS 的歌词动画",2)])])])])])],512)}}});export{cs as default};
