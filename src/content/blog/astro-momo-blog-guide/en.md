---
title: "Build an Astro + Momo Blog from Scratch: Configuration, Writing, and GitHub Pages"
pubDate: 2026-09-08
draft: false
description: A complete guide to building an Astro blog with the open-source Momo theme, writing posts, deploying to GitHub Pages, and enabling comments.
image: ""
slugId: astro-momo-blog-guide
category: Technology
pinTop: 0
---

Want a fast, clean personal blog without maintaining a database? Astro + Momo is a practical choice: Astro generates static pages, while Momo provides the blog layout, content system, themes, search, RSS, SEO, and Markdown extensions.

This guide starts with an empty folder and ends with a site published at `https://your-name.github.io/repository-name/`. The examples follow the Momo 26.8.15 structure. This blog’s own dependency versions have been adjusted, so always follow the `package.json` and lock file in the project you actually download.

## 1. Prepare the environment

Install Git, Node.js, pnpm, and an editor such as VS Code. Check the tools with:

```powershell
git --version
node --version
pnpm --version
```

If pnpm is missing, install it with `npm install --global pnpm`. Astro should be installed inside the project rather than globally.

## 2. Download and run Momo

Clone the theme and install its dependencies:

```powershell
git clone https://github.com/Motues/Momo.git my-blog
cd my-blog
pnpm install
pnpm dev
```

Open the local address printed by the terminal, usually `http://localhost:4321`.

You can keep the original repository as `upstream` and use your own repository as `origin`:

```powershell
git remote rename origin upstream
git remote add origin https://github.com/your-name/your-repository.git
```

## 3. Important files

The files used most often are:

- `src/content/blog/`: blog posts;
- `src/content/spec/`: special pages such as About and Friends;
- `src/i18n/`: interface translations;
- `src/config.ts`: title, profile, comments, theme, and links;
- `astro.config.mjs`: site URL, base path, languages, and Markdown settings;
- `public/`: avatar, favicon, and other static files;
- `.github/workflows/`: automatic deployment.

## 4. Configure the site

In `astro.config.mjs`, `site` is the domain and `base` is the repository path:

```js
site: 'https://your-name.github.io',
base: '/your-repository',
```

For a repository named `your-name.github.io`, the site is published at the domain root and normally does not need a `base` path.

In `src/config.ts`, update the site and profile information while preserving the existing object structure:

```ts
title: "My Blog",
subTitle: "Notes about technology and life",
favicon: "avatar.png",
avatar: "/avatar.png",
name: "your-name",
description: "A personal blog",
indexPage: "https://your-name.github.io/your-repository",
```

Put the avatar at `public/avatar.png`. Interface text belongs in the language files under `src/i18n/language/`.

## 5. Write a bilingual post

Create one folder with one file per language:

```powershell
New-Item -ItemType Directory .\src\content\blog\my-first-post
New-Item .\src\content\blog\my-first-post\zh-cn.md
New-Item .\src\content\blog\my-first-post\en.md
```

A frontmatter example:

```yaml
---
title: "My first post"
pubDate: 2026-09-08
description: "A short introduction."
category: Technology
image: ""
draft: false
slugId: my-first-post
pinTop: 0
---
```

The two language files must use the same `slugId`. Quote any title or description containing a colon. Otherwise Astro can report `bad indentation of a mapping entry`.

## 6. Preview, build, and publish

Start local development with:

```powershell
npm.cmd run dev
```

Build the production site and search index with:

```powershell
npm.cmd run build
```

Preview the production output with:

```powershell
npm.cmd run preview
```

A successful build ends with `Build complete!` and Pagefind finishing without an error.

Publish the source files with Git:

```powershell
git status
git add .
git commit -m "Update blog"
git push origin main
```

GitHub Actions then builds and deploys the `dist` directory. Do not upload `dist` manually.

## 7. Enable comments

GitHub Pages cannot run a database or backend. Run Momo Backend separately on a server or local machine, then configure the frontend:

```ts
comments: {
  enable: true,
  platform: "default",
  backendUrl: "https://your-comment-api.example.com"
}
```

Useful Docker commands:

```powershell
docker ps
docker logs momo-backend
docker start momo-backend
docker stop momo-backend
docker restart momo-backend
```

Online comments require a public HTTPS backend URL and a matching CORS origin. `localhost:3000` works only on the same computer.

## 8. Troubleshooting

For `ERESOLVE`, close Node processes, remove `node_modules`, and reinstall with `npm.cmd install --legacy-peer-deps`.

For `Cannot find module astro`, the dependency installation is incomplete.

For `require is not defined`, inspect the Astro, Vite, Tailwind, and Svelte versions with `npm.cmd ls` and restore a compatible set.

For a GitHub Actions failure, open the failed **Build** job and read the first real error rather than the final exit-code summary.
