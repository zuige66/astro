---
title: "Building a Personal Blog with Astro and Momo"
pubDate: 2026-09-05
draft: false
description: "A complete guide to setting up an Astro blog with the Momo template, customizing the site, and deploying it to GitHub Pages."
image: ""
slugId: "astro-momo"
category: "Technology"
pinTop: 0
---

## Introduction

I wanted a personal blog that was simple, fast, and easy to maintain. After comparing several static-site frameworks, I chose Astro and the [Momo](https://github.com/Motues/Momo) blog template.

Momo already provides the pages, styles, and features commonly needed by a blog, so there is no need to build an Astro project from scratch. This article records the complete setup and deployment process.

## Why Astro?

| Solution | Advantages | Disadvantages |
| --- | --- | --- |
| WordPress | Powerful and extensible | Requires a server and more maintenance |
| Hexo | Many themes and documentation | Depends heavily on its theme ecosystem |
| Hugo | Very fast builds | Custom themes require Go Template knowledge |
| Astro | Fast, modern, and flexible | Requires some frontend knowledge |

Astro generates fast static pages, supports Markdown and content collections, allows components from several frontend frameworks, can be deployed to GitHub Pages for free, and has a clear project structure.

## Why Momo?

[Momo](https://github.com/Motues/Momo) is a minimalist Astro blog template. It includes dark mode, system-theme support, Pagefind search, Chinese and English localization, responsive layouts, categories, a table of contents, RSS, reading time, KaTeX, Typst, Alert and GitHub cards, optional comments, and a local CMS.

Momo is a complete Astro template rather than a theme plugin. The simplest way to use it is to clone the repository directly.

## Prerequisites

Install Node.js, Git, and pnpm:

```bash
node -v
npm -v
git --version
npm install -g pnpm
pnpm -v
```

## Download the Momo template

```bash
git clone https://github.com/Motues/Momo.git
cd Momo
pnpm install
pnpm dev
```

The development server runs at `http://localhost:4321`.

## Project structure

```text
Momo/
├── .github/workflows/deploy.yml # GitHub Pages deployment
├── public/                      # Static assets and site icons
├── src/content/blog/            # Blog articles
├── src/i18n/                    # Localization
├── src/pages/                   # Routes and pages
├── src/config.ts                # Blog configuration
├── astro.config.mjs             # Astro configuration
└── package.json                 # Dependencies and scripts
```

The three places you will edit most often are `astro.config.mjs`, `src/config.ts`, and `src/content/blog/`.

## Configure the site URL

Open `astro.config.mjs` and update the `site` value:

```javascript
site: 'https://your-username.github.io',
```

For example:

```javascript
site: 'https://zuige66.github.io',
```

A user site is easiest to configure when the repository is named `your-username.github.io`. For a project repository, add a base path:

```javascript
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/astro-blog',
});
```

Test subpath deployments carefully because some links and assets begin with `/`.

## Customize the blog information

The main configuration file is `src/config.ts`. `siteConfig` controls the title, subtitle, favicon, page size, table of contents, comments, and theme settings. `profileConfig` controls the avatar, name, description, and personal homepage:

```typescript
export const profileConfig = {
  avatar: '/images/avatar.webp',
  name: 'Your name',
  description: 'Notes about technology, learning, and life',
  indexPage: 'https://your-username.github.io',
};
```

`friendLinkConfig` defines friend links, `licenseConfig` controls the article license, and localization files are stored in `src/i18n/`.

## Change the avatar and favicon

Static assets belong in `public/`. The avatar and favicon can use the same image. WebP, PNG, and SVG are good choices. Use short English filenames, update the configuration path when a filename changes, and hard-refresh the browser if it caches the old favicon.

## Write the first article

Blog articles are stored in `src/content/blog/`. You can create one with:

```bash
pnpm newpost docs/hello-world.md en
```

Every article needs front matter similar to this:

```markdown
---
title: "My first Astro article"
pubDate: 2026-09-05
draft: false
description: "My first article with Astro and Momo."
image: ""
slugId: "hello-world"
category: "Technology"
pinTop: 0
---

## Introduction

Write the article body here using Markdown.
```

The `slugId` must be unique. Lowercase English words separated by hyphens are recommended.

## Build and test locally

After changing the configuration or articles, run:

```bash
pnpm build
pnpm preview
```

The generated site is placed in `dist/`. Check the home page, articles, images, avatar, dark mode, search, mobile layout, and terminal output before deploying. Pagefind search is normally complete only after a production build.

## Deploy to GitHub Pages

Momo includes a workflow in `.github/workflows/deploy.yml`. Push the project to your repository and set the Pages source to **GitHub Actions** under **Settings → Pages → Build and deployment**.

The workflow installs dependencies, builds the site, uploads `dist/`, and publishes it to GitHub Pages. For future updates:

```bash
pnpm build
git add .
git commit -m "Publish a new article"
git push
```

Every push to the deployment branch starts a new deployment.

## Custom domains

Create `public/CNAME` and put only the domain name in it:

```text
blog.example.com
```

Then update `site` in `astro.config.mjs`, configure DNS, and set the custom domain in GitHub Pages.

## Common commands

| Command | Description |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the production site |
| `pnpm preview` | Preview the production build |
| `pnpm astro ...` | Run an Astro CLI command |
| `pnpm newpost <path> <lang>` | Create an article |
| `pnpm cms` | Start the local CMS |

## Troubleshooting

If `pnpm` is not found, run `npm install -g pnpm` and reopen the terminal. If GitHub Actions fails, run `pnpm install` and `pnpm build` locally first, then inspect the workflow log.

If the deployed page is blank, check `site`, `base`, asset paths, and whether the repository is a user site or project site. If an update does not appear, confirm that the code was pushed, Actions completed successfully, and the browser is not showing a cached page.

## Conclusion

The process is simple: install Node.js, Git, and pnpm; clone Momo; install dependencies; configure the site; write articles; run a production build; and push to GitHub. GitHub Actions then deploys the static site to GitHub Pages.

Astro and Momo keep hosting costs low while storing the site configuration and articles in Git, making the blog easy to back up and maintain.

## References

- [Momo GitHub repository](https://github.com/Motues/Momo)
- [Momo configuration guide](https://github.com/Motues/Momo/blob/main/doc/config_zh-cn.md)
- [Astro documentation](https://docs.astro.build/)
- [Deploy Astro to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
