const routes = require("./routes.js");
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

routes(app);

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
