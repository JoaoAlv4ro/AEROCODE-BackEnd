import { Router } from "express";
import { prisma } from "../lib/prisma";

export const etapasRoutes = Router();
const isIdNumber = (id: string) => !isNaN(Number(id));

etapasRoutes.get('/', async (_req, res) => {
    const data = await prisma.etapa.findMany();
    res.status(200).json(data);
});

etapasRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const data = await prisma.etapa.findUnique({ where: { id: Number(id) } });
    if (!data) return res.status(404).json({ error: 'Etapa não encontrada' });
    res.status(200).json(data);
});

// CRUD global de etapas desativado. Use /aeronaves/:codigo/etapas
etapasRoutes.post('/', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de etapas', use: '/aeronaves/:codigo/etapas' });
});

etapasRoutes.put('/:id', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de etapas', use: '/aeronaves/:codigo/etapas' });
});

etapasRoutes.delete('/:id', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de etapas', use: '/aeronaves/:codigo/etapas' });
});