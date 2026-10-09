---
title: Hexo + Fluid Blog Management and Customization
pubDate: 2026-09-04
draft: false
description: "Your blog is set up, but how do you change the title, add icons, or manage categories and tags? This post walks through the directory structure and common configuration of a Hexo + Fluid blog using the current site as an example."
image: ""
slugId: hexo-customize-guide
category: 技术
pinTop: 0
---

## Introduction

Your blog is up and running, but how do you change the title, add icons, or manage categories and tags? Using the current blog as an example, this post explains the directory structure and common configuration of Hexo + Fluid.

## 1. Command Cheat Sheet

All commands below are run from the blog root directory.

| Action | Command |
|--------|---------|
| Create a post | `hexo new "Post Title"` |
| Create a standalone page | `hexo new page "Page Name"` |
| Create a draft | `hexo new draft "Title"` |
| Publish a draft | `hexo publish "Title"` |
| Start local preview | `hexo server` |
| Preview on a specific port | `hexo server -p 4001` |
| Generate static files | `hexo generate` |
| Generate and deploy | `hexo generate -d` |
| Deploy only (generate first) | `hexo deploy` |
| Clean cache and old files | `hexo clean` |
| Force a full rebuild | `hexo generate -f` |
| List all posts | `hexo list post` |
| Check version | `hexo version` |

After starting the local preview, visit `http://localhost:4000` and press `Ctrl+C` to stop.

`hexo deploy` does not generate files automatically — you must run `hexo generate` first, then `hexo deploy`. `hexo generate -d` (short for `hexo g -d`) generates and deploys in one step, which is the command to use for daily posting.

`hexo generate` is incremental by default — it only regenerates changed posts and the affected archives, category, and tag pages, so posting one or two articles is fast. The command that actually triggers a full rebuild is `hexo clean` — it deletes the `db.json` cache and `public/`, forcing the next generation to start from scratch. Only run `hexo clean` when switching themes, making major config changes, or after an upgrade produces abnormal output. Don't add it normally.

The standard workflow for a post: `hexo new "Title"` to create → edit the corresponding md under `source/_posts/` → `hexo generate -d` to publish.

## 2. Project Structure

```
hexo/
├── _config.yml           # Hexo main config
├── _config.fluid.yml     # Fluid theme config
├── package.json          # Dependency management
├── source/
│   ├── _posts/           # Blog posts
│   ├── images/           # Image assets
│   ├── about/            # About page
│   ├── categories/       # Category page
│   ├── tags/             # Tag page
│   └── links/            # Friends page
└── themes/               # Theme directory
```

Two core config files:

| File | Purpose |
|------|---------|
| `_config.yml` | Global settings: site name, URL, author, language, etc. |
| `_config.fluid.yml` | Theme settings: navbar, colors, fonts, page layout, etc. |

## 3. Modify Site Information

Edit `_config.yml` in the root directory:

```yaml
# Site
title: zuige blog              # Site title (shown in browser tab)
subtitle: '落魄谷中寒风吹，春秋蝉鸣少年归。'  # Homepage subtitle
description: 'A blog about technology and life'  # Site description (SEO)
author: zuige66                # Author name
language: zh-CN                # Language
```

Run `hexo clean && hexo deploy` for changes to take effect.

## 4. Homepage Configuration

Edit the `index` section of `_config.fluid.yml`:

```yaml
index:
  banner_img: /img/default.png     # Homepage banner image
  banner_img_height: 100           # Image height (percentage of screen)
  banner_mask_alpha: 0.3           # Mask transparency

  slogan:
    enable: true
    text: "落魄谷中寒风吹，春秋蝉鸣少年归。"  # Homepage subtitle text

  auto_excerpt:
    enable: true                   # Auto-extract excerpt on homepage

  post_meta:
    date: true                     # Show publish date
    category: true                 # Show category
    tag: true                      # Show tags
```

## 5. Add a GitHub Icon

Configure the social icons for the about page in the `about` section of `_config.fluid.yml`:

```yaml
about:
  enable: true
  avatar: /images/zuige.jpg
  name: "zuige"
  intro: "欢迎来到我的博客"
  icons:
    - { class: "iconfont icon-github-fill", link: "https://github.com/zuige66", tip: "GitHub" }
    - { class: "iconfont icon-email-fill", link: "mailto:your@email.com", tip: "Email" }
```

