const {validationResult} = require('express-validator');

module.exports = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error.array().map(e => ({param:e.path, msg:e.msg})))
        return res.status(400).json({error:error.array().map(e => ({param:e.path, msg:e.msg}))});

    }
    next();
};