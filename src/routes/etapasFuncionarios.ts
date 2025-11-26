import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { escape } from 'querystring'

export const etapasFuncionariosRoutes = Router()
const isIdNumber = (v: string) => Number.isInteger(Number(v)) && !Number.isNaN(Number(v))

etapasFuncionariosRoutes.get('/', async (_req, res) => {
    const data = await prisma.etapaFuncionario.findMany();
    res.status(200).json(data);
});

etapasFuncionariosRoutes.post('/', async (req, res) => {
    const { etapaId, funcionarioId } = req.body;
    if (typeof etapaId !== 'number' || typeof funcionarioId !== 'number') {
        return res.status(400).json({ error: 'etapaId e funcionarioId são obrigatórios (number)' })
    }
    try {
        const created = await prisma.etapaFuncionario.create({ data: { etapaId, funcionarioId } });
        res.status(201).json(created);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
})

etapasFuncionariosRoutes.delete('/:etapaId/:funcionarioId', async (req, res) => {
    const { etapaId, funcionarioId } = req.params;
    if (!isIdNumber(etapaId) || !isIdNumber(funcionarioId)) {
        return res.status(400).json({ error: 'IDs inválidos' });
    }
    try {
        await prisma.etapaFuncionario.delete({
            where: {
                etapaId_funcionarioId: {
                    etapaId: Number(etapaId),
                    funcionarioId: Number(funcionarioId)
                }
            } as any
        });
        res.status(204).end();
    } catch {
        res.status(404).json({ error: 'Relação não encontrada' });
    }
});