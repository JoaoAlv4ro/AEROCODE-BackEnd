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

testesRoutes.post('/', async (req, res) => {
    try {
        const created = await prisma.teste.create({ data: req.body });
        res.status(201).json(created);
    }
    catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

testesRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const updated = await prisma.teste.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.status(200).json(updated);
    } catch {
        res.status(404).json({ error: 'Teste não encontrado' });
    }
});

testesRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        await prisma.teste.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Teste não encontrado' });
    }
});