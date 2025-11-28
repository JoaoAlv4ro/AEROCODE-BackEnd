import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { ResultadoTeste as PrismaResultadoTeste, TipoTeste as PrismaTipoTeste } from '../../generated/prisma/client';

export const aeronaveTestesRoutes = Router({ mergeParams: true });

// Lista testes da aeronave
aeronaveTestesRoutes.get('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string };
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo } });
  if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada' });

  const testes = await prisma.teste.findMany({ where: { aeronaveCodigo: codigo } });
  return res.json(testes);
});

// Cria teste para a aeronave
aeronaveTestesRoutes.post('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string };
  const aeronave = await prisma.aeronave.findUnique({ where: { codigo } });
  if (!aeronave) return res.status(404).json({ error: 'Aeronave não encontrada' });

  const { tipo, resultado } = req.body as { tipo: string; resultado: string };
  const isTipo = (v: any): v is PrismaTipoTeste => ['ELETRICO','HIDRAULICO','AERODINAMICO'].includes(v);
  const isResultado = (v: any): v is PrismaResultadoTeste => ['NAO_REALIZADO','APROVADO','REPROVADO'].includes(v);
  if (!isTipo(tipo) || !isResultado(resultado)) {
    return res.status(400).json({ error: 'Valores inválidos para tipo/resultado' });
  }
  try {
    const created = await prisma.teste.create({
      data: { tipo, resultado, aeronaveCodigo: codigo },
    });
    return res.status(201).json(created);
  } catch (e) {
    return res.status(400).json({ error: 'Falha ao criar teste' });
  }
});

// Atualiza teste específico da aeronave
aeronaveTestesRoutes.put('/:id', async (req, res) => {
  const { codigo, id } = req.params as { codigo: string; id: string };
  const testeId = Number(id);
  if (Number.isNaN(testeId)) return res.status(400).json({ error: 'ID inválido' });

  const teste = await prisma.teste.findUnique({ where: { id: testeId } });
  if (!teste || teste.aeronaveCodigo !== codigo) {
    return res.status(404).json({ error: 'Teste não encontrado para esta aeronave' });
  }

  const { tipo, resultado } = req.body as { tipo?: string; resultado?: string };
  const updates: { tipo?: PrismaTipoTeste; resultado?: PrismaResultadoTeste } = {};
  if (tipo !== undefined) {
    const isTipo = (v: any): v is PrismaTipoTeste => ['ELETRICO','HIDRAULICO','AERODINAMICO'].includes(v);
    if (!isTipo(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
    updates.tipo = tipo;
  }
  if (resultado !== undefined) {
    const isResultado = (v: any): v is PrismaResultadoTeste => ['NAO_REALIZADO','APROVADO','REPROVADO'].includes(v);
    if (!isResultado(resultado)) return res.status(400).json({ error: 'Resultado inválido' });
    updates.resultado = resultado;
  }
  const updated = await prisma.teste.update({
    where: { id: testeId },
    data: updates,
  });
  return res.json(updated);
});

// Remove teste da aeronave
aeronaveTestesRoutes.delete('/:id', async (req, res) => {
  const { codigo, id } = req.params as { codigo: string; id: string };
  const testeId = Number(id);
  if (Number.isNaN(testeId)) return res.status(400).json({ error: 'ID inválido' });

  const teste = await prisma.teste.findUnique({ where: { id: testeId } });
  if (!teste || teste.aeronaveCodigo !== codigo) {
    return res.status(404).json({ error: 'Teste não encontrado para esta aeronave' });
  }

  await prisma.teste.delete({ where: { id: testeId } });
  return res.status(204).send();
});
