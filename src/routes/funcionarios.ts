import { Router } from "express";
import { prisma } from "../lib/prisma";

export const funcionariosRoutes = Router();
const isIdNumber = (id: string) => !isNaN(Number(id));

funcionariosRoutes.get('/', async (_req, res) => {
    const data = await prisma.funcionario.findMany({ omit: { password: true } });
    res.status(200).json(data);
});

funcionariosRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const data = await prisma.funcionario.findUnique({ where: { id: Number(id) }, omit: { password: true } });
    if (!data) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.status(200).json(data);
});

funcionariosRoutes.post('/', async (req, res) => {
    try {
        const created = await prisma.funcionario.create({ data: req.body });
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

funcionariosRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const updated = await prisma.funcionario.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.status(200).json(updated);
    } catch {
        res.status(404).json({ error: 'Funcionário não encontrado' });
    }
});

funcionariosRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isIdNumber(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        await prisma.funcionario.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Funcionário não encontrado' });
    }
});
