const pool = require('../db/index');
const jwt = require('jsonwebtoken');

//Check email
const checkUsersEmail = async (email) => {
    try {
        const response = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (response.rows.length === 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error.message);
    }
}

//MiddleWare function for checking if the user was logged in recently
function checkLogin(req, res, next) {
    const token = req.header("token");
    //If the user logged without remember me checked
    if (!token) {
        return res.status(500).json({ message: "You are not Logged in" });
    }
    const user = jwt.verify(token, process.env.SECRET_TOKEN);
    //We take the token payload to get the email
    req.user = user;
    next();
}

module.exports = { checkUsersEmail, checkLogin };