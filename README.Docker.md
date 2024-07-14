### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:8800.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)

# Run Sql command in phpmyadmin
    CREATE USER 'android-user'@'%' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON *.* TO 'android-user'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;

# Env variables
    PORT = 8800
    DBHOST= 192.168.100.84
    DBPASSWORD=password
    DBUSER =android-user
    DBNAME = manmm

# Run Exiting Docker Container
    docker run [name]

# Run New Docker Container

    docker run --hostname=2afd8a80bec4 --mac-address=02:42:ac:11:00:02 --env=DBUSER=android-user --env=DBNAME=manmm --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --env=NODE_VERSION=18.20.3 --env=YARN_VERSION=1.22.19 --env=PORT=8800 --env=DBHOST=192.168.100.84 --env=DBPASSWORD=password --network=bridge --workdir=/app -p 8800:8800 --restart=no --runtime=runc -d aungaung177461/webtel-api:0.0.2.RELEASE