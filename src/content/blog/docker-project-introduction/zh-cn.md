---
title: Docker的认识与使用
pubDate: 2026-10-03
draft: false
description: 从 Docker 镜像和容器入门，掌握基本操作、数据持久化、多服务管理、更新回滚与故障排查。
image: ""
slugId: docker-project-introduction
category: 技术
pinTop: 0
---

第一次接触 Docker 时，最容易把它想成一台缩小版的虚拟机。这样理解不算完全错，但会错过 Docker 真正有用的地方。

Docker 负责把代码、依赖和启动方式装进一个可重复运行的环境。项目换一台机器，或者重新部署一次，尽量还是原来的样子。对需要长期运行的服务来说，这比在服务器上手动安装一堆软件可靠得多。

## Docker 是什么

Docker 里最常见的几个词，可以先这样记：

- 镜像是运行环境的模板，里面有代码、依赖和启动方式；
- 容器是镜像启动后的实例，可以启动、停止、重启和删除；
- Dockerfile 是构建镜像的说明书；
- 数据卷用来保存容器之外的重要数据；
- Docker Compose 用来管理多个容器。

镜像和容器的关系很像程序文件和运行中的程序。镜像可以反复使用，容器则是一次具体的运行。

容器可以随时重建，所以数据库、上传文件和业务数据不应该只放在容器内部。它们需要通过数据卷或目录映射保存到容器之外。

## 先跑一个容器

安装 Docker 后，可以先确认命令行和 Docker 服务是否正常：

```bash
docker --version
docker run hello-world
```

接着运行一个简单的 Web 容器：

```bash
docker run -d --name demo-web -p 8080:80 nginx
```

这条命令里，`-d` 表示后台运行，`--name` 给容器起一个名字，`-p 8080:80` 把宿主机的 8080 端口映射到容器的 80 端口。

启动后可以访问 `http://localhost:8080`。端口映射就是容器和外部世界之间的入口；没有映射时，容器里的服务通常只能被 Docker 网络中的其他容器访问。

常用的查看和控制命令：

```bash
docker ps
docker ps -a
docker stop demo-web
docker start demo-web
docker rm demo-web
```

`docker ps` 查看正在运行的容器，`docker ps -a` 会把已经停止的容器也列出来。删除容器不会自动删除镜像。

## 镜像从哪来

镜像一般来自公共镜像仓库、私有镜像仓库，或者本地构建。

查看本地镜像：

```bash
docker image ls
```

拉取一个镜像：

```bash
docker pull nginx:latest
```

镜像名后面的标签用来区分版本。学习时使用 `latest` 没问题，生产环境最好固定经过验证的版本。否则同一条命令过几天再次执行，可能得到一套不同的运行环境，排查问题和回滚都会变麻烦。

## 自己构建镜像

项目需要自己的运行环境时，可以写一个 Dockerfile：

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

这几行分别完成了几件事：选择基础镜像，设置工作目录，安装依赖，复制项目文件，指定容器启动命令。

构建镜像：

```bash
docker build -t demo-app:1.0 .
```

最后的 `.` 是构建上下文，表示 Docker 可以读取当前目录中的文件。项目通常还需要一个 `.dockerignore`，把缓存、日志、虚拟环境和本地密钥排除在外。

构建完成后启动：

```bash
docker run -d --name demo-app demo-app:1.0
```

如果修改了代码或依赖，应该重新构建镜像，而不是长期手动修改正在运行的容器。手动改动通常会在容器重建后消失。

## 配置怎么传

端口解决访问问题，环境变量解决配置问题。

```bash
docker run -d \
  --name demo-app \
  -e APP_ENV=production \
  -e API_URL=https://example.invalid \
  demo-app:1.0
```

真实密码、令牌和私钥不要写进 Dockerfile，也不要提交到代码仓库。开发环境可以使用本地环境变量或未纳入版本控制的配置文件，生产环境则应使用更安全的密钥管理方式。

## 数据放哪儿

如果重要数据直接写在容器文件系统里，容器重建时就可能一起消失。常见做法是把宿主机目录或命名卷映射到容器内：

```text
宿主机数据目录  →  容器内数据目录
```

命名卷的例子：

```bash
docker volume create demo-data
docker run -d --name demo-db -v demo-data:/var/lib/app demo-db:1.0
```

数据卷解决的是保存位置，不等于自动备份。重要数据仍然需要定期备份，并且最好实际演练一次恢复。

如果项目涉及交易或外部账户，还要分清两种状态：平台自己的数据库可以通过数据卷保存，外部交易平台上的真实仓位属于外部账户，不会因为 Docker 容器删除而消失。

## 多个服务一起跑

一个容器可以用 `docker run` 管理。前端、后端和数据库一起运行时，逐个输入命令很容易漏掉参数，这时可以使用 Docker Compose。

Compose 用配置文件描述服务、网络、端口、环境变量和数据卷，然后统一管理整组服务：

```bash
docker compose up -d
docker compose ps
docker compose logs -f <service>
docker compose stop
```

一个常见的结构是：

```text
浏览器
  ↓ HTTP / HTTPS
前端容器：Web 服务器和页面
  ↓ Docker 内部网络
后端容器：API 和业务逻辑
  ↓
宿主机上的持久化数据
```

前端通常负责页面和请求转发，后端负责接口和业务逻辑。外部用户只访问需要公开的入口，内部服务通过 Docker 网络互相连接。

## 出问题先看什么

容器显示“运行中”，只说明进程还在，并不代表应用真的正常。排查时可以按这个顺序来：

1. 查看 Compose 服务状态；
2. 查看相关服务的最近日志；
3. 确认数据目录是否正确挂载；
4. 请求健康检查接口；
5. 对照外部平台状态和本地业务账本；
6. 最后再考虑重启、重建或回滚。

查看日志和容器信息：

```bash
docker logs demo-app
docker logs -f demo-app
docker inspect demo-app
docker exec -it demo-app sh
```

`docker exec` 适合临时检查。不要把手动修改容器当成正式修复方式，永久改动应该回到代码或 Dockerfile 中。

## 更新要能回滚

正式更新最好遵循一条固定流程：

```text
本地修改并测试
    ↓
推送代码
    ↓
生成部署包并上传
    ↓
备份当前版本和数据
    ↓
构建新镜像
    ↓
执行数据迁移
    ↓
健康检查
    ↓
成功切换，失败回滚
```

开发环境可以直接使用：

```bash
docker compose up -d --build
```

正式环境更新时，最好使用带备份、检查和回滚逻辑的部署脚本。服务器上的更新不应该只剩下一次临时的 `git pull`。

查看镜像、容器和磁盘占用：

```bash
docker image ls
docker ps -a
docker system df
```

清理空间时不要随手执行 `docker system prune`。它可能删除暂时不用的镜像和缓存，让回滚变得困难。

## 最后记住三件事

使用 Docker 时，真正需要长期记住的不是几十条命令，而是三个问题：

- 数据保存在哪里；
- 服务如何更新；
- 出问题时如何回滚。

这三个问题有明确答案，Docker 就只是一个运行工具。它把环境和部署流程固定下来，真正让项目稳定运行的，还是备份、检查和回滚这些习惯。
