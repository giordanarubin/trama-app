import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectToDb from "./database/db.js";
import routes from "./routes/routes.js";
import cors from "cors"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//carrega arquivos estáticos primeiro
app.use(express.static(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'views')));

// ROTAS para as PÁGINAS HTML (antes das rotas da API)
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'dashboard.html'));
});

//rotas da API depois
app.use('/api', routes);

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`);
});
