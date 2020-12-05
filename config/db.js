const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURl");

const connectDB = async() =>{
    try {
        mongoose.connect(db,{
            useUnifiedTopology: true ,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify:false
        });
        console.log("MongoDB connected...")       
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;