const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/test/"

const connectToMongo = async () =>{
    try{
        mongoose.connect(mongoURI)
        console.log("Connected to Mongo Successfully");
    } catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;