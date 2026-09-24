---
title: 轻量服务器入门
pubDate: 2026-09-23
draft: false
description: 记录购买阿里云新加坡轻量应用服务器后，如何检查防火墙、使用 Tabby 建立 SSH 连接、配置密钥登录并完成 Ubuntu 的基础初始化。
image: ""
slugId: aliyun-singapore-server-tabby
category: 技术
pinTop: 0
---

最近开了一台阿里云新加坡轻量应用服务器，系统是 Ubuntu 22.04。第一次从本地连接海外服务器时，需要先确认实例网络和 SSH 端口，再在终端软件里填写连接信息。

这篇文章记录我的入门流程：用 Tabby 建立 SSH 连接、检查服务器状态，再把密码登录换成 SSH 密钥登录。出于安全考虑，我没有公开自己的公网 IP、实例 ID、密码或私钥；文中的服务器地址用 `YOUR_SERVER_IP` 代替，项目目录统一写成 `taest`，方便跟着示例操作。

## 准备服务器信息

在阿里云轻量应用服务器控制台找到实例，先记录这些信息：

| 信息 | 用途 |
| --- | --- |
| 公网 IP 地址 | Tabby 连接服务器的地址 |
| SSH 端口 | 默认通常为 `22`，若改过端口则填写实际端口 |
| 登录用户名 | 初始账号按创建方式和镜像设置，常见为 `root` |
| 登录凭据 | 服务器密码，或之后配置的 SSH 私钥 |

## 检查阿里云防火墙

进入轻量应用服务器实例的**防火墙**页面，确认有一条允许 SSH 的入方向规则：

- 协议：TCP
- 端口：22（如果 SSH 使用了其他端口，就填写实际端口）
- 来源：优先限制为自己的公网 IP；临时排查时才考虑放宽

