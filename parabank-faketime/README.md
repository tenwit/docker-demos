Create a parabank image with libfaketime included by

    docker build -t parabank-faketime .

However, this is not worth doing. Parabank or tomcat does not work with faketime.
Setting the time to anything unexpected causes an immediate core dump.
