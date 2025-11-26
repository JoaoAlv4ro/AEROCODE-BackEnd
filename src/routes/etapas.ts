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

etapasRoutes.post('/', async (req, res) => {
    try {
        const created = await prisma.etapa.create({ data: req.body });
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

etapasRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const updated = await prisma.etapa.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.status(200).json(updated);
    } catch {
        res.status(404).json({ error: 'Etapa não encontrada' });
    }
});

etapasRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        await prisma.etapa.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Etapa não encontrada' });
    }
});