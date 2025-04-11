网易云音乐的歌词api返回的歌词类型有两种：逐行歌词（lrc）和逐字歌词（yrc）。

## 目标
需要实现的歌词动画包括：
1. 滚动动画：平滑滚动到当前行
2. 缩放动画：当前行的缩放从1.0缓变为1.3，上一行反向变化
3. 逐字歌词动画：从左到右的剪切效果

逐行歌词可视为逐字歌词的特例：即动画长度为0的逐字歌词。

## 初代方案：基于CSS动画的实现

初版应用于XCMusic [0.2.4](https://github.com/yiktllw/XCMusic/releases/tag/0.2.4)及之前版本。

主要原理是：
1. 用`requestAnimationFrame`计算滚动动画位置
2. CSS动画处理缩放效果；
3. `clip-path`实现逐字动画，动画时长对应歌词时间

```vue
<!-- 逐字歌词动画 -->
<span
  class="item-white font-color-main"
  :style="{
    transition: `clip-path ${(word.duration ?? 0) + (word.startTime ?? line.startTime) > currentTime ? (word.duration ?? 0) / 1000 : 0}s linear, color 0.5s ease`,
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
```

## 二代方案：使用Canvas实现
应用于XCMusic [0.2.5](https://github.com/yiktllw/XCMusic/releases/tag/0.2.5)至[0.3.0](https://github.com/yiktllw/XCMusic/releases/tag/0.3.0)版本。

在第一版歌词中，我发现其存在诸多不便利性：
1. CSS动画无法暂停
2. 过多的dom元素导致的内存占用问题
3. CSS动画的自由性太低

恰好Canvas能够完美解决上述问题。

使用Canvas完成歌词的逻辑：
1. 获取当前系统缩放和应用缩放并适配，防止Canvas模糊
1. 根据解析后的歌词，计算每一行歌词的位置。
2. 使用requestAnimationFrame在每一帧完成：
   - 获取当前音频的播放进度
   - 计算当前滚动高度，实现滚动动画
   - 根据滚动高度与当前行高度的差值，计算缩放动画和字体颜色
   - 计算当前逐字动画位置，并计算`cutX`的位置。<br>
     与第一版歌词类似，在`scrollY`处画两份歌词：一份为白色，仅显示`cutX`左侧的部分；另一份为灰色，仅显示`cutX`右侧的部分。
3. 监听用户鼠标滚轮，并执行对应的滚动动画。

纯js实现带来的自由度是极高的--这一版动画的效果也是最好的。

**已知的问题**：
1. 在使用歌词时，electron的GPU进程占用的内存会逐步上涨，大约在一整天内从10MB以内上涨到100MB左右。而electron没有提供api来清除GPU进程的内存占用。~~可以通过禁用GPU加速来解决此问题~~
2. 放弃使用DOM的同时也放弃了现有的滚动容器和排版系统。前者导致歌词的滚动交互体验变差，而后者意味着长行歌词的排版成为一个大问题
3. 由于需要在每一帧计算动画，性能优化格外重要。这大大限制了代码的可读性，增大了维护难度。~~过几天自己都不知道写了个啥~~

## 最终版本：基于Web Animations API和CSS歌词动画
最终版歌词动画，在XCMusic 0.3.1（未发布）及之后的版本中使用。
