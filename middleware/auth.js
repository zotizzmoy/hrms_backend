//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//IMPORT THINGS ON THE TOP
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const jwt = require("jsonwebtoken");
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIG IMPORT
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const config = process.env;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const verifyToken = (req, res, next) => {
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (!token) {
        return res.status(403).send("A Token Is Required For Authentication");
    }
    try {
        // decode the token 
        
        const decoded = jwt.verify(token, config.JWT_SECRET);
        //req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = verifyToken;