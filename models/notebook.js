import mongoose from "mongoose";
import noteSchema from "./note";

const NotebookSchema = new mongoose.Schema({
    ownerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ownerUser',
        required: true,
    },
    title: {
        type: String,
    },
    //notes: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Notebook',
    //}],
    //tab: {
    //    type: String,
    //},
}, {
    timestamps: true
});

export default mongoose.model('Notebook', NotebookSchema);
