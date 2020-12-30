const express = require("express");
const router = express.Router();
const auth = require("./middleware/auth.js");
const User = require("./models/User.js");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

//@route GET api/auth
//@desc  get the user by token
//@access Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "server error" });
    }
});

//@route POST api/auth
//@desc  login User
//@access Public
router.post(
    "/",
    [
        check('email', 'please add an email').isEmail(),
        check('password', 'please enter a valid password').exists()
    ],
    async (req, res) => {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            //see if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }

            isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
            }
            const paylod =
            {
                user: {
                    id: user.id
                }
            }
            const msg = "done";
            jwt.sign(paylod,
                config.get("jwtSecet"), { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, msg });
                })
            //get user gavarar
            //encrypt password
            //get user webtoken
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    });

module.exports = router;