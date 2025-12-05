import mongoose from "mongoose";
import Notebook from "../models/Notebook.js";

const getNotebooksByUser = async (req, res) => {
  try {
    console.log("=== DEBUG NOTEBOOKS ===");
    console.log("1. req.query recebido:", req.query);
    console.log("2. req.query.userId:", req.query.userId);

    const userId = req.query.userId;

    if (!userId) {
      console.log("ERRO: userId é undefined ou vazio");
      return res.status(400).json({
        success: false,
        message: "UserId é obrigatório. Use: /api/notebooks?userId=SEU_ID",
      });
    }

    console.log("Buscando no banco com userId:", userId);
    const notebooks = await Notebook.find({
      userId: new mongoose.Types.ObjectId(userId)
    });

    console.log("Resultado da busca:", notebooks);
    console.log("Número de cadernos encontrados:", notebooks.length);

    return res.status(200).json({
      success: true,
      notebooks: notebooks,
    });
  } catch (error) {
    console.error("ERRO na busca:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cadernos"
    });
  }
};

const createNotebook = async (req, res) => {
  try {
    const { title, userId, coverColor } = req.body;

    console.log("=== DEBUG CREATE NOTEBOOK ===");
    console.log("Body recebido:", req.body);

    if (!title || !userId) {
      return res.status(400).json({
        success: false,
        message: "Título e userId são obrigatórios",
      });
    }

    const newNotebook = await Notebook.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: title,
      coverColor: coverColor,
    });

    console.log("Caderno criado:", newNotebook);

    return res.status(201).json({
      success: true,
      notebook: newNotebook,
      message: "Caderno criado!",
    });
  } catch (error) {
    console.error("Erro ao criar caderno:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar caderno"
    });
  }
};

export default {
  createNotebook,
  getNotebooksByUser,
};
