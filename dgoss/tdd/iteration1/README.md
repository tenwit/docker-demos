# Iteration 1

## Step 1: develop the test

```
dgoss edit -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss add file /usr/local/tomcat/lib/catalina.jar
goss add file /usr/local/tomcat/webapps/sample.war
```

Check it by running it as a test:
```
dgoss run -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
```
Which produces the rather gratifying:
```
INFO: Running Tests
File: /usr/local/tomcat/webapps/sample.war: exists: matches expectation: [true]
File: /usr/local/tomcat/webapps/sample.war: mode: matches expectation: ["0644"]
File: /usr/local/tomcat/webapps/sample.war: filetype: matches expectation: ["file"]
File: /usr/local/tomcat/webapps/sample.war: size: matches expectation: [4606]
File: /usr/local/tomcat/lib/catalina.jar: exists: matches expectation: [true]
File: /usr/local/tomcat/lib/catalina.jar: mode: matches expectation: ["0644"]
File: /usr/local/tomcat/lib/catalina.jar: owner: matches expectation: ["root"]
File: /usr/local/tomcat/lib/catalina.jar: group: matches expectation: ["root"]
File: /usr/local/tomcat/lib/catalina.jar: filetype: matches expectation: ["file"]
File: /usr/local/tomcat/lib/catalina.jar: size: matches expectation: [1683767]
```

And of course, it should be a _failing_ test at this stage.
```
dgoss run --rm -it -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps centos:7
```
Which produces
```
INFO: Running Tests
File: /usr/local/tomcat/webapps/sample.war: exists:
Expected
    <bool>: false
to equal
    <bool>: true
File: /usr/local/tomcat/webapps/sample.war: mode: skipped
File: /usr/local/tomcat/webapps/sample.war: filetype: skipped
File: /usr/local/tomcat/webapps/sample.war: size: skipped
File: /usr/local/tomcat/lib/catalina.jar: exists:
Expected
    <bool>: false
to equal
    <bool>: true
File: /usr/local/tomcat/lib/catalina.jar: mode: skipped
File: /usr/local/tomcat/lib/catalina.jar: owner: skipped
File: /usr/local/tomcat/lib/catalina.jar: group: skipped
File: /usr/local/tomcat/lib/catalina.jar: filetype: skipped
File: /usr/local/tomcat/lib/catalina.jar: size: skipped


Failures/Skipped:

File: /usr/local/tomcat/webapps/sample.war: exists:
Expected
    <bool>: false
to equal
    <bool>: true
File: /usr/local/tomcat/webapps/sample.war: mode: skipped
File: /usr/local/tomcat/webapps/sample.war: filetype: skipped
File: /usr/local/tomcat/webapps/sample.war: size: skipped

File: /usr/local/tomcat/lib/catalina.jar: exists:
Expected
    <bool>: false
to equal
    <bool>: true
File: /usr/local/tomcat/lib/catalina.jar: mode: skipped
File: /usr/local/tomcat/lib/catalina.jar: owner: skipped
File: /usr/local/tomcat/lib/catalina.jar: group: skipped
File: /usr/local/tomcat/lib/catalina.jar: filetype: skipped
File: /usr/local/tomcat/lib/catalina.jar: size: skipped
```

## Step 2: Make the test pass

First, install tomcat (it's already done, in the image acme/tomcat:centos!).
Rerun the test... no change. What's wrong?
Peek inside the container...

```
docker run --rm -it acme/tomcat:centos bash
ls /usr/local/tomcat # Nope, nothing there. How about..
ls /usr/share/tomcat # Oh good. Let's update the goss file to use share instead of local.
```
Rerun the test again. Much better, catalina.jar has been found. Ok, need to add the sample.war.
Edit docker-compose.yml to do that, and build using `docker-compose build`.
Run the test, including mounting the war file:

```
dgoss run --rm -it -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps centos:7
```

Mostly good. Doesn't like the file size. No idea what's going on. Never mind, just comment it out.

## Step 3: Refactor

Edit the resulting goss.yaml so that it looks like this:
```
file:
  /usr/local/tomcat/lib/catalina.jar:
    exists: true
    filetype: file
  /usr/local/tomcat/webapps/sample.war:
    exists: true
    filetype: file
```

Refactoring complete! Iteration 2, please.