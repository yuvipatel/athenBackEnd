## Athena Backend

### installation

App uses the node version 7.4.0, so better to use nvm and install node version 7.4.0

```
nvm install 7.4.0

nvm use 7.4.0
```

### Install dependancies

```
npm i
```

### Create SSL certificate

SSL certificate is required to run the backend API's on HTTPS.

create certs directory
navigate to certs/

Follow the step 1 through 4 given at http://www.akadia.com/services/ssh_test_certificate.html

Use your own values insted of values provided in instructions.

In order to make SSL work across all browsers add backend API hosting server URL in place of following value

```
Common Name (eg, your name or your server's hostname) []: {backend API URL} 
```

####Rename files 

```
cp server.crt ssl.crt
cp server.key ssl.key
```

### Running app

```
node start.js
```

This will start node server on https://localhost:3000
