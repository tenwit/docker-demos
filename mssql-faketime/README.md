Demo for libfaketime (and mysql :) ).

The Dockerfile is multistage: it builds libfaketime using a similar base image (debian:jessie) as the mssql
image, so that it is linked against the same dynamic libraries. Then it builds a mssql variant that includes
libfaketime, along with libfaketime configuration that makes it always 30 days in the future.

To see this working, you can run the `./server` script, and note that all the log messages are future-dated.
You can also run the `./client` script which puts you into the same container in a mssql CLI. Type
    select sysdatetime
    go
to see what time mssql reports.

