# solution.md
# Task 1 — Dockerfile Basics

## TASK1 - the index.html is ai generate

1. created Dockerfile
2. build the docker image with `docker build -t my-nginx:v1 .`
3. run the docker image with `docker run -d -p 8080:80 my-nginx:v1`
4. Testing: `curl localhost:8080`

#### Output

```bash
X@device ~/D/d/t/TASK1 (main)> curl localhost:8080
Hello World! x1
```

# Task 2 — Multi-stage Docker Build

## TASK2 - the basic project is ai generated

1. created Dockerfile with multi-stage build
2. use `COPY --from=builder` to copy files from builder stage to final stage
3. build the docker image with `docker build -t node-app:v1 .`
4. run the docker image with `docker run -d -p 3000:3000 node-app:v1`
5. test the application with `curl localhost:3000`

#### Output

```bash
X@device ~/D/d/t/TASK2 (main)> curl localhost:3000
{"message":"Welcome to the basic Node.js application","timestamp":"2026-09-30T07:08:22.930Z"}⏎                                                              
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
X@device ~/D/d/t/TASK5> docker compose ps
WARN[0000] /Users/X/Developer/docker/tasks/TASK5/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
NAME            IMAGE          COMMAND                  SERVICE   CREATED              STATUS              PORTS
task5-MySQL-1   mysql:latest   "docker-entrypoint.s…"   MySQL     About a minute ago   Up About a minute   3306/tcp, 33060/tcp
task5-Nginx-1   nginx:latest   "/docker-entrypoint.…"   Nginx     About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
X@device ~/D/d/t/TASK5>
```

# Task 6 — WordPress Stack

## Task 6

1. create a docker-compose.yml file. use two services wordpress and db.

a. add custom network `wordpress_net`
b. add restart policy
c. add environment variables from .env
d. persistenet volumn for db and wordpress.

2. run `docker-compose up` to start the services.
3. test using `docker compose ps`

#### Output

```bash
X@device ~/D/d/t/TASK6 (main) [SIGINT]> docker compose up -d
                                                 docker compose ps
                                                 docker compose logs wordpress

WARN[0000] /Users/X/Developer/docker/tasks/TASK6/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] up 2/2
 ✔ Container db        Healthy                                                                                                                              0.5s
 ✔ Container wordpress Running                                                                                                                              0.0s
WARN[0000] /Users/X/Developer/docker/tasks/TASK6/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
NAME        IMAGE              COMMAND                  SERVICE     CREATED              STATUS                        PORTS
db          mysql:latest       "docker-entrypoint.s…"   db          About a minute ago   Up About a minute (healthy)   3306/tcp, 33060/tcp
wordpress   wordpress:latest   "docker-entrypoint.s…"   wordpress   About a minute ago   Up About a minute             0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
WARN[0000] /Users/X/Developer/docker/tasks/TASK6/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
wordpress  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 192.168.156.3. Set the 'ServerName' directive globally to suppress this message
wordpress  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 192.168.156.3. Set the 'ServerName' directive globally to suppress this message
wordpress  | [Tue Sep 29 09:22:02.879633 2026] [mpm_prefork:notice] [pid 1:tid 1] AH00163: Apache/2.4.68 (Debian) PHP/8.3.35 configured -- resuming normal operations
wordpress  | [Tue Sep 29 09:22:02.879698 2026] [core:notice] [pid 1:tid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
wordpress  | 192.168.156.1 - - [29/Sep/2026:09:22:04 +0000] "GET / HTTP/1.1" 200 13779 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:156.0) Gecko/20100101 Firefox/156.0"
wordpress  | 192.168.156.1 - - [29/Sep/2026:09:22:04 +0000] "GET /wp-includes/css/admin-bar.min.css?ver=7.1.2 HTTP/1.1" 200 4349 "http://localhost:8080/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:156.0) Gecko/20100101 Firefox/156.0"
wordpress  | 192.168.156.1 - - [29/Sep/2026:09:22:04 +0000] "GET /wp-includes/js/dist/script-modules/block-library/navigation/view.min.js?ver=1bf28ded04f9f188bdcb HTTP/1.1" 200 1466 "http://localhost:8080/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:156.0) Gecko/20100101 Firefox/156.0"
wordpress  | 192.168.156.1 - - [29/Sep/2026:09:22:04 +0000] "GET /wp-includes/js/dist/script-modules/interactivity/index.min.js?ver=efaa5193bbad9c60ffd1 HTTP/1.1" 200 15550 "http://localhost:8080/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:156.0) Gecko/20100101 Firefox/156.0"
wordpress  | 192.168.156.1 - - [29/Sep/2026:09:22:04 +0000] "GET /wp-content/themes/twentytwentyfive/assets/fonts/manrope/Manrope-VariableFont_wght.woff2 HTTP/1.1" 200 53888 "http://localhost:8080/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:156.0) Gecko/20100101 Firefox/156.0"
X@device ~/D/d/t/TASK6 (main)>
```

