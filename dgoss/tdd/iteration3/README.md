# Iteration 1

## Step 1: Add to our test

`dgoss edit` again. This time, we're going to check that our application is correctly serving its landing page. `goss add http http://localhost:8080` should do it. _Note that goss runs _inside_ the container, so if we were binding the container's port 8080 to the host's port 80, we would use `localhost:8080` as the address. You _can_ use goss on the host as well, if the host is a linux machine.

## Step 2: Make it pass

Actually.. it already passes! Always nice when that happens!

## Step 3: Refactor

Remove the unimportant fields from the HTTP test. And let's add "Hello, World" to make it more precise. Rerun.