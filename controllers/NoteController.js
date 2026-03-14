import mongoose from "mongoose";
import Note from "../models/Note.js";
import Notebook from "../models/Notebook.js";

// Buscar todas as notas de um caderno
const getNotesByNotebook = async (req, res) => {
    try {
        const { notebookId } = req.params;
        const { userId } = req.query;

        if (!notebookId || !userId) {
            return res.status(400).json({
                success: false,
                message: "notebookId e userId são obrigatórios"
            });
        }

        // Verifica se o usuário tem acesso a este caderno
        const notebook = await Notebook.findOne({ 
            _id: notebookId, 
            userId: userId 
        });

        if (!notebook) {
            return res.status(403).json({
                success: false,
                message: "Acesso negado a este caderno"
            });
        }

        const notes = await Note.find({ 
            notebookId: notebookId,
            userId: userId 
        }).sort({ isFavorite: -1, updatedAt: -1 });

        return res.status(200).json({
            success: true,
            notes: notes
        });

    } catch (error) {
        console.error("Erro ao buscar notas:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar notas"
        });
    }
};

// Criar nova nota
const createNote = async (req, res) => {
    try {
        const { notebookId, userId, title, content, color, tags } = req.body;

        if (!notebookId || !userId || !title) {
            return res.status(400).json({
                success: false,
                message: "notebookId, userId e título são obrigatórios"
            });
        }

        // Verifica acesso ao caderno
        const notebook = await Notebook.findOne({ 
            _id: notebookId, 
            userId: userId 
        });

        if (!notebook) {
            return res.status(403).json({
                success: false,
                message: "Você não tem permissão para criar notas neste caderno"
            });
        }

        const newNote = await Note.create({
            notebookId: new mongoose.Types.ObjectId(notebookId),
            userId: new mongoose.Types.ObjectId(userId),
            title: title,
            content: content || "",
            color: color || "#FFFFFF",
            tags: tags || []
        });

        return res.status(201).json({
            success: true,
            note: newNote,
            message: "Nota criada com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao criar nota:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar nota"
        });
    }
};

// Atualizar nota
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, title, content, color, isFavorite, tags } = req.body;

        // Verifica se a nota existe e pertence ao usuário
        const note = await Note.findOne({ 
            _id: id,
            userId: userId 
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Nota não encontrada"
            });
        }

        // Atualiza apenas os campos fornecidos
        if (title) note.title = title;
        if (content !== undefined) note.content = content;
        if (color) note.color = color;
        if (isFavorite !== undefined) note.isFavorite = isFavorite;
        if (tags) note.tags = tags;

        await note.save();

        return res.status(200).json({
            success: true,
            note: note,
            message: "Nota atualizada com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao atualizar nota:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar nota"
        });
    }
};

// Deletar nota
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const note = await Note.findOneAndDelete({ 
            _id: id,
            userId: userId 
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Nota não encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Nota deletada com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao deletar nota:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao deletar nota"
        });
    }
};

// Buscar notas por termo (text search)
const searchNotes = async (req, res) => {
    try {
        const { userId, query } = req.query;

        if (!userId || !query) {
            return res.status(400).json({
                success: false,
                message: "userId e query são obrigatórios"
            });
        }

        const notes = await Note.find({
            userId: userId,
            $text: { $search: query }
        }).sort({ score: { $meta: "textScore" } });

        return res.status(200).json({
            success: true,
            notes: notes
        });

    } catch (error) {
        console.error("Erro na busca:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar notas"
        });
    }
};

// Buscar notas favoritas
const getFavoriteNotes = async (req, res) => {
    try {
        const { userId } = req.query;

        const notes = await Note.find({ 
            userId: userId,
            isFavorite: true 
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            notes: notes
        });

    } catch (error) {
        console.error("Erro ao buscar favoritas:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar notas favoritas"
        });
    }
};

export default {
    getNotesByNotebook,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getFavoriteNotes
};
