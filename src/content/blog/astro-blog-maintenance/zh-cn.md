---
title: "Astro 博客运维命令手册：写作、编译与发布"
pubDate: 2026-09-08
draft: false
description: 整理 Astro 博客日常使用的命令，包括创建文章、本地预览、生产编译、Git 提交、GitHub Pages 发布和回滚。
image: ""
slugId: astro-blog-maintenance
category: 技术
pinTop: 0
---

这是一份面向 Windows PowerShell 的 Astro 博客命令手册，项目目录为 `D:\Workplace\astro`。

## 进入项目

```powershell
cd D:\Workplace\astro
Get-Location
git status
```

## 安装依赖

```powershell
npm.cmd install --legacy-peer-deps
npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0
```

如果安装失败，先关闭 Node 进程并重装：

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item .\node_modules -Recurse -Force
npm.cmd install --legacy-peer-deps
```

当前验证过的核心版本是 Astro 6.4.8、Vite 7.3.6、`@astrojs/svelte` 8.1.2 和 Tailwind 4.1.13。

## 创建文章

```powershell
New-Item -ItemType Directory .\src\content\blog\my-post
New-Item .\src\content\blog\my-post\zh-cn.md
New-Item .\src\content\blog\my-post\en.md
```

也可以使用项目脚本：

```powershell
npm.cmd run newpost
```

中英文文件的 `slugId` 必须一致。标题或描述中有冒号时要加引号，否则会出现 `bad indentation of a mapping entry`。

## 本地预览

```powershell
npm.cmd run dev
```

修改文章后页面会自动刷新，按 `Ctrl + C` 停止服务。指定端口：

```powershell
npm.cmd run dev -- --port 4321
```

## 生产编译

```powershell
npm.cmd run build
```

这个命令会执行 `astro build`，再执行 `pagefind --site dist`。看到 `Build complete!` 和 `Finished`，且没有 `[ERROR]`，说明编译成功。

清理旧产物并预览生产版本：

```powershell
Remove-Item .\dist -Recurse -Force -ErrorAction SilentlyContinue
npm.cmd run preview
```

## 上传文章

Astro 不是单独上传 Markdown 文件，而是推送源代码，让 GitHub Actions 自动编译和部署。

只上传一篇文章：

```powershell
git add .\src\content\blog\my-post
git commit -m "新增文章 my-post"
git push origin main
```

上传全部修改：

```powershell
git add .
git commit -m "更新博客"
git push origin main
```

不要手动上传 `dist`。推送后到 GitHub 仓库的 **Actions** 页面查看 Build 和 Deploy。

## 查看与回滚

```powershell
git status
git diff
git log --oneline -10
git remote -v
```

撤销最近一次提交并发布回滚：

```powershell
git revert HEAD
git push origin main
```

## 评论后端 Docker

```powershell
docker ps
docker ps -a
docker start momo-backend
docker stop momo-backend
docker restart momo-backend
```

查看日志和数据卷：

```powershell
docker logs momo-backend
docker logs -f momo-backend
docker volume inspect momo-data
```

GitHub Pages 不能访问 `localhost:3000`。线上评论必须使用公网 HTTPS 地址，并设置正确的 CORS 来源。升级后端镜像前先备份 `momo-data`。

## 完整发布流程

```powershell
cd D:\Workplace\astro
npm.cmd run dev
npm.cmd run build
git add .
git commit -m "更新博客"
git push origin main
```

本地编译成功、远程 Build 成功、Deploy 成功后，文章才会正式上线。
