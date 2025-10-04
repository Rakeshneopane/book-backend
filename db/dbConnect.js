const mongoose = require("mongoose");

require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initialiseDatabase = async() =>{
await mongoose.connect(mongoUri).then(()=>{
        console.log("Connection established to Database.");
    }).catch((error)=>{
        console.log("There was an error while connecting to database", error);
        
    })
};

module.exports = { initialiseDatabase };