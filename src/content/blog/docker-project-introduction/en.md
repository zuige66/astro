---
title: Understanding and Using Docker
pubDate: 2026-10-03
draft: false
description: Learn Docker from images, containers, and volumes through common commands, Compose, multi-service layouts, deployment updates, troubleshooting, and security practices.
image: ""
slugId: docker-project-introduction
category: Tutorials
pinTop: 0
---

When people first encounter Docker, they often think of it as “another kind of virtual machine.” That is not entirely wrong, but it is not quite accurate.

A more useful way to think about Docker is that it packages project code, its runtime environment, dependencies, and startup instructions together so the project can run in a relatively consistent way on different machines. For a project that needs to stay deployed over time, that consistency is often more valuable than manually installing everything on a server.

## What problem does Docker solve?

A project usually depends on more than source code. It may require a specific version of Python or Node.js, third-party libraries, system tools, environment variables, and a particular startup sequence.

When all of these are installed directly on a server, problems tend to accumulate over time:

- It works locally but fails on the server.
- Upgrading one dependency unexpectedly breaks another service.
- Moving to a new server means repeating the setup by hand.
- Projects interfere with one another, making it difficult to identify the source of a problem.

Docker describes these runtime requirements together and packages them into an environment that can be started repeatedly. Deployment then shifts from “rebuild the environment on the server” to “prepare an image and start a container.”

## Concepts beginners should know

The basic Docker workflow is: get or build an image, start a container, check its status, read its logs, and stop or remove it when needed.

Besides images and containers, you will often see these terms:

- **Docker Engine:** The background service that builds images and runs containers.
- **Docker CLI:** The `docker` command you type in a terminal.
- **Image registry:** A place to store and distribute images, either public or private.
- **Dockerfile:** A text file that describes how to build an image.
- **Volume:** A way to keep data outside a container's lifecycle, useful for databases and uploaded files.
- **Network:** Lets containers communicate by service name without exposing every port externally.

After installing Docker on Windows, macOS, or Linux, check that it is working with:

```bash
docker --version
docker run hello-world
```

The first command displays the client version. The second downloads a small test image and starts a container. If it succeeds, the Docker service and local command line are basically ready to use.

## Start your first container from an image

A common operation is starting a container from an image:

```bash
docker run -d --name demo-web -p 8080:80 nginx
```

Here is what the command means:

- `-d` runs the container in the background.
- `--name` assigns an easy-to-recognize name to the container.
- `-p 8080:80` maps port 8080 on the host to port 80 in the container.
- `nginx` is the image to use.

Once it starts, open `http://localhost:8080` in a browser. Port mapping matters: a service inside a container is normally reachable only from its container network. Mapping a port lets the host, or external users, access it through the specified port.

List running containers:

```bash
docker ps
```

List all containers, including stopped ones:

```bash
docker ps -a
```

Stop and restart an existing container:

```bash
docker stop demo-web
docker start demo-web
```

If you are sure you no longer need it, remove the container:

```bash
docker rm demo-web
```

Removing a container does not automatically remove its image. Images and containers are different resources, so check each one separately when cleaning up.

## Where do images come from?

Images generally come from one of three places: a public registry, a build from your own Dockerfile, or a private image registry.

List local images:

```bash
docker image ls
```

Pull an image manually:

```bash
docker pull nginx:latest
```

The tag after an image name identifies its version. For learning and testing, use an explicit version tag. In production, avoid relying on the changeable `latest` tag long-term. Pin a version you have verified so the same startup command does not produce different results at different times.

## How does a Dockerfile work?

If your project does not use an existing image directly, build your own with a Dockerfile. A simplified Dockerfile might look like this:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

It says to start from a base image, set a working directory, install dependencies, copy the project files, and specify the command to run when the container starts.

Build the image:

```bash
docker build -t demo-app:1.0 .
```

The `.` is the build context: the current directory Docker is allowed to read. Real projects usually also need a `.dockerignore` file to exclude caches, logs, virtual environments, and local keys so unrelated files are not copied into the image.

Once built, start the image like any other:

