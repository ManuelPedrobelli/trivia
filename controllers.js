'use strict'

const express = require('express');
const trivia = require('./trivia.js');
const app = express();
const PORT = 5000;
const cors = require('cors'); // Importa el paquete cors
const path = require('path');
const loginCSSpath = path.join(__dirname, 'public', 'login.css');
const loginJSpath = path.join(__dirname, 'public', 'login.js');
const loginHTMLpath = path.join(__dirname, 'public', 'login.html');

app.use(cors()); // Usa cors para permitir solicitudes de todos los dominios
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//MIME para poder utilizar JS y CSS
app.get('/login.css', (req, res) => {
    res.set('Content-Type', 'text/css'); // Configurar el tipo MIME como CSS
    res.sendFile(loginCSSpath);
});
app.get('/login.js', (req, res) => {
    res.set('Content-Type', 'application/javascript'); // Configurar el tipo MIME como JavaScript
    res.sendFile(loginJSpath);
});

app.get('/', (req, res) => {
    res.sendFile(loginHTMLpath);
});

app.post('/trivia/board', crear);
app.patch('/trivia/board/:boardId', unirse);
app.post('/trivia/board/:boardId/prepare', preparar);
app.post('/trivia/board/:boardId', play);
app.get('/trivia/board/:boardId', estado);

app.listen(PORT, () => console.log(`Trivia iniciado. ctrl + click -> : localhost:${PORT}`));

function crear(req, res) {
    console.log('llega a ejecutar');
    let board = trivia.new(req.body.nombre, req.body.color);
    if (board.error) {
        res.status(400).json(board);
    } else {
        res.json(board);
    }
}

function unirse(req, res) {
    let board = trivia.joinExisting(req.params.boardId, req.body.nombre);
    if (board.error) {
        res.status(400).json(board);
    } else {
        res.json(board);
    }
}

function preparar(req, res) {
    let board = trivia.prepare(req.params.boardId, req.body.playerId);
    if (board.error) {
        res.status(400).json(board);
    } else {
        res.json(board);
    }
}

function play(req, res) {
    let board = trivia.play(req.body.boardId, req.body.playerId, req.body.respuesta);
    if (board.error) {
        res.status(400).json(board);
    } else {
        let estado = board.estadoRespuesta;
        res.json(board);
    }
}

function estado(req, res) {
    let board = trivia.poll(req.params.boardId, req.query.playerId);
    if (board.error) {
        res.status(400).json(board);
    } else {
        res.json(board);
    }
}