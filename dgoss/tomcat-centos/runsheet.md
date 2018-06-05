# Goal for today

Build prod-ready tomcat.
We have as an example the Alpine-based one that we've been using for our integration tests.
We're an RHEL shop, and we've been allowed use CentOS because it's RedHat.
So we want to put sample.war on centos:7

Prerequisites:
* sample.war running on Alpine.
* goss (dgoss) installed (for the "T" part).
* VSCode installed (for the 1st "D").
* Prepared to write failing tests and refactor lots (for the 2nd "D").

# Drive Development through Testing

## Iteration 1: Tomcat is installed

### Step 1: Create our test from our alpine container

```
dgoss edit acme/tomcat:alpine
goss add file /usr/local/tomcat 
```

## Iteration 2: Tomcat is running

### Step 1: Add to our test
```
dgoss edit acme/tomcat:alpine
goss autoadd java
```