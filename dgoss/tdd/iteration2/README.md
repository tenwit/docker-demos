# Iteration 1

## Step 1: develop the test

With the same (centos) `goss.yaml` file, we'll _autoadd_ java from alpine. We're not asking goss to validate, so it won't care that the test in there won't pass on this alpine image!

```
dgoss edit --rm -it -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss autoadd java
```

Check it fails:

```
dgoss run --rm -it -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps acme/tomcat:centos
```

Awesome:

```
INFO: Running Tests
File: /usr/share/tomcat/lib/catalina.jar: exists: matches expectation: [true]
File: /usr/share/tomcat/lib/catalina.jar: filetype: matches expectation: ["file"]
File: /usr/share/tomcat/webapps/sample.war: exists: matches expectation: [true]
File: /usr/share/tomcat/webapps/sample.war: filetype: matches expectation: ["file"]
Process: java: running:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp:8005: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp:8005: ip: skipped
Port: tcp6:8009: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp6:8009: ip: skipped
Port: tcp6:8080: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp6:8080: ip: skipped


Failures/Skipped:

Process: java: running:
Expected
    <bool>: false
to equal
    <bool>: true

Port: tcp:8005: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp:8005: ip: skipped

Port: tcp6:8009: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp6:8009: ip: skipped

Port: tcp6:8080: listening:
Expected
    <bool>: false
to equal
    <bool>: true
Port: tcp6:8080: ip: skipped
```

The required files are (still) there, but apparently Tomcat isn't running.

## Step 2: Make the test pass

Sure we've _installed_ tomcat, but is it running?

Nope.

So run it! This involves digging around CentOS to figure out _how_ it runs tomcat. Here's one I've already prepared earlier!

Build (`docker-compose build`) the new centos image. Run it (`docker-compose up`) and you'll see tomcat start! Yay!

Run the test again:

```
dgoss run --rm -it -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps acme/tomcat:centos
```
Nope, that's no better than before. Tomcat is starting as fast as it can, but not as fast as goss! We need to _wait_.
Fortunately, goss handles that by not running the tests in `goss.yaml` until after the tests in `goss_wait.yaml` all pass. By default it'll wait 30 seconds, and that's loads for us. We'll just grab a very basic test out of `goss.yaml` and turn it into a `goss_wait.yaml`. Something listening on port 8080 will do nicely.

Re-run the test again.


## Step 3: Refactor

Make it pretty! Remove all the unnecessary bits.