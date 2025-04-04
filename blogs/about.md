本博客通过GitHub Actions从[yiktllw.github.io](https://github.com/yiktllw/yiktllw.github.io)仓库自动构建，未采用任何现有博客框架，旨在兼顾Markdown的编写便利性与开发自由度。

技术方案如下：

1. 以Vue为基础框架
2. 编写TypeScript脚本实现：
   - 核心脚本：将Markdown解析为Vue组件，自动生成路由配置和文章元数据
   - 辅助脚本：实时监听Markdown文件变更并同步更新Vue文件，支持开发热更新
3. 通过GitHub Actions实现自动化部署

**以下为使用本项目构建个人博客的过程。**

## 目录

[1. 准备工作](#1.准备工作)<br>
[2. 启动开发服务](#2.启动开发服务)<br>
[3. 编写博客文章](#3.编写博客文章)<br>
[4. 发布到GitHub Pages](#4.发布到-github-pages)<br>
[5. 注意事项](#注意事项)

## 1.准备工作

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

## 2.启动开发服务

**启动文件监听**：

```bash
bun watch
```

**启动开发服务器**（新终端窗口）：

```bash
bun dev
```

访问 `http://localhost:5173` 预览实时效果

**配置评论系统**

安装[utteranc](https://github.com/apps/utterances)到fork的仓库，并修改项目根目录的`.env`文件中对应的信息。

## 3.编写博客文章

1. 在项目根目录的 `/blogs` 文件夹中新建 Markdown 文件
2. 系统会自动完成：
   - Markdown → Vue 组件转换（生成至 `/src/blogs`）
   - 自动注册路由 `/blog/文件名`
3. 编辑 `/src/blogs.json` 配置文章标题

## 4.发布到 GitHub Pages

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
