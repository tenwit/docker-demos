The base Parabank Docker image.
Used by several other images in the Docker demos projects.

# Usage

The usual docker commands are used. For your convenience, there's a build.gradle provided
that gives these commands:

* `./gradlew assemble` or ``./gradlew build` Create the parabank image _iqa/parabank:latest_.
* `./gradlew run` Run _iqa/parabank:latest_ in the named container _base_parabank_.
* `./gradlew check` Start and stop the _base_parabank_ container, creating it first if necessary.
* `./graldew cleanContainer` deletes _base_parabank_.
* `./gradlew cleanImage` deletes _iqa/parabank:latest_.

There are no ports exposed in this image, since this is intended to be used by other images that may choose to map ports or not expose them. If you want to use this image to see Parabank, you can use `docker container inspect base_parabank | grep IPAddress` then browse to port 8080 of the IP address that prints out.
