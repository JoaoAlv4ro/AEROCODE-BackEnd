import express from "express";
import cors from "cors";
import { aeronavesRoutes } from "./routes/aeronaves";
import { funcionariosRoutes } from "./routes/funcionarios";
import { etapasRoutes } from "./routes/etapas";
import { pecasRoutes } from "./routes/pecas";
import { testesRoutes } from "./routes/testes";
import { etapasFuncionariosRoutes } from "./routes/etapasFuncionarios";

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

app.use('/aeronaves', aeronavesRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/etapas', etapasRoutes);
app.use('/pecas', pecasRoutes);
app.use('/testes', testesRoutes);
app.use('/etapasFuncionarios', etapasFuncionariosRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});