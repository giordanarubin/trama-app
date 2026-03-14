import { Router } from "express";
import UserController from "../controllers/UserController.js";
import NotebookController from "../controllers/NotebookController.js";
import NoteController from "../controllers/NoteController.js";

const routes = Router();

//middleware de debug
routes.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    next();
});

//rotas de usuário
routes.post("/register", UserController.createUser);
routes.post("/login", UserController.findUser);

//rotas de notebooks
routes.get("/notebooks", NotebookController.getNotebooksByUser);
routes.post("/notebooks", NotebookController.createNotebook);
routes.delete("/notebooks/:id", NotebookController.deleteNotebook);

//rotas de notes
routes.get("/notebooks/:notebookId/notes", NoteController.getNotesByNotebook);
routes.post("/notes", NoteController.createNote);
routes.put("/notes/:id", NoteController.updateNote);
routes.delete("/notes/:id", NoteController.deleteNote);
routes.get("/notes/search", NoteController.searchNotes);
routes.get("/notes/favorites", NoteController.getFavoriteNotes);

export default routes;
