const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12');

function createAccessToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '15m' }
    );
}

async function createRefreshToken(userId, req) {

    const jti = crypto.randomUUID();

    const token = jwt.sign(
        { userId, jti },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRES || '7d' }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const ip = req.ip || req.connection.remoteAddress||null;
    const userAgent = req.headers['user-agent']||null;

    await db.promise().execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
        [userId, token, expiresAt, ip, userAgent]
    );
    return token;
}

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const [existing] = await db.promise().query('SELECT id FROM user WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.promise().execute(
            'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashed]
        );

        const userid = result.insertId;

        const accessToken = createAccessToken({ id: userid, email });
        const refreshToken = await createRefreshToken(userid, req);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ user: { id: userid, name, email }, accessToken });

    } catch (err) {
        next(err);
    }

}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const [rows] = await db.promise().query('SELECT id, name, email, password FROM user WHERE email = ?', [email])

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = createAccessToken({ id: user.id, email: user.email });
        const refreshToken = await createRefreshToken(user.id, req);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken })

    } catch (err) {
        res.status(401).json({error:"Login error"})
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const oldtoken = req.cookies.refreshToken || req.body.refreshToken;
        if (!oldtoken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        let decode;
        try {
            decode = jwt.verify(oldtoken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);

        } catch (err) {
            return res.status(401).json({ error: 'Invalid refresh token' });

        }

        const [rows] = await db.promise().query(
            'SELECT * FROM refresh_tokens WHERE token = ? AND revoked = false',
            [oldtoken]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Revoked or invalid tokens' })
        }
        if (rows[0].expires_at < new Date()) {
            await db.promise.execute(
                'UPDATE refresh_tokens SET revoked = true WHERE id = ?', [rows[0].id]
            )
            return res.status(401).json({ error: 'Expired token, revoked' })
        }

        const token = rows[0];

        await db.promise().execute(
            'DELETE FROM refresh_tokens WHERE id = ?', [token.id]
        );

        const userId = decode.userId;

        const accessToken = createAccessToken({ id: userId, email: decode.email });
        const newRefreshToken = await createRefreshToken(userId, req);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });


    } catch (err) {
        console.error("sth is wrong", err)
        return res.status(401).json({ error: 'Some thing is wrong. Contact admin or try again' })
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if(token){
            await this.revokeAllTokens(req.user.id)
        }
        res.clearCookie('refreshToken', {
            httponly: true,
            secure: true,
            sameSite: 'strict'
        });
        res.json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: ' logout failed ' + err })
    }
};

exports.revokeAllTokens = async (userId) => {
    await db.promise().execute('UPDATE refresh_tokens SET revoked = true WHERE user_id = ?', [userId]);

}

exports.getActiveSessions = async (req, res) => {
    try{
        const [rows] = await db.promise().query(
            'SELECT id, ip_address, user_agent, created_at, expires_at from refresh_tokens WHERE user_id = ?', [req.user.id]
        );
        res.json(rows);

    }catch(err){
        res.status(500).json({error:"can't fetch sessions"});
    }
}