---
title: Codex Windows 沙盒启动失败及解决办法
pubDate: 2026-09-07
draft: false
description: Codex 在 Windows 上无法启动受限终端、提示找不到 codex-windows-sandbox-setup.exe 时，可以将 Windows 沙盒实现从 elevated 切换为 unelevated，并重启 Codex。
image: ""
slugId: codex-windows-sandbox-setup
category: 技术
pinTop: 0
---

昨天用 Codex 改博客时，终端和文件编辑工具突然变得不稳定：普通 PowerShell 有时可以执行，但需要受限环境的操作会失败或卡住。最后弹出了一个更直接的错误窗口：Windows 找不到 `codex-windows-sandbox-setup.exe`。

![Windows 找不到 codex-windows-sandbox-setup.exe](/astro/images/codex-windows-sandbox-setup-error.png)

这篇文章记录问题的判断过程，以及在 Windows 上可行的恢复方法。

## 现象：不是项目坏了，也不只是终端坏了

一开始很容易把问题归因于 Hexo、PowerShell 或网络代理。但实际表现有些矛盾：

- PowerShell 的基础命令可以运行；
- 工作目录中的常规文件读写可以通过；
- GitHub 网络检测可以返回成功；
- Codex 发起某些终端会话、应用补丁或沙盒检查时，却可能失败。

弹窗中的文件名很关键：`codex-windows-sandbox-setup.exe`。它是 Codex 在 Windows 上准备沙盒环境时会用到的初始化程序。找不到该程序时，失败的是这一步初始化，而不是某个具体的博客项目。

## 原因：Windows 提权沙盒初始化没有完成

Codex 在 Windows 原生环境中有两种沙盒实现：

| 配置 | 含义 |
| --- | --- |
| `elevated` | 使用带提权的 Windows 沙盒初始化流程，也是默认推荐方式。 |
| `unelevated` | 使用不依赖提权助手的兼容初始化/预检流程。 |

当 `elevated` 的初始化程序无法找到、权限提升失败，或其初始化环境发生异常时，Codex 就可能无法正常创建受限终端。出现“找不到 `codex-windows-sandbox-setup.exe`”的窗口，正是这一类问题的明确信号。

至于初始化程序为什么不可用，可能与应用更新不完整、旧路径残留、权限环境或安全软件拦截有关。单凭这个窗口无法准确判定是哪一种，所以不建议一上来就删除配置、重置登录信息或修改项目文件。

## 解决：切换到 unelevated

打开 Codex 的用户配置文件：

```text
C:\Users\你的用户名\.codex\config.toml
```

在文件中添加或修改为：

```toml
[windows]
sandbox = "unelevated"
```

保存后，**完全退出 Codex 再重新打开**。只关闭当前对话或窗口不一定会让沙盒初始化程序重新加载。

我的情况切换后，终端命令、文件修改、Hexo 构建和 GitHub Pages 部署都恢复了正常。

## unelevated 是不是关闭沙盒？

不是。

`unelevated` 只是换了一种 Windows 沙盒的底层初始化方式，Codex 的文件访问和命令权限仍会按照当前的权限策略执行。它适合没有管理员权限，或者 `elevated` 初始化失败的场景。

OpenAI 的 Codex 配置文档也说明：Windows 上通常推荐 `elevated`；当管理员权限不可用，或提权初始化失败时，可以将 `unelevated` 作为回退方案。 [Codex 配置说明](https://learn.chatgpt.com/fr-FR/docs/config-file/config-basic)

## 恢复后如何确认

重启后，可以依次做几个轻量测试：

1. 在 Codex 内运行一个简单的 PowerShell 命令，例如 `Get-Location`；
2. 让 Codex 在当前工作目录新建或修改一个普通文本文件；
3. 再执行项目的构建命令，例如 Hexo 项目的 `npm.cmd run build`。

这几项都正常，基本就说明终端、文件写入和项目运行所需的沙盒流程恢复了。

## 要不要改回 elevated？

目前不用急着改回。只要 `unelevated` 运行稳定，就可以继续使用。以后 Codex 更新后，如果想确认提权沙盒是否已修复，再把配置改回：

```toml
[windows]
sandbox = "elevated"
```

重启后测试即可；如果问题再次出现，切回 `unelevated`。

另外，代理软件最好先于 Codex 启动。但代理连接问题和这个“找不到沙盒初始化程序”的错误并不是一回事；不要为了修复这个错误随意删除 `.codex` 目录、修改 `auth.json`，或取消已有的代理设置。
