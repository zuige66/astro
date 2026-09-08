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

这篇文章主要记录这个 Astro 博客最常用的命令。默认在 Windows PowerShell 中执行，项目目录是 `D:\Workplace\astro`。

## 1. 进入项目

执行 `cd D:\Workplace\astro` 进入项目。使用 `Get-Location` 查看当前目录，使用 `git status` 查看 Git 改动。

## 2. 安装依赖

第一次下载项目或删除依赖后，执行 `npm.cmd install --legacy-peer-deps`。使用 `npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0` 查看实际版本。

当前验证过的核心版本是 Astro 6.4.8、Vite 7.3.6、`@astrojs/svelte` 8.1.2 和 Tailwind 4.1.13，不要随意混用大版本。

安装失败时，先执行 `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`，再执行 `Remove-Item .\node_modules -Recurse -Force` 和 `npm.cmd install --legacy-peer-deps`。

## 3. 创建文章

手动创建文章目录和双语文件：`New-Item -ItemType Directory .\src\content\blog\my-post`、`New-Item .\src\content\blog\my-post\zh-cn.md`、`New-Item .\src\content\blog\my-post\en.md`。

也可以执行 `npm.cmd run newpost` 使用项目脚本。中英文文件的 `slugId` 必须一致。如果标题或描述中有冒号，要用引号包住，否则会出现 `bad indentation of a mapping entry`。

## 4. 本地预览

执行 `npm.cmd run dev` 启动开发服务器，修改文章后页面会自动刷新。按 `Ctrl + C` 停止服务。指定端口可以执行 `npm.cmd run dev -- --port 4321`。

## 5. 编译生产版本

执行 `npm.cmd run build`。这个命令会先执行 `astro build`，再执行 `pagefind --site dist`，生成静态网站和搜索索引。看到 `Build complete!` 和 `Finished`，并且没有 `[ERROR]`，才算成功。

清理旧构建产物可以执行 `Remove-Item .\dist -Recurse -Force -ErrorAction SilentlyContinue`。本地查看生产结果可以执行 `npm.cmd run preview`。

## 6. 上传文章到 GitHub

Astro 不是单独上传 Markdown 文件，而是通过 Git 推送源代码，再由 GitHub Actions 自动编译。

查看改动使用 `git status` 和 `git diff`。只提交一篇文章使用 `git add .\src\content\blog\my-post`，然后执行 `git commit -m "新增文章 my-post"` 和 `git push origin main`。

提交全部改动使用 `git add .`、`git commit -m "更新博客"` 和 `git push origin main`。不要手动上传 `dist`，工作流会在服务器上重新编译。

## 7. 查看提交和回滚

使用 `git log --oneline -10` 查看提交，使用 `git remote -v` 查看远程仓库，使用 `git branch --show-current` 查看当前分支。

撤销最近一次推送使用 `git revert HEAD`，然后执行 `git push origin main`。撤销指定提交使用 `git revert <commit-id>`。不要随便使用 `git reset --hard`，它可能删除本地修改。

## 8. 评论后端命令

使用 `docker ps` 查看运行中的容器，使用 `docker ps -a` 查看所有容器。启动、停止和重启分别使用 `docker start momo-backend`、`docker stop momo-backend` 和 `docker restart momo-backend`。

使用 `docker logs momo-backend` 查看日志，使用 `docker logs -f momo-backend` 持续查看日志，使用 `docker volume inspect momo-data` 查看数据卷。

GitHub Pages 不能访问 `localhost:3000`。线上评论必须配置后端公网 HTTPS 地址，并设置正确的 CORS 来源。升级镜像前要备份 `momo-data`，不能随意删除这个数据卷。

## 9. 完整发布流程

依次执行：`cd D:\Workplace\astro`、`npm.cmd run dev`（检查后按 `Ctrl + C` 停止）、`npm.cmd run build`、`git status`、`git add .`、`git commit -m "更新博客"`、`git push origin main`。

推送后到 GitHub 仓库的 **Actions** 页面查看 Build 和 Deploy。只有本地编译成功、远程 Build 成功、Deploy 成功，文章才算正式上线。
