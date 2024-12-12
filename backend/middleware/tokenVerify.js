const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
    const token = req.headers['authorization'];

    try {
        if (!token) {
            return res.status(401).json({
                login: false,
                data: "No token provided"
            });
        }
        const jwtToken = token.replace("Bearer","").trim()
        const decoded = await jwt.verify(jwtToken, process.env.SECRET_KEY);
        req.user = decoded;
        
        next();
        
    } catch (error) {
        return res.status(404).json({
            login: false,
            data: "Invalid token"
        });
    }
};

module.exports = authentication;
