---
title: Astro + Momo Blog Setup Guide
pubDate: 2026-09-08
draft: false
description: Set up a personal blog with the Momo theme, from local configuration and writing posts to GitHub Pages deployment and comments.
image: ""
slugId: astro-momo-blog-guide
category: Technology
pinTop: 0
---

Momo comes with the parts most blogs need: post listings, archives, search, RSS, and light and dark themes. You mainly need to add your site details, write posts, and publish the generated files.

Momo is an open-source blog theme built with Astro. It supports Markdown, multiple languages, Pagefind search, and RSS. This guide follows **Momo 26.8.15**, which is based on Astro 7 and requires Node.js 22 or later. The project recommends Node.js 24 LTS.[Momo theme page](https://astro.build/themes/details/momo/) · [Momo release notes](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)

## Prepare your environment

### Install the tools

Install Git, Node.js 24 LTS, and pnpm. Check that the commands are available:

```bash
git --version
node --version
pnpm --version
```

If pnpm is missing, install it with npm:

```bash
npm install --global pnpm
```

Install Astro and the theme dependencies in the project. Astro itself does not need to be installed globally.[Astro installation guide](https://docs.astro.build/en/install-and-setup/)

## Download and run Momo

### Start the local preview

Clone Momo, install dependencies, and start the development server:

```bash
git clone https://github.com/Motues/Momo.git my-blog
cd my-blog
pnpm install
pnpm dev
```

Open the local address printed in the terminal, usually `http://localhost:4321`. Check that the homepage loads before changing the configuration.

### Connect your GitHub repository

Create an empty repository on GitHub, then push your local repository. Keep the theme repository as `upstream` and use your own repository as `origin`:

```bash
git remote rename origin upstream
git remote add origin https://github.com/your-name/your-repository.git
git push -u origin HEAD
```

Use `origin` to publish your blog and `upstream` to check for theme updates. Leave the new GitHub repository empty so an automatically created README does not conflict with the local history.

## Configure your site

### Set the site URL and repository path

In `astro.config.mjs`, set `site` and `base` for a GitHub Pages project repository:

```js
export default defineConfig({
  site: 'https://your-name.github.io',
  base: '/your-repository',
  // Keep the other theme configuration
})
```

`site` is the domain; `base` is the repository path. If the repository is named `your-name.github.io`, the site is published at the domain root and usually does not need `base`. For a custom domain, set `site` to that domain and remove `base`. Internal links must also account for the `base` prefix.[Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

### Update the blog name and profile

In `src/config.ts`, find `siteConfig` and `profileConfig`, then replace the title, description, avatar, and other details with your own. Put the example avatar at `public/avatar.png`:

```ts
title: "My Blog",
subTitle: "Notes on technology, reading, and life",
favicon: "avatar.png",
```

```ts
avatar: "/avatar.png",
name: "Your Name",
description: "A developer who enjoys building for the web",
indexPage: "https://your-name.github.io/your-repository",
```

The configuration also covers the table of contents, post navigation, theme effects, comments, license, and friend links. Change only the values you need and keep the other fields from your version of the theme.[Momo configuration guide](https://momo.motues.top/blog/intro/config/)

### Edit the homepage and language settings

The homepage cover text lives in the language files under `src/i18n/language/`; edit `cover.title` and `cover.subtitle`. The languages available on the site and the default language are configured in `astro.config.mjs`.[Momo configuration guide](https://momo.motues.top/blog/intro/config/)

## Publish your first post

### Create the post directory

Momo organizes posts by directory. Create a folder under `src/content/blog/` and add one file per language:

```text
src/content/blog/my-first-post/
├─ zh-cn.md
└─ en.md
```

### Add post metadata

Each post starts with YAML frontmatter:

```markdown
---
title: "My first post"
pubDate: 2026-10-04
description: "My first post with Momo."
category: Notes
image: ""
draft: false
slugId: my-first-post
pinTop: 0
---

## Start here

Write your post here.
```

`title`, `pubDate`, and a unique `slugId` are required. Posts with `draft: true` stay out of the production site. Use `image` for a cover, `category` to group posts, and `pinTop` to control pinned order. Momo builds the post route from its relative directory under `src/content/blog/`; `slugId` identifies the post and is also used by the comment system. Avoid renaming a published directory or reusing its `slugId`.[Momo: Publish a post](https://momo.motues.top/blog/intro/publish-blog/)

Put translations in the same directory and use the same `slugId`. Name the English file `en.md`, and enable each language in `astro.config.mjs`. If a translation is missing, Momo falls back to the default language.

### Build and preview

Build and preview the production output before publishing:

```bash
pnpm build
pnpm preview
```

The build creates the static files in `dist/` and generates the Pagefind search index. Check the pages, images, and search in the preview.

## Deploy to GitHub Pages

### Set up the deployment workflow

First check whether `.github/workflows/` already contains a Pages workflow. If it does not, follow the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/github/) to add a GitHub Actions workflow that installs dependencies, runs the build, uploads `dist/`, and deploys it to Pages. Use the same Node.js version and package manager as the project. Commit the matching lock file: `pnpm-lock.yaml` for pnpm or `package-lock.json` for npm.

### Push and check the deployment

In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. After a successful local build, commit and push your changes:

```bash
git status
git add .
git commit -m "Build my Momo blog"
git push
```

Check the **Actions** tab to follow the build and deployment. A project repository is published at `https://your-name.github.io/your-repository/`. Astro's Pages workflow detects the package manager from the lock file, so commit that file with the rest of the source.[Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

### Troubleshoot a failed build

If the workflow fails, open the failed **Build** step and find the first error. Then reproduce it locally with `pnpm build`. Check the Node.js version, lock file, post frontmatter, and `site` and `base` values.

## Optional: enable comments

### Configure the comment backend

GitHub Pages serves static files; comments need a separate backend. Momo provides [Momo Backend](https://github.com/Motues/Momo-Backend). After deploying it, enable comments in `src/config.ts` and enter the backend URL:

```ts
comments: {
  enable: true,
  platform: "default",
  backendUrl: "https://your-comment-backend.example.com"
}
```

### Check CORS access

The backend must allow requests from your blog's domain through CORS. `localhost` works only on the computer running the backend; visitors need a publicly reachable URL. Momo also supports Twikoo, so check the configuration and backend documentation for your version.[Momo: Deploy the comment system](https://momo.motues.top/blog/intro/comment/)

## References

- [Momo GitHub repository](https://github.com/Motues/Momo)
- [Astro Themes: Momo](https://astro.build/themes/details/momo/)
- [Momo configuration guide](https://momo.motues.top/blog/intro/config/)
- [Momo post publishing guide](https://momo.motues.top/blog/intro/publish-blog/)
- [Momo comment deployment guide](https://momo.motues.top/blog/intro/comment/)
- [Momo release notes](https://github.com/Motues/Momo/blob/main/doc/release_zh-cn.md)
- [Astro installation guide](https://docs.astro.build/en/install-and-setup/)
- [Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

> Version and feature details are based on Momo 26.8.15 and were checked on 2026-10-04. Astro and Momo evolve; when upgrading, follow the configuration files and release notes for the version you use.
