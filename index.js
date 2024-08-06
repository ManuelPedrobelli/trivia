
const path = require('path');
const trivia = require('./trivia.js');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/crearPartida', (req, res) => {
  const requestBody = req.body;
  const board = trivia.new(requestBody.nombre, requestBody.color);

  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

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

app.post('/board/:boardId/play', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.play(req.params.boardId, requestBody.playerId, requestBody.respuesta);
  
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

app.post('/board/:boardId/prepare', async (req, res) => {
  const requestBody = req.body;
  const board = trivia.prepare(requestBody.boardId, requestBody.playerId);
  if (board.error) {
    res.status(400).json(board);
  } else {
    res.status(200).json(board);
  }
});

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



app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
