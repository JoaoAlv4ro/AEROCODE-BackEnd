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

// use rotas aninhadas /aeronaves/:codigo/pecas
pecasRoutes.post('/:codigo', async (req, res) => {
    res.status(405).json({
        error: 'Deprecated: use rotas aninhadas para CRUD de peças',
        use: '/aeronaves/:codigo/pecas'
    });
});

pecasRoutes.delete('/:codigo', async (_req, res) => {
    res.status(405).json({
        error: 'Deprecated: use rotas aninhadas para CRUD de peças',
        use: '/aeronaves/:codigo/pecas'
    });
});

