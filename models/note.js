import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    notebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notebook",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Título é obrigatório"],
        trim: true,
        maxlength: [100, "Título muito longo"]
    },
    content: {
        type: String,
        default: "",
        maxlength: [50000, "Conteúdo muito longo (máx 50000 caracteres)"]
    },
    color: {
        type: String,
        default: "#FFFFFF"
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true // cria createdAt e updatedAt automaticamente
});

// Índices para busca eficiente
NoteSchema.index({ notebookId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, isFavorite: -1 });
NoteSchema.index({ title: 'text', content: 'text' }); // Para busca por texto

export default mongoose.model('Note', NoteSchema);
