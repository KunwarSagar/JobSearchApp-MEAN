require("dotenv").config();
require("./api/data/dbconnect");

const { json } = require("express");
const express = require("express");
const app = express();

const router = require("./api/routes");

app.use('/api', function(req, res, next){
    res.header("Access-Control-Allow-Origin", process.env.CORS_ALLOWED_ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
})
app.use(json());
app.use(express.urlencoded({extended:true}));

app.use('/api', router);

const server = app.listen(process.env.PORT, function(){
    console.log("listening to http://localhost:"+server.address().port);
})