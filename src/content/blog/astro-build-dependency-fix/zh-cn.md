---
title: Astro 博客构建失败：依赖冲突与分页语言错误的排查记录
pubDate: 2026-09-08
draft: false
description: 记录 Astro 博客在 Windows 上安装依赖和构建时遇到的 ERESOLVE、source-map-js 与 currentLang 错误，以及最终的解决办法。
image: ""
slugId: astro-build-dependency-fix
category: 技术
pinTop: 0
---

最近给博客增加中英双语、评论系统和页面布局时，生产构建连续遇到了几个问题。它们表面上都发生在 `npm run build`，实际上分别属于依赖安装、依赖版本混用和代码初始化顺序错误。

## 第一个问题：npm 无法解析依赖

最初执行 `npm install` 时出现了 `ERESOLVE could not resolve`。报错显示项目声明的 `@tailwindcss/vite` 版本与 `node_modules` 中实际安装的版本不一致，同时 Vite 的 peer dependency 也无法满足。

这时不应该直接运行 `npm run build`，因为 `astro` 可能还没有被完整安装，随后会看到：

```text
Cannot find module node_modules/astro/bin/astro.mjs
```

先关闭正在运行的开发服务器和编辑器中的 Node 进程，再清理依赖目录：

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item .\node_modules -Recurse -Force
npm.cmd install --legacy-peer-deps
```

`--legacy-peer-deps` 只是在安装阶段忽略旧式 peer dependency 冲突，不能替代版本统一。安装完成后应使用 `npm ls` 检查实际版本。

## 第二个问题：依赖版本混用

检查依赖树后发现，Astro 7.2.1 的依赖链使用了 Vite 8，而项目中的 Tailwind 和其他插件仍按 Vite 7 解析。混用后，Vite 配置加载器会把 CommonJS 包 `source-map-js` 当成 ESM 执行，最终报错：

```text
require is not defined
```

解决方法不是修改 `source-map-js`，而是让框架、集成和构建工具使用同一套版本。这个项目最终采用了以下组合：

| 包 | 版本 |
| --- | --- |
| `astro` | `6.4.8` |
| `@astrojs/svelte` | `8.1.2` |
| `vite` | `7.3.6` |
| `@tailwindcss/vite` | `4.1.13` |
| `tailwindcss` | `4.1.13` |

修改 `package.json` 后重新安装：

```powershell
npm.cmd install --legacy-peer-deps
npm.cmd ls astro vite @astrojs/svelte @tailwindcss/vite --depth=0
```

如果 `npm ls` 显示 `invalid`，说明依赖仍然没有统一，暂时不要发布。

## 第三个问题：`currentLang` 初始化顺序

依赖问题解决后，构建继续执行到分页页面，却出现了：

```text
Cannot access 'currentLang' before initialization
```

原因是 `src/components/control/Navi.astro` 在定义每页数量选项和 URL 函数时使用了 `currentLang`，但变量声明放在后面。JavaScript 的 `const` 不会在初始化前使用，因此即使代码看起来都在同一个组件中，也会触发暂时性死区错误。

修复方式是把语言和翻译函数放到所有使用它们的代码之前：

```astro
const currentLang = Astro.currentLocale || i18n!.defaultLocale;
const t = i18nit(currentLang);
```

这类错误属于代码逻辑问题，不能靠重新安装依赖解决。

## 最终验证

依赖和代码都修复后执行：

```powershell
npm.cmd run build
```

成功时应看到类似结果：

```text
37 page(s) built
Build complete!
Indexed 2 languages
Finished
```

`astro-icon` 找不到 `src/icons`、Svelte 存在未使用的 transition 导入，以及 Pagefind 对中文不做词干提取，属于警告，不会阻止构建完成。

## 发布到 GitHub Pages

这个项目的 `.github/workflows/deploy.yml` 会在 `main` 分支收到推送后自动构建和部署。确认本地构建成功后：

```powershell
git add package.json package-lock.json src/components/control/Navi.astro
git commit -m "修复构建依赖与分页语言初始化"
git push origin main
```

随后到 GitHub 仓库的 **Actions** 页面查看部署任务。只有构建任务和部署任务都成功后，线上页面才会更新。

这次排查得到的经验是：先区分安装错误、依赖兼容错误和业务代码错误；不要看到 `build failed` 就盲目重装，也不要在本地构建未通过时直接发布。
