## Electron 的打包方式

Electron 采用 Chromium 前端 + NodeJS 后端 + 系统 API 的架构模式[^a]。软件打包后，Chromium 和 NodeJS 构成了存储空间的主要部分。

以 XCMusic 的 Windows 安装包为例：Electron 10+ 打包体积约 60MB，升级至 Electron 35 后增至 80MB，而我实际编写的应用代码和资源（app.asar）仅占 15MB。

这种打包机制存在显著弊端：每个 Electron 应用都需内置完整的 Chromium 运行时，导致用户设备可能同时存在数十个重复的 Chromium 实例。

~~喜报：爷的电脑上有 xx 个 Chromium.jpg~~[^1]

## 兼容性 OR 硬盘空间

Tauri 的安装包不包含 Webview 组件，直接调用系统原生 Webview 进行渲染：

> **Minimal Size**[^2]
>
> By using the OS's native web renderer，the size of a Tauri app can be little as 600KB.

这种设计使得 Tauri 打包后的体积是极小的——我认为这正是 Tauri 的核心竞争力所在。

但是，这种设计也意味着需要开发者适配不同操作系统的 Webview 特性差异。对于个人开发者而言，跨平台调试所需的时间成本是不得不考虑的问题。

如同 VSCode 以性能换取生态优势，Electron 与 Tauri 的取舍本质上是兼容性与资源占用的权衡。

## 内存安全...吗?

Tauri 在官网上强调：

> **Maximum Security** [^2]
>
> Front-of-mind for the Tauri Team that drives our highest priorities and biggest innovations.

> **Powered by Rust** [^2]
>
> With performance and security at the center, Rust is the language for the next generation of apps.

作为内存安全的系统级语言，Rust 确实为后端代码提供了安全保障。**_但是_**，正如 Tauri 在其官网上宣传的那样：

> **Frontend Independent** [^2]
>
> Bring your existing web stack to Tauri or start that new dream project. Tauri supports any frontend framework so you don’t need to change your stack.

Tauri 只在后端使用了 Rust，你可以使用任何语言编写前端：使用 Rust 的 Dioxus、Yew；使用 JS 的 Vue, React 等。

在 XCMusic 中，Electron 后端代码仅 1200 行，而基于 Vue 的前端代码高达 2.6w 行。这意味着即使迁移至 Tauri，仅有 4% 的代码能享受 Rust 的内存安全优势。

在 XCMusic 中：Tauri 主进程内存占用控制在 10MB 以内，但 Windows Webview 进程内存消耗约 300MB——与 Electron 渲染进程的占用水平基本持平。

由此可见，为获得有限的安全提升而抛弃 Electron 的兼容性和生态优势，其性价比值得商榷。

## 核心问题：网易云音乐 API

XCMusic 依赖的 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 是基于 NodeJS 的实现。Electron 内置 NodeJS 环境，可直接启动该服务；而在 Tauri 中则面临两难选择：

1. 打包为二进制程序：将增加约 40MB 体积，显著削弱 Tauri 的体积优势
2. 重写为 Rust 版本：需重构 2w 行 JS 代码，开发成本过高[^rust-ncm-api]

二者均不具备可行性。

## 结论

对于全新开发的 Windows 桌面应用，采用 Tauri 配合 Rust 前端框架（如 Dioxus/Yew）是值得考虑的方案。

然而就 XCMusic 而言，作为跨平台 Vue 应用，迁移至 Tauri 难以获得显著的安全增益，是费力不讨好的。

[^a]: [简介：Electron](https://www.electronjs.org/zh/docs/latest/)

[^1]: [GitHub：检测电脑中有多少个 Chromium 内核的程序](https://github.com/xh321/CefDetector.Net)

[^2]: [Tauri 2.0 官方网站](https://v2.tauri.app/)

[^rust-ncm-api]: GitHub 上有将此项目转写为 Rust 的版本，但是其最后更新在 2018 年，提供的 API 很少，可用性不高。
