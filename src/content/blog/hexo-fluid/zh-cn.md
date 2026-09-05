---
title: "Astro + Momo 搭建个人博客"
pubDate: 2026-09-05
draft: false
description: "从安装 Momo 博客模板、修改站点配置到部署 GitHub Pages，完整记录 Astro 个人博客的搭建过程。"
image: ""
slugId: "astro-momo"
category: "技术"
pinTop: 0
---

## 前言

一直想搭建一个简洁、加载速度快，而且方便长期写作的个人博客。对比了一些静态博客框架后，我最终选择了 Astro，并使用 [Momo](https://github.com/Motues/Momo) 作为博客模板。

Momo 已经准备好了博客常用的页面、样式和功能，因此不需要从零开发 Astro 项目。只需要下载模板、修改个人信息、添加文章，再部署到 GitHub Pages 即可。

这篇文章记录一下完整的搭建和部署过程，也给想使用 Astro 建博客的朋友提供一个参考。

## 为什么选择 Astro？

在开始之前，我对比了几种常见的博客方案：

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| WordPress | 功能强大、插件丰富 | 需要服务器，维护成本较高 |
| Hexo | 主题丰富，中文资料较多 | 依赖主题生态 |
| Hugo | 构建速度快 | 自定义主题需要了解 Go Template |
| Astro | 性能好、开发体验现代 | 需要一定的前端基础 |

最终选择 Astro，主要有以下几个原因：

- 默认生成静态页面，访问速度快
- 支持 Markdown 和内容集合
- 可以按需使用 Svelte、Vue、React 等组件
- 可以免费部署到 GitHub Pages
- 项目结构清晰，后期方便修改

## 为什么选择 Momo？

[Momo](https://github.com/Motues/Momo) 是一个基于 Astro 构建的极简博客模板。

它以黑白为主色调，并使用蓝色作为点缀，整体风格比较简洁。

Momo 已经内置了很多实用功能：

- 深色模式
- 跟随系统主题
- 基于 Pagefind 的文章搜索
- 简体中文和英文切换
- 移动端适配
- 文章分类和目录
- RSS 订阅
- 字数统计和阅读时间
- KaTeX 数学公式
- Typst、Alert 和 GitHub 卡片
- 可选的评论功能
- 本地 CMS 管理后台

需要注意，Momo 更准确地说是一个完整的 Astro 博客模板，而不是安装到现有 Astro 项目中的主题插件。

因此，最简单的使用方式是直接克隆 Momo 项目。

## 环境准备

开始之前，需要安装以下工具：

### Node.js

前往 [Node.js 官网](https://nodejs.org/) 下载并安装 Node.js。

安装完成后，检查版本：

```bash
node -v
npm -v
```

### Git

Git 用于下载项目、管理代码和部署博客。

```bash
git --version
```

### pnpm

Momo 使用 pnpm 管理依赖，可以通过 npm 安装：

```bash
npm install -g pnpm
```

检查是否安装成功：

```bash
pnpm -v
```

## 下载 Momo 模板

打开终端，执行以下命令：

```bash
git clone https://github.com/Motues/Momo.git
cd Momo
pnpm install
```

依赖安装完成后，启动本地开发服务器：

```bash
pnpm dev
```

默认访问地址为：

```text
http://localhost:4321
```

如果能够看到 Momo 的博客首页，说明项目已经成功运行。

## 项目目录结构

Momo 的主要目录如下：

```text
Momo/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 自动部署
├── public/                  # 静态资源和网站图标
├── src/
│   ├── assets/              # 图片资源
│   ├── components/          # 页面组件
│   ├── content/
│   │   ├── blog/            # 博客文章
│   │   └── spec/            # 特殊页面内容
│   ├── i18n/                # 国际化配置
│   ├── layouts/             # 页面布局
│   ├── pages/               # 页面和路由
│   ├── config.ts            # 博客信息配置
│   └── content.config.ts    # 文章字段配置
├── astro.config.mjs         # Astro 主配置
├── package.json             # 项目依赖和命令
└── pnpm-lock.yaml           # 依赖锁定文件
```

平时最常修改的是以下三个位置：

- `astro.config.mjs`：修改网站地址和语言
- `src/config.ts`：修改博客名称、头像和简介
- `src/content/blog/`：存放博客文章

## 修改网站地址

打开根目录中的 `astro.config.mjs`，找到：

```javascript
site: 'https://momo.motues.top',
```

将它改成自己的博客地址：

```javascript
site: 'https://你的用户名.github.io',
```

例如 GitHub 用户名是 `zuige66`：

```javascript
site: 'https://zuige66.github.io',
```

推荐将 GitHub 仓库命名为：

```text
你的用户名.github.io
```

这样博客会直接部署在网站根目录下，一般不需要额外配置 `base`。

如果使用普通项目仓库，例如 `astro-blog`，最终地址通常是：

```text
https://你的用户名.github.io/astro-blog/
```

这种情况下需要在 `astro.config.mjs` 中配置：

```javascript
export default defineConfig({
  site: 'https://你的用户名.github.io',
  base: '/astro-blog',
});
```

不过 Momo 内部可能存在以 `/` 开头的资源或页面链接，因此使用项目子路径部署时，还需要检查链接是否适配。

为了减少问题，建议直接使用 `用户名.github.io` 仓库。

## 修改博客信息

Momo 的主要博客信息位于：

```text
src/config.ts
```

### 网站信息

`siteConfig` 主要包括：

- `title`：网站标题
- `subTitle`：网站副标题
- `favicon`：网站图标
- `pageSize`：每页显示的文章数量
- `toc.enable`：是否启用文章目录
- `toc.depth`：目录显示深度
- `comments.enable`：是否启用评论
- `comments.backendUrl`：评论后端地址

修改时保留原来的对象结构，只替换对应内容，例如：

```typescript
export const siteConfig = {
  title: '我的博客',
  subTitle: '记录学习、技术与生活',

  // 其他字段按照原文件保留
};
```

不同版本的 Momo 配置内容可能有所变化，因此应以当前项目中的 `src/config.ts` 为准，不要直接删除不认识的字段。

### 个人信息

`profileConfig` 主要包括：

- `avatar`：头像
- `name`：昵称
- `description`：个人简介
- `indexpage`：个人主页地址

例如：

```typescript
export const profileConfig = {
  avatar: '/images/avatar.webp',
  name: '你的名字',
  description: '记录技术、学习与生活',
  indexpage: 'https://你的用户名.github.io',
};
```

实际修改时，需要按照原文件已有的字段结构填写。

### 友情链接

`friendLinkConfig` 用于设置友情链接，一般包括：

```typescript
{
  name: '网站名称',
  avatar: '网站头像',
  url: 'https://example.com',
  description: '网站简介',
}
```

### 文章版权

`licenseConfig` 用于设置文章底部的版权协议，包括：

- 是否显示版权信息
- 协议名称
- 协议地址

### 国际化配置

多语言配置位于：

```text
src/i18n/
```

首页封面标题和副标题可以在对应语言文件中修改，主要是：

```text
cover.title
cover.subtitle
```

如果只打算使用中文，也可以根据项目配置关闭不需要的语言。

## 更换头像和网站图标

网站图标可以放在：

```text
public/favicon/
```

头像则按照 `src/config.ts` 中原有的路径进行替换。

替换图片时需要注意：

- 建议使用 WebP、PNG 或 SVG
- 文件名建议使用英文和短横线
- 修改文件名后要同步修改配置路径
- 浏览器可能缓存旧图标，可以强制刷新页面

修改完成后，重新启动项目：

```bash
pnpm dev
```

确认网站标题、头像、简介和图标都能正常显示。

## 写第一篇文章

Momo 的博客文章存放在：

```text
src/content/blog/
```

### 使用命令创建文章

Momo 提供了新建文章命令：

```bash
pnpm newpost docs/hello-world.md zh-cn
```

其中：

- `docs/hello-world.md` 是文章相对路径
- `zh-cn` 是文章语言
- 语言参数可以省略，默认为 `zh-cn`

也可以执行：

```bash
pnpm newpost docs/hello-world.md
```

### 手动创建文章

也可以直接在 `src/content/blog/` 中新建 Markdown 文件：

```text
src/content/blog/docs/hello-world.md
```

### 文章格式

每篇文章开头都要包含 Front Matter：

```markdown
---
title: "我的第一篇文章"
pubDate: 2026-09-05
draft: false
description: "这是我的第一篇 Astro 博客文章。"
image: ""
slugId: "hello-world"
category: "技术"
pinTop: 0
---

## 前言

这里是文章正文，使用 Markdown 语法编写。
```

各字段作用如下：

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `pubDate` | 是 | 文章发布时间 |
| `draft` | 否 | 是否为草稿 |
| `description` | 否 | 文章简介 |
| `image` | 否 | 文章封面 |
| `slugId` | 是 | 文章唯一标识 |
| `category` | 否 | 文章分类 |
| `pinTop` | 否 | 文章置顶顺序 |

`slugId` 必须保持唯一，建议使用小写英文和短横线：

```yaml
slugId: "astro-momo"
```

## 本地构建检查

完成配置和文章修改后，执行：

```bash
pnpm build
```

构建成功后，生成的网站文件会放在：

```text
dist/
```

然后预览正式构建结果：

```bash
pnpm preview
```

部署前建议检查：

- 首页是否能正常打开
- 文章是否正常显示
- 图片和头像是否正常加载
- 深色模式是否正常
- 搜索功能是否正常
- 手机端布局是否正常
- 终端是否出现构建错误

## 部署到 GitHub Pages

Momo 已经包含：

```text
.github/workflows/deploy.yml
```

因此不需要手动编写 GitHub Actions，只需要把项目推送到自己的 GitHub 仓库。

### 1. 创建 GitHub 仓库

在 GitHub 新建一个仓库，推荐命名为：

```text
你的用户名.github.io
```

例如：

```text
zuige66.github.io
```

创建仓库时不需要额外添加 README、`.gitignore` 或许可证。

### 2. 修改远程仓库

因为项目是从 Momo 官方仓库克隆的，所以需要删除原来的远程地址：

```bash
git remote remove origin
```

然后添加自己的仓库。

使用 SSH：

```bash
git remote add origin git@github.com:你的用户名/你的用户名.github.io.git
```

使用 HTTPS：

```bash
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
```

检查远程仓库：

```bash
git remote -v
```

### 3. 提交代码

```bash
git add .
git commit -m "初始化 Astro Momo 博客"
git branch -M main
git push -u origin main
```

注意不要删除 `pnpm-lock.yaml`，并且要将它一起提交到 GitHub。

### 4. 开启 GitHub Pages

进入 GitHub 仓库，然后依次打开：

```text
Settings → Pages → Build and deployment → Source
```

将部署来源设置为：

```text
GitHub Actions
```

### 5. 查看部署状态

进入仓库的 `Actions` 页面，可以看到：

```text
Deploy to GitHub Pages
```

Momo 自带的工作流会自动完成：

1. 下载项目代码
2. 安装 pnpm
3. 安装 Node.js
4. 执行 `pnpm install`
5. 执行 `pnpm build`
6. 上传 `dist/`
7. 发布到 GitHub Pages

工作流显示绿色对勾后，就可以访问：

```text
https://你的用户名.github.io
```

以后每次向 `main` 分支推送代码，GitHub Actions 都会自动更新网站。

## Momo 自带的部署代码

如果项目中的 `.github/workflows/deploy.yml` 被删除，可以重新创建这个文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Upload
        uses: actions/upload-pages-artifact@v3
        with:
          path: "dist"

  deploy:
    needs: build
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

## 使用自定义域名

如果已经购买域名，可以在 `public/` 中新建：

```text
CNAME
```

文件内容只填写自己的域名：

```text
blog.example.com
```

然后将 `astro.config.mjs` 中的 `site` 改成：

```javascript
site: 'https://blog.example.com',
```

接着在域名服务商处配置 DNS，并在 GitHub Pages 设置中填写自定义域名。

使用自定义域名并部署在根路径时，一般不需要配置 `base`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建正式版本 |
| `pnpm preview` | 预览构建后的版本 |
| `pnpm astro ...` | 执行 Astro CLI 命令 |
| `pnpm newpost <path> <lang>` | 创建新文章 |
| `pnpm cms` | 启动本地 CMS |

## 日常发布文章

以后发布新文章时，只需要执行：

```bash
# 创建文章
pnpm newpost docs/文章文件名.md zh-cn

# 本地预览
pnpm dev

# 构建检查
pnpm build

# 提交并推送
git add .
git commit -m "发布新文章"
git push
```

代码推送到 `main` 分支后，GitHub Actions 会自动完成部署。

## 常见问题

### pnpm 命令不存在

重新安装 pnpm：

```bash
npm install -g pnpm
```

安装后关闭并重新打开终端，再检查版本：

```bash
pnpm -v
```

### GitHub Actions 构建失败

先在本地执行：

```bash
pnpm install
pnpm build
```

如果本地也构建失败，先解决终端中的错误。

如果本地正常，再检查：

- `pnpm-lock.yaml` 是否已经提交
- GitHub Actions 日志中的具体报错
- 配置文件是否存在语法错误
- 图片路径是否正确
- Front Matter 字段是否符合规范

### 部署成功但页面空白

重点检查 `astro.config.mjs` 中的 `site`。

如果使用普通项目仓库，还需要检查：

```javascript
base: '/仓库名称',
```

以及项目中的图片、页面和内部链接是否支持子路径。

### 修改后网页没有变化

检查以下内容：

1. 代码是否已经推送到 `main`
2. GitHub Actions 是否执行成功
3. 修改的文章是否设置了 `draft: false`
4. 浏览器是否缓存了旧页面

可以尝试强制刷新浏览器。

### 搜索功能在开发环境中不完整

Momo 使用 Pagefind 生成搜索索引，搜索功能通常需要先进行正式构建。

执行：

```bash
pnpm build
pnpm preview
```

然后再测试搜索功能。

## 总结

整个搭建流程可以概括为：

1. 安装 Node.js、Git 和 pnpm
2. 克隆 Momo 模板
3. 安装项目依赖
4. 修改 `astro.config.mjs`
5. 修改 `src/config.ts`
6. 在 `src/content/blog/` 中编写文章
7. 执行 `pnpm build` 检查项目
8. 推送到 GitHub
9. 使用 GitHub Actions 部署到 GitHub Pages

Astro + Momo 的部署成本比较低，网站的配置和文章也都保存在 Git 仓库中，方便备份和管理。

博客搭建完成以后，日常需要做的事情就只剩下写文章、提交代码和推送更新了。

## 参考资料

- [Momo GitHub 仓库](https://github.com/Motues/Momo)
- [Momo 配置指南](https://github.com/Motues/Momo/blob/main/doc/config_zh-cn.md)
- [Astro 官方文档](https://docs.astro.build/)
- [Astro 部署到 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)