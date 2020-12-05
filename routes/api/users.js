const express = require("express");
const config = require("config");
const router = express.Router();
const  { check, validationResult } = require('express-validator');
const User = require("./models/User.js");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//@route POST api/users
//@desc  Register User
//@access Public
router.post(
    "/",
    [
    check('name','name is required').not().isEmpty(),
    check('email','please add an email').isEmail(),
    check('password','please enter a password with more than 6 caracters').isLength({min:6})
    ],
    async (req,res)=>{
        const {name,email,password} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
         try {
            //see if user exists
            let user = await User.findOne({email});
            if(user){
               return res.status(400).json([{msg:"user already exists"}]);
            }
            const avatar = gravatar.url(email,{
                s:"200",
                r:"png",
                d:"mm",

            });

            user = new User ({
                name,email,avatar,password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            
            await user.save();

            const paylod = 
            {
                user:{
                    id:user.id    
                }
            }
            const msg ="done";
            jwt.sign(paylod,
                config.get("jwtSecet"), { expiresIn:36000},
                (err,token) => {
                if(err) throw err;
                res.json({ token , msg});
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