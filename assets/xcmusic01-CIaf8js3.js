import{c as L}from"./copy-BNUq0S91.js";import{d as P,r as v,n as K,o as X,b as $,c as p,a as n,e as E,t as o,u as e,F as y,j as A,f as j,g as b,h,i as M,k as r}from"./index-Db6z3kid.js";import"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";const N={class:"blog-container",ref:"container"},U={class:"blog-info"},V={class:"blog-title"},W=["data-open"],Y={class:"line-numbers"},z={class:"top-line"},G=["src"],J=["data-open"],R={class:"line-numbers"},H={class:"top-line"},Q=["src"],Z={class:"sidebar-placeholder"},ss={class:"sidebar-container"},ns={class:"nav"},as={class:"nav-content"},ts={class:"article toc active",id:"article"},es={class:"depth-0"},ls={class:"info"},is={class:"create-time"},os={class:"last-update"},cs={class:"word-count"},ps={class:"reading-time"},rs={key:0,class:"category"},ds={key:1,class:"series"},ms={key:2,class:"tags"},gs=P({__name:"xcmusic01",setup(us){const w=v(),d=v([]),u=v(0),B=()=>{const a=(document.documentElement.scrollTop||document.body.scrollTop)+100;let s=0;for(const[t,m]of d.value.entries())if(a>m)if(d.value[t+1]&&a<d.value[t+1]){s=t;break}else t===d.value.length-1&&(s=t);s!==u.value&&(u.value=s)};K(()=>{document.querySelectorAll(".blog h2, .blog h3, .blog h4, .blog h5, .blog h6").forEach(s=>{d.value.push(s.offsetTop)}),d.value.map(s=>-s),d.value.sort((s,t)=>s-t),document.addEventListener("scroll",B)}),X(()=>{document.removeEventListener("scroll",B)});const C=a=>{const s=document.getElementById(a),t=document.getElementById(a==="article"?"site":"article");t?(t.classList.remove("active"),s&&(s.style.display="block",s.style.position="absolute"),setTimeout(()=>{s&&(s.classList.add("active"),s.style.position="initial"),t.style.display="none"},200)):s&&s.classList.add("active");const m=document.getElementById("nav_"+a),f=document.getElementById("nav_"+(a==="article"?"site":"article"));m&&m.classList.add("selected"),f&&f.classList.remove("selected")},c=document.createElement("script");c.src="https://utteranc.es/client.js",c.setAttribute("repo","yiktllw/yiktllw.github.io"),c.setAttribute("issue-term","2025/04/xcmusic01"),c.setAttribute("label","💬comment"),c.setAttribute("theme",`github-${window.theme??"dark"}`),c.setAttribute("crossorigin","anonymous"),c.setAttribute("async","true"),K(()=>{var a,s,t;(a=w.value)==null||a.appendChild(c),(s=window.mermaid)==null||s.initialize({startOnLoad:!1,theme:window.theme==="dark"?"dark":"default"}),(t=window.mermaid)==null||t.run()});const l=$.find(a=>a.component==="@/blogs/2025/04/xcmusic01.vue");document.title=(l==null?void 0:l.blogInfo.title)??"yiktllw的博客";const O=[`<!-- 逐字歌词动画 -->
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
`],_=a=>{const s=O[a];navigator.clipboard.writeText(s)},g=v([!0,!0]),k=a=>{g.value[a]=!g.value[a]};return(a,s)=>{var t,m,f,q,T,x,S,F,I,D;return r(),p("div",N,[n("div",{class:"blog",ref_key:"blog",ref:w},[n("div",U,[n("h1",V,o(((t=e(l))==null?void 0:t.blogInfo.title)??"Untitled"),1)]),s[8]||(s[8]=E('<p> 网易云音乐的歌词 api 返回的歌词类型有两种：逐行歌词（lrc）和逐字歌词（yrc）。 </p><h2 id="%E7%9B%AE%E6%A0%87" tabindex="-1">目标</h2><p>需要实现的歌词动画包括：</p><ol><li>滚动动画：平滑滚动到当前行</li><li>缩放动画：当前行的缩放从 1.0 缓变为 1.3，上一行反向变化</li><li>逐字歌词动画：从左到右的剪切效果</li></ol><p>逐行歌词可视为逐字歌词的特例：即动画长度为 0 的逐字歌词。</p><h2 id="%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0" tabindex="-1"> 初代方案：基于 CSS 动画的实现 </h2><p> 初版应用于 XCMusic <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.4">0.2.4</a> 及之前版本。 </p><p>主要原理是：</p><ol><li>用 <code>requestAnimationFrame</code> 计算滚动动画位置</li><li>CSS 动画处理缩放效果；</li><li><code>clip-path</code> 实现逐字动画，动画时长对应歌词时间</li></ol>',9)),n("pre",null,[n("code",{"data-open":g.value[0],class:"hljs language-vue",style:{"font-family":"yiktllw-code, serif",position:"relative"}},[n("div",Y,[(r(),p(y,null,A(15,i=>n("span",null,o(i),1)),64))]),n("div",z,[n("div",{onClick:s[0]||(s[0]=i=>k(0)),class:"language"},"<VUE>"),n("div",{class:"copy-button",onClick:s[1]||(s[1]=i=>_(0))},[n("img",{class:"copy-img",src:e(L)},null,8,G)])]),s[6]||(s[6]=E(`<div class="code"><span class="language-xml"><span class="hljs-comment">&lt;!-- 逐字歌词动画 --&gt;</span>
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
</span></div>`,1))],8,W)]),s[9]||(s[9]=E('<h2 id="%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D" tabindex="-1"> 二代方案：使用 Canvas 绘制歌词 </h2><p> 应用于 XCMusic <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.2.5">0.2.5</a> 至 <a href="https://github.com/yiktllw/XCMusic/releases/tag/0.3.0">0.3.0</a> 版本。 </p><p>在第一版歌词中，我发现其存在诸多不便利性：</p><ol><li>CSS 动画无法暂停</li><li>过多的 dom 元素导致的内存占用问题</li><li>CSS 动画的自由性太低</li></ol><p>恰好 Canvas 能够完美解决上述问题。</p><p>使用 Canvas 完成歌词的逻辑：</p><ol><li>获取当前系统缩放和应用缩放并适配，防止 Canvas 模糊。</li><li>根据解析后的歌词，计算每一行歌词的位置。</li><li> 使用 <code>requestAnimationFrame</code> 在每一帧完成： <ul><li>获取当前音频的播放进度</li><li>计算当前滚动高度，实现滚动动画</li><li>根据滚动高度与当前行高度的差值，计算缩放动画和字体颜色</li><li> 计算当前逐字动画位置，并计算 <code>cutX</code> 的位置。<br> 与第一版歌词类似，在 <code>scrollY</code> 处画两份歌词：一份为白色，仅显示 <code>cutX</code> 左侧的部分；另一份为灰色，仅显示 <code>cutX</code> 右侧的部分。 </li></ul></li><li>监听用户鼠标滚轮，并执行对应的滚动动画。</li></ol><p> 纯 JavaScript 实现带来的自由度是极高的--这一版动画的效果也是最好的。 </p><h2 id="%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB" tabindex="-1"> 最终版本：基于 Web Animations API 和 CSS 的歌词动画 </h2><p>最终版歌词动画，在 XCMusic 0.3.1（未发布）及之后的版本中使用。</p><p>在版本迭代中,我发现使用 Canvas 绘制歌词存在以下问题：</p><ol><li> 在使用歌词时，electron 的 GPU 进程占用的内存会逐步上涨，大约在一整天内从 10MB 以内上涨到 100MB 左右。而 electron 没有提供 api 来清除 GPU 进程的内存占用 </li><li> 放弃使用 DOM 的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题 </li><li> 由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度 </li><li>画布大小不灵活,无法动态适应布局改变</li></ol><p> Web Animations Api 可以在 JavaScript 中操控 CSS 动画，解决了初代方案中动画灵活性的问题。 </p><p> 至于内存占用问题，在加载 100 句歌词 <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> (带翻译)后，渲染进程内存占用仅增加了 5MB。并且这部分内存是能够稳定得到释放的。 </p><p>使用 Web Animations Api 完成歌词动画的基本过程为：</p><ol><li> 在获取逐字歌词后，调用 <code>computeLyricsElements()</code> 函数：这个函数会完成： <ul><li>生成歌词对应的 dom 元素，并保存 dom 元素的引用</li><li>为行元素添加行动画(缩放动画)</li><li>为词元素添加从左到右的剪切动画</li><li>暂停所有动画，并保存动画的引用</li></ul></li><li>同时，从逐字歌词生成时间线</li><li> 使用 <code>requestAnimationFrame()</code> 函数，在每一帧监听播放进度，并通过时间线计算是否有需要播放的动画 </li><li>需要播放动画时，调用 <code>animate.play()</code> 来播放动画。</li></ol>',16)),n("pre",null,[n("code",{"data-open":g.value[1],class:"hljs language-typescript",style:{"font-family":"yiktllw-code, serif",position:"relative"}},[n("div",R,[(r(),p(y,null,A(64,i=>n("span",null,o(i),1)),64))]),n("div",H,[n("div",{onClick:s[2]||(s[2]=i=>k(1)),class:"language"},"<TYPESCRIPT>"),n("div",{class:"copy-button",onClick:s[3]||(s[3]=i=>_(1))},[n("img",{class:"copy-img",src:e(L)},null,8,Q)])]),s[7]||(s[7]=E(`<div class="code"><span class="hljs-comment">/** 计算歌词dom和动画 */</span>
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
</div>`,1))],8,J)]),s[10]||(s[10]=E('<hr class="footnotes-sep"><section class="footnotes"><ol class="footnotes-list"><li id="fn1" class="footnote-item"><p><a href="https://music.163.com/song?id=22256832">贝多芬第九交响曲。富特文格勒 / 1951 年拜罗伊特音乐节，网易云音乐 id: 22256832</a><a href="#fnref1" class="footnote-backref">↩︎</a></p></li></ol></section>',2))],512),n("div",Z,[n("div",ss,[n("div",ns,[n("div",{class:"nav-item selected",id:"nav_article",onClick:s[4]||(s[4]=i=>C("article"))}," 文章信息 "),n("div",{class:"nav-item",id:"nav_site",onClick:s[5]||(s[5]=i=>C("site"))}," 站点概览 ")]),n("div",as,[n("div",ts,[s[19]||(s[19]=n("div",{class:"toc-title"},"目录",-1)),s[20]||(s[20]=n("div",{class:"progress-bar"},null,-1)),n("ul",es,[n("li",null,[n("a",{href:"#%E7%9B%AE%E6%A0%87",class:j(u.value===0?"active":"not-active")},"1 目标",2)]),n("li",null,[n("a",{href:"#%E5%88%9D%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E5%9F%BA%E4%BA%8E-css-%E5%8A%A8%E7%94%BB%E7%9A%84%E5%AE%9E%E7%8E%B0",class:j(u.value===1?"active":"not-active")},"2 初代方案：基于 CSS 动画的实现",2)]),n("li",null,[n("a",{href:"#%E4%BA%8C%E4%BB%A3%E6%96%B9%E6%A1%88%EF%BC%9A%E4%BD%BF%E7%94%A8-canvas-%E7%BB%98%E5%88%B6%E6%AD%8C%E8%AF%8D",class:j(u.value===2?"active":"not-active")},"3 二代方案：使用 Canvas 绘制歌词",2)]),n("li",null,[n("a",{href:"#%E6%9C%80%E7%BB%88%E7%89%88%E6%9C%AC%EF%BC%9A%E5%9F%BA%E4%BA%8E-web-animations-api-%E5%92%8C-css-%E7%9A%84%E6%AD%8C%E8%AF%8D%E5%8A%A8%E7%94%BB",class:j(u.value===3?"active":"not-active")},"4 最终版本：基于 Web Animations API 和 CSS 的歌词动画",2)])]),n("div",ls,[n("span",is,[s[11]||(s[11]=n("span",{class:"ele-title"},"创建于：",-1)),h(o(e(M)(((m=e(l))==null?void 0:m.blogInfo.createTime)??0)),1)]),n("span",os,[s[12]||(s[12]=n("span",{class:"ele-title"},"修改于：",-1)),h(o(e(M)(((f=e(l))==null?void 0:f.blogInfo.lastUpdate)??0)),1)]),n("span",cs,[s[13]||(s[13]=n("span",{class:"ele-title"},"本文字数：",-1)),h(o((q=e(l))==null?void 0:q.blogInfo.wordCount)+"字 ",1)]),n("span",ps,[s[14]||(s[14]=n("span",{class:"ele-title"},"预计阅读时间：",-1)),h(o((T=e(l))==null?void 0:T.blogInfo.readingTime)+"分钟 ",1)]),((x=e(l))==null?void 0:x.blogInfo.category)!=="default"?(r(),p("span",rs,[s[15]||(s[15]=n("span",{class:"ele-title"},"分类于：",-1)),h(o((S=e(l))==null?void 0:S.blogInfo.category),1)])):b("",!0),(F=e(l))!=null&&F.blogInfo.series.enable?(r(),p("span",ds,[s[16]||(s[16]=n("span",{class:"ele-title"},"系列：",-1)),h(o((I=e(l))==null?void 0:I.blogInfo.series.name),1)])):b("",!0),s[18]||(s[18]=n("span",{class:"copy-right"},[n("span",{class:"ele-title"},"许可协议："),n("p",{"xmlns:cc":"http://creativecommons.org/ns#"},[n("a",{href:"https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1",target:"_blank",rel:"license noopener noreferrer",style:{display:"inline-block"}},"CC BY-NC-SA 4.0")])],-1)),e(l)&&e(l).blogInfo.tags.length>0?(r(),p("span",ms,[s[17]||(s[17]=n("span",{class:"ele-title"},"标签：",-1)),(r(!0),p(y,null,A((D=e(l))==null?void 0:D.blogInfo.tags,i=>(r(),p("span",{class:"tag",key:i},o(i),1))),128))])):b("",!0)])]),s[21]||(s[21]=n("div",{class:"site",id:"site"},"标签2的内容",-1))])])])],512)}}});export{gs as default};
