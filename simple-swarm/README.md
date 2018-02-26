This demo shows how secrets and configs can be used to provide information from the build or from the host system to the running container.

The main difference between secrets and configs is that secrets are encrypted and available only through memory, not the filesystem (except on Windows and OSX, which do not support ramdisks in the same way as Linux). Also, configs can be rotated (changed in a running container), while secrets are static.

Secrets and configs are for use with Docker Swarm. Standalone containers don't need these since you can bind-mount (docker run -v host_secret:container_secret) in order to achieve the same thing. It's also easy to run your standalone container as a single service in Swarm if you want to leverage these features: I recommend that you do.

The `docker-compose.yml` file tells the container that two secrets will be made available in the default location `/run/secrets/`. One of the secrets is prepared at build time by the compose file.

The other is manually configured on the host. This is what you want if every tester needs their own secret. To set up a secret this way, the command is `echo "Santa isn't real!" | docker secret create santa -` (or `docker secret create santa <(echo Santa isn\'t real\!)` if you like process substitution). You can provide a file instead of `-` (read from STDIN) but this way means that there is no file to steal the data from.

Similarly, `docker-compose.yml` declares two configs will be made available in the default location `/`. One of the configs is prepared at build time by the compose file, and the other can be configured in advance using something like `docker config create easter <(echo April 1st, this year.)`

To create a stack of services in your swarm, use

    docker stack deploy -c docker-compose.yml secret_demo

To check that the secrets are available, you can connect to the running container and dump the contents of all files in /run/secrets

    docker exec -it $(docker ps --filter name=secret_demo --format "{{.ID}}") bash -c "cat /run/secrets/*"

For configs, you can use

    docker exec -it $(docker ps --filter name=secret_demo --format "{{.ID}}") bash -c "cat /easter /xmas"

And to clean up, you can

    docker stack rm secret_demo
    docker secret rm santa
    docker config rm easter
