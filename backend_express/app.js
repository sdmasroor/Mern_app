
const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const app = express();

app.use("/api/places",placesRoutes);
app.use("/api/users",usersRoutes);


// app.use(bodyParser.urlencoded({ extended: false }));
// app.post('/post',(req, res,next) => {
//     res.send(req.body.username);
// });
// app.get('/',(req,res,next)=>{
//     res.send('<form action="/post" method="POST"><input type="text" name="username"><button type="submit"></button></form>');
// });

app.listen(5000);