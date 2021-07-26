# Ports:
Client: 3000
Posts: 4000
Comments: 4001
Query: 4002
Moderation: 4003
Event Bus: 4005

# Virtual Machine:
Posts(4000) + Comments(4001) + Query(4002) + Moderation(4003) + Comments(4006) + Comments(4007) ==> EventBus(4005)
or
VM 1[Posts(4000) + Comments(4001) + Query(4002) + Moderation(4003)]  ==> EventBus(4005) <== VM2[Comments(4006) + Comments(4007)]

### Here, there are three servers running for comments, so that load can be reduced, add these two newly added routes to event bus as well.

# Why Docker?
Docker solves the issues such as assumptions about our environment and knowledge about how to start it. Docker containers wrap up everything that is needed for a program + how to start and run it. 

# Why Kubernetes?
It is a tool for running a bunch of different containers. We give it some configuration to describe how we want our containers to run and interact with each other. Kubernetes cluster consists of multiple docker containers, they are all managed by a program called as master.

# Docker Commands:
1. FROM: node:alpine --> Specify base image
2. WORKDIR: /app --> Set the working directory to "/app" in the container. All following commands will be issued relative to this directory.
3. COPY: package.json ./ --> Copy over only the package.json file
4. RUN: npm install  --> Install all dependencies
5. COPY: ./ ./ --> Copy over all of our remaining source code
6. CMD: ["npm", "start"] --> Set the command to run when the container starts up.

# Docker Commands:
1. Building Image: docker build -t <dockerId/projectName> . --> Build an image based on the dockerfile in the current directory. Tag it as '<dockerId/projectName>', in our case it is ashwin2604/posts or others,...
2. Running the image: docker run <imageId> or <imageTag> --> Create and start a container based on the provided image id or tag
3. docker run -it <imageId> or <imageTag> <cmd> --> Create and start a container, but also override the default command
4. docker ps --> Print out information about all of the running containers
5. docker exec -it <containerId> <cmd> --> Execute the given command in a running container
6. docker logs <containerId> --> Print out logs from the given container

# Kubernetes:
1. Start it using docker desktop app.
2. kubectl version --> to check docker version

# Kubernetes Terminology:
1. Kubernetes Cluster: A collection of nodes + a master to manage them
2. Node: A virtual machine that will run our container
3. Pod: More or less a running container. Technically, a Pod can run multiple containers
4. Deployment: Monitors a set of pods, make sure they are running and restarts them if they crash
5. Service: Provides an easy-to-remember URL to accessing a running container

# Kubernetes Config files:
1. Tells kubernetes about the different Deployments, Pods and Services (referred to as Objects) that we want to create
2. Written in YAML Syntax (Like JSON, with less curly braces)
3. Always store these files with our project source code - they are documentation
4. We can create Objects without config files - do not do this. Config files provide a precise definition of what your cluster is running
5. Kubernetes docs will tell you to run direct commands to create objects - only do this for testing purposes
6. Blog posts will tell you to run direct commands to create objects - close the Blog post!