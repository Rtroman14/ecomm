const layout = require("../layout");

const getError = (errors, prop) => {
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
};

module.exports = ({ req, errors }) => {
    return layout({
        content: `
            <div>
                <form method="POST">
                    Your ID is: ${req.session.userId}
                    <input name="email" placeholder="email" />
                    ${getError(errors, "email")}
                    <input name="password" placeholder="password" />
                    ${getError(errors, "password")}
                    <input name="passwordConfirmation" placeholder="passwordConfirmation" />
                    ${getError(errors, "passwordConfirmation")} 
                    <button>Sign Up</button>
            </div>
        `,
    });
};