```bash
docker run -d --name demo-app demo-app:1.0
```

## Containers, ports, and environment variables

The port inside a container is not the same as a port on the host. This notation means “host port mapped to container port”:

```text
host port:container port
```

Two services cannot use the same host port at the same time. If a service is unreachable, check three things: whether the application listens on the expected port, whether the container port is mapped correctly, and whether the host firewall allows access.

Configuration usually should not be hard-coded into an image. Pass it through environment variables instead:

```bash
docker run -d \
  --name demo-app \
  -e APP_ENV=production \
  -e API_URL=https://example.invalid \
  demo-app:1.0
```

Do not put real passwords, tokens, or private keys directly in a Dockerfile or commit them to a code repository. In development, use local environment variables or configuration files excluded from version control. In production, use a more secure secrets management method.

## Volumes: keep data when containers go away

To preserve files needed by a container, use a named volume:

```bash
docker volume create demo-data
docker run -d --name demo-db -v demo-data:/var/lib/app demo-db:1.0
```

The volume name is on the left of the colon; the directory inside the container is on the right. You can also mount a host directory into a container, but pay attention to paths, permissions, and backups.

A volume answers “where is the data stored?” It does not automatically create a backup. Important data still needs regular backups, and you should verify that those backups can actually be restored.

## Inspect what is happening inside a container

View logs:

```bash
docker logs demo-app
docker logs -f demo-app
```

Open a temporary shell in a running container:

```bash
docker exec -it demo-app sh
```

Inspect details such as ports, environment variables, and mounts:

```bash
docker inspect demo-app
```

`docker exec` is useful for troubleshooting, but it should not be your long-term way to modify a container. Manually changed files are usually lost when the container is recreated. For permanent changes, update the code or Dockerfile and build a new image.

## Why Docker Compose is so common

For a single container, `docker run` is often enough. When a project has multiple services such as a frontend, backend, and database, entering each command separately makes it easy to miss an option. That is where Docker Compose helps.

Compose describes services, networks, ports, environment variables, and volumes in a configuration file, then manages the group with a consistent set of commands:

```bash
docker compose up -d
docker compose ps
docker compose logs -f <service>
docker compose stop
```

Compose makes startup easier to reproduce and lets teammates share a development environment. Its configuration can still reference sensitive variables, so check that secrets are not included before committing or sharing it.

## Common beginner mistakes

- **Treating a container like a permanent server:** Containers should be replaceable. Keep important data in a volume or host directory.
- **Only checking `docker ps`:** A running container does not guarantee a healthy application. Check logs and health checks too.
- **Editing a running container:** Temporary changes do not become a new image. Make permanent changes in the Dockerfile or source code.
- **Exposing ports indiscriminately:** Map only the services that really need outside access.
- **Using floating versions:** Pin image versions in production to make troubleshooting and rollback easier.
- **Baking secrets into an image:** Images can be cached, copied, and uploaded. Keep sensitive information out of them.

## What is the difference between an image and a container?

Think of an image as a read-only template containing an application's code, dependencies, and runtime environment.

A container is a running instance created from an image. One image can start multiple containers, and a container can be stopped, restarted, or removed.

Put simply:

- An image is a template.
- A container is an instance.
- Docker Compose describes how multiple containers run together.

A container is not a good place to store every important piece of data. It can be rebuilt or deleted, so databases, uploaded files, and archived logs that need to persist should live outside it and be made available through a volume or directory mount.

## A common frontend and backend layout

For a project people access in a browser, a typical layout can be simplified to:

```text
Browser
  ↓ HTTP / HTTPS
Frontend container: web server + frontend pages
  ↓ internal Docker network
Backend container: API + business logic + external service adapters
  ↓
Persistent data directory on the host
```

The frontend container serves pages and forwards requests. The backend container handles APIs, business logic, and communication with external services. The containers communicate over an internal Docker network, while outside users usually need to reach only the port exposed by the frontend.

This separation lets the frontend and backend be updated independently, makes issues easier to locate, and allows one service to be restarted without restarting the other.

## Why store data outside containers?

