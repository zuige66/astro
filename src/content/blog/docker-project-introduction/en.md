---
title: Understanding and Using Docker
pubDate: 2026-10-03
draft: false
description: Get started with Docker images and containers, then learn basic operations, persistent data, multi-service management, rollbacks, and troubleshooting.
image: ""
slugId: docker-project-introduction
category: Tutorials
pinTop: 0
---

When people first encounter Docker, they often picture a small virtual machine. That is not entirely wrong, but it misses what makes Docker useful.

Docker packages code, dependencies, and startup instructions into an environment that can be run repeatedly. When a project moves to another machine or is deployed again, it should behave as consistently as possible. For a service that needs to run over time, this is much more reliable than manually installing a collection of software on a server.

## What is Docker?

Here are a few common Docker terms to start with:

- An **image** is a template for a runtime environment. It contains code, dependencies, and startup instructions.
- A **container** is an instance started from an image. You can start, stop, restart, or remove it.
- A **Dockerfile** describes how to build an image.
- A **volume** stores important data outside a container.
- **Docker Compose** manages multiple containers.

The relationship between an image and a container is similar to the relationship between a program file and a running program. You can reuse an image, while a container represents one particular run.

Containers can be recreated at any time, so databases, uploaded files, and business data should not live only inside a container. Store them outside the container with a volume or directory mount.

## Start your first container

After installing Docker, check that the command line and Docker service are working:

```bash
docker --version
docker run hello-world
```

Next, start a simple web container:

```bash
docker run -d --name demo-web -p 8080:80 nginx
```

In this command, `-d` runs the container in the background, `--name` gives it a name, and `-p 8080:80` maps port 8080 on the host to port 80 in the container.

After it starts, visit `http://localhost:8080`. Port mapping provides an entry point between the container and the outside world. Without it, a service inside a container is usually reachable only by other containers on the Docker network.

Common commands for inspecting and controlling containers:

```bash
docker ps
docker ps -a
docker stop demo-web
docker start demo-web
docker rm demo-web
```

`docker ps` lists running containers. `docker ps -a` also includes stopped containers. Removing a container does not automatically remove its image.

## Where do images come from?

Images usually come from a public registry, a private registry, or a local build.

List local images:

```bash
docker image ls
```

Pull an image:

```bash
docker pull nginx:latest
```

The tag after an image name identifies its version. `latest` is fine for learning, but in production it is better to pin a version you have verified. Otherwise, running the same command again a few days later could give you a different environment, making troubleshooting and rollback harder.

## Build your own image

If your project needs its own runtime environment, create a Dockerfile:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

These lines select a base image, set the working directory, install dependencies, copy project files, and specify the command to run when the container starts.

Build the image:

```bash
docker build -t demo-app:1.0 .
```

The final `.` is the build context: the current directory Docker can read. Projects usually also need a `.dockerignore` file to exclude caches, logs, virtual environments, and local keys.

Start the image after the build completes:

```bash
docker run -d --name demo-app demo-app:1.0
```

If you change the code or dependencies, rebuild the image instead of making long-term manual edits to a running container. Manual changes usually disappear when the container is recreated.

## Pass configuration to a container

Ports control access to a service; environment variables provide configuration.

```bash
docker run -d \
  --name demo-app \
  -e APP_ENV=production \
  -e API_URL=https://example.invalid \
  demo-app:1.0
```

Do not put real passwords, tokens, or private keys in a Dockerfile or commit them to a code repository. For development, use local environment variables or configuration files excluded from version control. In production, use a more secure secrets management method.

## Where should data live?

If important data is written directly to a container's filesystem, it may disappear when the container is recreated. A common solution is to mount a host directory or named volume into the container:

```text
host data directory  →  data directory inside the container
```

Example using a named volume:

```bash
docker volume create demo-data
docker run -d --name demo-db -v demo-data:/var/lib/app demo-db:1.0
```

A volume determines where data is stored; it does not automatically create backups. Important data still needs regular backups, and you should test restoring one in practice.

For projects involving trading or external accounts, distinguish between two kinds of state: the platform's own database can be stored in a volume, while real positions on an external trading platform belong to that external account and do not disappear when a Docker container is deleted.

## Run multiple services together

You can manage one container with `docker run`. When a frontend, backend, and database need to run together, entering each command separately makes it easy to miss an option. Docker Compose can manage the group instead.

Compose describes services, networks, ports, environment variables, and volumes in a configuration file, then manages the whole set with a consistent command interface:

```bash
docker compose up -d
docker compose ps
docker compose logs -f <service>
docker compose stop
```

A common layout looks like this:

```text
Browser
  ↓ HTTP / HTTPS
Frontend container: web server and pages
  ↓ internal Docker network
Backend container: API and business logic
  ↓
Persistent data on the host
```

The frontend usually serves pages and forwards requests; the backend handles APIs and business logic. External users access only the public entry point, while internal services communicate over the Docker network.

## What should you check when something goes wrong?

A container marked “running” only tells you that its process is still alive. It does not prove the application is healthy. Troubleshoot in this order:

1. Check the status of the Compose services.
2. Read recent logs from the relevant service.
3. Confirm that the data directory is mounted correctly.
4. Call the health-check endpoint.
5. Compare the external platform's state with the local business ledger.
6. Only then consider restarting, rebuilding, or rolling back.

Inspect logs and container details with:

```bash
docker logs demo-app
docker logs -f demo-app
docker inspect demo-app
docker exec -it demo-app sh
```

`docker exec` is useful for temporary checks. Do not treat manual changes inside a container as a permanent fix; make lasting changes in the source code or Dockerfile.

## Make updates reversible

Production updates should follow a consistent process:

```text
Make and test changes locally
    ↓
Push the code
    ↓
Create and upload a deployment package
    ↓
Back up the current version and data
    ↓
Build the new image
    ↓
Run data migrations
    ↓
Perform health checks
    ↓
Switch over on success; roll back on failure
```

In development, you can run:

```bash
docker compose up -d --build
```

For production updates, use a deployment script with backup, verification, and rollback steps. Updating a server should involve more than an ad hoc `git pull`.

Check image, container, and disk usage with:

```bash
docker image ls
docker ps -a
docker system df
```

Do not run `docker system prune` casually when cleaning up space. It may remove unused images and caches, making rollback more difficult.

## Three things to remember

When using Docker, you do not need to memorize dozens of commands. Keep track of three things:

- Where is the data stored?
- How are services updated?
- How can you roll back if something goes wrong?

Once you can answer these questions, Docker is simply a tool for running applications. It makes the environment and deployment process consistent; habits like backing up, checking, and rolling back are what keep a project running reliably.
