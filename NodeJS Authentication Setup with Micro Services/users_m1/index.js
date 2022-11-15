'use strict';

const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./mysql_database');
require('dotenv').config();
const gatewayPort = process.env.GATEWAY_PORT || 8000;
const usersPortM1 = process.env.USERS_PORT_M1 || 9001;
const jwt_Secret = process.env.JWT_SECRET || "@superiorCodeLabs_JWT_Secret#";
// Importing middle ware here.
const userAuthentication = require('../api-gateway/middleware/userAuthentication');

//middleware to read req.body.<params>
app.use(express.json());

// API to get users GET : `http://localhost:${gatewayPort}/users/`
app.get("/", (req, res) => {
	res.send("Users (Module 1) Server Running....");
})

// API to signup users POST : `http://localhost:${gatewayPort}/users/sign-up` (No Login Required);
app.post(`/sign-up`, async (req, res) => {
	/* // Send details in that way...
		{ "name": "vasu", "email": "vasu@gmail.com", "password": "vasu", "username": "vasuvasu", "mobile", "1234567890" }
	*/
	// Creating salt to add in password.
	const salt = await bcrypt.genSalt(10);
	// Creating secured hash password. With Salt.
	const secretPassword = await bcrypt.hash(req.body.password, salt);
	// taking all data from Body of request...
	const { name, email, username, mobile } = req.body;
	const password = secretPassword;

	// Checking for empty and maximum Name values.
	if (name.length < 3 || name.length > 25) return res.status(400).json({ value: "name", error: "Name has to be 3 to 25 characters." });
	// Checking for 10 chars mobile values.
	if (mobile.length !== 10) return res.status(400).json({ value: "mobile", error: "Mobile has to be 10 characters." });
	// Checking for empty and maximum username values.
	if (username.length < 5 || username.length > 20) return res.status(400).json({ value: "username", error: "Username has to be 5 to 20 characters." });
	// Checking for empty and maximum password values.
	if (req.body.password.length < 8 || req.body.password.length > 15) return res.status(400).json({ value: "password", error: "Password has to be 8 to 15 characters." });
	// Checking mail from regular expression.
	let reg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	if ((!reg.test(email)) || (email.length < 5) || (email.length > 45)) return res.status(400).json({ value: "email", error: "Please provide correct email. Email range is 5 to 45 Chars." });

	try {
		// Query to check weather email is already exists or not.
		let SQL_Query = `SELECT COUNT(*) AS count FROM user_details WHERE email="${email}"`;
		db.query(SQL_Query, (err, result) => {
			if (err) throw err;
			else {
				if (result[0].count > 0) {
					return res.status(400).json({ error: "Email Already Exists..." });
				}
				else {

					// Query to check weather username is already exists or not.
					SQL_Query = `SELECT COUNT(*) AS count FROM user_details WHERE username="${username}"`;
					db.query(SQL_Query, (err, result) => {
						if (err) throw err;
						else {
							if (result[0].count > 0) {
								return res.status(400).json({ error: 'Username Already Exists' });
							}
							else {
								let authToken;

								// Saving Data into DB. Here user_details is tablename and it has to be same in db also.
								SQL_Query = `INSERT INTO user_details (name, username, mobile, email, password) VALUES ("${name}", "${username}", "${mobile}", "${email}", "${password}")`;
								// Running mySQL query from these lines...
								db.query(SQL_Query, (err, result) => {
									if (err) throw err;
									console.log('\nSuccess,', 'Data added successfully!');
									console.log('Signup Successfull.');
									const data = {
										user: { id: result.insertId }
									}
									authToken = jwt.sign(data, jwt_Secret);
									return res.json({ authToken });
								});
							};
						};
					});
				};
			};
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ "error": "Internal Server Error. Sign Up" });
	};
});

// API to login users POST : `http://localhost:${gatewayPort}/users/login` (No Login Required);
app.post(`/login`, (req, res) => {
	/* // Send details in that way...
	{ "email": "vasu@gmail.com", "password": "vasu" },
	{ "username": "vasuvasu", "password": "vasu"}
	*/
	// variable for sending token to user login...
	let authToken;

	// taking all data from Body of request... 
	let userPassword = req.body.password;
	let userID;
	// if email is there then go for email otherwise go for username.
	req.body.email ? userID = req.body.email : userID = req.body.username;

	if (req.body.email) {
		// Checking mail from regular expression.
		let reg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		if ((!reg.test(userID)) || (userID.length < 5) || (userID.length > 45)) return res.status(400).json({ value: "email", error: "Please provide correct email. Email range is 5 to 45 Chars." });
	} else {
		// Checking for empty and maximum username values.
		if (userID.length < 5 || userID.length > 20) return res.status(400).json({ value: "username", error: "Username has to be 5 to 20 characters." });
	};

	// Checking for empty and maximum password values.
	if (userPassword.length < 8 || userPassword.length > 15) return res.status(400).json({ value: "password", error: "Password has to be 8 to 15 characters." });

	// here user_details is tablename and it has to be same in db also. If email is there then go for email otherwise go for username.
	let SQL_Query;
	req.body.email ? SQL_Query = `SELECT * FROM user_details WHERE email = ?` : SQL_Query = `SELECT * FROM user_details WHERE username = ?`;

	// checking data into mySQL database from these lines...
	db.query(SQL_Query, [userID], async (err, result) => {
		try {
			if (err) throw err;
			// Checking if email is present in DB then only go next. Otherwise go back with bad request.
			if (result.length === 0) {
				return res.status(400).json({ error: "Please try to logged in with correct credentials. Email" });
			};
			// Checking req.body.password and DB password is same or not...
			let passwordCompare = await bcrypt.compare(userPassword, result[0].password);
			// If password is wrong then go back with bad request.
			if (!passwordCompare) {
				return res.status(400).json({ error: "Please try to logged in with correct credentials. Password" });
			};
			// Taking id and creating payload here.
			const data = {
				user: { id: result[0].id }
			};
			// Signing auth token with JWT
			authToken = jwt.sign(data, jwt_Secret);
			// Sending authToken to the user.
			return res.json({ authToken });
		} catch (error) {
			// If any error send Internal server error and go back.
			console.error(error.message);
			res.status(500).send({ "error": "Internal Server Error. Login" });
		};
	});
});

// userAuthentication is middle ware to authenticate logged in user.
// API to Get Logged in User Details POST : `http://localhost:${gatewayPort}/users/getuser` (Login Required);
app.post(`/getuser`, userAuthentication, (req, res) => {
	/* authtoken : dyr87ehf... */
	try {
		// Taking userID from request after authenticate from middle ware.
		const userId = req.user.id;
		// here user_details is tablename and it has to be same in db also. If email is there then go for email otherwise go for username.
		let SQL_Query = `SELECT id, name, email, username, mobile FROM user_details WHERE id = ${userId}`;
		// checking data into mySQL database from these lines...
		db.query(SQL_Query, async (err, result) => {
			let user = result[0];
			return res.send(user);
		});

	} catch (error) {
		// If any error send Internal server error and go back.
		console.error(error.message);
		return res.status(500).send({ "error": "Internal Server Error. Get User" });
	};

});

// Liostening the server.
app.listen(usersPortM1, () => {
	console.log(`Users (Module 1) : Module listening on http://localhost:${usersPortM1}/`);
	console.log(`Users (Module 1) : API gateway listening on http://localhost:${gatewayPort}/users/`);
});