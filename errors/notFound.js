const {StatusCodes} = require('http-status-codes');
const customApiError = require('./customapi');


class NotFoundError extends customApiError {
    constructor(message) {
        super(message)
        this.statuscode = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundError