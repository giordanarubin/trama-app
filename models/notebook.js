import mongoose from "mongoose";

const NotebookSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
      maxlength: [50, "Título muito longo"]
    },
    coverColor: {
      type: String,
      default: "#3498db",
    },
    description: {
      type: String,
      maxlength: [200, "Descrição muito longa"],
      default: ""
    }
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
