const express = require("express");
const { check, validationResult } = require("express-validator");

const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassord, requirePasswordConfirmation } = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post(
    "/signup",
    [requireEmail, requirePassord, requirePasswordConfirmation],
    async (req, res) => {
        // "check" results is attatched to "req"
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password } = req.body;

        const user = await userRepo.create({ email, password });

        req.session.userId = user.id;

        res.send("Account created!!");
    }
);

router.get("/signout", (req, res) => {
    req.session = null;
    res.send("You are logged out.");
});

router.get("/signin", (req, res) => {
    res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepo.getUserBy({ email });

    if (!user) {
        return res.send("Email not found.");
    }

    const validPassword = await comparePasswords(user.password, password);

    if (!validPassword) {
        return res.send("Invalid password");
    }

    req.session.userId = user.id;

    res.send("You are signed in!");
});

module.exports = router;
