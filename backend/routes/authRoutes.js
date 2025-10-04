const express = require('express');
const {body} = require('express-validator');
const {register, login, refreshToken, logout, getActiveSessions} = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', [
    body('name').trim().isLength({min:2}).withMessage('Name must be atleast 2 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({min:8}).withMessage('Password must be at least 8 characters long')
],
validate, 
register);

router.post('/login', 
    [
        body('email').isEmail().normalizeEmail().withMessage("hack attempt"),
        body('password').exists()
    ],
    validate,
    login
);

router.post('/refresh', refreshToken);

router.post('/logout', authenticate, logout);

router.get('/sessions', authenticate, getActiveSessions)

module.exports = router;