const path = require('path');
const trivia = require('./trivia.js'); // Asumiendo que trivia.js está en el mismo directorio
const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: 'GET,POST', // Permitir solicitudes GET y POST
  allowedHeaders: 'Content-Type', // Permitir el encabezado Content-Type
};
// Habilitar CORS para todas las rutas
app.use(cors(corsOptions));
app.use(express.json());
// Servir archivos estáticos desde la carpeta 'public' en la ruta raíz '/'
app.use('/', express.static(path.join(__dirname, 'public')));


// Ruta para crear una partida
app.post('/crearPartida', (req, res) => {
  const requestBody = req.body;
  const board = trivia.new(requestBody.nombre, requestBody.color);

  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para consultar el estado de una partida
app.get('/board/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  const playerId = req.query.playerId;
  
  const board = trivia.poll(boardId, playerId);

  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para realizar un movimiento en una partida
app.post('/board/:boardId/play', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.play(req.params.boardId, requestBody.playerId, requestBody.respuesta);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta pacra preparar una partida
app.post('/board/:boardId/prepare', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.prepare(requestBody.boardId, requestBody.playerId);
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Ruta para unirse a una partida existente
app.patch('/board/:boardId', async (req, res) => {
  const name = req.body;
  const boardID = req.params.boardId;
  const board = trivia.joinExisting(boardID, name);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

// Escuchar en el puerto asignado por Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

// Exportar la aplicación para Vercel
module.exports = app;
