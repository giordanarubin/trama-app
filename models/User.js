import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Nome de usuário é obrigatório"],
        unique: true,
        trim: true,
        minlength: [3, "Usuário deve ter no mínimo 3 caracteres"]
    },
    email: {
        type: String,
        required: [true, "Email é obrigatório"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Email inválido"]
    },
    password: {
        type: String,
        required: [true, "Senha é obrigatória"],
        minlength: [6, "Senha deve ter no mínimo 6 caracteres"]
    },
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);
