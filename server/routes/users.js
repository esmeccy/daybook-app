const express = require("express");
const bcrypt = require("bcrypt");

const { body, validationResult } = require("express-validator");
const db = require("../config/db");

const usersRouter = express.Router();

// register a user
usersRouter.post("/signup",
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

    // check if the email is already in use
    const checkEmail = 'SELECT * FROM ec_users WHERE email = ?';
    db.query(checkEmail, [email], (err,result)=>{
        // if there is an error, log it and return a 500 error
        // 500 = internal server error
        if(err) {
            console.error(err);
            return res.status(500).json({
                message:"Unable to check existing user"+err
            });
        }
        // if the email is already in use, return a 409 error
        // 409 = conflict
        if(result.length > 0) {
            return res.status(409).json({
                errors:[{msg:"Email already in use"}]
            });
        }
    });

    // hash the password using bcrypt after confirming the email is not in use
    const hashedPassword = await bcrypt.hash(password,10);

    // insert the user into the database
    const sql = 'INSERT INTO ec_users (username, email, password) VALUES (?,?,?)';

    // get the result from the database
    db.query(sql, [username,email,hashedPassword],(err,result)=>{
        // if there is an error, log it and return a 500 error
        // 500 = internal server error
        if(err) {
            console.error(err);
            return res.status(500).json({
                message:"Creating user failed"+err
            });
        }
        // 201 = created
        res.status(201).json({
            message:"User created successfully",
            userId:result.insertId
        });
    });
});

module.exports = usersRouter;