const { validationResult } = require("express-validator");

module.exports = {
    handleErrors(templateFunc, callBack) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                let data = {};
                // explaination on video 423
                if (callBack) {
                    data = await callBack(req);
                }
                return res.send(templateFunc({ errors, ...data }));
            }

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
