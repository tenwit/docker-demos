# Testing in DevOps

Big picture, DevOps seems to be all about testing. It pretty much tells us to
- use automated checks to measure how fit-for-purpose our applications and infrastructure are, and
- to share the results widely in order to foster a lean culture.
All of CALMS in a single sentence! ;)
Have a policy of designing your checks to be easily consumed by all stakeholders. Easy to read, easy to consume. Share, and enjoy.

## Why TDD for infrastructure code?

Honestly: for exactly the same reasons as for application code.

In my opinion, TDD is primarily a specification technique. It does provide validation, it affects design and it drives development, but its most important effect on how I create software is that is changes the questions I ask myself. Instead of asking "how do I solve this problem?", I ask questions like "what is the smallest problem I can solve" and "what am I _really_ trying to achieve?" There are lots of side effects to this change in perspective:
- There's fewer tests: one per problem (approximately...).
- Each test is catching something that no other test will catch.
- There's less code, and less code to break.
- Since they're written as specs, they're self-documenting and phrased in a way that allows them to be used as documentation and (in case of failure) as an error report.
- They can be more easily pair- or mob-developed by cross-functional teams because they're not reverse-engineered from code, the way may of us write our unit tests.
- Involving the test- and ops-specialists at this stage fosters the right culture: shared responsibility, shared interest and shared solution creation.
- Having this broader range of inputs into test developerment helps ensure the right language is developed and consistently used by the team and with the other stakeholders.

It also enables CI of infrastructure from the start. And that leads to all sorts of Devops-y benefits:
- Increased confidence in the application and infrastructure throughout the organization.
- Transparent evidence of how close to or far from releasing we might be.
- With automatic publication of tests as specifications, there is
  - insurance against loss of team knowledge, and
  - better preparation for inclusion of new teams (growth, outsourcing, etc.).
- Improved traceability between requirements and infrastructure (great for auditors!).

## Automated checking of infrastructure code

Application development has bought into automated checking. The applications that enable infrastructure-as-code are so well tested: many of them are open source and you can browse the checks on GitHub. But very often, the code that we write for these applications is not so well tested. There's no real reason for this: the tools are there and they're great! We just don't seem to have the same rigour around infrastructure testing as we do around application testing.

Serverspec, inspec, AWS spec, Kitchen/KitchenCI and more provide everything we need. They're fairly easy to use and provide everything you could possibly want: they have full power of Ruby and its ecosystem of testing libraries behind them. Start using one!

# Goal for today

In case that seems like a big ask, today I'm going to lower the bar to getting started. There's another tool, a lot less powerful and a lot less flexible, but it's good at what it does and it's really, really easy to work with.

Let's say our development team managed to convince the architects and security guys that docker is the future. They've got neat little image that everyone uses for testing on their dev machines. The continuous integration uses it, the testers use it, we even give the stakeholder demos using it.

But we can't use it for system testing, or business process testing, or integration testing, or performance and security testing. And the ops and SRE teams are getting really jealous of how easy it is for the testers to upgrade and they want docker. So they try to convince the architects and security guys to let them use it in more environments.. and they say yes! So long as it's RHEL. Or at least CentOS, 'cos that's pretty much RHEL for Docker.

So we want to get our app running on the centos:7 docker image, in a way that's indistinguishable to app users. Let's...

# Drive Development through Testing

## Iteration 1: Tomcat is installed

### Step 1: Create our test from our alpine container

```
cd ~/tdd/iteration1
dgoss edit --rm -it -p 8080:8080 -v warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss add file /usr/local/tomcat/lib/catalina.jar
goss add file /usr/local/tomcat/webapps/sample.jar
```

### Step 2: Make it pass

Fail against vanilla CentOS:
    dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps centos:7

Build CentOS+Tomcat, and run again:
```
cd tomcat-centos
docker-compose build
dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps acme/tomcat:centos
```

Edit goss.yaml to fix paths. (/usr/local => /usr/share)

### Step 3: Refactor

Remove the unimportant stuff.

## Iteration 2: Tomcat is running

### Step 1: Add to our test

```
cd ~/tdd/iteration2
dgoss edit --rm -it -p 8080:8080  -v warfiles:/usr/local/tomcat/webapps acme/tomcat:alpine
goss autoadd java
```

### Step 2: Make the test pass

    dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps 

Make Tomcat run:

```
docker-compose build
dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps 
```

Wait for Tomcat to start up:

    mv x_goss_wait.yaml goss_wait.yaml

Try again.
Nope. Turn on IPv6.

    dgoss run --rm -it -p 8080:8080 -v warfiles:/usr/share/tomcat/webapps --sysctl net.ipv6.conf.all.disable_ipv6=0 acme/tomcat:centos

### Step 3: Refactor

Remove the unimportant ports, IP address, etc. Check.

### What we've learned

That waiting and timing are important when testing infrastructure!
Testing your infrastructure can teach you more about how your infrastructure works.
And there's great value in docker-compose: I wouldn't want to have to type `--sysctl net.ipv6.conf.all.disable_ipv6=0` every time I started my app!

## Iteration 3: Our application is running

### Step 1: Add to our test

Use the alpine image to `dgoss edit` again. This time, we're going to check that our application is correctly serving its landing page. `goss add http http://localhost:8080` should do it. Note that goss runs _inside_ the container, so if we were binding the container's port 8080 to the host's port 80, we would use `localhost:8080` as the address. You _can_ use goss on the host as well, if the host is a linux machine.

### Step 2: Make it pass

Actually.. it already passes! Always nice when that happens!

### Step 3: Refactor

Remove the unimportant fields from the HTTP test. And let's add "Hello, World" to make it more precise. Rerun.

### What we've learned

Sometimes, TDD can't provide you with a failing test to start with :)
And sometimes, the refactoring step can be more than just refactoring. Redesigning your tests based on the test tool isn't always a bad thing.

# Conclusions

This sort of test-first infrastructure development fits very well with DevOps.
- Automation: well, 'nuff sed.
- Measurement: again, 'nuff sed. Checks like these _are_ measurements: of predictability, if nothing else.
- Sharing: when designed as executable specifications, with as wide a target audience as possible, automated checks and their results share the intent and status of your application and the infrastructure supporting it.
- Culture: writing these checks to automatically share valuable measurements is very nearly the _definition_ of DevOps culture.

# If there's more time...

## Including in CI

You want to incorporate these tests to your ruby / java / perl test suite? No worries! Set `GOSS_OPTS` to `--format rspecish`, `--format junit` or `--format tap`.

## Turn your tests into monitoring agents

Goss provides a "serve" feature, which exposes a HTTP port that serves the test results. This can be very handy when you want to monitor the health of test machines but don't want to set up / join in a full ELK stack and configure a suite of beat modules! Getting it working with dgoss isn't explained anywhere, so I'll show you how.

The trick is to use `dgoss edit` to run the container _and_ provide goss on the command line. You have to expose the port that you plan to serve the health endpoint on.

```
dgoss edit  --rm -it -p 8080:8080 -p 8081:8081 -v $WARFILEDIR:/usr/share/tomcat/webapps --sysctl net.ipv6.conf.all.disable_ipv6=0 acme/tomcat:centos
goss server --endpoint / --listend-addr :8081 --format junit
```