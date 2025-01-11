class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);  // Inherited from the built-in Error class
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
