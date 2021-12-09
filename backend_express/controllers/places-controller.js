const HttpError = require('../models/http-error');

const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const getCoordsForAddress = require("../util/location");

const Place = require('../models/place');

const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  console.log("get res");
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place", 404);

    return next(error);

  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {

  const userId = req.params.uid;

  let places;
  try {
    places = await User.findById(userId).populate('places');

  } catch (err) {
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }

  if (!places || places.places.length == 0) {
    const error = new HttpError("Could not find place", 404);

    return next(error);
  }

  res.json({
    places: places.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

const createdPlace = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Inputs", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let createPlace = new Place({

    title: title,
    description: description,
    location: coordinates,
    address: address,
    image: "image",
    creator: creator
  });
  let hasUser;
  try {
    hasUser = await User.findById(creator);
  }
  catch (err) {
    return next(new HttpError("Error User Not Found", 500));
  }
  if (!hasUser) {
    return next(new HttpError("User Not Available", 500));
  }

  try {
    const sessions = await mongoose.startSession();
    sessions.startTransaction();
    await createPlace.save({ session: sessions });
    hasUser.places.push(createPlace);

    await hasUser.save({ session: sessions });
    await sessions.commitTransaction();

  }
  catch (err) {
   
    return next(new HttpError("Error Creating the Place", 500));
  }

  res.status(201).json(createPlace);
};

const updatePlace = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }

  place.title = title;

  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {

  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }
  if (!place) {
    const error = new HttpError("Could not find place", 500);

    return next(error);
  }
  try {

    const sessions = await mongoose.startSession();
    sessions.startTransaction();
    await place.save({ session: sessions });
    place.creator.places.pull(place);
    await place.creator.save({ session: sessions });
    await sessions.commitTransaction();

  } catch (err) {
    const error = new HttpError("Something went wrong,Could not find place", 500);

    return next(error);
  }
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;

exports.getPlacesByUserId = getPlacesByUserId;

exports.createdPlace = createdPlace;

exports.updatePlace = updatePlace;

exports.deletePlace = deletePlace;