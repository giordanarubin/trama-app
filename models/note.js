import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    notebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notebook',
        required: true,
    },
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