If important data is written directly to a container's filesystem, it may disappear when that container is rebuilt. A common solution is to mount a persistent directory from the host into the container:

```text
persistent directory on host  →  data directory inside container
```

The container sees the in-container path, but the actual files are kept on the host. If the container is removed and recreated, the data remains available as long as the mount mapping stays the same.

This is something to verify before deployment. If the application starts without the correct data directory mounted, it may assume it has an empty, brand-new database. That can be especially dangerous for systems involving trades, orders, or account state.

It is also important to distinguish between two kinds of state:

- The platform's own database, logs, and cache can be kept in persistent storage.
- Real positions on an external trading platform belong to the external account and do not disappear when a Docker container is deleted.

## Common container operations

Check service status:

```bash
docker compose ps
```

View the latest logs for one service:

```bash
docker compose logs --tail=200 <service>
```

Follow logs continuously:

```bash
docker compose logs -f --tail=200 <service>
```

Restart one service:

```bash
docker compose restart <service>
```

This can restore a service temporarily. It usually does not delete persistent data, but it interrupts the current process and its in-memory state, so a restart is not entirely consequence-free.

Rebuild images and start services:

```bash
docker compose up -d --build
```

This is useful in development or when you explicitly need to rebuild an image. For a production update, use a process that includes backups, checks, and a rollback plan instead of making an ad hoc change on the server.

Stop and remove containers:

```bash
docker compose down
```

This stops and removes containers managed by Compose. It normally does not delete a separate data directory mounted from the host. You can start the services again later, but first confirm that the data mounts and configuration are correct.

Check image, container, and disk usage:

```bash
docker image ls
docker ps -a
docker system df
```

Be careful when reclaiming Docker storage. Commands such as `docker system prune` may remove unused images and caches, making rollback harder. Before cleaning up in production, confirm that the current version, previous images, and backups are still available.

## A production update is more than `git pull`

A service that needs to run reliably should have a clear production update path:

```text
Make and test changes locally
    ↓
Commit and push the code
    ↓
Create and upload a deployment package
    ↓
Back up data and the current version on the server
    ↓
Build the new image
    ↓
Run any required data migrations
    ↓
Perform health checks
    ↓
Switch over on success; roll back on failure
```

The goal is not to make every step complicated, but to give each one a clear purpose:

- Test locally before uploading to avoid taking obvious problems to the server.
- Keep the current version and a data backup before updating so you can roll back.
- Run health checks after building; do not rely only on the container's running status.
- Consider the deployment successful only after the new version is actually usable.

A mature deployment script may also support a check-only mode and a backup-only mode. Those are useful when troubleshooting or doing routine maintenance.

## When something goes wrong, investigate before restarting

When a service behaves unexpectedly, check it in this order:

1. Check whether every Compose service is in its expected state.
2. Read the latest logs from the backend service.
3. Confirm that the persistent directories are mounted correctly.
4. Call the health-check endpoint to see whether the service can really respond.
5. Compare the external platform's state with the local business ledger.
6. Only then consider restarting, rebuilding, or rolling back.

A container marked “running” does not guarantee that the application is healthy. The process may still be alive while its API cannot respond or its business loop has stopped. Check container status, application logs, and health checks together.

If the system involves an external account or trading, also verify the real state on that external platform. Docker runs the application; it cannot replace checking the external account.

## Security considerations

Docker Compose configuration may contain environment variables, service connection details, and references to secrets. Expanding the configuration can even reveal sensitive values, so do not post the full file publicly while troubleshooting.

Safer practices include:

- Share only the configuration lines relevant to the problem.
- Redact secrets, tokens, server addresses, and account details.
- Remove sensitive information from logs before sharing them.
- Check what a command will print before running one that expands variables.
- Use different credentials for production and development.

## Closing thoughts

Docker is useful for more than “putting an application in a container.” It makes the runtime environment, service relationships, and deployment process clearer and easier to repeat.

The most useful habits are knowing where data lives, how services are updated, and how to roll back when something goes wrong. Once those three things are clear, containers become much less mysterious, and deployment can gradually move from a series of manual steps to a reliable engineering process.
