const jwt = require ("jsonwebtoken");
// get the JWT_SECRET from .env file
const JWT_SECRET = process.env.JWT_SECRET;

// authenticate the token   
function authenticateToken (req, res, next ){
    // get the token from the header
    const authHeader = req.headers["authorization"];
    // token is the second part of the authorization header and split by space
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        //401 = unauthorizated
        return res.status(401).json({message:"Access denied"});
    }
    // verify the token
    jwt.verify(token, JWT_SECRET,(err,user)=>{
        if(err){
            //403 = not allow
            return res.status(403).json({
                message:"Invalid or expired token"
            });
        }
        // if the token is valid, add the user to the request object
        req.user = user;
        // call the next middleware
        next();
    });
}

module.exports = authenticateToken;