These tests run against a Selenium hub. It's configured to run using Zalenium, so pop over there and run `./start`.
Then you can pop back here and run `./start` to run the tests.

An easy way to figure out where the test result files end up is to run `docker diff` on the container after the tests finish. That gives you something like this:

    C /iqa_test
    A /iqa_test/logs
    A /iqa_test/logs/iqa.html
    A /iqa_test/logs/iqa.xml
    C /multi_browser_example
    A /multi_browser_example/logs
    A /multi_browser_example/logs/iqa.html
    A /multi_browser_example/logs/iqa.xml
    C /rspec_demo
    A /rspec_demo/logs
    A /rspec_demo/logs/output.json

You might like to mount those logs directories as bind mounts (back to the host machine) or as docker volumes. If you mount them into a swarm with a suitable storage driver, you can then mount them into your Jenkins or other dashboard machine for easy rendering of test results.