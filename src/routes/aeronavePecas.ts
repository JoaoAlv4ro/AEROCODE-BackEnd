import { Router } from 'express'
import { prisma } from '../lib/prisma'

// Rotas de Peças aninhadas sob Aeronave
export const aeronavePecasRoutes = Router({ mergeParams: true })

// Listar peças da aeronave
aeronavePecasRoutes.get('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string }
  const data = await prisma.peca.findMany({ where: { aeronaveCodigo: codigo } })
  res.status(200).json(data)
})

// Criar peça para a aeronave
aeronavePecasRoutes.post('/', async (req, res) => {
  const { codigo } = req.params as { codigo: string }
  try {
    const created = await prisma.peca.create({
      data: { ...req.body, aeronaveCodigo: codigo },
    })
    res.status(201).json(created)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// Atualizar peça (garante que pertence à aeronave)
aeronavePecasRoutes.put('/:pecaCodigo', async (req, res) => {
  const { codigo, pecaCodigo } = req.params as { codigo: string; pecaCodigo: string }
  try {
    const found = await prisma.peca.findUnique({ where: { codigo: pecaCodigo } })
    if (!found || found.aeronaveCodigo !== codigo) {
      return res.status(404).json({ error: 'Peça não encontrada para esta aeronave' })
    }
    const updated = await prisma.peca.update({ where: { codigo: pecaCodigo }, data: req.body })
    res.status(200).json(updated)
  } catch {
    res.status(404).json({ error: 'Peça não encontrada' })
  }
})

// Excluir peça (garante que pertence à aeronave)
aeronavePecasRoutes.delete('/:pecaCodigo', async (req, res) => {
  const { codigo, pecaCodigo } = req.params as { codigo: string; pecaCodigo: string }
  try {
    const found = await prisma.peca.findUnique({ where: { codigo: pecaCodigo } })
    if (!found || found.aeronaveCodigo !== codigo) {
      return res.status(404).json({ error: 'Peça não encontrada para esta aeronave' })
    }
    await prisma.peca.delete({ where: { codigo: pecaCodigo } })
    res.status(204).end()
  } catch {
    res.status(404).json({ error: 'Peça não encontrada' })
  }
})
