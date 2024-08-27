//chess to do list

function legalMoves(board) {
    //returns an array of moves for currentPlayerTurn
    //inclusive of piece for square collision?
    //pawn promotion will be a series of (4) moves
}

function playMove(board, move) {
    //returns a new board, but with the move played
    //inclusive of piece?
    //prob need move piece and pushBoardHistory together?
}

function scoreBoard(board) {
    //if it is checkmate, it should return positive infinity
    //if it is draw, return 0
    //calculate material score for white and black
    //we want it to be a positive number when currentPlayerTurn has more material
}
//spoiler alert, we will be replacing scoreboard with a neural network

function randomAI(board) {
    // return a random move obj (legal move)
}

function greedyAI(board) {
    // return best move for the board based on return value of scoreBoard(board)
}

function playGame(whiteAI, blackAI) {
    // return 1 if whiteAI wins, 0 if draw, -1 if blackAI wins
}

function runGauntlet(ai1, ai2, numGames) {
    //run playGame a bunch, returns an obj with AI1/AI2 wins or draws
}

