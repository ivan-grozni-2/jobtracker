const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({error:'Unauthorized'});
        }
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {id:decode.userId, email:decode.email};
        next();

    }catch(err){
        return res.status(401).json({error:'Invalid or expired token'});
    }
};