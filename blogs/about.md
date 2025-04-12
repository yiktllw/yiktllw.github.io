本博客通过 GitHub Actions 从 [yiktllw.github.io](https://github.com/yiktllw/yiktllw.github.io) 仓库自动构建，未采用任何现有博客框架，旨在兼顾 Markdown 的编写便利性与开发自由度。

技术方案如下：

1. 以 Vue 为基础框架
2. 编写 TypeScript 脚本实现：
   - 核心脚本：将 Markdown 解析为 Vue 组件，自动生成路由配置和文章元数据
   - 辅助脚本：实时监听 Markdown 文件变更并同步更新 Vue 文件，支持开发热更新
3. 通过 GitHub Actions 实现自动化部署

**以下为使用本项目构建个人博客的过程。**

## 准备工作

1. **克隆仓库**

   - Fork 本项目到你的 GitHub 账户
   - 将项目源码克隆到本地：
     ```bash
     git clone https://github.com/你的用户名/仓库名.git
     ```

2. **环境配置**

   - 安装 Bun 运行时环境 ([官方安装指南](https://bun.sh/docs/installation))
   - 安装 Vite 构建工具：
     ```bash
     bun add -g vite
     ```

3. **安装依赖**
   ```bash
   bun install
   ```

## 启动开发服务

**启动文件监听和开发服务器**：

```bash
bun watch
```

在脚本自动修改路由配置时，Vite 默认的窗口刷新会影响编辑体验，已禁用该特性。若新增了 md 文件，请在运行服务的终端窗口中按 <kbd>r</kbd> + <kbd>Enter</kbd> 强制 HMR 更新，即可预览新文件。

**配置评论系统**

安装 [utteranc](https://github.com/apps/utterances) 到 fork 的仓库，并修改项目根目录的 `.env` 文件中对应的信息。

## 编写博客文章

1. 在项目根目录的 `/blogs` 文件夹中新建 Markdown 文件
2. 系统会自动完成：
   - Markdown → Vue 组件转换（生成至 `/src/blogs`）
   - 自动注册路由 `/blog/文件名`
3. 编辑 `/src/blogs.json` 配置文章标题

## 发布到 GitHub Pages

1. **本地构建预览**：

   ```bash
   bun run build  # 生成静态文件
   bun run preview  # 本地预览生产环境效果
   ```

2. **部署到 GitHub**：

   ```bash
   git add .
   git commit -m "更新博客内容"
   git push origin main
   ```

3. 自动部署流程：
   - GitHub Actions 会自动触发部署
   - 部署完成后访问 `https://你的用户名.github.io/仓库名`

## 注意事项

1. 保持文件监听服务 (`bun watch`) 持续运行
2. 确保 GitHub 仓库已启用 Pages 服务（Settings → Pages）
