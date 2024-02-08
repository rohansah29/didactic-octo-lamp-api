const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, "masai");
            // console.log(decoded)
            req.user_id = decoded.user_id;
            next();
        } catch (error) {
            res.status(401).json({ msg: "Token is not valid" });
        }
    } else {
        res.status(401).json({ msg: "Authorization denied. No token provided" });
    }
};

module.exports = auth;
