
const HttpError = require('../models/http-error');

const {validationResult} = require('express-validator');

const uuid = require('uuid');

const DUMMY_USERS = [{
    id:"", 
    email:"test@test.com",
    password:"1234",
}];

const getUsers = (req, res, next) =>{
    res.json({users:DUMMY_USERS});
};
const signup = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      throw new HttpError("Invalid Inputs",422);
    }
    const {name , email, password} = req.body;
const hasUser = DUMMY_USERS.find(u=>u.email === email);

if(hasUser){
     throw new HttpError("Email already  registered",401);
}
    const createdUser = {
        id:uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user:createdUser});
};
const login = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      throw new HttpError("Invalid Inputs",422);
    }
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u=>u.email === email);

    if(!identifiedUser || !identifiedUser.password !== password){
        throw new HttpError("could not find User",401);
    }
    res.json({message:'logged in!'})
};


exports.getUsers = getUsers;

exports.signup = signup;

exports.login = login;