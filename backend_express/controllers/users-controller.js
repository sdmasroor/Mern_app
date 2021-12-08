
const HttpError = require('../models/http-error');

const { validationResult } = require('express-validator');

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
    let createdUser = new User({

        name,
        email,
        password,
        image:"image",
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("Something went wrong,Could not Save User", 500);

        return next(error);
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError("could not find User", 401));
    }
    res.json({ message: 'logged in!' })
};


exports.getUsers = getUsers;

exports.signup = signup;

exports.login = login;