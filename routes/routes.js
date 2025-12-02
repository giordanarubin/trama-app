import { Router } from "express";
import UserController from "../controllers/UserController.js";

const routes = Router();

//middleware de debug
routes.use((req, res, next) => {
    console.log('Body recebido:', req.body);
    console.log('Headers:', req.headers['content-type']);
    next();
});

routes.get("/", (req, res) => {
    res.render("index.ejs");
});

routes.post("/register", UserController.createUser);
routes.post("/login", UserController.findUser);

export default routes;
