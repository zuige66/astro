---
title: OpenCode 上手
pubDate: 2026-09-04
draft: false
description: ""
image: ""
slugId: opencode-tutorial
category: 技术
pinTop: 0
---

## 前言

OpenCode 是一个基于命令行的 AI 编程助手，支持代码生成、调试、重构、项目搭建等场景。本文介绍从环境配置到实际使用的完整流程。

## 环境准备

### 启动命令行

Windows 下启动终端的几种方式：

| 方式 | 操作 |
|------|------|
| 快捷键 | `Win + R` → 输入 `cmd` → 回车 |
| 开始菜单 | 搜索"命令提示符"或"PowerShell" |
| 右键菜单 | 在文件资源管理器空白处右键 → "在终端中打开" |

启动后确认路径前缀为 `C:\Users\你的用户名>` 即可。

### 安装 Node.js

OpenCode 依赖 Node.js 运行环境，需先完成安装。

**下载**

访问 https://nodejs.org，下载 LTS 版本安装包。

**安装**

双击安装包，全程保持默认选项，点击 Install 完成安装。

**验证**

```bash
node -v    # 输出 v22.x.x 即为成功
npm -v     # 输出 10.x.x 即为成功
```

若提示"不是内部或外部命令"，重启终端后重试。

## 安装 OpenCode

```bash
npm install -g opencode
```

`-g` 参数表示全局安装，安装完成后可在任意目录调用。

验证安装：

```bash
opencode --version
```

## 模型切换

OpenCode 内置免费模型，无需配置 API Key，开箱即用。

启动后按 `Shift + Tab` 可切换模型，常用免费模型：

| 模型 | 特点 |
|------|------|
| Gemini 2.5 Flash | 响应快，推荐日常使用 |
| Gemini 2.5 Pro | 推理能力强，适合复杂任务 |
| Llama 4 Maverick | Meta 开源模型 |

## 使用

### 启动

```bash
opencode
```

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Shift + Tab` | 切换模型 |
| `Ctrl + C` | 退出 |
| `Ctrl + L` | 清屏 |

### 场景示例

**代码生成**

```
> 用 Python 实现一个 HTTP 文件服务器，支持断点续传
```

**代码解释**

```
> 解释这段代码的作用：
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

**调试**

```
> 运行 python app.py 报错：ModuleNotFoundError: No module named 'flask'
```

AI 会分析错误原因并给出修复方案。

**项目搭建**

```
> 初始化一个 Express 项目，配置 TypeScript 和 ESLint
```

### 文件与命令操作

OpenCode 可直接操作文件系统和执行命令：

```
> 列出当前目录下的文件
> 创建 index.html 并写入基础 HTML 结构
> 删除 src/ 下所有 .bak 文件
> 执行 npm run build 并查看输出
```

## 常见问题

### npm 安装速度慢

切换至国内镜像源：

```bash
npm config set registry https://registry.npmmirror.com
```

### 权限不足

Windows 下右键终端图标，选择"以管理员身份运行"。

### 更新 OpenCode

```bash
npm update -g opencode
```

## 总结

1. 安装 Node.js 并验证
2. `npm install -g opencode` 全局安装
3. 配置 API Key 和模型
4. `opencode` 启动，开始使用

完整流程约 10 分钟完成。