const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const url = `mongodb+srv://satendrayadav:Satendra123@cluster0.2ilbire.mongodb.net/urlpt`;
    try {
        const connect = await mongoose.connect(url);
        console.log(`MongoDb connected at host ${connect.connection.host}`);
    } catch (error) {
        console.log(`error ${error.message}`);
    }
}

module.exports = connectDB;

