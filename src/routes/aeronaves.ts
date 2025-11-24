import { Router } from "express";
import { prisma } from "../lib/prisma";

export const aeronavesRoutes = Router();

aeronavesRoutes.get('/', async (_req, res) => {
    const data = await prisma.aeronave.findMany();
    res.status(200).json(data);
});

aeronavesRoutes.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const data = await prisma.aeronave.findUnique({ where: { codigo } });
    if (!data) return res.status(404).json({ error: 'Aeronave not found' });
    res.status(200).json(data);
});

aeronavesRoutes.post('/', async (req, res) => {
    try { 
        const created = await prisma.aeronave.create({ data: req.body });
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

aeronavesRoutes.put('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const updated = await prisma.aeronave.update({
            where: { codigo },
            data: req.body
        });
        res.status(200).json(updated);
    } catch {
        res.status(404).json({ error: 'Aeronave não encontrada' });
    }
});

aeronavesRoutes.delete('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        await prisma.aeronave.delete({ where: { codigo } });
        res.status(204).send();
    } catch {
        res.status(404).json({ error: 'Aeronave não encontrada' });
    }
});

