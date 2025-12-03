import mongoose from "mongoose";
import bcrypt from "bcryptjs";
//import notebookSchema from "./notebook";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    //notebooks: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Notebook',
    //}],
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);
