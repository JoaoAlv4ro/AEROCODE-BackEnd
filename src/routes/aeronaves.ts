import { Router } from "express";
import { prisma } from "../lib/prisma";

export const aeronavesRoutes = Router();

aeronavesRoutes.get('/', async (_req, res) => {
    try {
        const data = await prisma.aeronave.findMany({
            include: {
                pecas: true,
                testes: true,
                etapas: {
                    include: {
                        funcionarios: { include: { funcionario: true } }
                    }
                }
            }
        });
        const normalized = data.map((a: any) => ({
            codigo: a.codigo,
            modelo: a.modelo,
            tipo: a.tipo,
            capacidade: a.capacidade,
            alcance: a.alcance,
            pecas: a.pecas,
            testes: a.testes,
            etapas: a.etapas.map((e: any) => ({
                id: e.id,
                nome: e.nome,
                prazo: e.prazo,
                status: e.status,
                funcionarios: e.funcionarios.map((ef: any) => ({
                    id: String(ef.funcionario.id),
                    nome: ef.funcionario.nome,
                    telefone: ef.funcionario.telefone,
                    endereco: ef.funcionario.endereco,
                    usuario: ef.funcionario.username,
                    nivelPermissao: ef.funcionario.permissao
                }))
            }))
        }));
        res.status(200).json(normalized);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

aeronavesRoutes.get('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const a = await prisma.aeronave.findUnique({
            where: { codigo },
            include: {
                pecas: true,
                testes: true,
                etapas: {
                    include: {
                        funcionarios: { include: { funcionario: true } }
                    }
                }
            }
        });
        if (!a) return res.status(404).json({ error: 'Aeronave não encontrada' });
        const normalized = {
            codigo: a.codigo,
            modelo: a.modelo,
            tipo: a.tipo,
            capacidade: a.capacidade,
            alcance: a.alcance,
            pecas: a.pecas,
            testes: a.testes,
            etapas: a.etapas.map((e: any) => ({
                id: e.id,
                nome: e.nome,
                prazo: e.prazo,
                status: e.status,
                funcionarios: e.funcionarios.map((ef: any) => ({
                    id: String(ef.funcionario.id),
                    nome: ef.funcionario.nome,
                    telefone: ef.funcionario.telefone,
                    endereco: ef.funcionario.endereco,
                    usuario: ef.funcionario.username,
                    nivelPermissao: ef.funcionario.permissao
                }))
            }))
        };
        res.status(200).json(normalized);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

aeronavesRoutes.post('/', async (req, res) => {
    try {
        const created = await prisma.aeronave.create({ data: req.body });
        const a = await prisma.aeronave.findUnique({
            where: { codigo: created.codigo },
            include: {
                pecas: true,
                testes: true,
                etapas: {
                    include: {
                        funcionarios: { include: { funcionario: true } }
                    }
                }
            }
        });
        const normalized = {
            codigo: a?.codigo,
            modelo: a?.modelo,
            tipo: a?.tipo,
            capacidade: a?.capacidade,
            alcance: a?.alcance,
            pecas: a?.pecas || [],
            testes: a?.testes || [],
            etapas: (a?.etapas || []).map((e: any) => ({
                id: e.id,
                nome: e.nome,
                prazo: e.prazo,
                status: e.status,
                funcionarios: e.funcionarios.map((ef: any) => ({
                    id: String(ef.funcionario.id),
                    nome: ef.funcionario.nome,
                    telefone: ef.funcionario.telefone,
                    endereco: ef.funcionario.endereco,
                    usuario: ef.funcionario.username,
                    nivelPermissao: ef.funcionario.permissao
                }))
            }))
        };
        res.status(201).json(normalized);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

aeronavesRoutes.put('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        await prisma.aeronave.update({ where: { codigo }, data: req.body });
        const a = await prisma.aeronave.findUnique({
            where: { codigo },
            include: {
                pecas: true,
                testes: true,
                etapas: {
                    include: {
                        funcionarios: { include: { funcionario: true } }
                    }
                }
            }
        });
        if (!a) return res.status(404).json({ error: 'Aeronave não encontrada' });
        const normalized = {
            codigo: a.codigo,
            modelo: a.modelo,
            tipo: a.tipo,
            capacidade: a.capacidade,
            alcance: a.alcance,
            pecas: a.pecas,
            testes: a.testes,
            etapas: a.etapas.map((e: any) => ({
                id: e.id,
                nome: e.nome,
                prazo: e.prazo,
                status: e.status,
                funcionarios: e.funcionarios.map((ef: any) => ({
                    id: String(ef.funcionario.id),
                    nome: ef.funcionario.nome,
                    telefone: ef.funcionario.telefone,
                    endereco: ef.funcionario.endereco,
                    usuario: ef.funcionario.username,
                    nivelPermissao: ef.funcionario.permissao
                }))
            }))
        };
        res.status(200).json(normalized);
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

