The `docker-compose.yml` file here starts MySQL and MySQL Workbench in different containers, talking to each other via a named network "fakingerrors_fragile".

Before running `docker-compose up`, ensure you run `xhost local:+` so that Workbench is allowed display on your host.

Once the containers are running, you can connect Workbench to MySQL by adding a new connection: the MySql machine is called "mysql" and the DB server is on the default port, 3306.

You can prove that the connection is working by running a query like `select current_date(), current_time();`.
If you view the server status page, you can click the "Refresh" button.

To demonstrate the effects of the MySQL machine disappearing from the network, you can run
`docker network disconnect fakingerrors_fragile fakingerrors_mysql_1`. When you click the Refresh button, Workbench will not respond (this is not gracefully failing!). You can try to switch tabs but nothing will happen.
To make MySQL reappear, run `docker network connect fakingerrors_fragile fakingerrors_mysql_1`. All your queued actions will execute in short order: more ungraceful failing.

Similarly, you can demonstrate what happens when the entire network disappears and reappears with the commands `docker network disconnect fakingerrors_fragile fakingerrors_workbench_1` and `docker network connect fakingerrors_fragile fakingerrors_workbench_1`. (It's the same behaviour as when the database disappears / reappears).
