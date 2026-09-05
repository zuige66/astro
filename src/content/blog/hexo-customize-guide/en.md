---
title: Hexo + Fluid 博客管理与自定义配置
pubDate: 2026-09-04
draft: false
description: ""
image: ""
slugId: hexo-customize-guide
category: 技术
pinTop: 0
---

## 前言

博客搭好了，但怎么改标题、加图标、管理分类标签？本文以当前博客为例，讲解 Hexo + Fluid 的目录结构和常用配置。

## 项目结构

```
hexo/
├── _config.yml           # Hexo 主配置
├── _config.fluid.yml     # Fluid 主题配置
├── package.json          # 依赖管理
├── source/
│   ├── _posts/           # 博客文章
│   ├── images/           # 图片资源
│   ├── about/            # 关于页
│   ├── categories/       # 分类页
│   ├── tags/             # 标签页
│   └── links/            # 友链页
└── themes/               # 主题目录
```

两个核心配置文件：

| 文件 | 作用 |
|------|------|
| `_config.yml` | 站点名称、URL、作者、语言等全局设置 |
| `_config.fluid.yml` | 导航栏、颜色、字体、页面布局等主题设置 |

## 修改站点信息

编辑根目录 `_config.yml`：

```yaml
# Site
title: zuige blog              # 站点标题（浏览器标签页显示）
subtitle: '落魄谷中寒风吹，春秋蝉鸣少年归。'  # 首页副标题
description: 'A blog about technology and life'  # 站点描述（SEO）
author: zuige66                # 作者名
language: zh-CN                # 语言
```

修改后执行 `hexo clean && hexo deploy` 生效。

## 首页配置

编辑 `_config.fluid.yml` 的 `index` 部分：

```yaml
index:
  banner_img: /img/default.png     # 首页大图
  banner_img_height: 100           # 图片高度（屏幕百分比）
  banner_mask_alpha: 0.3           # 蒙版透明度

  slogan:
    enable: true
    text: "落魄谷中寒风吹，春秋蝉鸣少年归。"  # 首页副标题文字

  auto_excerpt:
    enable: true                   # 首页自动截取摘要

  post_meta:
    date: true                     # 显示发布日期
    category: true                 # 显示分类
    tag: true                      # 显示标签
```

## 添加 GitHub 图标到首页

在 `_config.fluid.yml` 的 `about` 部分配置关于页的社交图标：

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

如果想在导航栏也显示 GitHub 图标，修改 `navbar` 部分：

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

## 管理分类

### 创建分类页

`source/categories/index.md` 已存在，内容为：

```markdown
---
title: 分类
date: 2026-09-03
type: categories
---
```

### 给文章添加分类

在文章的 front-matter 中指定：

```yaml
---
title: 我的文章
categories:
  - 技术
  - 前端
---
```

一个文章可以属于多个分类。如果分类不存在，Hexo 会自动创建。

### 分类页配置

```yaml
category:
  enable: true
  banner_img: /img/default.png
  banner_img_height: 60
  order_by: "-length"          # 按文章数倒序
  collapse_depth: 0            # 折叠深度，0 为全部折叠
  post_limit: 10               # 单个分类最多显示文章数
```

## 管理标签

### 创建标签页

`source/tags/index.md` 内容为：

```markdown
---
title: 标签
date: 2026-09-03
type: tags
---
```

### 给文章添加标签

```yaml
---
title: 我的文章
tags:
  - Hexo
  - Markdown
  - 博客
---
```

### 标签云配置

```yaml
tag:
  enable: true
  banner_img_height: 80
  tagcloud:
    min_font: 15         # 最小字号
    max_font: 30         # 最大字号
    unit: px
    start_color: "#BBBBEE"  # 起始颜色
    end_color: "#337ab7"    # 结束颜色
```

## 写新文章

```bash
hexo new "文章标题"
```

在 `source/_posts/` 下生成 `文章标题.md`，编辑后部署：

```bash
hexo clean && hexo deploy
```

文章 front-matter 完整示例：

```yaml
---
title: 文章标题
date: 2026-09-04
tags:
  - 标签1
  - 标签2
categories:
  - 分类1
index_img: /images/cover.jpg    # 首页封面图（可选）
banner_img: /images/banner.jpg  # 文章页大图（可选）
math: true                      # 启用数学公式（可选）
---

正文内容...
```

## 关于页

编辑 `source/about/index.md`：

```markdown
---
title: 关于我
date: 2026-09-03
---

## Hi there!

这里写你的个人介绍。

### 联系方式

- GitHub: [zuige66](https://github.com/zuige66)
- Email: your@email.com
```

## 自定义样式

如需修改颜色、字体等细节，可创建自定义 CSS 文件。

在 `_config.fluid.yml` 中指定：

```yaml
custom_css:
  - /css/custom.css
```

然后在 `source/css/custom.css` 中编写样式：

```css
/* 修改文章标题颜色 */
.post-title a {
  color: #2c3e50;
}

/* 修改正文行高 */
.post-body {
  line-height: 2;
}
```

## 颜色主题

```yaml
color:
  body_bg_color: "#f5f5f5"       # 页面背景
  navbar_bg_color: "#2f4154"     # 导航栏背景
  navbar_text_color: "#fff"      # 导航栏文字
  text_color: "#3c4858"          # 正文文字
  post_text_color: "#2c3e50"     # 文章文字
  post_heading_color: "#1a202c"  # 文章标题
  post_link_color: "#0366d6"     # 文章链接
  link_hover_color: "#30a9de"    # 链接悬浮
  board_color: "#fff"            # 卡片背景
```

## 常用操作速查

| 需求 | 操作 |
|------|------|
| 改站点标题 | `_config.yml` → `title` |
| 改首页副标题 | `_config.fluid.yml` → `index.slogan.text` |
| 加 GitHub 图标 | `_config.fluid.yml` → `about.icons` |
| 加新分类 | 文章 front-matter 里加 `categories` |
| 加新标签 | 文章 front-matter 里加 `tags` |
| 改导航栏 | `_config.fluid.yml` → `navbar.menu` |
| 改颜色 | `_config.fluid.yml` → `color` |
| 改字体 | `_config.fluid.yml` → `font` |
| 写新文章 | `hexo new "标题"` → 编辑 md → `hexo deploy` |

## 总结

核心就两个文件：

1. `_config.yml` 管全局设置
2. `_config.fluid.yml` 管主题样式

改完配置执行 `hexo clean && hexo deploy` 即可生效。