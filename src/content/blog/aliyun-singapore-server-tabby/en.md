---
title: Getting Started with a Lightweight Server
pubDate: 2026-09-23
draft: false
description: A beginner's guide to checking the firewall, connecting to an Aliyun Singapore Lightweight Application Server with Tabby, setting up SSH key authentication, and performing basic Ubuntu setup.
image: ""
slugId: aliyun-singapore-server-tabby
category: Tutorials
pinTop: 0
---

I recently set up an Aliyun Singapore Lightweight Application Server running Ubuntu 22.04. When connecting to a server in another region for the first time, check its network access and SSH port before entering the connection details in a terminal client.

This guide records my first steps: connecting with Tabby, checking the server, and replacing password authentication with an SSH key. For security, I have not included my public IP address, instance ID, password, or private key. The server address is shown as `YOUR_SERVER_IP`, and the example project directory is named `taest` throughout.

## Server details to collect

In the Aliyun Lightweight Application Server console, open your instance and note the following:

| Detail | Purpose |
| --- | --- |
| Public IP address | The address Tabby connects to |
| SSH port | Usually `22` by default; use the actual port if it has been changed |
| Login username | Depends on how the instance and image were created; `root` is common |
| Login credentials | The server password, or the SSH private key you configure later |

## Check the Aliyun firewall

Open the instance's **Firewall** page and make sure there is an inbound rule that allows SSH:

- Protocol: TCP
- Port: `22` (or the actual port if SSH uses a different one)
- Source: limit access to your public IP when possible; only broaden it temporarily while troubleshooting

