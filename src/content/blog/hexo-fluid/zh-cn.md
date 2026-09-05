---
title: Hexo + Fluid 搭建个人博客
pubDate: 2026-09-03
draft: false
description: ""
image: ""
slugId: hexo-fluid
category: 技术
pinTop: 0
---

## 前言

花了几个小时搭建了这个博客，记录一下过程，也给想建博客的朋友一个参考。

## 为什么选 Hexo？

对比了几种方案：

| 方案 | 优点 | 缺点 |
|------|------|------|
| WordPress | 功能强大、插件多 | 需要服务器、维护成本高 |
| Hugo | 速度快 | 主题生态不如 Hexo |
| Hexo | 主题丰富、部署简单 | 需要 Node.js 环境 |

最终选了 Hexo，主要因为：
- 免费托管在 GitHub Pages，不用买服务器
- Fluid 主题颜值高、中文文档好
- Markdown 写文章很舒服

## 环境准备

需要安装两个东西：

**Node.js** - 去官网下载安装即可，自带 npm

```bash
# 验证安装
node -v    # v22.x.x
npm -v     # 10.x.x
```

**Git** - 用于版本管理和部署

```bash
git --version  # 2.x.x
```

## 安装 Hexo

```bash
# 全局安装 Hexo CLI
npm install -g hexo-cli

# 初始化博客项目
mkdir my-blog && cd my-blog
hexo init .

# 安装依赖
npm install
```

初始化后的目录结构：

```
my-blog/
├── _config.yml    # 主配置文件
├── package.json   # 依赖管理
├── scaffolds/     # 文章模板
├── source/        # 文章和资源
│   └── _posts/    # 博客文章放这里
└── themes/        # 主题目录
```

## 安装 Fluid 主题

```bash
# 在博客根目录执行
npm install hexo-theme-fluid --save
```

然后编辑根目录的 `_config.yml`，把主题改为 fluid：

```yaml
theme: fluid
```

创建主题配置文件 `_config.fluid.yml`（在根目录），基础配置：

```yaml
navbar:
  blog_title: "我的博客"
  menu:
    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
    - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }
    - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
    - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
```

## 写第一篇文章

### 方式一：命令行创建

```bash
hexo new "文章标题"
```

会在 `source/_posts/` 下生成一个 `文章标题.md` 文件。

### 方式二：直接新建文件

在 `source/_posts/` 下新建 `.md` 文件，文件名就是文章的 URL。

### 文章格式

```markdown
---
title: 文章标题
date: 2026-09-03
tags:
  - 标签1
  - 标签2
categories:
  - 分类
---

这里是正文内容，使用 Markdown 语法。
```

### Markdown 常用语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**加粗文字**
*斜体文字*
~~删除线~~

- 无序列表项
1. 有序列表项

[链接文字](https://example.com)
![图片描述](图片URL)

> 引用内容

`行内代码`

​```python
# 代码块
print("Hello World")
​```

| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |
```

## 部署到 GitHub

### 1. 创建 GitHub 仓库

仓库名必须是 `用户名.github.io`（个人主页）或自定义名称（项目页面）。

### 2. 配置 Git SSH

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥添加到 GitHub
cat ~/.ssh/id_ed25519.pub
```

### 3. 配置部署

编辑 `_config.yml`：

```yaml
url: https://zuige66.github.io/hexo
deploy:
  type: git
  repo: git@github.com:zuige66/hexo.git
  branch: gh-pages
```

安装部署插件：

```bash
npm install hexo-deployer-git --save
```

### 4. 一键部署

```bash
hexo clean && hexo deploy
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `hexo new "标题"` | 新建文章 |
| `hexo server` | 本地预览（默认 http://localhost:4000） |
| `hexo generate` | 生成静态文件 |
| `hexo deploy` | 部署到 GitHub |
| `hexo clean` | 清除缓存和 public 目录 |
| `hexo clean && hexo deploy` | 重新生成并部署（最常用） |

## 目录结构说明

```
source/
├── _posts/          # 博客文章
│   ├── hello-world.md
│   └── 我的第一篇博客.md
├── about/           # 关于页面
│   └── index.md
├── categories/      # 分类页面
│   └── index.md
├── tags/            # 标签页面
│   └── index.md
└── images/          # 图片资源
    └── zuige.jpg
```

## 总结

整个流程就是：

1. 安装 Node.js + Git
2. 安装 Hexo CLI
3. 初始化项目 + 安装主题
4. 写 Markdown 文章
5. `hexo deploy` 部署

以后写新文章只需要：

```bash
hexo new "标题"
# 编辑 md 文件
hexo clean && hexo deploy
```

就这么简单，开始写博客吧！