-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `sobrenome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `dataNascimento` VARCHAR(191) NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Prefiro_nao_informar', 'Nao_binario') NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidoIngresso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `ingressoId` INTEGER NOT NULL,
    `dataPedido` DATETIME(3) NOT NULL,
    `codigoPedido` VARCHAR(191) NOT NULL,
    `statusPedido` VARCHAR(191) NOT NULL,
    `tipoPedido` ENUM('Trilha', 'Cachoeira', 'Hospedagem') NULL,
    `quantidadePedido` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingresso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoIngresso` ENUM('Trilha', 'Cachoeira', 'Hospedagem') NULL,
    `precoIngresso` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidoIngresso` ADD CONSTRAINT `pedidoIngresso_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidoIngresso` ADD CONSTRAINT `pedidoIngresso_ingressoId_fkey` FOREIGN KEY (`ingressoId`) REFERENCES `Ingresso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
