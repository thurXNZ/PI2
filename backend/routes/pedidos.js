const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: "minimal" });

const { exceptionHandler } = require('../utils/handlers');
const { authenticateToken } = require('../utils/auth');

const pedidos = {};

router.get('/:IDUsuario', async (req, res) => {
  try {

    const IDUsuario = Number(req.params.IDUsuario);
    console.log('ID do usuário:', IDUsuario);
    
    const pedidosUsuario = await prisma.pedido.findMany({
      where: {
        cliente: {
          id: IDUsuario
        }
      },
      include: {
        ingresso: true,
      },
    });

    console.log('Pedidos encontrados:', pedidosUsuario);

    res.json(pedidosUsuario);
    
  } catch (exception) {
    console.error('Erro ao buscar pedidos:', exception);
    exceptionHandler(exception, res);
  }
});

router.get('/', async (req, res) => {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          cliente: true,
          ingresso: true,
        },
      });
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


router.post('/', async (req, res) => {
  const { ingressoId, quantidade, IDUsuario, codigoPedido, valorTotal } = req.body;

  console.log('IDUsuario recebido:', IDUsuario);
  console.log('ID do ingresso:', ingressoId);
  console.log('Quantidade:', quantidade);
  console.log('Código do pedido:', codigoPedido);
  console.log('Valor total:', valorTotal);

  try {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id: parseInt(ingressoId) }
    });

    if (!ingresso) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }

    const pedido = await prisma.pedido.create({
      data: {
        cliente: { connect: { id: parseInt(IDUsuario) } },
        ingresso: { connect: { id: parseInt(ingressoId) } }, 
        quantidade: quantidade,
        valorTotal: valorTotal,
        codigoPedido: codigoPedido
      }
    });

    res.status(201).json(pedido);
  } catch (exception) {
             exceptionHandler(exception, res);
       }
});


router.all('*', (req, res) => {
    res.status(501).end();
});

module.exports = router;
