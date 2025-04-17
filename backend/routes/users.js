var express = require('express');
var router = express.Router();

const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: "minimal" });
const bcrypt = require('bcryptjs');

const { exceptionHandler } = require('../utils/handlers');
const { generateAccessToken, authenticateToken } = require('../utils/auth');

const validateIsAdmin = (value) => {
  const validValues = ['Sim', 'Nao'];
  if (!validValues.includes(value)) {
    throw new Error('Valor invalido para o campo is_admin. Tente "Sim" ou "Não".');
  }
  return value;
};

// GET - lista os usuários
router.get('/', async function (req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// POST - adiciona um usuário
router.post('/', async (req, res) => {
  const data = req.body;

  try {
    if (!data.senha || data.senha.length < 8) {
      return res.status(400).json({
        error: "A senha é obrigatória e deve conter no mínimo 8 caracteres!"
      });
    }

    data.senha = await bcrypt.hash(data.senha, 10);

    if ('is_admin' in data) {
      data.is_admin = validateIsAdmin(data.is_admin);
    }

    const user = await prisma.user.create({
      data: data,
      select: {
        id: true,
        nome: true,
        email: true,
        is_admin: true
      }
    });

    const jwt = generateAccessToken(user);
    user.accessToken = jwt;
    res.status(201).json(user);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// GET {id} - lista usuários pelo ID
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: id
      }
    });
    res.json(user);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});

// PATCH {id} - atualiza um usuário pelo ID
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const token = req.accessToken;

    console.log("Token:", token);
    console.log("User ID:", id);
    console.log("is_admin:", token.is_admin);

    if (!token.is_admin && id !== token.id) {
      return res.status(403).json({ error: "Você não tem permissão para atualizar este usuário." });
    }

    if ('senha' in data) {
      if (data.senha.length < 8) {
        return res.status(400).json({ error: "A senha deve conter no mínimo 8 caracteres." });
      }
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    if ('is_admin' in data) {
      data.is_admin = validateIsAdmin(data.is_admin);
    }

    const user = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        is_admin: data.is_admin
      },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        dataNascimento: true,
        genero: true,
        is_admin: true
      }
    });
    res.json(user);
  } catch (exception) {
    exceptionHandler(exception, res);
  }
});


// DELETE - exclui um usuário pelo ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });
    res.status(200).end();
  } catch (exception) {
    exceptionHandler(exception, res)
  }
});

// Rota para validar o acesso de um usuário pelo login
router.post('/login', async (req, res) => {
  try {
    const data = req.body;
    if (!( 'senha' in data) ||(!'email' in data)) {
      return res.status(401).json({
        error: "Email e senha são obrigatórios!"
      });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: data.email
      }
    });

    const senhaCheck = await bcrypt.compare(data.senha, user.senha);
    if (!senhaCheck) {
      return res.status(401).json({
        error: "Usuário e/ou senha incorretos!"
      });
    }
    
    delete user.senha;

    const jwt = generateAccessToken(user);
    const response = {
      accessToken: jwt,
      nome: user.nome,
      is_admin: user.is_admin,
      id: user.id
    };

    console.log(response)
    res.json(response)

  } catch (exception) {
    let error = exceptionHandler(exception);
    res.status(error.code).json({
      error: error.message,
    });
  }
});

// Resposta padrão para rotas não existentes
router.all('*', (req, res) => {
  res.status(501).end();
});

module.exports = router;