import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    date: {
        type: Date,
    },
});

export default noteSchema;
