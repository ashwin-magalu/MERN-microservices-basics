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
    1. Kubernetes docs will tell you to run direct commands to create objects - only do this for testing purposes
    2. Blog posts will tell you to run direct commands to create objects - close the Blog post!

# Creating a pod
1. docker build -t <dockerId/projectName>:<version> . ex: ashwin2604/posts:0.0.1
2. Create another folder called "infra" to hold all config files
3. Within this folder create another folder called "k8s". This will contain all kubernetes related configuration files
4. Within k8s folder create a file called "posts.yaml" (posts.yaml.example)
5. Add data as shown in the file
6. Run command inside k8s folder: 
    1. kubectl apply -f posts.yaml (filename)
    2. kubectl get pods --> shows all pods available

    If your pods are showing ErrImagePull, ErrImageNeverPull or ImagePullBackOff errors after running kubectl apply, the simplest solution is to provide an imagePullPolicy to the pod.
    First, run kubectl delete -f infra/k8s/
    Then, update your pod manifest:
    spec:
      containers:
        - name: posts
          image: ashwin2604/posts
          imagePullPolicy: Never

    Then, run kubectl apply -f infra/k8s/
    This will ensure that Kubernetes will use the image built locally from your image cache instead of attempting to pull from a registry.
    Minikube users:
        If you are using a vm driver, you will need to tell Kubernetes to use the Docker daemon running inside of the single node cluster instead of the host
        Run the following command:
        eval $(minikube docker -env)
        Note - This command will need to be repeated anything you close and restart the terminal session.
        Afterwards, you can build your image:
        docker build -t USERNAME/REPO .
        Update, your pod manifest as show and then run: kubectl apply -f infra/k8s/
        https://minikube.sigs.k8s.io/docs/commands/docker-env/

# .yaml file configuration details
1. apiVersion: v1 --> k8s is extensible: we can add in our own custom objects. This specifies the set of objects we want k8s to look at
2. kind: Pod --> The type of objects we want to create
3. metadata: --> Config options for the object we are about to create
4. name: posts --> when the pod is created, give it a name of posts
5. spec: --> The exact attributes we want to apply to the object we are about to create
6. containers: --> We can create many containers i a single pod
7. - name: posts --> Make a container with a name of posts
8. image: ashwin2604/posts:0.0.1 --> The exact image we want to use, this is the name of the image we created using docker build command

# Common kubectl commands:
1. docker ps --> kubectl get pods : Print out information about all of the running pods
2. docker exec -it <containerId> <cmd> --> kubectl exec -it <podName> <cmd> : Execute the given command in a running pod
3. docker logs <containerId> --> kubectl logs <podName> : Print out logs from the given pod
4. kubectl delete pod <podName> : Deletes the given pod
5. kubectl apply -f <configFileName> : Tells kubernetes to process the config
6. kubectl describe pod <podName> : Print out some information about the running pod

# Deployment

1. Create posts-depl.yaml file inside k8s folder
2. Add code as shown in that file
3. kubectl get deployments : List all the running deployments
4. kubectl describe deployment <deploymentName> : Print out details about a specific deployment
5. kubectl delete deployment <deploymentName> : Delete a deployment

# Updating the image used by a Deployment - Method 1
1. Make a change to your project code
2. Rebuild the image, specify a new image version
3. In the deployment config file, update the version of the image
4. Run the command: kubectl apply -f <deploymentFileName>

# Updating the image used by a Deployment - Method 2 (Most used)
1. The deployment must be using the "latest" tag in the pod spec section
2. Make an update to your code
3. Build the image
4. Push the image to docker hub
5. Run the command: kubectl rollout restart deployment <deploymentFileName>

# Networking with Services