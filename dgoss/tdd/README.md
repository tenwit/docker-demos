# A demonstration of test-first development of infrastructure.

I've used goss (via dgoss) to write tests based on a known good infrastructure (a tomcat webapp on Alpine linux). Then I've used those tests to write new infrastructure (the same tomcat webapp on CentOS linux). I've done it in three iterations: you can follow along with these steps. Docker knowledge is required.

## Preparation.

Have a recent version of docker and docker-compose installed.
Download the [Apache "Hello World" webapp](https://tomcat.apache.org/tomcat-7.0-doc/appdev/sample/sample.war) and put it into a Docker volume called `warfiles`.

## Iteration 1: put Tomcat on CentOS.

Using the Alpine image `acme/tomcat:alpine` (which you can build by changing into the `tomcat-alpine` directory beside this one and running `docker-compose build`), run dgoss from an empty directory and get goss to write some tests for the important tomcat and webapp files:

```
dgoss edit --rm -it -p 8080:8080 -v warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss add file /usr/local/tomcat/lib/catalina.jar
goss add file /usr/local/tomcat/webapps/sample.jar
```

Once you exit the dgoss shell, it creates `goss.yaml` with tests for those files. Verify that there are failing tests by running it against the default CentOS image that we'll be building from:

```
dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps centos:7
```

Now for the test-driven development: with those tests, create a Dockerfile that resolves the errors you see. To run the tests, use the same dgoss line as above, but replace the `centos:7` image with the image you're creating.

While you're trying to get the tests to pass, pay attention to how you're running the test as that may have to be changed. Don't forget to refactor afterwards! Clean up `goss.yaml` by removing any tests you don't care about.

If you get stuck, the solution Dockerfile is in `iteration1/tomcat-centos`, along with a `docker-compose.yml` that will build and run it.

## Iteration 2: run Tomcat.

When you've got the tests passing, you can add more tests to the same `goss.yaml`. This time, goss will write tests for the running Tomcat container:

```
dgoss edit --rm -it -p 8080:8080 -v warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss autoadd java
```

Drive your development with the new tests. Try to extend your Dockerfile to kick off Tomcat, then re-run the tests. Figure out why goss passes some tests and not others. Some fixes have to be made to the test, and some have to be made to the dgoss command line because Docker isn't being run correctly. Timing is an issue: you'll have to read [the goss manual](https://github.com/aelsabbahy/goss/blob/master/docs/manual.md) and [the dgoss docs](https://github.com/aelsabbahy/goss/tree/master/extras/dgoss) to figure out how to get dgoss to wait (retry) before running tests. After all the tests are passing, do your refactoring.

If you get stuck, the implementation solution is in `iteration2/tomcat-centos`, and the test solution is in `iteration2`. The Dockerfile runs Tomcat correctly, but you'll also need the sysctl option that's in `docker-compose.yml`. The equivalent docker command line option is `--sysctl`.

## Iteration 3: run the webapp.

First we need more failing tests. Get goss to create some tests for the main page of the webapp:

```
dgoss edit --rm -it -p 8080:8080 -v warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss add http http://localhost:8080/sample
```

Have a look at the test. It includes a line `body: []` which is where you can put a check for any HTML code that your page includes. Stick "Hello, World" in there, since that's on the page you're testing.

When you run the extra tests, you'll see that they already pass! Sometimes, your failing tests do accidentally pass :) The files in `iteration3/tomcat-centos` are the same as the ones in `iteration2/tomcat-centos`. You just have to refactor a little, and you've successfully applied TDD to convert a machine from one operating system flavour to another.. congratulations!