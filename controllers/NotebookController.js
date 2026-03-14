import mongoose from "mongoose";
import Notebook from "../models/Notebook.js";

const getNotebooksByUser = async (req, res) => {
  try {
    /* console.log("=== DEBUG NOTEBOOKS ===");
    console.log("1. req.query recebido:", req.query);
    console.log("2. req.query.userId:", req.query.userId); */

    const userId = req.query.userId;

    if (!userId) {
      console.log("ERRO: userId é undefined ou vazio");
      return res.status(400).json({
        success: false,
        message: "UserId é obrigatório. Use: /api/notebooks?userId=SEU_ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "UserId inválido"
      });
    }

    console.log("Buscando no banco com userId:", userId);
    const notebooks = await Notebook.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });

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
    const { title, userId, coverColor, description } = req.body;

    console.log("=== DEBUG CREATE NOTEBOOK ===");
    console.log("Body recebido:", req.body);

    if (!title || !userId) {
      return res.status(400).json({
        success: false,
        message: "Título e userId são obrigatórios",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "UserId inválido"
      });
    }

    const newNotebook = await Notebook.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: title,
      coverColor: coverColor,
      description: description
    });

    console.log("Caderno criado:", newNotebook);

    return res.status(201).json({
      success: true,
      notebook: newNotebook,
      message: "Caderno criado com sucesso!",
    });

  } catch (error) {
    console.error("Erro ao criar caderno:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar caderno"
    });
  }
};

const deleteNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const notebook = await Notebook.findById(id);
        
    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Caderno não encontrado"
      });
    }

    if (notebook.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Não autorizado"
      });
    }

    await Notebook.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Caderno excluído com sucesso"
    });

    } catch (error) {
      console.error("Erro ao deletar caderno:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao deletar caderno"
      });
    }
};

export default {
  createNotebook,
  getNotebooksByUser,
  deleteNotebook
};
