let board = null;
const game = new Chess();

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove() {
  const possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
}

function makeBestMove() {
  if (game.moves().length === 0) {
    alert("game over");
    return;
  }

  bestMove = getBestMove(game);
  game.move(bestMove);
  board.position(game.fen());
}

const getBestMove = (game) => {
  let positionCount = 0;
  const depth = parseInt($("#search-depth").find(":selected").text());

  const d1 = new Date().getTime();
  const bestMove = minimax(depth, game);
  const moveTime = new Date().getTime() - d1;

  const positionsPerS = (positionCount * 1000) / moveTime;

  $("#position-count").text(positionCount);
  $("#time").text(moveTime / 1000 + "s");
  $("#positions-per-s").text(positionsPerS);
};

const minimax = (depth, game) => {};

function onDrop(source, target) {
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

const config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

board = ChessBoard("board", config);
