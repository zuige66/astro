---
title: 从零搭建 Astro + Momo 个人博客：配置、写作与 GitHub Pages 部署
pubDate: 2026-09-08
draft: false
description: 使用开源 Astro 主题 Momo 搭建个人博客的完整教程，涵盖环境准备、站点配置、文章发布、GitHub Pages 部署和常见问题。
image: ""
slugId: astro-momo-blog-guide
category: 技术
pinTop: 0
---

想拥有一个加载快、界面干净，又不需要维护数据库的个人博客，可以试试 **Astro + Momo**：Astro 负责把页面构建成静态文件，Momo 则提供现成的博客界面、文章系统和常用功能。

Momo 是 Motues 开源的极简 Astro 博客模板，已集成明暗主题、响应式布局、Pagefind 全文搜索、RSS、SEO，以及数学公式和提示框等 Markdown 扩展。项目可以免费使用，源代码托管在 GitHub。[来源：Astro Themes 的 Momo 项目页](https://astro.build/themes/details/momo/)、[Motues/Momo 仓库](https://github.com/Motues/Momo)

这篇教程会从一个空文件夹开始，最终把博客发布到 `https://你的用户名.github.io/仓库名/`。文中的目录和配置项以 **Momo 26.8.15** 为基准；该版本已经升级到 Astro 7，要求 Node.js 不低于 22，作者建议使用 Node.js 24 LTS。[来源：Momo 更新指南](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)

这里的版本说明指上游模板。本博客的本地分支已调整过依赖，当前使用 Astro 6.4.8；新建站点时应跟随下载版本的依赖和锁文件，不要直接混用两个版本的配置。本教程的全文构建验证在当前环境中因子进程权限错误 `spawn EPERM` 未能完成。

## 一、准备开发环境

先安装以下工具：

- [Git](https://git-scm.com/)，用于下载代码和提交版本；
- [Node.js](https://nodejs.org/)，建议选择 24 LTS；
- [pnpm](https://pnpm.io/)，Momo 官方示例使用的包管理器；
- 任意代码编辑器，例如 VS Code。

在终端中检查版本：

```bash
git --version
node --version
pnpm --version
```

如果系统还没有 pnpm，可以执行：

```bash
npm install --global pnpm
```

Astro 应安装在项目内，而不是全局安装；使用模板时也可以通过 `create astro --template` 直接从 GitHub 仓库初始化。[来源：Astro 安装文档](https://docs.astro.build/en/install-and-setup/)

## 二、下载并运行 Momo

将 Momo 克隆到本地，并安装依赖：

```bash
git clone https://github.com/Motues/Momo.git my-blog
cd my-blog
pnpm install
pnpm dev
```

浏览器打开终端提示的地址，通常是 `http://localhost:4321`。看到 Momo 首页，就说明开发环境已经正常运行。这组启动命令来自主题官方介绍。[来源：Astro Themes 的 Momo 项目页](https://astro.build/themes/details/momo/)

此时建议把原作者仓库保留为 `upstream`，再绑定到自己的 GitHub 仓库：

```bash
git remote rename origin upstream
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

这样 `origin` 用来发布自己的博客，`upstream` 用来获取 Momo 的后续更新。执行前，需要先在 GitHub 创建一个空仓库；不要勾选自动生成 README，以免第一次推送产生无关冲突。

## 三、认识项目结构

日常使用主要会接触这些文件：

```text
my-blog/
├─ public/                 # 头像、favicon 等原样复制的静态文件
├─ src/
│  ├─ assets/             # 由 Astro 处理和优化的资源
│  ├─ content/blog/       # 博客文章
│  ├─ content/spec/       # 关于页、友链页等特殊页面
│  ├─ i18n/               # 多语言界面文字
│  └─ config.ts           # 标题、个人资料、评论、主题等配置
├─ astro.config.mjs       # 域名、路径、语言和 Markdown 配置
├─ package.json           # 依赖与运行命令
└─ .github/workflows/     # GitHub Actions 部署流程
```

Momo 作者也将 `astro.config.mjs`、`src/config.ts`、`src/content.config.ts` 和 `src/i18n/` 视为需要重点维护的配置；文章和图片主要保存在 `src/content/`、`src/assets/` 与 `public/`。[来源：Momo 更新指南](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)

## 四、修改网站信息

### 1. 配置网址和仓库路径

打开 `astro.config.mjs`。如果博客发布到普通项目仓库，例如仓库名为 `my-blog`，配置应类似：

```js
export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/my-blog',
  // 其余配置保持不变
})
```

这里有两个容易混淆的值：

- `site` 是网站的协议和域名，不包含仓库路径；
- `base` 是以 `/` 开头的仓库名。

如果仓库恰好叫 `你的用户名.github.io`，网站直接发布在域名根目录，应删除 `base`。如果以后改用独立域名，同样要把 `site` 改成新域名并移除 `base`。这是 Astro 官方针对 GitHub Pages 的配置要求。[来源：Astro 的 GitHub Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)

### 2. 修改博客标题和个人资料

打开 `src/config.ts`，按自己的信息修改 `siteConfig` 与 `profileConfig`：

```ts
export const siteConfig = {
  title: "小明的博客",
  subTitle: "记录技术、阅读与生活",
  favicon: "avatar.png",
  pageSize: 10,
  toc: {
    enable: true,
    depth: 3
  },
  blogNavi: {
    enable: true
  },
  comments: {
    enable: false,
    platform: "default",
    backendUrl: ""
  },
  // theme 等其余字段保留原项目结构
}

export const profileConfig = {
  avatar: "/avatar.png",
  name: "小明",
  description: "一名喜欢折腾 Web 的开发者",
  indexPage: "https://你的用户名.github.io/my-blog",
  startYear: 2026
}
```

把头像文件放到 `public/avatar.png`。`src/config.ts` 还可以配置文章目录、底部导航、评论、动效、图片占位、灯箱、文章卡片样式、版权协议和友链。[来源：Momo 配置指南](https://momo.motues.top/blog/intro/config/)

不要整段照抄上面的对象去覆盖新版文件，因为 Momo 更新时可能增加字段。更稳妥的做法是保留原文件结构，只替换对应的值。

### 3. 修改首页文案与语言

首页封面文字位于 `src/i18n/language/` 下对应的语言文件中，修改其中的 `cover.title` 与 `cover.subtitle` 即可。支持的语言与默认语言由 `astro.config.mjs` 的 `i18n.locales` 和 `i18n.defaultLocale` 决定。[来源：Momo 配置指南](https://momo.motues.top/blog/intro/config/)

只写中文博客时，可以保留 `zh-cn` 为默认语言；若启用英文，则为每篇文章增加 `en.md`。删减语言前先全站构建一次，检查导航、归档与链接是否仍然正常。

## 五、发布第一篇文章

在 `src/content/blog/` 下为文章创建单独文件夹：

```text
src/content/blog/my-first-post/
└─ zh-cn.md
```

`zh-cn.md` 的完整示例：

```markdown
---
title: 我的第一篇文章
pubDate: 2026-09-08
description: 记录第一次使用 Momo 搭建博客的过程。
category: 随笔
image: ""
draft: false
slugId: my-first-post
pinTop: 0
---

## 你好，Momo

这里开始写正文。
```

各字段的作用如下：

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `pubDate` | 是 | 发布日期，格式为 `YYYY-MM-DD` |
| `description` | 否 | 摘要，建议认真填写以改善列表展示和 SEO |
| `category` | 否 | 文章分类，缺省时归入未分类 |
| `image` | 否 | 封面图；本地图片使用相对当前 Markdown 文件的路径 |
| `draft` | 否 | `true` 表示草稿，发布时不会显示 |
| `slugId` | 是 | 文章唯一 ID，建议与文章目录路径一致，用于评论关联等功能 |
| `pinTop` | 否 | 小于 1 不置顶，数字越大排序越靠前 |

同一篇文章的多语言版本放在同一个文件夹，例如 `zh-cn.md` 和 `en.md`，并使用相同的 `slugId`。默认语言版本不能缺失；启用的语言必须先写入 `astro.config.mjs`。这些目录约定和 frontmatter 字段来自 Momo 官方的文章发布说明。[来源：Momo 文章发布指南](https://momo.motues.top/blog/intro/publish-blog/)

本博客当前代码按文章文件夹生成页面路径；只修改 `slugId` 不会改变网址。首次搭建时让目录名和 `slugId` 保持一致，发布后尽量保持稳定。

写完后，本地检查：

```bash
pnpm build
pnpm preview
```

`pnpm build` 会生成生产文件并建立 Pagefind 搜索索引，`pnpm preview` 用来预览最终产物。开发模式下搜索结果不完整并不一定是故障，应以生产构建后的预览为准。

## 六、部署到 GitHub Pages

先检查 `.github/workflows/` 下是否已有 GitHub Pages 部署流程；如果没有，按 [Astro 官方部署指南](https://docs.astro.build/en/guides/deploy/github/) 创建 `.github/workflows/deploy.yml`。工作流应使用与本地一致的 Node.js 和包管理器，并执行 `pnpm build`、上传 `dist/`、部署到 Pages。本文采用 pnpm，请提交生成的 `pnpm-lock.yaml`；如果已有工作流使用 npm，应先统一安装与构建命令，不能只改本地命令。

在 GitHub 仓库中打开 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。确认本地构建通过后，检查本次改动并提交：

```bash
git status
git add .
git commit -m "初始化 Momo 博客"
git push -u origin main
```

回到 **Actions** 页面等待构建和部署完成，网站就会出现在：

```text
https://你的用户名.github.io/你的仓库名/
```

Astro 官方推荐使用 GitHub Actions 部署静态、预渲染的网站，并提醒将包管理器对应的锁文件一并提交，以确保云端安装出相同的依赖。[来源：Astro 的 GitHub Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)

如果 Actions 构建失败，先不要反复推送。请在本地运行 `pnpm build`，优先检查 Node.js 版本、依赖锁文件、frontmatter 字段，以及 `site`、`base` 是否写对。

## 七、可选：开启评论

博客页面部署在 GitHub Pages 后仍然是纯静态网站，评论功能需要一个可公开访问的后端。Momo 提供独立的 [Momo Backend](https://github.com/Motues/Momo-Backend)，后端部署完成后，在 `src/config.ts` 中开启评论并填写地址：

```ts
comments: {
  enable: true,
  platform: "default",
  backendUrl: "https://你的评论后端域名"
}
```

后端需要正确允许博客域名跨域访问。不要把只在自己电脑上可访问的 `localhost` 地址填到线上配置中，否则访客无法发表评论。Momo 也支持 Twikoo；选择哪个平台，应以当前版本的 `src/config.ts` 和后端文档为准。[来源：Momo 评论部署指南](https://momo.motues.top/blog/intro/comment/)、[Momo Backend 仓库](https://github.com/Motues/Momo-Backend)

## 八、常见问题

### 页面样式正常，但图片或链接 404

项目仓库部署通常缺少或写错了 `base`。确认它等于仓库名，并以 `/` 开头；同时避免在自定义组件中写死不带 `base` 的站内绝对路径。[来源：Astro 的 GitHub Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)

### 文章没有出现在首页

检查 `draft` 是否仍为 `true`、文件名是否为默认语言（例如 `zh-cn.md`）、frontmatter 是否包含 `title`、`pubDate` 和唯一的 `slugId`，然后重新运行 `pnpm build`。[来源：Momo 文章发布指南](https://momo.motues.top/blog/intro/publish-blog/)

### 升级 Momo 后突然无法构建

先比较 `package.json` 中的 Momo 版本并阅读更新记录。版本号变化往往意味着配置结构改变，不能只覆盖组件代码；重点核对 `astro.config.mjs`、`src/config.ts`、`src/content.config.ts` 与 `src/i18n/`。从 Astro 5 升级到 Astro 7 时还需要 Node.js 22 或更高版本，并应清理旧的依赖缓存后重新安装。[来源：Momo 更新指南](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)

## 结语

到这里，一个具备文章分类、多语言、全文搜索、明暗主题、RSS 和 SEO 基础能力的个人博客就完成了。后续真正值得投入时间的，不是不断更换主题，而是建立简单稳定的写作流程：新建文章、填写元数据、本地构建、提交推送。

## 参考资料

1. [Momo GitHub 仓库](https://github.com/Motues/Momo)
2. [Astro Themes：Momo](https://astro.build/themes/details/momo/)
3. [Momo 配置指南](https://momo.motues.top/blog/intro/config/)
4. [Momo 文章发布指南](https://momo.motues.top/blog/intro/publish-blog/)
5. [Momo 评论部署指南](https://momo.motues.top/blog/intro/comment/)
6. [Momo 更新指南与版本记录](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)
7. [Astro 安装文档](https://docs.astro.build/en/install-and-setup/)
8. [Astro：部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

> 本文依据以上项目文档整理，查询日期为 2026-09-08。开源项目会持续更新；实际操作时，请同时检查 Momo 仓库的最新 README、Release 与配置文件。