轻量应用服务器使用控制台中的防火墙规则管理入方向流量，不使用 ECS 的安全组。Linux 实例通常默认放行 22、80、443 端口，但仍应在控制台检查规则是否存在且已启用。[阿里云轻量应用服务器防火墙说明](https://help.aliyun.com/zh/simple-application-server/user-guide/manage-the-firewall-of-a-server)

如果实例内部还启用了 UFW，也要确认对应端口允许通过。Ubuntu 上可以用下面的命令查看状态：

```bash
sudo ufw status
```

如果 UFW 已启用且 SSH 端口没有放行，先添加规则再调整其他防火墙设置：

```bash
sudo ufw allow 22/tcp
```

如果你使用的不是 22 端口，请把命令中的 `22` 换成实际端口。修改远程登录防火墙时要保留当前 SSH 连接，确认新规则生效后再关闭旧规则，避免把自己锁在服务器外。

## 在 Tabby 创建 SSH 连接

Tabby 是一款支持 SSH 的终端工具，也提供连接配置和 SFTP 文件传输等功能。[Tabby 官方网站](https://tabby.sh/)介绍了它内置的 SSH 客户端和连接管理器。

1. 打开 Tabby，进入配置文件或连接管理页面，新增一个 **SSH** 配置。
2. 在主机（Host）中填写阿里云实例的公网 IP，例如 `YOUR_SERVER_IP`。
3. 端口（Port）填写 `22`，用户名（Username）填写实例实际使用的账号。
4. 首次连接可以选择密码认证，输入在阿里云控制台设置或重置的服务器密码。
5. 保存配置并连接。首次连接时，Tabby 会询问是否信任服务器主机密钥；确认这是自己的实例后再接受。

阿里云轻量服务器没有通用的默认登录密码。若尚未设置密码，可以在控制台重置服务器密码，然后再用 SSH 客户端登录。[阿里云轻量应用服务器新手指引](https://help.aliyun.com/zh/simple-application-server/getting-started/getting-started)

连接成功后会看到类似下面的命令行提示符：

```text
root@iZxxxx:~#
```

此时已经进入远程 Ubuntu 服务器。注意，终端里运行的命令会作用于服务器，而不是本地电脑。

## 首次登录后的基础检查

先确认登录用户、系统版本、磁盘和内存：

```bash
whoami
lsb_release -a
df -h
free -h
```

更新软件包索引并安装系统更新：

```bash
sudo apt update
sudo apt upgrade -y
```

如果更新了内核或系统核心组件，Ubuntu 可能会提示需要重启。可以在确认没有正在运行的重要任务后执行：

```bash
sudo reboot
```

服务器重启后，Tabby 当前连接会断开，等待实例恢复运行后重新连接即可。

## SSH 登录后常用命令

下面这些是我连上服务器后常用的命令。可以先记住“我在哪、我是谁、机器状态怎么样”，再去找项目目录。

### 先看懂命令怎么写

Linux 命令通常由“命令名 + 选项 + 操作对象”组成。比如：

```bash
ls -la /root
```

- `ls` 是 `list` 的缩写，表示列出内容。
- `-l` 表示长格式（long format），会显示权限、链接数、所有者、所属组、大小和修改时间等信息。
- `-a` 表示全部（all），包括名称以 `.` 开头的隐藏文件。
- `/root` 是要查看的目录；省略它时，`ls` 默认查看当前目录。

`-l` 和 `-a` 可以合并写成 `-la`，也可以写成 `-al`，效果相同。很多 Linux 命令都遵循这种习惯：短选项前面加一个减号，可以组合使用；长选项通常写成 `--` 开头，例如 `ls --all`。

执行 `ls -la` 后，每一行大致可以这样读：

```text
-rw-r--r--  1 root root  1234 Sep 24 10:00 notes.txt
│            │ │    │     │       │             └─ 文件名
│            │ │    │     │       └─ 修改时间
│            │ │    │     └─ 文件大小（字节）
│            │ │    └─ 所属组
│            │ └─ 所有者
│            └─ 硬链接数量
└─ 文件类型和权限
```

开头的权限串里，第一位表示类型（`-` 普通文件、`d` 目录、`l` 软链接），后面每三位一组，分别是所有者、所属组和其他用户的读（`r`）、写（`w`）、执行（`x`）权限。

| 写法 | 英文记法 | 好记的意思 |
| --- | --- | --- |
| `pwd` | print working directory | 打印当前工作目录，看看“我在哪” |
| `whoami` | who am I | 我是谁，显示当前用户名 |
| `id` | identity | 查看用户的 UID、GID 和所属组 |
| `hostname` | host name | 这台主机的名字 |
| `cd` | change directory | 切换目录 |
| `ls` | list | 列出目录内容 |
| `mkdir` | make directory | 创建目录 |
| `cat` | concatenate | 原意是连接文件；常用来直接显示文件内容 |
| `cp` | copy | 复制文件或目录 |
| `mv` | move | 移动或重命名文件 |
| `rm` | remove | 删除文件或目录 |
| `df` | disk free | 查看文件系统还剩多少空间 |
| `du` | disk usage | 查看文件或目录占用了多少空间 |
| `nproc` | number of processing units | 查看可用的处理器数量 |
| `ps` | process status | 查看进程状态 |
| `ss` | socket statistics | 查看网络套接字和监听端口 |
| `grep` | global regular expression print | 按文本模式查找匹配内容 |
| `uname` | Unix name | 查看系统和内核信息 |
| `apt` | Advanced Package Tool | Ubuntu 上安装和更新软件包的工具 |
| `chmod` | change mode | 修改文件权限 |
| `chown` | change owner | 修改文件所有者 |

有些常用写法不是英文首字母缩写，而是看参数来理解：

| 参数 | 英文记法 | 例子和含义 |
| --- | --- | --- |
| `-a` | all | `ls -a`：显示全部内容，包括隐藏文件 |
| `-l` | long | `ls -l`：用详细的长格式显示 |
| `-h` | human-readable | `df -h`、`free -h`：用 KB、MB、GB 等易读单位显示 |
| `-R` | recursive | `ls -R`：递归列出子目录 |
| `-d` | directory | `ls -ld /bin`：查看目录本身的信息，而不是列出目录里的内容 |

例如 `ss -tlnp` 可以拆成：`-t` 只看 TCP、`-l` 只看正在监听的端口、`-n` 直接显示数字端口、`-p` 同时显示相关进程。`ps aux` 中 `a`、`u`、`x` 是组合选项，用来查看更多用户和不挂在终端上的进程；这类老命令选项不一定都能按一个英文单词直译，记住它的用途更实用。

命令帮助可以用 `命令 --help` 查看，例如 `ls --help`。也可以用 `man ls` 打开手册页，按 `/关键词` 搜索，按 `q` 退出。记忆英文是帮助理解，具体行为还是以当前系统里的帮助信息为准。

命令行里还有几个常见连接符：`|` 是管道，把左边命令的输出交给右边命令；`&&` 表示左边成功后才运行右边；`;` 表示依次执行，前一条成功与否都继续执行。例如 `df -h; free -h; uptime` 会连续查看磁盘、内存和运行时间。

重定向也很常见。以 `find / -type d -name ".git" 2>/dev/null` 为例：`2>` 把错误输出重定向，`/dev/null` 是系统里的“丢弃口”，所以 `2>/dev/null` 的效果就是不显示错误信息。它不会隐藏正常找到的结果。

| 写法 | 英文记法 | 含义 |
| --- | --- | --- |
| `head` | head | 看文件或输出的开头；默认显示前 10 行 |
| `tail` | tail | 看文件或输出的末尾；常用来查看日志最后几行 |
| `wc` | word count | 统计行数、单词数或字符数；`wc -l` 只统计行数 |
| `systemctl` | system control | 管理 systemd 服务，例如查看 SSH 服务状态 |
| `sudo` | 常记作 “superuser do” | 临时以管理员权限运行命令；运行前要确认命令内容 |

例如：

```bash
ps aux | head                 # 把进程列表交给 head，只看开头几行
ls /usr/bin | wc -l           # 列出命令，再统计输出行数
tail -n 50 ~/deploy.log       # 看日志最后 50 行；-n 指定行数
find / -name "package.json" 2>/dev/null  # 找文件，同时丢弃错误输出
```

记住一条就够用：先认命令名，再看减号后面的选项，最后看路径或文件名；遇到不熟悉的写法，先查 `--help` 或 `man`，不要直接给不懂的命令加 `sudo`。

### 先确认位置和账号

| 命令 | 作用 | 例子 |
| --- | --- | --- |
| `pwd` | 显示当前所在目录 | 输出 `/root` |
| `whoami` | 显示当前用户名 | 输出 `root` |
| `hostname` | 查看这台机器的主机名 | 输出当前主机名 |
| `id` | 查看用户 ID 和所属用户组 | 输出 UID、GID 和 groups |

### 查看和切换目录

```bash
ls                         # 列出当前目录
ls -la                     # 显示详细信息和隐藏文件
ls -R                      # 递归列出子目录
cd /                       # 切换到根目录
cd ~                       # 回到当前用户的家目录
tree -L 2                  # 用树状结构显示两层目录
```

Ubuntu 默认可能没有 `tree`，需要先安装：

```bash
sudo apt update && sudo apt install tree -y
```

### 找到项目目录

项目通常放在家目录、`/opt` 或 `/var/www`。先看常见位置：

```bash
ls -la ~
ls -la /home /opt /var/www
```

也可以按项目特征搜索：

```bash
find / -type d -name ".git" 2>/dev/null
find / -name "package.json" 2>/dev/null
find / -type d -name "*taest*" 2>/dev/null
```

全盘搜索可能比较慢；如果已经大致知道项目放在哪里，先把 `/` 换成 `~`、`/opt` 或 `/var/www`，会更快一些。项目目录的例子统一写作 `taest`：

```bash
cd ~/taest && ls -la
```

### 快速了解系统

```bash
cd / && ls -la              # 查看根目录下的主要目录
ls -ld /bin /sbin /lib      # 查看系统目录及软链接信息
ls /usr/bin | wc -l         # 粗略统计 /usr/bin 中的命令数量
cat /etc/os-release         # 查看 Ubuntu 发行版信息
uname -a                    # 查看内核和系统架构信息
```

Ubuntu 中 `/bin`、`/sbin`、`/lib` 常会链接到 `/usr` 下对应目录。检查 `/tmp` 时要记得它用于临时文件，系统可能按自身策略定期清理其中的内容。

### 查看服务器状态

```bash
df -h                       # 查看各文件系统的磁盘使用量
du -sh ~/*                  # 查看家目录下各项的大小
free -h                     # 查看内存使用情况
nproc                       # 查看可用 CPU 核数
uptime                      # 查看运行时间和系统负载
top                         # 实时查看进程，按 q 退出
ps aux | head               # 快速查看进程列表
w                           # 查看当前登录用户和活动
```

### 查看网络和服务

```bash
ip addr                     # 查看网卡和 IP 地址
ss -tlnp                    # 查看 TCP 监听端口及进程
systemctl list-units --type=service --state=running  # 查看运行中的服务
```

### 检查项目和部署记录

进入项目目录后，可以用下面这些命令快速判断项目结构和最近的改动：

```bash
cd ~/taest && ls -la
git log --oneline -5        # 查看最近 5 次提交
git remote -v               # 查看 Git 远程仓库地址
cat requirements.txt        # 查看 Python 项目的依赖清单（如果有）
cat package.json            # 查看 Node.js 项目的依赖和脚本（如果有）
tail -n 50 ~/deploy.log     # 查看部署日志的最后 50 行
history                     # 查看当前账号的命令历史
```

查看配置、日志或命令历史时，注意不要把密码、访问令牌、私钥等凭据复制到公开位置。

### Ubuntu 目录结构速记

```text
/             根目录，整个文件系统的起点
├── etc/      系统和服务配置，例如 SSH、Nginx 配置
├── home/     普通用户的家目录
├── root/     root 用户的家目录
├── opt/      常见的第三方软件或自建项目目录
├── var/      经常变化的数据
│   ├── log/  系统和服务日志
│   └── www/  常见的网站文件目录
├── usr/      大量系统程序和共享文件
├── bin/      基础命令，Ubuntu 上常链接到 /usr/bin
├── tmp/      临时文件目录，内容可能被系统清理
└── proc/     提供进程和内核信息的虚拟文件系统
```

我自己的记法是：配置先去 `/etc` 找，项目先看 `/home`、`/opt` 和 `/var/www`，日志先看 `/var/log`，系统命令通常在 `/usr/bin`。

### 最实用的“五连击”

```bash
pwd; whoami; ls -la                    # 我在哪、我是谁、当前目录有什么
cd / && ls -la                         # 看系统根目录
find ~ -name ".git" 2>/dev/null       # 在家目录下找 Git 项目
df -h; free -h; uptime                 # 快速看磁盘、内存和负载
cd ~/taest && ls -la                   # 进入项目目录
```

熟悉这些基础命令后，遇到“项目在哪、端口有没有监听、磁盘是否满了”这类问题，就可以先在 Tabby 里自己定位。

## 建议改用 SSH 密钥登录

密码可以用于首次连接，但日常管理更适合使用 SSH 密钥。私钥留在自己的电脑上，服务器只保存与之对应的公钥；不要把私钥上传到服务器或提交到 Git 仓库。

### 在 Windows 生成密钥

在本地 PowerShell 中运行：

```powershell
ssh-keygen -t ed25519 -C "aliyun-tabby"
```

按提示选择保存位置，并为私钥设置一个口令。默认密钥通常保存在：

```text
C:\Users\你的用户名\.ssh\id_ed25519
C:\Users\你的用户名\.ssh\id_ed25519.pub
```

其中 `.pub` 文件是公钥，可以放到服务器；没有 `.pub` 后缀的文件是私钥，只留在本地。

### 将公钥放到服务器

先用 Tabby 的密码方式连接服务器，然后在服务器终端运行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

在本地 PowerShell 显示公钥内容：

```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
```

复制整行公钥，粘贴到服务器的 `authorized_keys` 文件中。保存退出后执行：

```bash
chmod 600 ~/.ssh/authorized_keys
```

然后在 Tabby 的 SSH 配置中选择密钥认证，并指向本地 `id_ed25519` 私钥文件。先新开一个 Tabby 连接测试密钥确实能登录，再考虑关闭密码认证；不要在密钥登录验证成功前关闭密码登录。

## 常见连接问题

### 连接超时

优先检查公网 IP 是否正确、实例是否运行，以及阿里云防火墙有没有放行 SSH 端口。若使用了 UFW 等系统防火墙，也要检查系统内部规则。阿里云建议在无法远程连接时逐项检查端口放行和本地网络。[远程连接常见问题](https://help.aliyun.com/zh/simple-application-server/user-guide/faq-about-remote-connection)

### Connection refused

这通常表示网络已经到达服务器，但目标端口没有 SSH 服务监听，或端口填写不正确。可以通过阿里云 Workbench 登录后检查服务：

```bash
sudo systemctl status ssh
sudo ss -tlnp | grep ssh
```

Ubuntu 的 SSH 服务单元通常名为 `ssh`。如果服务没有运行，可以检查安装和启动状态：

```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

### Permission denied

检查 Tabby 中的用户名、认证方式和密钥路径。密码登录时要确认密码是当前服务器密码；密钥登录时确认服务器 `authorized_keys` 中保存的是配对的公钥，并检查目录和文件权限。

## 小结

这台服务器的连接流程可以概括为：在阿里云确认公网 IP 和 SSH 端口、检查防火墙规则、在 Tabby 保存 SSH 配置，首次连接后完成系统更新，再切换为密钥登录。

海外服务器的访问速度会受本地网络、运营商路由、实例地域和线路等因素影响。新加坡只是实例所在地域，具体体验还要以自己的网络测试为准。配置完成后，Tabby 可以保存连接配置，后续打开配置就能登录，也可以使用 SFTP 浏览和传输服务器文件。
