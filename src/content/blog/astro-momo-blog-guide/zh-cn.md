---
title: Astro + Momo 博客搭建指南
pubDate: 2026-09-08
draft: false
description: 用 Momo 主题搭建 Astro 个人博客，从环境准备、站点配置和文章发布，到 GitHub Pages 部署与评论设置。
image: ""
slugId: astro-momo-blog-guide
category: 技术
pinTop: 0
---

Momo 已经把博客常用的文章列表、归档、搜索、RSS 和明暗主题准备好了。搭建时，你主要需要改站点信息、写文章，再把静态文件部署出去。

Momo 是基于 Astro 的开源博客主题，支持 Markdown、多语言、Pagefind 搜索和 RSS。本文按 Momo **26.8.15** 版说明操作；该版本基于 Astro 7，要求 Node.js 22 或更高，项目建议使用 Node.js 24 LTS。[Momo 项目页](https://astro.build/themes/details/momo/) · [版本说明](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)

## 准备环境

### 安装工具

安装 Git、Node.js 24 LTS 和 pnpm。安装后在终端确认命令可用：

```bash
git --version
node --version
pnpm --version
```

如果还没有 pnpm，可以通过 npm 安装：

```bash
npm install --global pnpm
```

Astro 和主题依赖应安装在项目中，无需全局安装 Astro。[Astro 安装文档](https://docs.astro.build/en/install-and-setup/)

## 下载并运行主题

### 启动本地预览

克隆 Momo、安装依赖并启动开发服务器：

```bash
git clone https://github.com/Motues/Momo.git my-blog
cd my-blog
pnpm install
pnpm dev
```

打开终端显示的本地地址，通常是 `http://localhost:4321`。看到首页后，先在浏览器检查页面，再开始改配置。

### 连接自己的 GitHub 仓库

在 GitHub 创建一个空仓库，然后把本地仓库推上去。保留原主题仓库为 `upstream`，将自己的仓库设为 `origin`：

```bash
git remote rename origin upstream
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin HEAD
```

以后 `origin` 用于发布自己的博客，`upstream` 用于查看主题更新。创建 GitHub 仓库时保持为空，避免 README 等初始文件与本地历史冲突。

## 修改站点信息

### 设置网址和仓库路径

打开 `astro.config.mjs`，为 GitHub Pages 项目仓库设置 `site` 和 `base`：

```js
export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/你的仓库名',
  // 保留主题原有的其他配置
})
```

`site` 是域名，`base` 是仓库路径。如果仓库名是 `你的用户名.github.io`，网站发布在域名根目录，通常不需要 `base`。使用自定义域名时，将 `site` 改成自己的域名并移除 `base`。项目仓库中的站内链接也要正确处理 `base` 前缀。[Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

### 修改博客名称和个人资料

在 `src/config.ts` 中找到 `siteConfig` 和 `profileConfig`，把标题、简介、头像等字段换成自己的信息。示例头像 `avatar.png` 应放在 `public/avatar.png`：

```ts
title: "小明的博客",
subTitle: "记录技术、阅读与生活",
favicon: "avatar.png",
```

```ts
avatar: "/avatar.png",
name: "小明",
description: "一名喜欢折腾 Web 的开发者",
indexPage: "https://你的用户名.github.io/你的仓库名",
```

配置文件还包括目录、文章导航、主题效果、评论、版权和友链。只改需要的值，并保留当前版本已有的其他字段，避免升级时漏掉新配置。[Momo 配置指南](https://momo.motues.top/blog/intro/config/)

### 调整首页文案和语言

首页封面文字在 `src/i18n/language/` 下对应的语言文件中，修改 `cover.title` 和 `cover.subtitle`。支持哪些语言、默认显示哪种语言，则由 `astro.config.mjs` 中的国际化配置决定。[Momo 配置指南](https://momo.motues.top/blog/intro/config/)

## 发布第一篇文章

### 创建文章目录

Momo 按目录组织文章。在 `src/content/blog/` 下创建文件夹，再放入语言文件：

```text
src/content/blog/my-first-post/
├─ zh-cn.md
└─ en.md
```

### 填写文章元数据

文章文件使用 YAML frontmatter 描述标题、日期等信息：

```markdown
---
title: "我的第一篇文章"
pubDate: 2026-10-04
description: "记录第一次使用 Momo 写博客。"
category: 随笔
image: ""
draft: false
slugId: my-first-post
pinTop: 0
---

## 从这里开始

写下文章正文。
```

`title`、`pubDate` 和唯一的 `slugId` 是必填项。`draft: true` 的文章不会出现在正式站点；`image` 可设置封面，`category` 用于分类，`pinTop` 用于置顶排序。文章路由按 `src/content/blog/` 下的相对目录生成，`slugId` 用于标识文章，也会被评论系统使用。不要在发布后随意改目录名或重复使用 `slugId`。[Momo 文章发布指南](https://momo.motues.top/blog/intro/publish-blog/)

中英文版本放在同一目录，并使用相同的 `slugId`。如果启用了英文，文件名用 `en.md`；没有英文版本时，Momo 会按默认语言回退显示。每种语言都需要在 `astro.config.mjs` 中启用。

### 构建并预览

写完后先构建并预览生产版本：

```bash
pnpm build
pnpm preview
```

构建会生成 `dist/` 静态文件和 Pagefind 搜索索引。预览确认页面、图片和搜索都正常，再发布。

## 部署到 GitHub Pages

### 准备部署工作流

先看 `.github/workflows/` 目录里是否已有 Pages 工作流。没有的话，按 [Astro 官方部署指南](https://docs.astro.build/en/guides/deploy/github/) 添加 GitHub Actions 工作流，让它安装依赖、运行构建、上传 `dist/` 并部署到 Pages。工作流的 Node.js 版本和包管理器要与项目一致；使用 pnpm 时，把生成的 `pnpm-lock.yaml` 一并提交，使用 npm 时则提交 `package-lock.json`。

### 推送并查看部署状态

在 GitHub 仓库打开 **Settings → Pages**，把 **Source** 设为 **GitHub Actions**。确认本地构建通过后提交代码：

```bash
git status
git add .
git commit -m "Build my Momo blog"
git push
```

推送后到 **Actions** 页面查看构建和部署状态。项目仓库的默认网址是 `https://你的用户名.github.io/你的仓库名/`。Astro 的 Pages 工作流会读取锁文件来识别包管理器，因此需要把对应锁文件提交到仓库。[Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

### 排查构建失败

如果构建失败，先打开失败的 **Build** 步骤，定位最早出现的错误，再在本地运行 `pnpm build` 重现。重点检查 Node.js 版本、依赖锁文件、文章 frontmatter，以及 `site` 和 `base` 配置。

## 可选：启用评论

### 配置评论后端

GitHub Pages 只托管静态页面；评论需要独立的后端。Momo 提供 [Momo Backend](https://github.com/Motues/Momo-Backend)，部署后在 `src/config.ts` 中开启评论并填写后端网址：

```ts
comments: {
  enable: true,
  platform: "default",
  backendUrl: "https://你的评论后端域名"
}
```

### 检查跨域设置

后端必须允许你的博客域名跨域访问。`localhost` 只在运行它的那台电脑上可用，线上访客需要一个公网可访问的地址。Momo 也支持 Twikoo；具体选项以当前版本配置和后端说明为准。[Momo 评论部署指南](https://momo.motues.top/blog/intro/comment/)

## 参考资料

- [Momo GitHub 仓库](https://github.com/Motues/Momo)
- [Astro Themes：Momo](https://astro.build/themes/details/momo/)
- [Momo 配置指南](https://momo.motues.top/blog/intro/config/)
- [Momo 文章发布指南](https://momo.motues.top/blog/intro/publish-blog/)
- [Momo 评论部署指南](https://momo.motues.top/blog/intro/comment/)
- [Momo 更新指南与版本记录](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)
- [Astro 安装文档](https://docs.astro.build/en/install-and-setup/)
- [Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

> 本文的版本与功能说明依据 Momo 26.8.15 更新记录整理，查询日期为 2026-10-04。Momo 和 Astro 都会更新；跟随仓库升级时，请以所用版本的配置文件和更新记录为准。
