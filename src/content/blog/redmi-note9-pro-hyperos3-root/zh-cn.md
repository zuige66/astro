---
title: Redmi Note 9 Pro 刷机与 Root
pubDate: 2026-10-07
draft: false
description: 记录一台代号 gauguin 的 Redmi Note 9 Pro 从 MIUI 14 线刷第三方 HyperOS 3 移植版，并核验内核 Root 的过程。
image: ""
slugId: redmi-note9-pro-hyperos3-root
category: 技术
pinTop: 0
---

本文记录一台 Redmi Note 9 Pro（设备代号 `gauguin`）从 MIUI 14 刷入第三方 HyperOS 3 移植版，并用 SukiSU Ultra 检查内核 Root 状态的实际过程。刷入后系统显示版本 `3.0.303.0.WJSCNXM.C06`，内核为 `4.19.157-moon-gc5e300589`，Android 版本为 16。

**这不是小米官方为该机型提供的 HyperOS 3 升级包，也不是适用于所有 Redmi Note 9 Pro 的通用教程。** 只有设备代号、硬件版本和刷机包说明完全匹配时才可参考。解锁 BL 和线刷都会清除数据；第三方系统和 Root 还会降低设备安全性，可能影响稳定性、售后、OTA 与部分应用。小米也提醒，解锁和刷写系统会带来数据暴露、数据损坏或设备无法启动等风险。[小米刷机风险说明](https://www.mi.com/global/support/faq/details/KA-523727/)

## 一、确认设备与准备文件

本次操作环境和结果如下：

| 项目 | 本次记录 |
| --- | --- |
| 设备 | Redmi Note 9 Pro |
| 设备代号 | `gauguin` |
| 处理器 | Qualcomm Snapdragon 750G |
| 原系统 | MIUI 14 |
| 刷入后版本 | `3.0.303.0.WJSCNXM.C06` |
| 内核 | `4.19.157-moon-gc5e300589` |
| Android | 16 |
| 电脑 | Windows |

开始前逐项确认：

1. 在手机“设置 → 我的设备 → 全部参数”查看型号和处理器信息。
2. 在刷机包说明、文件名和发布页核对设备代号为 `gauguin`。型号名称相同不代表不同地区版本可以共用刷机包。
3. 从刷机包作者发布渠道获取文件。本次原稿指向[酷安作者主页](https://www.coolapk.com/u/1184948)；主页不是具体版本的下载页，下载前仍需核实帖子、文件名和适配说明。
4. 准备 Mi Unlock、小米 MiFlash、与设备代号完全匹配的第三方 Fastboot 包，以及可用于恢复的官方 Fastboot ROM。小米官方 ROM 下载入口为[小米社区 ROM 下载](https://new.c.mi.com/global/roms)；若没有对应机型的官方救砖包，不要开始刷机。
5. 将文件解压到纯英文路径，例如：

```text
D:\ROM\gauguin\hyperos3
```

路径中避免中文、空格和特殊符号。备份照片、下载文件、验证码、聊天记录和需要迁移的应用数据，并确认备份可读取。

## 二、解锁 Bootloader

小米 Bootloader 解锁资格和流程会随系统、地区与账号规则变化。小米社区当前说明要求 HyperOS 用户按社区授权流程申请；该公告同时指出，MIUI 14 等旧系统仍保留此前的解锁方式。操作前先查看[小米 HyperOS 解锁规则](https://new.c.mi.com/global/post/673501)和[官方解锁工具入口](https://www.mi.com/global/unlock/)，以页面和 Mi Unlock 工具的最新提示为准。原稿记录的这台设备等待时间为 7 天，不代表其他账号的固定等待时间。

### 1、绑定小米账号

1. 打开“设置 → 我的设备”，连续点击 OS/MIUI 版本，直到系统提示开发者模式已开启。
2. 进入“设置 → 更多设置 → 开发者选项 → 设备解锁状态”。
3. 登录小米账号，选择“绑定账号和设备”，等待页面确认绑定成功。
4. 记录页面或 Mi Unlock 显示的等待时长。等待期间不要退出账号、解绑设备或恢复出厂设置；若页面要求其他条件，按当前提示处理。

### 2、使用 Mi Unlock

1. 关闭手机，同时按住“电源键 + 音量下键”进入 Fastboot 模式。
2. 使用数据线连接 Windows 电脑，打开 Mi Unlock，并登录手机上已绑定的同一小米账号。
3. 按工具提示检查设备和等待时间；等待期结束后再执行解锁。
4. 仅在工具明确显示解锁成功后继续。手机会清除数据并重新启动。

成功标志：Mi Unlock 显示解锁成功，或设备解锁状态页显示已解锁。若账号权限、绑定状态或等待时间不符合要求，先停止操作，不要使用第三方解锁服务绕过限制。

## 三、用 MiFlash 线刷

> **警告：** 以下步骤会清除手机数据。MiFlash 底部选择“全部删除 / clean all”，不要选择“全部删除并 lock / clean all and lock”。第三方 ROM 上重新锁定 Bootloader 可能导致设备无法启动或无法通过官方验证。

1. 关闭手机，同时按住“电源键 + 音量下键”进入 Fastboot，再通过稳定的数据线直连电脑。
2. 打开 MiFlash，点击“选择”，定位到第三方 Fastboot 包解压目录。
3. 点击“加载设备”或刷新，确认列表出现本机序列号。
4. 再次核对设备代号、刷机包来源和目录。确认刷机脚本属于该包后，在窗口底部选择 **全部删除（clean all）**。
5. 点击“刷机”。过程中不要拔线、关闭电脑或让手机断电；等待 MiFlash 显示 `flash done` 和 `success`。

本次线刷记录耗时约 342 秒。设备、电脑和包体不同，耗时会有差异。

![MiFlash 显示 flash done 与 success](/img/redmi-note9-pro-hyperos3/miflash-success.png)

## 四、检查系统启动

首次启动时间可能长于日常开机。进入桌面后打开“设置 → 我的设备”，核对机型和系统版本：

1. 设备名称为 Redmi Note 9 Pro。
2. 系统显示版本 `3.0.303.0.WJSCNXM.C06`。
3. 通话、移动网络、Wi-Fi、相机、充电和指纹等基础功能可以正常使用。

![澎湃 OS 3 系统版本与设备信息](/img/redmi-note9-pro-hyperos3/hyperos-version.jpg)

若手机长时间停留在开机动画、反复重启或触控异常，先强制关机并进入 Fastboot。核对包的设备代号和安装说明；确需恢复时，只使用适配该设备代号的官方 Fastboot ROM，恢复同样会清除数据。不要在第三方系统上重新锁定 Bootloader。

## 五、检查内核 Root

本次使用的第三方 ROM 已集成兼容 SukiSU 的 Root 内核，因此没有另外修补或刷入 `boot` 镜像。SukiSU Ultra 管理器用于读取和管理兼容内核中的 Root 接口；单独安装管理器 APK 不会给未集成 Root 的内核添加 Root。[SukiSU Ultra 官方仓库](https://github.com/SukiSU-Ultra/SukiSU-Ultra)

1. 从[SukiSU Ultra 官方 Releases](https://github.com/SukiSU-Ultra/SukiSU-Ultra/releases)获取管理器 APK 并安装。
2. 打开管理器，查看状态页是否显示“工作中”，并确认识别到设备和内核。
3. 仅向可信且确有需要的应用授予 Root 权限。不要安装不匹配的内核、KPM 或模块。

本次状态页显示 Root“工作中”、SELinux“强制执行”，KPM 显示“不支持（内核未配置）”。KPM 未配置不等于 Root 失效，也不应通过刷入其他设备的 KPM 文件来补齐。

![SukiSU Ultra 显示 Root 工作中](/img/redmi-note9-pro-hyperos3/sukisu-root.jpg)

出现管理器无法读取内核状态、频繁弹出授权请求或安装模块后异常重启时，停止添加模块并卸载最近安装项。无法进入系统时，按前述方式使用匹配的官方 Fastboot ROM 恢复。

## 六、常见问题

### MiFlash 不识别设备

确认手机停留在 Fastboot 界面，再刷新设备列表；更换数据线和 USB 接口，检查驱动是否安装。设备列表仍为空时不要开始刷机。

### 刷机后无法开机

首次启动先等待一段时间。仍停留在开机动画时，重新核对设备代号、包版本和分区要求；不要继续尝试随机刷入 `boot`、内核或其他设备的包。需要恢复时使用匹配的官方 Fastboot ROM。

### SukiSU 未识别 Root

确认当前 ROM 的发布说明明确写有集成 SukiSU 或兼容的 Root 内核。管理器 APK 只是管理端，不会替代内核支持。不要通过随机刷入模块或内核镜像来“补 Root”。

## 七、刷机后检查

- Bootloader 保持解锁，没有在第三方系统上重新上锁。
- MiFlash 显示 `success`，系统可以进入桌面。
- 设备代号、系统版本和刷机包说明一致。
- 通信、Wi-Fi、相机、充电、指纹等基础功能已逐项测试。
- SukiSU Ultra 显示 Root 正常；不支持的 KPM 保持未安装。
- 官方 Fastboot 救援包和个人数据备份仍保存在电脑中。

这份记录只说明一台 `gauguin` 设备的结果。Root 会扩大应用可访问的系统权限；只向可信应用授权，并为无法启动的情况预先准备匹配的官方恢复包。

## 相关链接

- [小米 Bootloader 解锁工具](https://www.mi.com/global/unlock/)
- [小米 HyperOS Bootloader 解锁规则](https://new.c.mi.com/global/post/673501)
- [小米社区官方 ROM 下载](https://new.c.mi.com/global/roms)
- [SukiSU Ultra 官方仓库与 Releases](https://github.com/SukiSU-Ultra/SukiSU-Ultra/releases)
- [本次刷机包发布者主页](https://www.coolapk.com/u/1184948)
