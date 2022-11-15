
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_Secret = process.env.JWT_SECRET || "@superiorCodeLabs_JWT_Secret#";

const userAuthentication = (req, res, next) => {
    // Get the userID from the JWT token and id to request object.
    const auth_token = req.headers.authtoken;
    if (!auth_token) {
        // If auth token is not there in headers then it will return from here.
        return res.send({ error: 'Please authenticate using a valid credentials.' });
    };
    try {
        // Verifying the auth token. If not verified then it will go to catch and return back.
        const data = jwt.verify(auth_token, jwt_Secret);
        // Assigning user data to request.
        req.user = data.user;
        next();
    } catch (error) {
        return res.send({ error: 'Please authenticate using a valid credentials.' });
    };
};

module.exports = userAuthentication;