
exports.errorHandler = function(err, req, res, next) {
    if (err.statusCode) {
        // Our own custom error. Send appropriate status code and error message
        let msg = err.res || err.message;
        res.send(err.statusCode, msg);
    } else {
        // Other unhandled or programming errors. Don't disclose internal details to
        // client. Simply log error message and stack to server console and send
        // status code 500 to client.
        console.error(err.message);
        console.error(err.stack);
        res.send(500);
    }
};
