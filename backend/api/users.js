const router = require("express").Router();
const pool = require('../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkUsersEmail, checkLogin } = require("../helper/user");

//Sign Up a new user
router.post('/users/SignIn', async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;
        const checkEmail = await checkUsersEmail(email);
        if (checkEmail) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const response = await pool.query('INSERT INTO users VALUES($1, $2, $3, $4)', [email, first_name, last_name, hashedPassword]);
            res.status(200).json('Account Created!');
        } else {
            res.json('The email you inserted is already used!');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Log in with an existent account(sa bag si jwt)
router.post('/users/LogIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
        if (response.rows.length !== 0) {
            const cryptPass = await bcrypt.compare(password, response.rows[0].password);
            if (cryptPass) {
                const token = jwt.sign({ email: email }, process.env.SECRET_TOKEN, { expiresIn: '12h' });
                res.status(200).json(token);
            } else {
                res.json('Wrong password');
            }
        } else {
            res.json('No account was found with this email');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Check the email sent
router.post('/users/forgotPass', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (newPassword === undefined) {
            const check = await checkUsersEmail(email);
            if (check) {
                res.json('This Email doesnt have an account asociated!');
            } else {
                res.status(200).json('Email is Good');
            }
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const newPass = await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
            res.status(200).json('Password updated');
        }
    } catch (error) {
        console.error(error.message);
    }
});

//Check if the user was logged in the last 12 hours
router.get("/checkLogin", checkLogin, async (req, res) => {
    try {
        res.status(200).json(req.user.email);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;