import express from "express";
import connectToDb from "./database/db.js";
import routes from "./routes/routes.js";

const app = express();
const port = 3001;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`);
});
