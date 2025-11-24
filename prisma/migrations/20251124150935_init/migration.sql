-- CreateTable
CREATE TABLE `Aeronave` (
    `codigo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('COMERCIAL', 'MILITAR') NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `alcance` INTEGER NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `permissao` ENUM('ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etapa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `prazo` DATETIME(3) NOT NULL,
    `status` ENUM('PENDENTE', 'ANDAMENTO', 'CONCLUIDA') NOT NULL,
    `aeronaveCodigo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtapaFuncionario` (
    `etapaId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`etapaId`, `funcionarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peca` (
    `codigo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('IMPORTADA', 'NACIONAL') NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `status` ENUM('EM_PRODUCAO', 'EM_TRANSPORTE', 'PRONTA') NOT NULL,
    `aeronaveCodigo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teste` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ELETRICO', 'HIDRAULICO', 'AERODINAMICO') NOT NULL,
    `resultado` ENUM('NAO_REALIZADO', 'APROVADO', 'REPROVADO') NOT NULL,
    `aeronaveCodigo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Etapa` ADD CONSTRAINT `Etapa_aeronaveCodigo_fkey` FOREIGN KEY (`aeronaveCodigo`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFuncionario` ADD CONSTRAINT `EtapaFuncionario_etapaId_fkey` FOREIGN KEY (`etapaId`) REFERENCES `Etapa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFuncionario` ADD CONSTRAINT `EtapaFuncionario_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_aeronaveCodigo_fkey` FOREIGN KEY (`aeronaveCodigo`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teste` ADD CONSTRAINT `Teste_aeronaveCodigo_fkey` FOREIGN KEY (`aeronaveCodigo`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
