const path = require('path');
const trivia = require('../trivia.js'); // Asumiendo que trivia.js está en el mismo directorio
const express = require('express');
const app = express();

// Ruta para crear una partida
app.post('/api/crearPartida',  (req, res) => {
  res('Success');
  /*
  const requestBody = req.body;
  const board = trivia.new(requestBody.nombre, requestBody.color);

  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }*/
});

// Ruta para consultar el estado de una partida
app.get('/api/consultarPartida', async (req, res) => {
  const boardId = req.query.boardId;
  const playerId = req.query.playerId;
  
  const board = trivia.poll(boardId, playerId);

  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para realizar un movimiento en una partida
app.post('/api/realizarMovimiento', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.play(requestBody.boardId, requestBody.playerId, requestBody.respuesta);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para preparar una partida
app.post('/api/prepararPartida', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.prepare(requestBody.boardId, requestBody.playerId);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para unirse a una partida existente
app.post('/api/unirsePartida', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.joinExisting(requestBody.boardId, requestBody.nombre);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Montar el router en la aplicación
module.exports = app;

// Exportar la aplicación para Netlify Functions
