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

## 1. Enter the project

Run `cd D:\Workplace\astro` to enter the project. Use `Get-Location` for the current directory and `git status` for Git changes.

## 2. Install dependencies

For a fresh checkout or after removing dependencies, run `npm.cmd install --legacy-peer-deps`. Inspect versions with `npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0`.

The verified core versions are Astro 6.4.8, Vite 7.3.6, `@astrojs/svelte` 8.1.2, and Tailwind 4.1.13. Avoid mixing major versions.

If installation fails, stop Node with `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`, remove dependencies with `Remove-Item .\node_modules -Recurse -Force`, and run `npm.cmd install --legacy-peer-deps` again.

## 3. Create a post

Create a directory and both language files with `New-Item -ItemType Directory .\src\content\blog\my-post`, `New-Item .\src\content\blog\my-post\zh-cn.md`, and `New-Item .\src\content\blog\my-post\en.md`.

You can also run `npm.cmd run newpost` to use the project script. Both language files must use the same `slugId`. Quote titles or descriptions containing a colon, otherwise Astro may report `bad indentation of a mapping entry`.

## 4. Preview locally

Run `npm.cmd run dev` to start the development server. Stop it with `Ctrl + C`. To use another port, run `npm.cmd run dev -- --port 4321`.

## 5. Build for production

Run `npm.cmd run build`. This executes `astro build` and then `pagefind --site dist`, generating the static site and search index. `Build complete!` and `Finished`, without `[ERROR]`, indicate success.

Remove old output with `Remove-Item .\dist -Recurse -Force -ErrorAction SilentlyContinue`. Preview the production output with `npm.cmd run preview`.

## 6. Publish to GitHub

Astro posts are not uploaded as separate Markdown files. Push the source files with Git, and GitHub Actions builds and publishes the site.

Review changes with `git status` and `git diff`. To publish one post, run `git add .\src\content\blog\my-post`, `git commit -m "Add post my-post"`, and `git push origin main`.

To publish all changes, run `git add .`, `git commit -m "Update blog"`, and `git push origin main`. Do not upload `dist` manually; the workflow rebuilds it on the server.

## 7. Inspect commits and roll back

Use `git log --oneline -10` to inspect commits, `git remote -v` to inspect the remote, and `git branch --show-current` to inspect the current branch.

Revert the latest push with `git revert HEAD` followed by `git push origin main`. Revert a specific commit with `git revert <commit-id>`. Avoid `git reset --hard` because it can remove local changes.

## 8. Comment backend commands

Use `docker ps` for running containers and `docker ps -a` for all containers. Start, stop, and restart the backend with `docker start momo-backend`, `docker stop momo-backend`, and `docker restart momo-backend`.

Read logs with `docker logs momo-backend` or `docker logs -f momo-backend`. Inspect the data volume with `docker volume inspect momo-data`.

GitHub Pages cannot access `localhost:3000`. Online comments require a public HTTPS backend URL and a matching CORS origin. Back up `momo-data` before upgrading the image.

## 9. Complete release sequence

Run `cd D:\Workplace\astro`, `npm.cmd run dev` (check the site, then press `Ctrl + C`), `npm.cmd run build`, `git status`, `git add .`, `git commit -m "Update blog"`, and `git push origin main`.

Then check GitHub **Actions**. A post is fully published only after the local build, remote Build job, and Deploy job all succeed.
