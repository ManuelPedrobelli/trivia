const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

module.exports = {
    new: newTrivia,
    joinExisting: joinExistingTrivia,
    prepare: prepararJugada,
    play: play,
    poll: poll
};

const pathDatabase = path.join(__dirname, 'data', 'database.json');
const pathPreguntas = path.join(__dirname, 'data', 'preguntas.json');

const BLUE = 'blue';
const GREEN = 'green';
const Error_tablero_desconocido = {
    error: true,
    message: 'Tablero no encontrado'
};
const errorTurno = {
    error: true,
    message: 'No es tu turno'
};

let initialBoard = {
    blueName: null,
    greenName: null,
    boardId: null,
    blueId: null,
    greenId: null,
    turn: BLUE,
    diceNum: 0,
    blueIndex: 0,
    greenIndex: 0,
    winner: null,
    preguntas: JSON.parse(fs.readFileSync(pathPreguntas)),
    pregunta: null,
    opcion1: null,
    opcion2: null,
    opcion3: null,
    correcta: null,
    usadas: [],
    estadoRespuesta: false,
};

function newTrivia(nombre, color) {
    if (!fs.existsSync(pathDatabase)) {
        fs.writeFileSync(pathDatabase, JSON.stringify([]));
    }
    let trivia = newGame();
    id = generateID();
    trivia.boardId = generateID();
    if(color == 'verde'){
        trivia.greenName = nombre;
        trivia.greenId = id
    }else{
        trivia.blueName = nombre;
        trivia.blueId = id; 
    }
    saveTrivia(trivia);
    return triviaDTO(trivia, id);
}

 function joinExistingTrivia(boardId, nombre) {
/*     let trivia = findBy(t => t.boardId == boardId && !t.greenId); */
    let trivia = findBy(t => t.boardId == boardId);
    if (trivia) {
        id = generateID();
        if(!trivia.greenName){
            trivia.greenName = nombre;
            trivia.greenId = id;
        }else{
            trivia.blueName = nombre;
            trivia.blueId = id;
        }
        saveTrivia(trivia);
        return triviaDTO(trivia, id);
    } else {
        return Error_tablero_desconocido;
    }
} 

function prepararJugada(boardId, playerId) {
    let trivia = readTrivia(boardId);
    if (trivia && trivia.blueId && trivia.greenId) {
        if (isMyTurn(trivia, playerId)) {
            if (isWinner(trivia)) {
                trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
                saveTrivia(trivia);
                return triviaDTO(trivia, playerId);
            }
            trivia.diceNum = rollDice();
            cargarPreguntas(trivia);
            saveTrivia(trivia);
            return triviaDTO(trivia, playerId);
        } else {
            return errorTurno;
        }
    }
}

function play(boardId, playerId, respuesta) {
    let trivia = readTrivia(boardId);
    if (trivia && trivia.blueId && trivia.greenId) {
        if (isMyTurn(trivia, playerId)) {
            if (isWinner(trivia)) {
                trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
                saveTrivia(trivia);
                return triviaDTO(trivia, playerId);
            }

            if (verificarRespuesta(respuesta, trivia)) {
                trivia.estadoRespuesta = true;
                actualizarIndex(trivia, playerId);
            } else {
                trivia.estadoRespuesta = false;
            }
            trivia.pregunta = null;
            changeTurn(trivia);
            saveTrivia(trivia);
            return triviaDTO(trivia, playerId);
        } else {
            return errorTurno;
        }
    } else {
        console.log('error partida no encontrada (modulo play)');
    }
}

function poll(boardId, playerId) {
    let trivia = readTrivia(boardId);
    if (trivia) {
        if (isWinner(trivia)) {
            trivia.winner = (trivia.blueIndex >= 21) ? trivia.blueName : trivia.greenName;
            saveTrivia(trivia);
        }
        return triviaDTO(trivia, playerId);
    } else {
        return Error_tablero_desconocido;
    }
}

//----------------------------- Funciones Internas -------------------------------------

function actualizarIndex(trivia, playerId) {
    if (trivia.blueId === playerId) {
        trivia.blueIndex += trivia.diceNum;
        if (trivia.blueIndex === trivia.greenIndex) {
            trivia.blueIndex = trivia.greenIndex - 1; // Restar 1 al índice de la ficha azul
        }
    } else if (trivia.greenId === playerId) {
        trivia.greenIndex += trivia.diceNum;
        if (trivia.greenIndex === trivia.blueIndex) {
            trivia.greenIndex = trivia.blueIndex - 1; // Restar 1 al índice de la ficha verde
        }
    }
}

