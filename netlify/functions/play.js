const trivia = require('../trivia.js');

exports.handler = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const board = trivia.play(requestBody.boardId, requestBody.playerId, requestBody.respuesta);
  
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
