
const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        const error = new HttpError("Something went wrong,Could not find User", 500);

        return next(error);
    }
    res.json({ users: users });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        throw new HttpError("Invalid Inputs", 422);
    }
    const { name, email, password } = req.body;
    let hasUser;
    try {
        hasUser = await User.find({ email: email });
    } catch (err) {
        const error = new HttpError("Something went wrong,Could not find User", 500);

        return next(error);
    }

    if (hasUser.length) {

        return next(new HttpError("Email already  registered", 401));
    }
    let hashedPassword;
try{
    hashedPassword = await bcrypt.hash(password,12);
}
catch(e){
    const error = new HttpError("Something went wrong,Could not Save User", 500);

    return next(error);
}
   
    let createdUser = new User({

        name,
        email,
        password:hashedPassword,
        image:req.file.path,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("Something went wrong,Could not Save User", 500);

        return next(error);
    }
    let token;
    try { 
        token = jwt.sign({
            userId:createdUser.id,
            email:createdUser.email
        },"supersecret_dont_share",
        {expiresIn:'1h'}
        );
    }catch (err) {
        const error = new HttpError("Something went wrong,Could not Save User", 500);

        return next(error);
    }
   
    res.status(201).json({ userId: createdUser.id,email: createdUser.email,token:token });
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid Inputs", 422));
    }
    const { email, password } = req.body;

    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Something went wrong,Could not find User", 500);

        return next(error);
    }

    if (!identifiedUser) {
        return next(new HttpError("could not find User", 401));
    }
    let isValidPassword;
    try{
        isValidPassword = await bcrypt.compare(password,identifiedUser.password);
    }
    catch (err) {
        const error = new HttpError("Invalid username or password", 500);

        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError("Invalid username or password", 500);

        return next(error);
    }
    let token;
    try { 
        token = jwt.sign({
            userId:identifiedUser.id,
            email:identifiedUser.email
        },"supersecret_dont_share",
        {expiresIn:'1h'}
        );
    }catch (err) {
        const error = new HttpError("Something went wrong,Could not login  User", 500);

        return next(error);
    }

    res.json({ message: 'logged in!',
    userId:identifiedUser.id,
    email:identifiedUser.email,
    token:token });
};


exports.getUsers = getUsers;

exports.signup = signup;

exports.login = login;