function verificarRespuesta(respuesta, trivia) {
    switch (respuesta) {
        case 'value1':
            return trivia.opcion1 === trivia.correcta;
        case 'value2':
            return trivia.opcion2 === trivia.correcta;
        case 'value3':
            return trivia.opcion3 === trivia.correcta;
        default:
            console.log('error al verificar respuesta (modulo verificar respuesta)');
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function triviaDTO(trivia, playerId) {
    return {
        blueName: trivia.blueName,
        greenName: trivia.greenName,
        boardId: trivia.boardId,
        playerId: playerId,
        turn: trivia.turn,
        dice: trivia.diceNum,
        blueIndex: trivia.blueIndex,
        greenIndex: trivia.greenIndex,
        winner: trivia.winner,
        pregunta: trivia.pregunta,
        opcion1: trivia.opcion1,
        opcion2: trivia.opcion2,
        opcion3: trivia.opcion3,
        estadoRespuesta: trivia.estadoRespuesta,
    };
}

function newGame() {
    let trivia = {};
    Object.assign(trivia, initialBoard);
    return trivia;
}

function cargarPreguntas(trivia) {
    // Hacer una copia de las preguntas disponibles
    let preguntasDisponibles = JSON.parse(JSON.stringify(trivia.preguntas));

    // Verificar si ya se han utilizado todas las preguntas (Total de preguntas hasta el momento = 41)
    if (trivia.usadas.length == 41) {
        // Si todas las preguntas se han utilizado, reiniciar la lista 'usadas' y la lista de 'preguntas'.
        trivia.usadas = [];
        trivia.preguntas = JSON.parse(fs.readFileSync(pathPreguntas));
    }

    let randomIndex;
    let pregActual;

    do {
        randomIndex = Math.floor(Math.random() * preguntasDisponibles.length);
        pregActual = preguntasDisponibles[randomIndex];
    } while (trivia.usadas.includes(pregActual));

    if (pregActual && pregActual.pregunta && pregActual.respuestas && pregActual.respuestaCorrecta) {
        trivia.pregunta = pregActual.pregunta;
        trivia.opcion1 = pregActual.respuestas[0];
        trivia.opcion2 = pregActual.respuestas[1];
        trivia.opcion3 = pregActual.respuestas[2];
        trivia.correcta = pregActual.respuestaCorrecta;

        // Eliminar la pregunta seleccionada de la lista de preguntas disponibles
        preguntasDisponibles.splice(randomIndex, 1);

        // Actualizar trivia.preguntas con la lista actualizada de preguntas disponibles
        trivia.preguntas = preguntasDisponibles;

        // Agregar la pregunta utilizada a la lista de preguntas usadas
        trivia.usadas.push(pregActual);
    } else {
        console.log('error en modulo cargarPreguntas');
    }

    // Retornar el objeto trivia actualizado
    return trivia;
}

function readTrivia(boardId) {
    return findBy(t => t.boardId == boardId);
}

function findBy(predicate) {
    if (fs.existsSync(pathDatabase)) {
        return JSON.parse(fs.readFileSync(pathDatabase)).find(predicate);
    } else {
        return undefined;
    }
}

function saveTrivia(trivia) {
    let partidas = JSON.parse(fs.readFileSync(pathDatabase));
    let i = partidas.findIndex(p => p.boardId == trivia.boardId);
    if (i == -1) {
        partidas.push(trivia);
    } else {
        partidas[i] = trivia;
    }
    fs.writeFileSync(pathDatabase, JSON.stringify(partidas));
}

function changeTurn(trivia) {
    if (trivia.turn == GREEN) {
        trivia.turn = BLUE;
    } else {
        trivia.turn = GREEN;
    }
}

function isMyTurn(trivia, playerId) {
    if (trivia.greenId == playerId) {
        return trivia.turn == GREEN;
    } else if (trivia.blueId == playerId) {
        return trivia.turn == BLUE;
    } else {
        return false;
    }
}

function isWinner(trivia) {
    return ((trivia.blueIndex >= 21) || (trivia.greenIndex >= 21));
}

function generateID() {
    return crypto.randomBytes(16).toString('hex');
}