let routes = require("./routes.js");
let express = require('express');
let app = express();

routes(app);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
