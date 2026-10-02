---
title: Tabby vs. MobaXterm for SSH
pubDate: 2026-10-02
draft: false
description: A hands-on comparison of Tabby and MobaXterm, covering their interfaces, SSH workflow, file transfer, best use cases, and basic connection setup.
image: ""
slugId: tabby-vs-mobaxterm-ssh-key-docker
category: Tutorials
pinTop: 0
---

I recently started managing my own servers. I first tried Tabby and later started using MobaXterm. Both can connect to Linux servers over SSH, save connection details, use keys, and transfer files, but they feel quite different in day-to-day use.

I currently use MobaXterm more often. Its interface is not as clean-looking as Tabby's, but commands feel more responsive and stable in my environment. I like Tabby's graphical interface and tab design, though typing commands after connecting to a server occasionally feels a little laggy. This article compares the tools and covers their most basic connection workflows; it does not discuss server deployment.

The examples use `YOUR_SERVER_IP` for the server address and `root` as the sample username. Replace them with your own public IP, port, and username. Do not publish your password, private key, or real server details in an article or screenshot.

## The short version

If you mainly manage servers on Windows and want responsive SSH input, a server file browser right beside the terminal, and occasional access to remote desktop, X11, or other protocols, I suggest trying **MobaXterm** first.

If you care about a polished interface, want the same terminal on Windows, macOS, and Linux, or prefer tabs, split panes, and a customizable terminal experience, **Tabby** is worth a look.

Neither tool is always better. What matters most for SSH is whether typing feels comfortable and the connection is stable. I currently use MobaXterm as my main client and keep Tabby as a more visually relaxed option for browsing with multiple tabs.

## What are these tools?

### Tabby: more like a modern terminal

