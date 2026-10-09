---
title: Hyper MeloLock 沉浸式音乐锁屏
pubDate: 2026-10-09T14:00:00+08:00
draft: false
description: "Hyper MeloLock，为澎湃 OS 3 打造的锁屏沉浸音乐模块：专辑封面铺成真壁纸、时钟跟随取色、完整播放控制，附下载地址与安装步骤。"
image: "/img/hyper-melolock/lockscreen-colors.jpg"
slugId: hyper-melolock-lockscreen-cover
category: 技术
pinTop: 0
---

Hyper MeloLock 是一个开源免费的澎湃 OS 3 锁屏音乐模块：正在播放音乐时，锁屏会换成大号时间、铺满全屏的专辑封面和完整播放控制条。封面是真正的壁纸，不是叠在锁屏上的一层图，所以系统的液态玻璃时钟、通知卡毛玻璃都能取到专辑的颜色。

模块通过 Vector / LSPosed 框架注入系统界面，不修改任何音乐播放器，也不改系统 APK。默认关闭、失败关闭：找不到锁屏视图或媒体数据无效时，立刻恢复原生锁屏。

![四种配色方案的锁屏效果](/img/hyper-melolock/lockscreen-colors.jpg)

## 一、下载安装

### 下载地址

- GitHub 发布页：[https://github.com/zuige66/Hyper-MeloLock/releases](https://github.com/zuige66/Hyper-MeloLock/releases)
- 最新版 APK 直链：[Hyper-MeloLock-v0.3.1.apk](https://github.com/zuige66/Hyper-MeloLock/releases/download/v0.3.1/Hyper-MeloLock-v0.3.1.apk)

只从 GitHub Releases 下载正式签名包。模块作用于系统锁屏界面，来源不明的二次打包版本有风险。

### 安装前提

| 项目 | 要求 |
| --- | --- |
| 系统 | 澎湃 OS 3（Android 16） |
| 设备 | Redmi Note 9 Pro（`gauguinpro`） |
| 框架 | Vector / LSPosed（SukiSU Ultra 提供） |
| 播放器 | 任何提供标准媒体会话的音乐应用 |

模块按精确构建指纹做门禁，换机型或换系统版本不会生效，此时模块会主动让位给原生锁屏，不会造成黑屏或卡死。

### 安装步骤

- 安装 APK 后，在 Vector 管理器里启用 Hyper MeloLock，作用域勾选这两项，缺一项对应功能就不生效：
  - `com.android.systemui`——锁屏覆盖层本体，必须勾选；
  - `com.miui.miwallpaper`——封面壁纸化，不勾则封面取不到系统毛玻璃效果。
- 重启手机。管理器里勾上作用域只是声明，进程没重启就不会注入。
- 打开 Hyper MeloLock 应用，点首页状态卡开启模块开关，确认显示「已激活」。
- 在「应用」页勾选实际使用的音乐播放器。默认一个都不勾，没勾选的播放器不会触发锁屏接管。
- 播放一首带封面的歌曲，熄屏再点亮。

成功标志：锁屏出现大号时间和全屏封面，底部有播放控制条；配置端首页显示系统版本与「已激活」。

![配置端首页](/img/hyper-melolock/app-home.jpg)
*配置端首页：开关状态 · 已开启应用 · 系统信息*

![关于页](/img/hyper-melolock/app-about.jpg)
*关于页：开发者信息 · 检查更新*

## 二、外观可以调什么

外观页里每一项都能实时调整，改完回到锁屏立即生效，不需要重启。基础可调项：

- 时间：字号、粗细、圆润、颜色、上间距，还可以单独加描边；
- 封面：缩放、圆角；
- 播放器卡片：圆角、上间距、底色（七档，含跟随封面动态取色）；
- 时钟上方可加一行「公历 + 周几 + 农历」日期和自定义签名，各自独立开关。

![外观分组](/img/hyper-melolock/app-appearance.jpg)
*外观分组：取色 · 日期 · 签名 · 时间 · 封面 · 播放器*

![时间取色](/img/hyper-melolock/app-appearance-picker.jpg)
*时间取色：跟随封面 / 固定色 · 取色风格（M3E / 鲜艳原色）*

### 取色：让锁屏跟着专辑变色

除了直接选颜色，时间、日期行、签名行、播放器底色、入口文字和入口背景都**能单独开关「跟随专辑封面」自动取色**。切换歌曲时颜色跟着封面一起变，不用手动改。

取色风格有两种，观感差别明显：

- **低饱和磨砂（M3E）**：从封面取出主色后压暗、降饱和，得到莫兰迪一类的柔和色。大号时间压在这种底色上更耐看，长时间看也不刺眼；
- **鲜艳原色直出**：直接取封面里的主色，颜色更跳、更接近海报感，适合封面本身配色干净的专辑。

主色从封面的哪里挑，也有两种选择：

- **最鲜艳优先**：直接取整张图里最鲜艳的那个颜色；
- **占比优先**：先看封面前五大色块，再在其中挑最鲜艳的，结果更贴近封面主体，不至于取到边角的一点杂色。

不跟封面时，时间颜色和播放器底色各有固定色档：时间有白、黑、浅灰、暖黄、天蓝、粉；播放器底色七档，其中一档同样是跟随封面动态取色。

## 三、已知限制

- 目前只在 Redmi Note 9 Pro（`gauguinpro`）+ 澎湃 OS 3 这套环境上测试过，其他机型未验证；模块按精确构建指纹门禁，不匹配时主动放弃覆盖、保持原生锁屏。
- 「Xposed 框架」一行固定显示「未知」，是读取方式的限制，不是故障。

## 相关链接

- 代码仓库：[https://github.com/zuige66/Hyper-MeloLock](https://github.com/zuige66/Hyper-MeloLock)
- 问题反馈：[GitHub Issues](https://github.com/zuige66/Hyper-MeloLock/issues)
- 项目基于 AGPL-3.0 开源，界面组件来自 HyperIsland（MIT License）
