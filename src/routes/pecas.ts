import { Router } from 'express'
import { prisma } from '../lib/prisma'

export const pecasRoutes = Router()

pecasRoutes.get('/', async (_req, res) => {
    const data = await prisma.peca.findMany();
    res.status(200).json(data);
});

pecasRoutes.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const data = await prisma.peca.findUnique({ where: { codigo } });
    if (!data) return res.status(404).json({ error: 'Peça não encontrada' });
    res.status(200).json(data);
});

pecasRoutes.post('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const updated = await prisma.peca.update({
            where: { codigo },
            data: req.body
        });
        res.status(200).json(updated);
    } catch {
        res.status(404).json({ error: 'Peça não encontrada' });
    }
});

pecasRoutes.delete('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        await prisma.peca.delete({where: { codigo }});
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Peça não encontrada' });
    }
});

