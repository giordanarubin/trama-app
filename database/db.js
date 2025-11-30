import mongoose from "mongoose";

const connectToDb = (() => {
    mongoose.connect(
        "mongodb+srv://giordana:admin@trama1.mk7b1sf.mongodb.net/?appName=trama1"
    ).then(() => {
        console.log("MongoDb Atlas CONECTADO!");
    })
});

export default connectToDb;