If you also want a GitHub icon in the navbar, edit the `navbar` section:

```yaml
navbar:
  blog_title: "zuige blog"
  menu:
    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
    - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }
    - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
    - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
```

## 6. Manage Categories

### Create the category page

`source/categories/index.md` already exists with the following content:

```markdown
---
title: 分类
date: 2026-09-03
type: categories
---
```

### Add a category to a post

Specify it in the post's front-matter:

```yaml
---
title: My Post
categories:
  - 技术
  - 前端
---
```

A post can belong to multiple categories. If a category does not exist, Hexo creates it automatically.

### Category page configuration

```yaml
category:
  enable: true
  banner_img: /img/default.png
  banner_img_height: 60
  order_by: "-length"          # Sort by post count, descending
  collapse_depth: 0            # Collapse depth, 0 = collapse all
  post_limit: 10               # Max posts shown per category
```

## 7. Manage Tags

### Create the tag page

`source/tags/index.md` contains:

```markdown
---
title: 标签
date: 2026-09-03
type: tags
---
```

### Add tags to a post

```yaml
---
title: My Post
tags:
  - Hexo
  - Markdown
  - 博客
---
```

### Tag cloud configuration

```yaml
tag:
  enable: true
  banner_img_height: 80
  tagcloud:
    min_font: 15         # Minimum font size
    max_font: 30         # Maximum font size
    unit: px
    start_color: "#BBBBEE"  # Start color
    end_color: "#337ab7"    # End color
```

## 8. Write a New Post

```bash
hexo new "Post Title"
```

This generates `Post Title.md` under `source/_posts/`. After editing, generate and deploy with one command:

```bash
hexo generate -d
```

Complete post front-matter example:

```yaml
---
title: Post Title
date: 2026-09-04
tags:
  - Tag1
  - Tag2
categories:
  - Category1
index_img: /images/cover.jpg    # Homepage cover image (optional)
banner_img: /images/banner.jpg  # Post page banner (optional)
math: true                      # Enable math formulas (optional)
---

Body content...
```

## 9. About Page

Edit `source/about/index.md`:

```markdown
---
title: 关于我
date: 2026-09-03
---

## Hi there!

Write your personal introduction here.

### Contact

- GitHub: [zuige66](https://github.com/zuige66)
- Email: your@email.com
```

## 10. Custom Styles

To tweak colors, fonts, and other details, create a custom CSS file.

Specify it in `_config.fluid.yml`:

```yaml
custom_css:
  - /css/custom.css
```

Then write your styles in `source/css/custom.css`:

```css
/* Change post title color */
.post-title a {
  color: #2c3e50;
}

/* Change body line height */
.post-body {
  line-height: 2;
}
```

## 11. Color Theme

```yaml
color:
  body_bg_color: "#f5f5f5"       # Page background
  navbar_bg_color: "#2f4154"     # Navbar background
  navbar_text_color: "#fff"      # Navbar text
  text_color: "#3c4858"          # Body text
  post_text_color: "#2c3e50"     # Post text
  post_heading_color: "#1a202c"  # Post headings
  post_link_color: "#0366d6"     # Post links
  link_hover_color: "#30a9de"    # Link hover
  board_color: "#fff"            # Card background
```

## 12. Common Config Cheat Sheet

| Need | Action |
|------|--------|
| Change site title | `_config.yml` → `title` |
| Change homepage subtitle | `_config.fluid.yml` → `index.slogan.text` |
| Add GitHub icon | `_config.fluid.yml` → `about.icons` |
| Add a new category | Add `categories` in post front-matter |
| Add a new tag | Add `tags` in post front-matter |
| Change navbar | `_config.fluid.yml` → `navbar.menu` |
| Change colors | `_config.fluid.yml` → `color` |
| Change fonts | `_config.fluid.yml` → `font` |
| Change hover, float, and search highlight effects | `source/css/site-motion.css` |
| Change in-site search positioning | `themes/fluid/source/js/local-search.js` and `source/js/site-interactions.js` |

## Summary

It comes down to two files:

- `_config.yml` handles global settings
- `_config.fluid.yml` handles theme styling

After editing the config, run `hexo clean && hexo deploy` for changes to take effect. For daily commands, see "1. Command Cheat Sheet" at the top.