# Task 7 — Environment Variables

## Task 7

1. use the ${variable_name} to inject .env variables in the docker-compose

# Task 8 — Health Checks

## Task 8

1. create two services called backend and databse.
2. add healthcheck to the database.
3. make the backend depend on databse service.

# Task 9 — Reverse Proxy **

## Task 9

1. mainly i created two nginx containers, one for the frontend and one for the backend. -> exposed their port 80
2. created backend and frontend container, that use the frontend and backend images respectively.
3. create a nginx service, that uses the default.conf file to proxy requests to the backend and frontend containers.
4. the container use internal networking to communicate with each other.

# Task 10 — Production Compose Stack **

## Task 10

1. created a basic express app with AI. / -> returns all entry, /log -> logs the current timestamp in the db
2. created 3 services: backend, database, and nginx.
3. the database service has a persistent volume, a network called internal(connects with the backend), and a healthcheck.
4. the backend uses the Dockerfile of the backend image, has two networks: internal and external(connects with the nginx) and a healthcheck. So this does not expose directyl to the host machine. And uses the database service to connect to the database.
5. the nginx service uses the default.conf file to proxy requests to the backend. with resource limit and logging.

# 🔥 Troubleshooting Tasks

## Task 11 — Container Keeps Restarting

1. First of all, because I need to save the application data. I should use a persistent volume and don't use `docker compose down -v`.
2. I'll look for the logs of the container to see what's going on. If anything is throwing errors. `docker logs backend`
3. Then I'll run the `docker inspect backend`. and feed that data to an LLM. as this is the detailed config file. It'll take a long time to analyze this myself.
4. Then I'll run `docker stats` to check if the resource allication is working properly. And/Or if it's bottlenecking.

## Task 12 — Container Cannot Connect to Database

1. run `docker compose ps` to check if the postgres service is running.
2. run `docker compose logs postgres` to see if anything is wrong. shows if hostname, port or credentials are wrong, by showing connection error.
3. `docker network ls` to see if they have a common bridge network between them to communicate.
4. make sure to add a depends_on section, so that the database is ready before attempting to connect.

## Task 13 — Data Lost After Container Removal
1. Because the docker volume is not configured.
2. to add a volume to the compose - create a volume section and then add mapping to the volume to the service.
3. to verify - `docker volume ls` to see if the volume exists. and then `docker compose down` and then `docker compose up -d` to check if data persists.

## Task 14 — Image Too Large
to reduce the image size, i'll use these stratagies
1. multi-stage build - to seperate the production and development builds. i'll copy only the necessary data in the production build.
2. use smaller base images.
3. use .dockerignore to exclude files.
4. remember the caching and the layering of the image. if a data is added to the image, it will stay in cache.
5. use slim toolkit(https://github.com/slimtoolkit/slim) and dive(https://github.com/wagoodman/dive) to inspect the built image layers, and further reduce the size. specially i'll use slim.

## Task 15 — Zero-Downtime Application Update
I actually have little idea about this one.
1. I'll create a backend-v2 and add that to the nginx.
2. then i'll replace the other backend service with the new one.



# ⭐ Final Challenge **

## Final

1. created a mini backend that uses Postgres, Redis and Worker. (The backend is created using AI.)
2. the frontend uses an nginx server to serve the static files. - mainly a frontend server.
3. now i first created three services: database, redis and worker. as these do not depend on anything. then i added to a internal network called `backend`. also added volume to the database.
4.and then i created a Dockerfile for the backend. which uses multi-stage build. and then I created a backend service is docker-compose. this has the `backend` network and then another network called internal, for frontend communication.
5.then i created nginx service. it has the interal network to communicate with the frontend and the backend.
6. mainly this nginx routes / -> frontend and /api -> backend. and this exposed the 8080 port to the host.
7. so all the other service is is not reachable from the host machine. they only communicate with each other within the `backend` network. and the nginx server is the only one exposed to the host.
