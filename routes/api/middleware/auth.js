const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).json({msg:"no token, authorization denied"});
    }

    try {
        decoded = jwt.verify(token,config.get("jwtSecet"));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json("token is not valid");
    }
}