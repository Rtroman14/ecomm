module.exports = {
    getError(errors, prop) {
        try {
            return errors.mapped()[prop].msg;

            // EXAMPLE OF "ERRORS"
            // errors: [
            //     {
            //         email: {
            //             msg: ""
            //         },
            //         password: {
            //             msg: ""
            //         },
            //         passwordConfirmation: {
            //             msg: ""
            //         }
            //     },
            // ];
        } catch (error) {
            return "";
        }
    },
};
