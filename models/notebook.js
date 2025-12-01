import mongoose from "mongoose";
import noteSchema from "./note";

const notebookSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    note: [noteSchema],
    tab: {
        type: String,
    },
});

export default notebookSchema;
