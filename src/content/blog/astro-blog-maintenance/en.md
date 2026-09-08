---
title: "Astro Blog Command Handbook: Writing, Building, and Publishing"
pubDate: 2026-09-08
draft: false
description: A command-focused guide for creating posts, previewing locally, building for production, committing with Git, deploying to GitHub Pages, and rolling back changes.
image: ""
slugId: astro-blog-maintenance
category: Technology
pinTop: 0
---

This is a practical command handbook for this Astro blog. The examples use Windows PowerShell, and the project directory is `D:\Workplace\astro`.

## Enter the project

```powershell
cd D:\Workplace\astro
Get-Location
git status
```

## Install dependencies

```powershell
npm.cmd install --legacy-peer-deps
npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0
```

If installation fails, stop Node processes and reinstall:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item .\node_modules -Recurse -Force
npm.cmd install --legacy-peer-deps
```

The verified core versions are Astro 6.4.8, Vite 7.3.6, `@astrojs/svelte` 8.1.2, and Tailwind 4.1.13.

## Create a post

Create a directory and both language files:

```powershell
New-Item -ItemType Directory .\src\content\blog\my-post
New-Item .\src\content\blog\my-post\zh-cn.md
New-Item .\src\content\blog\my-post\en.md
```

You can also run:

```powershell
npm.cmd run newpost
```

Both language files must use the same `slugId`. Quote titles or descriptions containing a colon, otherwise Astro may report `bad indentation of a mapping entry`.

## Preview locally

```powershell
npm.cmd run dev
```

The page reloads when an article changes. Stop the server with `Ctrl + C`. To use another port:

```powershell
npm.cmd run dev -- --port 4321
```

## Build for production

```powershell
npm.cmd run build
```

This runs `astro build` and then `pagefind --site dist`. `Build complete!` and `Finished`, without `[ERROR]`, indicate success.

Clean old output and preview the production build:

```powershell
Remove-Item .\dist -Recurse -Force -ErrorAction SilentlyContinue
npm.cmd run preview
```

## Publish to GitHub

Astro posts are not uploaded as separate Markdown files. Push the source files with Git, and GitHub Actions builds and publishes the site.

Publish one post:

```powershell
git add .\src\content\blog\my-post
git commit -m "Add post my-post"
git push origin main
```

Publish all changes:

```powershell
git add .
git commit -m "Update blog"
git push origin main
```

Do not upload `dist` manually. Check the repository's **Actions** page after pushing.

## Inspect and roll back

```powershell
git status
git diff
git log --oneline -10
git remote -v
```

Revert the latest commit and publish the rollback:

```powershell
git revert HEAD
git push origin main
```

## Comment backend with Docker

```powershell
docker ps
docker ps -a
docker start momo-backend
docker stop momo-backend
docker restart momo-backend
```

Read logs and inspect the data volume:

```powershell
docker logs momo-backend
docker logs -f momo-backend
docker volume inspect momo-data
```

GitHub Pages cannot access `localhost:3000`. Online comments require a public HTTPS backend URL and a matching CORS origin. Back up `momo-data` before upgrading the backend image.

## Complete release flow

```powershell
cd D:\Workplace\astro
npm.cmd run dev
npm.cmd run build
git add .
git commit -m "Update blog"
git push origin main
```

The post is online after the local build, remote Build job, and Deploy job all succeed.
