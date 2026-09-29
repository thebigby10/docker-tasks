# Task 1 — Dockerfile Basics
## TASK1 - the index.html is ai generate
1. create Dockerfile 
2. build the docker image with `docker build -t my-nginx:v1 .`
3. run the docker image with `docker run -d -p 8080:80 my-nginx:v1`
4. Testing: `curl localhost:8080`
#### Output
```bash

```

# Task 2 — Multi-stage Docker Build
## TASK2 - the basic project is ai generated
1. create Dockerfile with multi-stage build
2. use `COPY --from=builder` to copy files from builder stage to final stage
3. build the docker image with `docker build -t node-app:v1 .`
4. run the docker image with `docker run -d -p 3000:3000 node-app:v1`
5. test the application with `curl localhost:3000`
#### Output
```bash

```

# Task 3 — Docker Networking
## Task 3
1. create two seperate project for client and nginx - the client is going to attempt to curl the nginx server.
2. create a custom network called `app-network`.
3. create a Dockerfile for nginx and run that project. **must name the image 'nginx' with --name and use the custom network `app-network`**
4. now run a alpine image with `docker run --network app-network -it alpine:latest sh` . this will run a alpine image and open interactive shell of that image.
5. now test the connection with `wget -qO- http://nginx`
#### Output
```bash
/ # wget -qO- http://nginx
Hello World! x3
/ # exit
```

# Task 4 — Docker Volume
## Task 4
1. create a persistent volumn with `docker volume create` called `mysql-volume`
2. while running the mysql container use the docker volumn with -v 
```bash
    docker run -d \
        --name my-mysql \
        -p 3306:3306 \
        -v mysql-volumn:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=rootpassword \
        -e MYSQL_DATABASE=appdb \
        -e MYSQL_USER=appuser \
        -e MYSQL_PASSWORD=password \
        mysql:8
```

# Task 5 — Basic Compose Application
## Task 5
1. create `docker-compose.yml` 
2. run `docker-compose up` to start the services.
3. test using `docker compose ps`
#### Output
```bash
thebigby01@device ~/D/d/t/TASK5> docker compose ps
WARN[0000] /Users/thebigby01/Developer/docker/tasks/TASK5/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
NAME            IMAGE          COMMAND                  SERVICE   CREATED              STATUS              PORTS
task5-MySQL-1   mysql:latest   "docker-entrypoint.s…"   MySQL     About a minute ago   Up About a minute   3306/tcp, 33060/tcp
task5-Nginx-1   nginx:latest   "/docker-entrypoint.…"   Nginx     About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
thebigby01@device ~/D/d/t/TASK5>
```

# Task 6 — WordPress Stack
## Task 6
