Demo for libfaketime (and mysql :) ).

The Dockerfile is multistage: it builds libfaketime using the same base image (debian:jessie) as the mysql
image, so that it is linked against the same dynamic libraries. Then it builds a mysql variant that includes
libfaketime, along with libfaketime configuration that makes it always 30 days in the future.

To see this working, you can build the image using `./build` script and then run the `./server` script, and note that all the log messages are future-dated.
You can also run the `./client` script which puts you into the same container in a mysql CLI. Type `\r` to
connect to the default server (local), then `select current_date;` to see what time mysql reports.