The Lightweight Application Server manages inbound traffic with firewall rules in its own console; it does not use ECS security groups. Linux instances commonly allow ports 22, 80, and 443 by default, but check that the rule exists and is enabled.[Aliyun: Manage the firewall of a server](https://help.aliyun.com/zh/simple-application-server/user-guide/manage-the-firewall-of-a-server)

If UFW is enabled inside Ubuntu, make sure it allows the SSH port too. Check its status with:

```bash
sudo ufw status
```

If UFW is active and SSH is not allowed, add a rule before changing any other firewall settings:

```bash
sudo ufw allow 22/tcp
```

Replace `22` with your actual port if necessary. When changing firewall rules on a remote server, keep your current SSH session open. Verify that the new rule works before removing the old one, so you do not lock yourself out.

## Create an SSH connection in Tabby

Tabby is a terminal application with an SSH client, saved connection profiles, and SFTP file transfer. Its [official website](https://tabby.sh/) describes its built-in SSH client and connection manager.

1. Open Tabby's profile or connection manager and create a new **SSH** profile.
2. Enter the Aliyun instance's public IP in **Host**, for example `YOUR_SERVER_IP`.
3. Set **Port** to `22` and **Username** to the account used by your instance.
4. For the first connection, you can select password authentication and enter the server password set or reset in the Aliyun console.
5. Save the profile and connect. The first time you connect, Tabby will ask whether to trust the server's host key. Accept it only after confirming that you are connecting to your own instance.

Aliyun Lightweight Application Servers do not have a universal default login password. If you have not set one yet, reset the server password in the console before connecting with an SSH client.[Aliyun: Getting started with a Lightweight Application Server](https://help.aliyun.com/zh/simple-application-server/getting-started/getting-started)

Once connected, you should see a shell prompt similar to:

```text
root@iZxxxx:~#
```

You are now working on the remote Ubuntu server. Commands entered here run on the server, not on your local computer.

## Basic checks after your first login

Check the current user, Ubuntu version, disk space, and memory:

```bash
whoami
lsb_release -a
df -h
free -h
```

Refresh the package index and install available system updates:

```bash
sudo apt update
sudo apt upgrade -y
```

After a kernel or core system update, Ubuntu may recommend a restart. If no important jobs are running, you can restart with:

```bash
sudo reboot
```

The restart disconnects your current Tabby session. Wait for the instance to come back online, then reconnect.

## Handy commands over SSH

These are the commands I use most after connecting. Start by checking where you are, which account you are using, and how the machine is doing; then look for your project directory.

### Understanding command syntax

Linux commands usually follow the pattern “command name + options + target.” For example:

```bash
ls -la /root
```

- `ls` is short for `list`; it displays directory contents.
- `-l` selects the long format, showing permissions, link count, owner, group, size, and modification time.
- `-a` means “all,” including hidden names that start with `.`.
- `/root` is the directory to inspect. If omitted, `ls` lists the current directory.

The short options `-l` and `-a` can be combined as `-la` or `-al`. Many Linux commands use this convention: short options start with a single hyphen and can be combined, while long options usually start with `--`, as in `ls --all`.

The output from `ls -la` might look like this:

```text
-rw-r--r--  1 root root  1234 Sep 24 10:00 notes.txt
│            │ │    │     │       │             └─ file name
│            │ │    │     │       └─ modification time
│            │ │    │     └─ file size in bytes
│            │ │    └─ group
│            │ └─ owner
│            └─ hard-link count
└─ file type and permissions
```

In the permissions string, the first character indicates the file type (`-` for a regular file, `d` for a directory, and `l` for a symbolic link). The remaining characters form three groups for the owner, group, and other users, showing read (`r`), write (`w`), and execute (`x`) permissions.

| Command | Common expansion | What it does |
| --- | --- | --- |
| `pwd` | print working directory | Print the current directory (“Where am I?”) |
| `whoami` | who am I | Show the current username |
| `id` | identity | Show the UID, GID, and group memberships |
| `hostname` | host name | Show the machine's host name |
| `cd` | change directory | Change the current directory |
| `ls` | list | List files and directories |
| `mkdir` | make directory | Create a directory |
| `cat` | concatenate | Originally joins files; commonly used to print a file's contents |
| `cp` | copy | Copy files or directories |
| `mv` | move | Move or rename files |
| `rm` | remove | Remove files or directories |
| `df` | disk free | Show free space on file systems |
| `du` | disk usage | Show how much space files or directories use |
| `nproc` | number of processing units | Show the number of available CPU cores |
| `ps` | process status | Show process information |
| `ss` | socket statistics | Show network sockets and listening ports |
| `grep` | global regular expression print | Search text for matching patterns |
| `uname` | Unix name | Show operating system and kernel information |
| `apt` | Advanced Package Tool | Install and update packages on Ubuntu |
| `chmod` | change mode | Change file permissions |
| `chown` | change owner | Change a file's owner |

Some useful options are easier to learn by looking at how they are used:

| Option | Meaning | Example |
| --- | --- | --- |
| `-a` | all | `ls -a`: include hidden files |
| `-l` | long | `ls -l`: use the detailed long format |
| `-h` | human-readable | `df -h` and `free -h`: show sizes in readable units such as KB, MB, and GB |
| `-R` | recursive | `ls -R`: list subdirectories recursively |
| `-d` | directory | `ls -ld /bin`: show information about the directory itself rather than its contents |

For example, `ss -tlnp` selects TCP sockets (`-t`), listening sockets (`-l`), numeric addresses and ports (`-n`), and process information (`-p`). In `ps aux`, `a`, `u`, and `x` are a traditional combination of options for showing processes from more users, including processes not attached to a terminal. Not every legacy option maps neatly to an English word, so learning what it does is more useful than memorizing an expansion.

Use `command --help` to see a command's options, such as `ls --help`. You can also open a manual page with `man ls`, search by typing `/keyword`, and press `q` to exit. English expansions can help with memory, but check your system's help text for the command's exact behavior.

Command-line connectors are useful too. A pipe (`|`) sends the output of the command on the left to the command on the right. `&&` runs the next command only if the previous one succeeds; `;` runs commands in sequence regardless of the previous result. For example, `df -h; free -h; uptime` checks disk, memory, and uptime one after another.

Redirection is common as well. In `find / -type d -name ".git" 2>/dev/null`, `2>` redirects error output and `/dev/null` discards it. This suppresses errors without hiding matching results.

| Command | Common expansion | What it does |
| --- | --- | --- |
| `head` | head | Show the beginning of a file or output; defaults to 10 lines |
| `tail` | tail | Show the end of a file or output; useful for recent log entries |
| `wc` | word count | Count lines, words, or characters; `wc -l` counts lines |
| `systemctl` | system control | Manage systemd services, for example by checking SSH status |
| `sudo` | often remembered as “superuser do” | Run a command with administrator privileges; inspect the command first |

Examples:

```bash
ps aux | head                              # Show only the beginning of the process list
ls /usr/bin | wc -l                        # Count the output lines from ls
tail -n 50 ~/deploy.log                    # Show the last 50 log lines; -n sets the line count
find / -name "package.json" 2>/dev/null    # Search for files while discarding errors
```

The basic pattern is simple: identify the command, read its options, then check its path or file arguments. If a command is unfamiliar, read `--help` or `man` first. Do not add `sudo` to a command you do not understand.

### Check your location and account

| Command | Purpose | Example result |
| --- | --- | --- |
| `pwd` | Show the current directory | `/root` |
| `whoami` | Show the current username | `root` |
| `hostname` | Show the machine's host name | The current host name |
| `id` | Show the user ID and groups | UID, GID, and groups |

### List and change directories

```bash
ls                         # List the current directory
ls -la                     # Show details and hidden files
ls -R                      # List subdirectories recursively
cd /                       # Change to the filesystem root
cd ~                       # Return to the current user's home directory
tree -L 2                  # Display two directory levels as a tree
```

Ubuntu may not include `tree` by default. Install it first if you need it:

```bash
sudo apt update && sudo apt install tree -y
```

### Find your project directory

Projects are often stored in a home directory, `/opt`, or `/var/www`. Check the usual places first:

```bash
ls -la ~
ls -la /home /opt /var/www
```

You can also search for common project markers:

```bash
find / -type d -name ".git" 2>/dev/null
find / -name "package.json" 2>/dev/null
find / -type d -name "*taest*" 2>/dev/null
```

A full-disk search can be slow. If you know roughly where the project is, search `~`, `/opt`, or `/var/www` instead of `/`. The example project directory is consistently named `taest`:

```bash
cd ~/taest && ls -la
```

### Quick system overview

```bash
cd / && ls -la              # Show the main directories at the filesystem root
ls -ld /bin /sbin /lib      # Inspect system directories and symbolic links
ls /usr/bin | wc -l         # Roughly count entries in /usr/bin
cat /etc/os-release         # Show the Ubuntu release information
uname -a                    # Show kernel and system architecture information
```

On Ubuntu, `/bin`, `/sbin`, and `/lib` may link to the corresponding directories under `/usr`. Remember that `/tmp` is for temporary files and the system may periodically clean it.

### Check server health

```bash
df -h                       # Check disk usage for each file system
du -sh ~/*                  # Check the size of items in the home directory
free -h                     # Check memory usage
nproc                       # Show the available CPU core count
uptime                      # Show uptime and system load
top                         # Monitor processes; press q to exit
ps aux | head               # Quickly inspect the process list
w                           # Show logged-in users and activity
```

### Check networking and services

```bash
ip addr                     # Show network interfaces and IP addresses
ss -tlnp                    # Show listening TCP ports and related processes
systemctl list-units --type=service --state=running  # List running services
```

### Check a project and its deployment history

From the project directory, these commands help you understand its structure and recent changes:

```bash
cd ~/taest && ls -la
git log --oneline -5        # Show the five most recent commits
git remote -v               # Show the Git remote repository URLs
cat requirements.txt        # Show a Python project's dependencies, if present
cat package.json            # Show a Node.js project's dependencies and scripts, if present
tail -n 50 ~/deploy.log      # Show the last 50 lines of a deployment log
history                     # Show the current user's command history
```

When inspecting configuration, logs, or command history, do not copy passwords, access tokens, private keys, or other credentials into public locations.

### A quick map of Ubuntu directories

```text
/             filesystem root
├── etc/      system and service configuration, including SSH and Nginx
├── home/     regular users' home directories
├── root/     the root user's home directory
├── opt/      third-party software and self-hosted projects
├── var/      data that changes frequently
│   ├── log/  system and service logs
│   └── www/  a common location for website files
├── usr/      many system programs and shared files
├── bin/      basic commands; often linked to /usr/bin on Ubuntu
├── tmp/      temporary files that the system may clean up
└── proc/     virtual files that provide process and kernel information
```

My shorthand is: look in `/etc` for configuration, `/home`, `/opt`, and `/var/www` for projects, `/var/log` for logs, and usually `/usr/bin` for system commands.

### Five useful command combinations

```bash
pwd; whoami; ls -la                    # Where am I, who am I, and what is here?
cd / && ls -la                         # Inspect the filesystem root
find ~ -name ".git" 2>/dev/null       # Find Git repositories in the home directory
df -h; free -h; uptime                 # Check disk, memory, and load
cd ~/taest && ls -la                   # Open the example project directory
```

Once you know these basics, you can use Tabby to start investigating questions like “Where is my project?”, “Is a port listening?”, and “Is the disk full?”

## Switch to SSH key authentication

You can use a password for the first connection, but an SSH key is a better choice for routine administration. Keep the private key on your own computer; only its matching public key belongs on the server. Never upload the private key to the server or commit it to a Git repository.

### Generate a key on Windows

Run this in your local PowerShell:

```powershell
ssh-keygen -t ed25519 -C "aliyun-tabby"
```

Choose where to save the key when prompted, and set a passphrase for the private key. The default files are usually:

```text
C:\Users\YourUsername\.ssh\id_ed25519
C:\Users\YourUsername\.ssh\id_ed25519.pub
```

The `.pub` file is the public key and can be installed on the server. The file without the `.pub` suffix is the private key; keep it on your local computer.

### Install the public key on the server

First connect with your password in Tabby. On the server, create the SSH directory and open the authorized keys file:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

On your local computer, display the public key in PowerShell:

```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
```

Copy the entire public key line into `authorized_keys` on the server. Save and close the file, then set its permissions:

```bash
chmod 600 ~/.ssh/authorized_keys
```

In your Tabby SSH profile, select key authentication and point it to your local `id_ed25519` private key. Open a second Tabby connection to verify that the key works before considering whether to disable password authentication. Do not turn off password access until you have confirmed key login.

## Common connection problems

### Connection timed out

First check that the public IP is correct, the instance is running, and the Aliyun firewall allows inbound traffic on the SSH port. If UFW or another system firewall is enabled, check those rules too. Aliyun recommends checking port rules and the local network when a remote connection fails.[Aliyun: Remote connection FAQ](https://help.aliyun.com/zh/simple-application-server/user-guide/faq-about-remote-connection)

### Connection refused

This usually means the network reached the server, but no SSH service is listening on that port, or the port number is wrong. Sign in with Aliyun Workbench and check the service:

```bash
sudo systemctl status ssh
sudo ss -tlnp | grep ssh
```

The SSH service unit on Ubuntu is usually named `ssh`. If it is not running, check that the server package is installed and start the service:

```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

### Permission denied

Check the username, authentication method, and key path in Tabby. For password login, make sure you are using the current server password. For key login, confirm that `authorized_keys` contains the matching public key and that the directory and file permissions are correct.

## Final checklist

The connection process is: confirm the public IP and SSH port in Aliyun, check the firewall rules, save an SSH profile in Tabby, update the system after the first login, and then switch to key-based authentication.

Connection speeds to an overseas server depend on your local network, carrier routing, the instance region, and the network route. Singapore identifies the instance's region; test the actual connection from your own network to see how it performs. Once Tabby has saved the profile, you can reuse it to connect and use SFTP to browse or transfer files.
