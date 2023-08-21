const trivia = require('../trivia.js');

exports.handler = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const board = trivia.joinExisting(requestBody.boardId, requestBody.nombre);
  
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