import { PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Limpeza das tabelas
    await prisma.etapaFuncionario.deleteMany();
    await prisma.etapa.deleteMany();
    await prisma.funcionario.deleteMany();
    await prisma.teste.deleteMany();
    await prisma.peca.deleteMany();
    await prisma.aeronave.deleteMany();

    // Inserção de dados iniciais
    const aeronaves = []
    aeronaves.push(await prisma.aeronave.create({
        data: {
            codigo: 'A320',
            modelo: 'Airbus A320',
            tipo: 'COMERCIAL',
            capacidade: 180,
            alcance: 6500,
        },
    }));
    aeronaves.push(await prisma.aeronave.create({
        data: {
            codigo: "F-39E",
            modelo: "Caça Gripen E",
            tipo: "MILITAR",
            capacidade: 1,
            alcance: 4000,
        },
    }));

    const funcionarios = []; 
    funcionarios.push(await prisma.funcionario.create({
        data: {
            nome: 'Vivian Maria',
            telefone: '1234567890',
            endereco: 'Rua pequena, 123',
            username: 'viv1an',
            password: 'senha123',
            permissao: 'OPERADOR',
        },
    }));
    funcionarios.push(await prisma.funcionario.create({
        data: {
            nome: 'Rodolfo Rodrigues',
            telefone: '1234567891',
            endereco: 'Rua dos Bobos, 0',
            username: 'Rodolf0',
            password: 'senha123',
            permissao: 'ENGENHEIRO',
        },
    }));
    funcionarios.push(await prisma.funcionario.create({
        data: {
            nome: 'João Álvaro',
            telefone: '1234567892',
            endereco: 'Rua dos Bobos, 0',
            username: 'Alv4ro',
            password: 'senha123',
            permissao: 'ADMINISTRADOR',
        },
    }));

    // Etapas (relacionadas à Aeronave via aeronaveCodigo) 
    /* Etapas A320 */
    const etapas = []
    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Montagem Inicial', 
            prazo: new Date(Date.now() + 7*86400000), 
            status: 'ANDAMENTO', 
            aeronaveCodigo: 'A320' 
        }
    }));
    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Pintura', 
            prazo: new Date(Date.now() + 14*86400000), 
            status: 'PENDENTE', 
            aeronaveCodigo: 'A320' 
        }
    }));
    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Alocamento de Motor', 
            prazo: new Date(Date.now() + 21*86400000), 
            status: 'PENDENTE', 
            aeronaveCodigo: 'A320' 
        }
    }));

    /* Etapas F-39E */
    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Montagem Inicial', 
            prazo: new Date(Date.now() + 10*86400000),
            status: 'ANDAMENTO', 
            aeronaveCodigo: 'F-39E' 
        }
    }));

    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Revisão de Sistemas',
            prazo: new Date(Date.now() + 20*86400000), 
            status: 'PENDENTE', 
            aeronaveCodigo: 'F-39E' 
        }
    }));

    etapas.push(await prisma.etapa.create({
        data: { 
            nome: 'Alocamento de Armamento',
            prazo: new Date(Date.now() + 20*86400000), 
            status: 'PENDENTE', 
            aeronaveCodigo: 'F-39E' 
        }
    }));

    // Associação de Funcionários às Etapas (relacionamento N:N)
    await prisma.etapaFuncionario.createMany({
        data: [
            { etapaId: etapas[0].id, funcionarioId: funcionarios[0].id },
            { etapaId: etapas[0].id, funcionarioId: funcionarios[1].id },
            { etapaId: etapas[1].id, funcionarioId: funcionarios[1].id },
            { etapaId: etapas[3].id, funcionarioId: funcionarios[0].id },
            { etapaId: etapas[3].id, funcionarioId: funcionarios[2].id },
        ],
    });

    // Peças (relacionadas à Aeronave via aeronaveCodigo)
    /* Peças A320 */
    await prisma.peca.createMany({
        data: [
            { codigo: 'A320-001', nome: 'Asa Esquerda', tipo: 'NACIONAL', fornecedor: 'Fornecedor A', status: 'EM_TRANSPORTE', aeronaveCodigo: 'A320' },
            { codigo: 'A320-002', nome: 'Motor', tipo: 'IMPORTADA', fornecedor: 'Fornecedor B', status: 'PRONTA', aeronaveCodigo: 'A320' },
            { codigo: 'A320-003', nome: 'Trem de Pouso', tipo: 'NACIONAL', fornecedor: 'Fornecedor C', status: 'EM_PRODUCAO', aeronaveCodigo: 'A320' },
        ],
    });

    /*Peças F-39E */
    await prisma.peca.createMany({
        data: [
            { codigo: 'F39E-001', nome: 'Asa Direita', tipo: 'NACIONAL', fornecedor: 'Fornecedor A', status: 'PRONTA', aeronaveCodigo: 'F-39E' },
            { codigo: 'F39E-002', nome: 'Sistema de Navegação', tipo: 'IMPORTADA', fornecedor: 'Fornecedor F', status: 'EM_TRANSPORTE', aeronaveCodigo: 'F-39E' },
            { codigo: 'F39E-003', nome: 'Turbina', tipo: 'NACIONAL', fornecedor: 'Fornecedor G', status: 'EM_PRODUCAO', aeronaveCodigo: 'F-39E' },
        ],
    });


    // Teste (relacionados à Aeronave via aeronaveCodigo)
    /* Testes A320 */
    await prisma.teste.createMany({
        data: [
            { tipo: 'AERODINAMICO', resultado: 'NAO_REALIZADO', aeronaveCodigo: 'A320' },
            { tipo: 'HIDRAULICO', resultado: 'APROVADO', aeronaveCodigo: 'A320' },
            { tipo: 'ELETRICO', resultado: 'REPROVADO', aeronaveCodigo: 'A320' },
        ],
    });

    /* Testes F-39E */
    await prisma.teste.createMany({
        data: [
            { tipo: 'AERODINAMICO', resultado: 'NAO_REALIZADO', aeronaveCodigo: 'F-39E' },
            { tipo: 'HIDRAULICO', resultado: 'APROVADO', aeronaveCodigo: 'F-39E' },
            { tipo: 'ELETRICO', resultado: 'REPROVADO', aeronaveCodigo: 'F-39E' },
        ],
    });

    console.log('Seeding do banco de dados concluído!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });