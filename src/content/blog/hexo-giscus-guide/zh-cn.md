---
title: Giscus，让博客接入评论
pubDate: 2026-09-04
draft: false
description: ""
image: ""
slugId: hexo-giscus-guide
category: 技术
pinTop: 0
---

## 前言

静态博客没有后端，评论数据无处存储。Giscus 基于 GitHub Discussions，免费、稳定、支持 Markdown，是 Hexo 博客的最佳评论方案之一。

本文记录从零接入 Giscus 的完整流程，包括踩坑点。

## 一、GitHub 仓库准备

### 1.1 开启 Discussions

进入博客 GitHub 仓库 → Settings → Features → 勾选 **Discussions**。

### 1.2 创建 Announcement 分类

进入仓库 → Discussions → 右侧 `Edit categories` → `New category`：

- 名称：`Announcements`
- **类型必须选 Announcement（公告）**

> 这一步很关键。如果选成 General，访客可以在仓库里随意新建帖子，造成混乱。Announcement 类型下，只有 Giscus 机器人能创建主帖，访客只能回复。

### 1.3 安装 Giscus 应用

访问 https://github.com/apps/giscus ，点击 Install。

- 只授权你的博客仓库
- 不要全仓库授权

## 二、Giscus 官网配置

访问 https://giscus.app/zh-CN ，按以下步骤配置：

### 2.1 仓库

填入：`用户名/仓库名`（如 `zuige66/hexo`）

### 2.2 映射方式

选择：**Discussion 的标题包含页面的 pathname**

这种方式下，每篇文章的 URL 路径会作为 Discussion 的标题，一一对应。

### 2.3 Discussion 分类

选择：`Announcements`

### 2.4 特性勾选

| 选项 | 建议 |
|------|------|
| 启用主帖子上的反应 | ✅ 勾选 |
| 将评论框放在评论上方 | ✅ 勾选 |
| 懒加载评论 | ✅ 勾选 |
| 输出 discussion 的元数据 | ☐ 不勾选 |

### 2.5 主题配色

选择：**用户偏好的色彩方案**

这样评论区会自动跟随博客的亮色/暗色模式切换。

### 2.6 复制代码

页面会生成一段 `<script>` 代码，类似：

```html
<script src="https://giscus.app/client.js"
        data-repo="zuige66/hexo"
        data-repo-id="R_kgDOUNLYKw"
        data-category="Announcements"
        data-category-id="DIC_kwDOUNLYK84DE1jw"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
```

记住里面的 `repo-id` 和 `category-id`，下一步要用。

## 三、嵌入 Hexo 博客

### 3.1 编辑主题配置

打开 `_config.fluid.yml`，添加两处配置：

**启用评论（在 post 段落内）：**

```yaml
post:
  # ... 其他配置
  comments:
    enable: true
    type: giscus
```

**Giscus 参数（文件末尾添加）：**

```yaml
giscus:
  repo: zuige66/hexo
  repo-id: R_kgDOUNLYKw
  category: Announcements
  category-id: DIC_kwDOUNLYK84DE1jw
  mapping: pathname
  strict: 0
  reactions-enabled: 1
  emit-metadata: 0
  input-position: top
  theme-light: light
  theme-dark: dark
  lang: zh-CN
```

> 注意：Fluid 主题要求 `theme-light` 和 `theme-dark` 两个字段，不要写成 `theme`。

### 3.2 部署

```bash
hexo clean && hexo deploy
```

## 四、上线后验证

1. 访问线上博客文章页面，滚动到底部
2. 首次访问某篇文章时，Giscus 机器人会自动在仓库 Announcements 分类下创建一条 Discussion 主帖（标题是文章路径）
3. 用 GitHub 账号登录后即可发表评论
4. 未登录的访客可以查看评论，登录后可回复

> 本地 `hexo s` 预览只能看到评论区 UI 框架，不会真正创建 Discussion。必须部署到线上才能正常使用。

## 五、工作原理

```
文章 URL: /2026/09/04/my-post/
        ↓
Giscus 根据 pathname 查找对应的 Discussion
        ↓
找到 → 显示评论
没找到 → 自动创建新的 Discussion 主帖
        ↓
评论存储在 GitHub Discussions
```

- 每篇文章 = 1 个 Discussion 主帖
- 所有评论都是该主帖下的 Reply
- 只要文章路径不变，修改标题不会丢失历史评论

## 六、常见问题

### 评论区不显示

检查项：
- Discussions 是否已开启
- Announcement 分类类型是否正确
- Giscus 应用是否已授权仓库
- `_config.fluid.yml` 中 `post.comments.enable` 是否为 `true`

### 暗色模式下评论区白底

主题配色要选「用户偏好的色彩方案」，不要固定 GitHub Light。

### 本地预览看不到评论

正常现象。`hexo s` 只渲染 UI，Discussion 帐子只有部署线上后才会由 Giscus 机器人创建。

### 仓库里出现乱七八糟的帖子

分类类型选错了。必须是 Announcement，不能是 General。Announcement 类型下只有 Giscus 能创建主帖。

## 七、进阶设置

### 指定文章关闭评论

在文章 front-matter 中设置：

```yaml
---
title: 某篇文章
comments: false
---
```

### 自定义评论区标题

Giscus 默认用文章路径作为 Discussion 标题。如需自定义，可在 giscus.app 配置时修改映射方式。

## 总结

| 步骤 | 操作 |
|------|------|
| 1 | 仓库开启 Discussions |
| 2 | 创建 Announcement 分类 |
| 3 | 安装 Giscus 应用并授权 |
| 4 | giscus.app 配置并获取参数 |
| 5 | `_config.fluid.yml` 添加 giscus 配置 |
| 6 | 部署上线验证 |

整个流程约 15 分钟完成，无需服务器，无需付费。