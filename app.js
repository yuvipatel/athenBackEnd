const routes = require("./routes.js");
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// serve static file contents
app.use('/static', express.static(path.join(__dirname, 'public')));

routes(app);

https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}, app).listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

// app.listen(3000, () => {
//     console.log('Example app listening on port 3000!');
// });
