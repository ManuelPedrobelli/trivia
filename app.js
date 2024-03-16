const path = require('path');
const trivia = require('./trivia.js'); // Asumiendo que trivia.js está en el mismo directorio
const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public' en la ruta raíz '/'
app.use('/', express.static(path.join(__dirname, 'public')));

// Ruta para crear una partida
app.get('/api/crearPartida', (req, res) => {
  res.send('Comunicación entre el front y el servidor correcta');
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

// Escuchar en el puerto 3000
app.listen(3000, () => console.log("Server ready on port 3000."));

// Exportar la aplicación para Netlify Functions
module.exports = app;
