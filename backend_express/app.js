
const express = require('express');

const fs = require('fs');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const path = require('path');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');

const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("could not find the route", 404);

});
app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,()=>{
      console.log(error)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occoured" });
});
mongoose
  .connect(process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME)
  // .connect('mongodb://localhost:27017/Mern_db')
  .then(() => {
    console.log('Connected to database and server');
    app.listen(5000);
  }).
  catch(err => {
    console.error(err);
  });

