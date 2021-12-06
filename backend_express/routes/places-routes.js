const express = require('express');
const HttpError = require('../models/http-error');
const router = express.Router();

const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u2'
    },
    {
      id: 'p2',
      title: 'Emp. State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      address: '20 W 34th St, New York, NY 10001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584
      },
      creator: 'u2'
    }
  ];
router.get('/',(req,res,next)=>{
    console.log("get res");
    res.json({message:"hello works"});
});
router.get('/:pid',(req,res,next)=>{
    console.log("get res");
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p=>{
        return p.id === placeId;
    });
    if(!place){
      const error = new HttpError("Could not find place",404);
      // error.code = 404;
     return next(error);
   
    }
    res.json({place});
});
router.get('/user/:uid',(req,res,next)=>{
    console.log("get res");
    const placeId = req.params.uid;
    const places = DUMMY_PLACES.find(u=>{
        return u.creator === placeId;
    });
    if(!places){
      const error = new HttpError("Could not find place",404);
      // error.code = 404;
     return next(error);
      }
    res.json({places});
});
module.exports = router;