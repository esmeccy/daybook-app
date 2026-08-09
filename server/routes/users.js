const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");
const db = require("../config/db");

const usersRouter = express.Router();

// get the JWT_SECRET from .env file
const JWT_SECRET = process.env.JWT_SECRET;

// register a user
usersRouter.post("/sign-up",
    // validate the request body using express-validator (middleware)
    [
    body("username").trim().notEmpty().withMessage("Username is required."),
    //check and normalize the email to lowercase
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    //check the password to at least 8 characters or longer
    body("password").isLength({min:8}).withMessage("Password must be at least 8 characters or longer"),
],async (req,res)=>{
    // get the errors from the express-validator
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    
    // get the email and password from the request body
    const {username,email,password} = req.body;

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password,10);

    // insert the user into the database
    const sql = 'INSERT INTO `ec_users-table` (username, email, password) VALUES (?,?,?)';

    // get the result from the database
    db.query(sql, [username,email,hashedPassword],(err,result)=>{
        if(err) {
            // the email column is UNIQUE, so the database rejects duplicates for us.
            // no pre-check needed, and this stays correct under concurrent requests
            // 409 = conflict
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    errors:[{msg:"Email already in use"}]
                });
            }
            // log it and return a 500 error
            // 500 = internal server error
            console.error(err);
            return res.status(500).json({
                message:"Creating user failed"
            });
        }
        // 201 = created
        res.status(201).json({
            message:"User created successfully",
            userId:result.insertId
        });
    });
});

// sign in
usersRouter.post("/sign-in",
    // validate the request body using express-validator (middleware)
    [
    // validate the email
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    // validate the password
    body("password").notEmpty().withMessage("Password is required"),
],(req,res)=>{
    // get the errors from the express-validator
    const errors = validationResult(req);
    // if there are errors, return a 400 error
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }

    // get the email and password from the request body
    const {email,password} = req.body;
    // get the user from the database and limit the result to 1
    const sql = 'SELECT id, username, email, password FROM `ec_users-table` WHERE email = ? LIMIT 1';

    // get the result from the database
    //async because we are using await to get the result from the database
    db.query(sql, [email], async(err,result)=>{
        // if there is an error, log it and return a 500 error
        if(err) {
            console.error(err);
            return res.status(500).json({
                message:"Unable to check existing user"
            });
        }
        // if the email is not in the database, return a 401 error
        if(result.length === 0) {
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        // if the email is in the database, check if the password is valid
        const user = result[0];
        // compare the password with the hashed password in the database
        // password = plain text password, user.password = hashed password
        //bcrypt.compare() returns a boolean
        const isPasswordValid = await bcrypt.compare(
            password, user.password
        );

        // if the password is not valid, return a 401 error
        if(!isPasswordValid) {
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        // if the password is valid, generate a token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        // return the token
        res.status(200).json({
            message:"Login successful",
            token:token
        });
    });
});

module.exports = usersRouter;