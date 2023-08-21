const trivia = require('../trivia.js');

exports.handler = async (event, context) => {
  const boardId = event.queryStringParameters.boardId;
  const playerId = event.queryStringParameters.playerId;
  
  const board = trivia.poll(boardId, playerId);
  
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
