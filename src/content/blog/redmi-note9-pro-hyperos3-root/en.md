---
title: Redmi Note 9 Pro HyperOS 3 and Root
pubDate: 2026-10-07
draft: false
description: A device-specific account of flashing a third-party HyperOS 3 port onto a Redmi Note 9 Pro codename gauguin and checking its built-in kernel root.
image: ""
slugId: redmi-note9-pro-hyperos3-root
category: Tutorials
pinTop: 0
---

This article documents one Redmi Note 9 Pro (`gauguin`) upgraded from MIUI 14 to a third-party HyperOS 3 port, followed by a check of its kernel root support with SukiSU Ultra. The flashed system reported version `3.0.303.0.WJSCNXM.C06`, kernel `4.19.157-moon-gc5e300589`, and Android 16.

**This is not an official Xiaomi HyperOS 3 upgrade for this model, nor a universal guide for every Redmi Note 9 Pro variant.** Use it only when the device codename, hardware variant, and ROM instructions all match. Bootloader unlocking and flashing erase data. A third-party ROM and root also reduce device security and may affect stability, service coverage, OTA updates, and some apps. Xiaomi warns that unlocking and flashing can expose or corrupt data and may leave a device unable to boot. [Xiaomi: Risks of flashing a phone](https://www.mi.com/global/support/faq/details/KA-523727/)

## 1. Confirm the device and prepare files

The recorded environment and result:

| Item | This device |
| --- | --- |
| Device | Redmi Note 9 Pro |
| Codename | `gauguin` |
| Processor | Qualcomm Snapdragon 750G |
| Original system | MIUI 14 |
| Flashed system | `3.0.303.0.WJSCNXM.C06` |
| Kernel | `4.19.157-moon-gc5e300589` |
| Android | 16 |
| Computer | Windows |

Before starting:

1. Check the model and processor under **Settings → About phone → All specs**.
2. Confirm `gauguin` in the ROM notes, archive name, and release page. Identical product names do not guarantee that regional hardware variants share the same ROM.
3. Obtain the ROM from its publisher. The source notes link to the [Coolapk profile of the publisher](https://www.coolapk.com/u/1184948), not to a specific release file; verify the post, archive name, and device support before downloading.
4. Prepare Mi Unlock, Xiaomi MiFlash, the third-party Fastboot ROM for this exact codename, and an official Fastboot ROM that can restore this device. Xiaomi's [official ROM download portal](https://new.c.mi.com/global/roms) is the reference for official recovery files. Do not proceed without a matching recovery package.
5. Extract the files to a plain English path, for example:

```text
D:\ROM\gauguin\hyperos3
```

Avoid Chinese characters, spaces, and special characters in the path. Back up photos, downloads, authentication codes, chats, and app data, then verify that the backup can be read.

## 2. Unlock the bootloader

Xiaomi's bootloader eligibility and process vary by system version, region, and account. The current Xiaomi Community notice asks HyperOS users to apply through its authorization flow and says older systems such as MIUI 14 retain the previous method. Review the [Xiaomi HyperOS unlock rules](https://new.c.mi.com/global/post/673501) and the [official unlock tool page](https://www.mi.com/global/unlock/) before starting. Follow the current on-device and Mi Unlock prompts. The source records a seven-day wait for this account; that is not a guaranteed wait for other accounts.

### 1. Bind the Xiaomi account

1. Open **Settings → About phone** and tap the OS/MIUI version repeatedly until Developer options are enabled.
2. Open **Settings → Additional settings → Developer options → Mi Unlock status**.
3. Sign in to the Xiaomi account and select **Add account and device**. Wait for the confirmation that binding succeeded.
4. Record the wait time shown by the phone or Mi Unlock. During the wait, do not sign out, unbind the device, or factory-reset it. Follow any additional on-screen requirements.

### 2. Use Mi Unlock

1. Power off the phone, then hold **Power + Volume Down** to enter Fastboot mode.
2. Connect the phone directly to the Windows computer and open Mi Unlock. Sign in with the same Xiaomi account bound on the phone.
3. Check the tool's device and wait-time messages. Unlock only after the wait period ends.
4. Continue only when the tool explicitly reports success. The phone will erase its data and reboot.

Success indicator: Mi Unlock reports success, or the device unlock-status page shows that the bootloader is unlocked. If account permission, binding, or the wait period is not satisfied, stop. Do not use third-party unlock services to bypass the restrictions.

## 3. Flash with MiFlash

> **Warning:** These steps erase the phone. In MiFlash, choose **Clean all**. Do not choose **Clean all and lock**. Relocking the bootloader on a third-party ROM can prevent the device from booting or passing official verification.

1. Power off the phone, hold **Power + Volume Down** to enter Fastboot, and connect it directly to the computer with a reliable cable.
2. Open MiFlash, select **Select**, and choose the extracted third-party Fastboot ROM directory.
3. Select **Refresh** and confirm that the device serial number appears.
4. Recheck the codename, ROM source, and directory. Confirm that the included flashing script belongs to this package, then select **Clean all** at the bottom of the window.
5. Select **Flash**. Do not disconnect the cable, shut down the computer, or let the phone lose power. Wait for MiFlash to show `flash done` and `success`.

The recorded flash took about 342 seconds. Timing varies with the device, computer, and package size.

![MiFlash showing flash done and success](/img/redmi-note9-pro-hyperos3/miflash-success.png)

## 4. Verify the system boot

The first boot may take longer than usual. After the home screen appears, open **Settings → About phone** and check:

1. The device is still identified as Redmi Note 9 Pro.
2. The system reports version `3.0.303.0.WJSCNXM.C06`.
3. Calls, mobile data, Wi-Fi, camera, charging, and fingerprint work.

![HyperOS 3 system version and device information](/img/redmi-note9-pro-hyperos3/hyperos-version.jpg)

If the phone remains on the boot animation, repeatedly restarts, or has touch problems, force it off and enter Fastboot. Recheck the ROM codename and instructions. For recovery, use only an official Fastboot ROM that matches the device; recovery also erases data. Do not relock the bootloader on a third-party system.

## 5. Check kernel root

The third-party ROM used in this test already included a kernel with SukiSU-compatible root support, so no separate `boot` image patch or flash was performed. SukiSU Ultra Manager reads and manages root access exposed by a compatible kernel; installing the manager APK alone does not add root to a kernel without that support. [SukiSU Ultra official repository](https://github.com/SukiSU-Ultra/SukiSU-Ultra)

1. Download and install the manager APK from [SukiSU Ultra's official Releases](https://github.com/SukiSU-Ultra/SukiSU-Ultra/releases).
2. Open the manager and check that the status shows **Working** and identifies the device and kernel.
3. Grant root only to trusted apps with a clear need. Do not install mismatched kernels, KPM files, or modules.

The recorded status showed root **Working**, SELinux **Enforcing**, and KPM **Unsupported (kernel not configured)**. An unconfigured KPM does not mean root is broken; do not flash KPM files built for another device.

![SukiSU Ultra showing root working](/img/redmi-note9-pro-hyperos3/sukisu-root.jpg)

If the manager cannot read kernel status, repeatedly requests authorization, or the device becomes unstable after a module install, stop adding modules and remove the latest one. If Android no longer boots, restore with the matching official Fastboot ROM.

## 6. Troubleshooting

### MiFlash does not detect the phone

Keep the phone on the Fastboot screen and refresh the device list. Try another cable or USB port and check that the drivers are installed. Do not flash while the device list is empty.

### The phone will not boot after flashing

Allow extra time for the first boot. If the boot animation persists, recheck the codename, package version, and partition requirements. Do not randomly flash another `boot` image, kernel, or device package. Use the matching official Fastboot ROM for recovery.

### SukiSU does not detect root

Confirm that the ROM release notes explicitly say the kernel includes SukiSU or compatible root support. The manager is only the control app; kernel support is still required. Do not try to “add root” by flashing random modules or kernel images.

## 7. Post-flash checklist

- The bootloader remains unlocked; it was not relocked on the third-party system.
- MiFlash reported `success`, and Android reaches the home screen.
- The device codename and system version match the ROM notes.
- Calls, Wi-Fi, camera, charging, fingerprint, and other core functions have been tested.
- SukiSU Ultra reports root working; unsupported KPM files remain uninstalled.
- The official Fastboot recovery package and personal-data backup remain available on the computer.

This record covers one `gauguin` device only. Root gives apps broader system access. Grant it only to trusted apps, and prepare a matching official recovery package before making changes.

## Related links

- [Xiaomi Bootloader unlock tool](https://www.mi.com/global/unlock/)
- [Xiaomi HyperOS bootloader unlock rules](https://new.c.mi.com/global/post/673501)
- [Xiaomi Community official ROM downloads](https://new.c.mi.com/global/roms)
- [SukiSU Ultra official repository and releases](https://github.com/SukiSU-Ultra/SukiSU-Ultra/releases)
- [Publisher profile for the ROM used in this record](https://www.coolapk.com/u/1184948)
