const path = require('path');
const trivia = require('../trivia.js'); // Importa tu lógica de trivia

exports.handler = async (event, context) => {
  // Construye la ruta absoluta a la carpeta 'data'
  const absoluteDataFolderPath = path.resolve(__dirname, '..', '..', 'data');
  const pathPreguntas = path.join(absoluteDataFolderPath, 'preguntas.json');
  
  // Tu lógica para crear una partida
  const requestBody = JSON.parse(event.body);
  const board = trivia.new(requestBody.nombre, requestBody.color, pathPreguntas);
  
  if (board.error) {
    return {
      statusCode: 400,
      body: JSON.stringify(board) 
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(board)
    };
  }
};
