const _ = require('lodash');

module.exports = {
    /**
     * Response error
     * @param code HTTP Code
     * @param error Error message
     * @param kind Kind of error
     * @param res
     */
    responseError (code, error, res) {
        res.status(code);
        res.json({
            message: error,
            code: `app/${kind}.${_.kebabCase(error)}`
        });
    },
};
