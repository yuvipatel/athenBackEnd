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

run following command

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```

You can edit no. of days from 365 to any number.

### Running app

```
node start.js
```

This will start node server on https://localhost:3000

### Troubleshooting

If you face any error like

```
c.context.setKey(options.key);
                ^
Error: error:0906A068:PEM routines:PEM_do_header:bad password read
```

run following command

```
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
```