Tabby is a cross-platform terminal application for Windows, macOS, and Linux. It can manage SSH connections and also supports tabs, split panes, SFTP, jump hosts, and port forwarding.[Tabby feature overview](https://tabby.sh/about/features)

My first impression was its clean interface. Profiles, themes, tabs, and split panes all feel modern. If you also use PowerShell, Git Bash, or WSL locally, Tabby can bring those terminals together in one application.

### MobaXterm: more like a Windows remote-access toolbox

MobaXterm is closer to an all-in-one remote connection toolbox for Windows. Alongside SSH, it includes an SFTP file browser, RDP, VNC, FTP, X11, and other features.[MobaXterm documentation](https://mobaxterm.mobatek.net/documentation.html)

One thing I like is that after an SSH login, I can usually see the server's files on the left without opening a separate transfer application. For someone new to server administration, having the terminal and files on the same screen feels very straightforward.

## Side-by-side comparison

| Area | Tabby | MobaXterm |
| --- | --- | --- |
| Platforms | Windows, macOS, and Linux | Primarily Windows |
| Interface | Clean and modern, with an emphasis on the terminal experience and themes | Feature-dense, more like a traditional remote administration tool |
| SSH typing in my setup | I occasionally notice a little lag | Input and echo feel more responsive in my setup |
| Saved connections | Save SSH profiles for reuse | Save sessions; useful for managing multiple machines |
| File transfer | Supports SFTP | Often shows an SFTP file tree alongside an SSH session |
| Tabs and split panes | A strong point | Supports multiple sessions and tabs, with a stronger focus on remote administration |
| Other protocols | Primarily terminal and SSH workflows | Integrates RDP, VNC, FTP, X11, and more |
| Best fit | People who like modern terminals and cross-platform use | People managing servers on Windows who want an all-in-one workflow |

### Interface and day-to-day use

Tabby's settings, icons, themes, and tab bar are pleasant to use, especially if you keep many terminal sessions open. Split panes are handy too: for example, you can watch logs on one side and run commands on the other, or connect to two servers at once.

MobaXterm shows more information on screen and may feel a little complex at first, but its remote-access tools are easy to find. The SFTP file tree that appears after an SSH login is particularly convenient for uploading, downloading, and dragging files.

### Why might command input feel laggy?

Lag while typing SSH commands is not necessarily caused by Tabby itself. Network latency, server load, terminal rendering, fonts, and plugins can all contribute. MobaXterm feels smoother to me, so I currently prefer it; that is my personal experience and does not mean Tabby will be slow on every computer or server.

To narrow down the cause, test both clients against the same server, network, and account. Type several short commands and watch how quickly the characters appear; then try commands such as `ping` and `top` to check whether the network or server is slow too. If only Tabby lags, try changing its theme or font, disabling plugins, or restarting it. If both clients lag, the network or server is a more likely cause.

## Basic MobaXterm workflow

This is the client I currently use more often.

### Create an SSH session

1. Open MobaXterm and click **Session** in the upper-left corner.
2. Choose **SSH**.
3. Enter the server's public IP in **Remote host**, for example `YOUR_SERVER_IP`.
4. Select **Specify username** and enter the server account, for example `root`.
5. The default SSH port is `22`. If the server uses a different port, enter that number in **Port**.
6. Click **OK** to connect. The first time, MobaXterm asks you to confirm the server's host fingerprint. Accept it only after confirming that the server is yours.

When logging in with a password for the first time, the terminal prompts you to enter the server password. It normally shows no stars or characters while you type. That is expected; press Enter when you are done.

After a successful connection, MobaXterm saves the machine in the **Sessions** list on the left. Double-click the session next time to reconnect without re-entering the IP and username.

### Transfer files with the SFTP pane

After an SSH login, MobaXterm usually displays the server's directory tree on the left. This is an SFTP file browser.

- To upload from your computer, drag a file into the appropriate directory on the left or use the upload button.
- To download from the server, select a server file and choose where to save it locally.
- To create, rename, or delete files, check the current path and target first, then use the context menu.

The terminal and SFTP pane show files on the same server under the same login account. For example, if the terminal is in `/root`, the file tree will generally show locations that account can access. Before deleting or overwriting files, I use `pwd` and `ls -la` in the terminal to confirm the directory, then operate on the file in the pane.

### A few handy interface actions

- **Open another session:** Double-click a saved server on the left to connect in a new tab.
- **Disconnect:** Close the corresponding tab. This does not stop programs running on the server.
- **Copy text:** Copy commands and error messages as text rather than only taking a screenshot; text is easier to troubleshoot later.
- **Save passwords:** This is possible, but I recommend switching to SSH keys instead of storing a password in the client long-term.

## Basic Tabby workflow

The SSH setup in Tabby follows the same general steps as in MobaXterm, though the interface is organized differently.

1. Open Tabby's settings or connection manager and create a new **SSH profile**.
2. Enter the host `YOUR_SERVER_IP`, port `22`, and your login username.
3. For your first connection, use the server's current authentication method. You can select a private key in the profile later.
4. Save the profile, return to the main screen, and open it to start the SSH session.

Profiles make it easy to organize common connections. You might name them “Singapore server,” “Test server,” or “Local WSL” instead of distinguishing them only by IP address. Tabby also supports multiple tabs and split panes in the same window. If, like me, you find SSH input less comfortable in Tabby, there is no need to force yourself to use it as your primary client.

## Both tools support SSH keys

SSH keys work the same way in Tabby and MobaXterm: keep the private key on your computer, and put its matching public key in the server user's `~/.ssh/authorized_keys`. In the client, select the **private key** stored locally. Never upload the private key to the server or share it with anyone.

The detailed setup can be covered separately. For choosing between these clients, remember that changing SSH applications does not require generating another key pair. With the correct username and server address, either tool can connect to the same server using the same private key.

## Which one I use

I currently use MobaXterm to connect to my servers because responsive command input matters to me, and the SFTP pane on the left is convenient. Tabby's graphical interface, tabs, and overall visual design are genuinely appealing to me. I may use it more again if input feels more stable in my environment or if I need to manage terminals across platforms.

You do not have to settle on one tool permanently. Start with whichever client feels comfortable and reliably handles your connections and file transfers, then build your workflow from there.
