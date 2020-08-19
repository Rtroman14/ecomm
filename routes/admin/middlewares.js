const { validationResult } = require("express-validator");

module.exports = {
    handleErrors(templateFunc) {
        // middleware has to always be a function
        return (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.send(templateFunc({ errors }));
            }

            // go to next middleware or route handler
            next();
        };
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }

        next();
    },
};
