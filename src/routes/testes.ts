import { Router } from "express";
import { prisma } from "../lib/prisma";

export const testesRoutes = Router();
const isIdNumber = (v: string) => Number.isInteger(Number(v)) && !Number.isNaN(Number(v))

testesRoutes.get('/', async (_req, res) => {
    const data = await prisma.teste.findMany();
    res.status(200).json(data);
});

testesRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const data = await prisma.teste.findUnique({ where: { id: Number(id) } });
    if (!data) return res.status(404).json({ error: 'Teste não encontrado' });
    res.status(200).json(data);
});

// CRUD global de testes desativado. Use /aeronaves/:codigo/testes
testesRoutes.post('/', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de testes', use: '/aeronaves/:codigo/testes' });
});

testesRoutes.put('/:id', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de testes', use: '/aeronaves/:codigo/testes' });
});

testesRoutes.delete('/:id', async (_req, res) => {
    res.status(405).json({ error: 'Deprecated: use rotas aninhadas para CRUD de testes', use: '/aeronaves/:codigo/testes' });
});