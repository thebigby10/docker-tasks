## 🐳 Docker & Docker Compose Practical Tasks

### Task 1 — Dockerfile Basics

Create a Dockerfile for a simple **Nginx web server**.

Requirements:

* Use `nginx:alpine`
* Copy a custom `index.html` into the container
* Expose port `80`
* Build an image named `my-nginx:v1`
* Run it on host port `8080`

Expected test:

```bash
curl http://localhost:8080
```

---

### Task 2 — Multi-stage Docker Build

Create a Dockerfile for a **Node.js application**.

Requirements:

* Use Node.js Alpine
* Install dependencies
* Build the application
* Use a separate production stage
* The final image should contain only production dependencies and build output
* Do not run the application as root

Expected:

```bash
docker build -t node-app:v1 .
docker run -p 3000:3000 node-app:v1
```

---

### Task 3 — Docker Networking

Create two containers:

```text
client container
      |
      | Docker network
      |
nginx container
```

Requirements:

* Create a custom bridge network called `app-network`
* Run an Nginx container on it
* Run an Alpine container on the same network
* From Alpine, access Nginx using its container/service name
* Do not use the Nginx container IP directly

Test:

```bash
docker exec -it client sh
wget -qO- http://nginx
```

---

### Task 4 — Docker Volume

Run a MySQL container with persistent storage.

Requirements:

* Image: `mysql:8`
* Database: `appdb`
* User: `appuser`
* Password: use an environment variable
* Store MySQL data in a Docker named volume
* Delete and recreate the container
* Verify that the database still exists

Expected architecture:

```text
MySQL Container
      |
      v
mysql-data volume
```

---

# Docker Compose Tasks

## Task 5 — Basic Compose Application

Create:

```text
docker-compose.yml
```

with:

```text
Nginx
MySQL
```

Requirements:

* Nginx exposed on port `8080`
* MySQL exposed only internally
* Both services use the same Docker network
* MySQL uses a persistent volume
* Configure MySQL using environment variables

Expected:

```bash
docker compose up -d
docker compose ps
```

---

## Task 6 — WordPress Stack

Create a Docker Compose stack:

```text
              ┌─────────────┐
              │   Browser   │
              └──────┬──────┘
                     |
                   :8080
                     |
              ┌──────▼──────┐
              │  WordPress  │
              └──────┬──────┘
                     |
              ┌──────▼──────┐
              │    MySQL    │
              └─────────────┘
```

Requirements:

* WordPress
* MySQL 8
* Persistent MySQL volume
* Persistent WordPress volume
* Environment variables using `.env`
* Custom network
* Restart policy

Commands should work:

```bash
docker compose up -d
docker compose ps
docker compose logs wordpress
```

---

# Intermediate Tasks

## Task 7 — Environment Variables

Create:

```text
.env
```

```env
APP_PORT=8080
MYSQL_DATABASE=appdb
MYSQL_USER=appuser
MYSQL_PASSWORD=secret
MYSQL_ROOT_PASSWORD=rootsecret
```

Use these variables inside `compose.yaml`.

**Requirement:** Do not hard-code the credentials inside the Compose file.

---

## Task 8 — Health Checks

Create a Compose application with:

```text
backend
database
```

Requirements:

* PostgreSQL database
* Backend depends on PostgreSQL
* PostgreSQL must have a health check
* Backend should start only after PostgreSQL becomes healthy

Example health check:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

---

## Task 9 — Reverse Proxy

Build this architecture:

```text
                   Internet
                      |
                   :8080
                      |
                 ┌────▼────┐
                 │  Nginx  │
                 └────┬────┘
                      |
              ┌───────┴────────┐
              |                |
           frontend          backend
           :3000             :5000
```

Requirements:

* Nginx acts as reverse proxy
* `/` → frontend
* `/api/` → backend
* Frontend and backend must not expose their ports to the host
* Only Nginx should be publicly accessible

---

# Advanced Docker Task

## Task 10 — Production Compose Stack

Build a production-style application:

```text
                         Internet
                            |
                         :80/:443
                            |
                      ┌─────▼─────┐
                      │   Nginx   │
                      └─────┬─────┘
                            |
                    ┌───────▼───────┐
                    │    Backend    │
                    └───────┬───────┘
                            |
                    ┌───────▼───────┐
                    │  PostgreSQL   │
                    └───────────────┘
```

Requirements:

### Docker

* Multi-stage Dockerfile
* Non-root user
* `.dockerignore`
* Small final image
* Proper `CMD`/`ENTRYPOINT`
* Health check

### Compose

* Backend
* PostgreSQL
* Nginx
* Custom networks
* Persistent volumes
* `.env`
* Health checks
* Restart policies
* Resource limits
* Logging configuration

### Security

Do **not**:

```yaml
ports:
  - "5432:5432"
```

PostgreSQL should only be reachable from the backend network.

---

# 🔥 Troubleshooting Tasks

These are particularly useful for **DevOps/SRE interviews**.

### Task 11 — Container Keeps Restarting

You run:

```bash
docker ps
```

and see:

```text
backend   Restarting (1)
```

Find the problem using:

```bash
docker logs backend
docker inspect backend
docker stats
```

Fix the container without deleting the application data.

---

### Task 12 — Container Cannot Connect to Database

Backend error:

```text
connection refused: postgres:5432
```

Investigate:

```bash
docker compose ps
docker compose logs postgres
docker network ls
docker inspect <container>
```

Determine whether the problem is:

* Database isn't running
* Wrong hostname
* Wrong port
* Wrong credentials
* Network configuration
* Database isn't ready yet

---

### Task 13 — Data Lost After Container Removal

You have:

```bash
docker rm -f mysql
docker compose up -d
```

All database data disappeared.

Your task:

1. Explain why.
2. Fix the Compose configuration.
3. Add persistent storage.
4. Recreate the container.
5. Verify persistence.

---

### Task 14 — Image Too Large

Your Docker image:

```text
my-app   2.4GB
```

Reduce it to **less than 300 MB**.

Investigate:

```bash
docker history my-app
docker images
```

Apply:

* Multi-stage builds
* Alpine/distroless where appropriate
* `.dockerignore`
* Remove package caches
* Avoid unnecessary dependencies

---

## Task 15 — Zero-Downtime Application Update

You have:

```text
Nginx
  |
  ├── backend-v1
  └── backend-v1
```

You need to deploy:

```text
backend-v2
```

without downtime.

Design a Docker Compose deployment strategy that supports:

```text
v1 → v2
```

while existing users continue receiving traffic.

Explain:

1. How traffic is routed.
2. How v2 is started.
3. How health is verified.
4. How traffic is switched.
5. What happens if v2 fails.
6. How rollback works.

---

## ⭐ Final Challenge

Build this complete stack:

```text
                         Internet
                            │
                                                 ▼
                       ┌─────────┐
                       │  Nginx  │
                       └────┬────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                              ▼                                    ▼
             Frontend              Backend
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                                            ▼                    ▼                     ▼
                      Postgres      Redis        Worker
```

@ferdous.mim @abidur.rahman
