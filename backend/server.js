const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const db = require("./db");
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const jobsRoutes = require('./routes/jobsRoutes');

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

const limiter = rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many atempts. Try again in 15 minutes." }
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes)

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
})

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.error("database error", err)
            res.status(500).json({ error: "database error" });
        }
        res.json(result);
    });
});

if (require.main === module) {
    app.listen(PORT, () => console.log("Server is running"));
}

module.exports = app;

