import mongoose from "mongoose";
import notebookSchema from "./notebook";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    notebook: [notebookSchema],
});

export default userSchema;
