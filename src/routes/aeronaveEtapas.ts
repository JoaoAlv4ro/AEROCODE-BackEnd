import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { StatusEtapa as PrismaStatusEtapa } from '../../generated/prisma/client';

export const aeronaveEtapasRoutes = Router({ mergeParams: true });

const isStatusEtapa = (v: any): v is PrismaStatusEtapa => ['PENDENTE','ANDAMENTO','CONCLUIDA'].includes(v);

// Lista etapas da aeronave com relações básicas
aeronaveEtapasRoutes.get('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string };
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo } });
  if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada' });
  const etapas = await prisma.etapa.findMany({
    where: { aeronaveCodigo: codigo },
    include: { funcionarios: { include: { funcionario: true } } },
  });
  return res.json(etapas);
});

// Cria etapa para a aeronave
aeronaveEtapasRoutes.post('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string };
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo } });
  if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada' });

  const { nome, prazo, status } = req.body as { nome: string; prazo?: string | Date; status?: PrismaStatusEtapa };
  if (!nome?.trim()) return res.status(400).json({ error: 'Nome é obrigatório' });
  let statusValue: PrismaStatusEtapa = 'PENDENTE';
  if (status) {
    if (!isStatusEtapa(status)) return res.status(400).json({ error: 'Status inválido' });
    statusValue = status;
  }
  const prazoDate = prazo ? new Date(prazo) : undefined;
  try {
    const created = await prisma.etapa.create({
      data: { nome: nome.trim(), prazo: prazoDate as any, status: statusValue, aeronaveCodigo: codigo },
    });
    return res.status(201).json(created);
  } catch (e) {
    return res.status(400).json({ error: 'Falha ao criar etapa' });
  }
});

// Atualiza etapa da aeronave
aeronaveEtapasRoutes.put('/:id', async (req, res) => {
  const { codigo, id } = req.params as { codigo: string; id: string };
  const etapaId = Number(id);
  if (Number.isNaN(etapaId)) return res.status(400).json({ error: 'ID inválido' });
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } });
  if (!etapa || etapa.aeronaveCodigo !== codigo) return res.status(404).json({ error: 'Etapa não encontrada nesta aeronave' });

  const { nome, prazo, status } = req.body as { nome?: string; prazo?: string | Date; status?: PrismaStatusEtapa };
  const data: any = {};
  if (nome !== undefined) data.nome = String(nome).trim();
  if (prazo !== undefined) data.prazo = prazo ? new Date(prazo) : null;
  if (status !== undefined) {
    if (!isStatusEtapa(status)) return res.status(400).json({ error: 'Status inválido' });
    data.status = status;
  }
  const updated = await prisma.etapa.update({ where: { id: etapaId }, data });
  return res.json(updated);
});

// Exclui etapa da aeronave
aeronaveEtapasRoutes.delete('/:id', async (req, res) => {
  const { codigo, id } = req.params as { codigo: string; id: string };
  const etapaId = Number(id);
  if (Number.isNaN(etapaId)) return res.status(400).json({ error: 'ID inválido' });
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } });
  if (!etapa || etapa.aeronaveCodigo !== codigo) return res.status(404).json({ error: 'Etapa não encontrada nesta aeronave' });
  await prisma.etapa.delete({ where: { id: etapaId } });
  return res.status(204).send();
});

// Associa funcionario à etapa
aeronaveEtapasRoutes.post('/:id/funcionarios', async (req, res) => {
  const { codigo, id } = req.params as { codigo: string; id: string };
  const etapaId = Number(id);
  const { funcionarioId } = req.body as { funcionarioId: number };
  if (Number.isNaN(etapaId) || typeof funcionarioId !== 'number') return res.status(400).json({ error: 'IDs inválidos' });
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } });
  if (!etapa || etapa.aeronaveCodigo !== codigo) return res.status(404).json({ error: 'Etapa não encontrada nesta aeronave' });
  try {
    const link = await prisma.etapaFuncionario.create({ data: { etapaId, funcionarioId } });
    return res.status(201).json(link);
  } catch (e) {
    return res.status(400).json({ error: 'Falha ao associar funcionário' });
  }
});

// Remove associação
aeronaveEtapasRoutes.delete('/:id/funcionarios/:funcionarioId', async (req, res) => {
  const { codigo, id, funcionarioId } = req.params as { codigo: string; id: string; funcionarioId: string };
  const etapaId = Number(id);
  const funcId = Number(funcionarioId);
  if (Number.isNaN(etapaId) || Number.isNaN(funcId)) return res.status(400).json({ error: 'IDs inválidos' });
  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } });
  if (!etapa || etapa.aeronaveCodigo !== codigo) return res.status(404).json({ error: 'Etapa não encontrada nesta aeronave' });
  await prisma.etapaFuncionario.delete({ where: { etapaId_funcionarioId: { etapaId, funcionarioId: funcId } } as any });
  return res.status(204).send();
});
