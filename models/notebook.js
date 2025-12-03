import mongoose from "mongoose";

const NotebookSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverColor: {
      type: String,
      default: "#3498db",
    },
    //coverPattern: {
    //  type: String,
    //  enum: ["solid", "stripes", "dots", "grid"],
    //  default: "solid",
    //},
    //notes: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Notebook',
    //}],
    //tab: {
    //    type: String,
    //},
  }, {
    timestamps: true,
  }
);

export default mongoose.model('Notebook', NotebookSchema);
