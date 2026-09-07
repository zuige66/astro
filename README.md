# zuige's blog

这是一个基于 [Astro](https://astro.build/) 构建的个人博客，记录技术、学习与生活。目前部署在 [GitHub Pages](https://zuige66.github.io/astro/)。

## 功能

- 响应式博客页面，支持桌面端和移动端
- 中英文双语切换
- 明暗主题切换
- 本地文章搜索、归档、目录和 RSS
- Markdown、KaTeX、Typst、代码高亮和 GitHub 卡片
- 使用 `public/zuige.png` 作为网站头像和 favicon
- Momo 评论系统前端组件

## 本地运行

要求：Node.js 22 或更高版本。

```powershell
npm.cmd install
npm.cmd run dev
```

启动后访问 `http://localhost:4321`。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm.cmd run dev` | 启动开发服务器 |
| `npm.cmd run build` | 构建生产版本到 `dist/` |
| `npm.cmd run preview` | 预览生产构建结果 |
| `npm.cmd run newpost` | 创建新文章 |
| `npm.cmd run cms` | 启动本地 CMS |

## 修改内容

- 博客基本信息：`src/config.ts`
- 头像和 favicon：`public/zuige.png`
- 个人资料：`src/config.ts` 中的 `profileConfig`
- 关于页中文正文：`src/content/spec/about/zh-cn.md`
- 关于页英文正文：`src/content/spec/about/en.md`
- 中文界面文字：`src/i18n/language/zh-cn.ts`
- 英文界面文字：`src/i18n/language/en.ts`
- 博客文章：`src/content/blog/`

## 评论系统

评论前端已经集成。若在本机运行 Momo Backend，可以启动 Docker 容器：

```powershell
docker start momo-backend
```

本地测试时，将 `src/config.ts` 中的 `backendUrl` 设置为：

```ts
backendUrl: "http://localhost:3000"
```

然后同时运行博客和后端。本地评论数据保存在 Docker 的 `momo-data` 数据卷中。

GitHub Pages 是静态网站，线上评论需要一个公网可访问的 Momo Backend 地址，并将该地址填入 `backendUrl`。仅运行本机 Docker 后端无法让线上访客提交评论。

后端项目和部署文档：[Motues/Momo-Backend](https://github.com/Motues/Momo-Backend)

## 部署到 GitHub Pages

项目已配置 GitHub Actions。将代码推送到 `main` 分支后，工作流会自动构建并部署网站：

```bash
git add .
git commit -m "update blog"
git push origin main
```

首次使用时，在 GitHub 仓库的 **Settings → Pages** 中将发布来源设置为 **GitHub Actions**。

## 项目结构

```text
public/                 静态资源
src/components/         页面组件
src/content/blog/       博客文章
src/content/spec/       关于页、友链页等固定页面内容
src/i18n/               多语言文字
src/pages/              页面路由
src/config.ts           网站配置
.github/workflows/      GitHub Pages 部署流程
```
