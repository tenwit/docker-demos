# Testing in DevOps

Big picture, DevOps seems to be all about testing. It pretty much tells us to
- use automated checks to measure how fit-for-purpose our applications and infrastructure are, and
- to share the results widely in order to foster a lean culture.
There, I think I've squeezed all of CALMS in a single sentence! ;)
Have a policy of designing your checks to be easily consumed by all stakeholders. Easy to read, easy to consume. Share, and enjoy.

Application development has bought into automated checking. The applications that enable infrastructure-as-code are so well tested: many of them are open source and you can browse the checks on GitHub. But very often, the code that we write for these applications is not well tested. There's no real reason for this: the tools are there and they're great! We just don't seem to have the same rigour around infrastructure testing as we do around application testing.

Serverspec, inspec, AWS spec, Kitchen/KitchenCI and more provide everything we need. They're fairly easy to use and provide everything you could possibly want: they have full power of Ruby and its ecosystem of testing libraries behind them. Start using one!

Today I'm going to lower the bar to getting started. There's another tool, a lot less powerful and a lot less flexible, but it's good at what it does and it's really, really easy to work with.

# Goal for today

Build prod-ready tomcat.
We have as an example the Alpine-based one that we've been using for our integration tests.
We're an RHEL shop, and we've been allowed use CentOS because it's RedHat.
So we want to put sample.war on centos:7

# Drive Development through Testing

## Iteration 1: Tomcat is installed

### Step 1: Create our test from our alpine container

```
cd ~/tdd/iteration1
dgoss edit --rm -it -p 8080:8080 -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss add file /usr/local/tomcat/lib/catalina.jar
goss add file /usr/local/tomcat/webapps/sample.jar
```

### Step 2: Make it pass

Fail against vanilla CentOS:
    dgoss run --rm -it -p 8080:8080 -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps centos:7

Build CentOS+Tomcat, and run again:
```
cd tomcat-centos
docker-compose build
dgoss run --rm -it -p 8080:8080 -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps acme/tomcat:centos
```

Edit goss.yaml to fix paths. (/usr/local => /usr/share)

### Step 3: Refactor

Remove the unimportant stuff.

### What we've learned

Getting started is easy! The yaml file is easy to read for the technical sorts, and hopefully you can see that it would be easy to convert this to a dashboard explaining what our infrastructure requirements are (two files must exist) and whether or not they are currently satisfied. If you can't see that, just take my word for it: there's tools that'll convert yaml to HTML and the CSS wizes can make it look nice.

## Iteration 2: Tomcat is running

### Step 1: Add to our test

```
cd ~/tdd/iteration2
dgoss edit --rm -it -p 8080:8080  -v /home/paul/projects/docker/dgoss/warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss autoadd java
```

### Step 2: Make the test pass

    dgoss run --rm -it -p 8080:8080 -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps 

Make Tomcat run:

```
docker-compose build
dgoss run --rm -it -p 8080:8080 -v /home/paul/projects/docker/dgoss/warfiles:/usr/share/tomcat/webapps 
```

Wait for Tomcat to start up:

    mv x_goss_wait.yaml goss_wait.yaml

Try again.
Nope. Turn on IPv6.

    docker run --rm -it -p 8080:8080 -v $WARFILEDIR:/usr/share/tomcat/webapps --sysctl net.ipv6.conf.all.disable_ipv6=0 acme/tomcat:centos

### Step 3: Refactor

Remove the unimportant ports, IP address, etc. Check.

## Iteration 3: Our application is running

### Step 1: Add to our test

`dgoss edit` again. This time, we're going to check that our application is correctly serving its landing page. `goss add http http://localhost:8080` should do it. _Note that goss runs _inside_ the container, so if we were binding the container's port 8080 to the host's port 80, we would use `localhost:8080` as the address. You _can_ use goss on the host as well, if the host is a linux machine.

### Step 2: Make it pass

Actually.. it already passes! Always nice when that happens!

### Step 3: Refactor

Remove the unimportant fields from the HTTP test. And let's add "Hello, World" to make it more precise. Rerun.