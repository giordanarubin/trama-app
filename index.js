import express from "express";
import connectToDb from "./database/db.js";

const app = express();
const port = 3001;

connectToDb();

app.use(express.json());

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`);
});
