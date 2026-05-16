function scoreBoard(board) {
    if (isKingInCheckmate(board)) {
        return -Infinity;
    }
    if (isGameInDraw(board)) {
        return 0;
    }
    let latestBoardHistory = board[board.length - 1];
    let latestBoard = latestBoardHistory.board;
    let pieceValues = {
        'pawn': 1,
        'knight': 3,
        'bishop': 3,
        'rook': 5,
        'queen': 9,
    };
    let score = 0;
    for (let row = 0; row < latestBoard.length; row++) {
        for (let col = 0; col < latestBoard[row].length; col++) {
            let scannedSquare = latestBoard[row][col];
            if (scannedSquare.type) {
                let pieceScore = pieceValues[scannedSquare.type] || 0;
                if (scannedSquare.color === latestBoardHistory.playerTurn) {
                    score += pieceScore;
                } else {
                    score -= pieceScore;
                }
            }
        }
    }
    return score;
}

function randomAI(board) {
    let moves = legalMoves(board);
    let randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

function greedyAI(board) {
    let moves = legalMoves(board);
    let largestScore = -Infinity;
    let largestScoringMove = null;
    for (let move of moves) {
        let newBoard = playMove(board, move);
        let newBoardScore = -scoreBoard(newBoard);
        if (newBoardScore > largestScore) {
            largestScore = newBoardScore;
            largestScoringMove = move;
        }
    }
    return largestScoringMove;
}

function joelAI(board) {
    let moves = legalMoves(board);
    let largestScore = -Infinity;
    let largestScoringMove = null;
    for (let move of moves) {
        let newBoard = playMove(board, move);
        let newBoardScore = -joelScoreBoard(newBoard, 1);
        if (newBoardScore >= largestScore) {
            largestScore = newBoardScore;
            largestScoringMove = move;
        }
    }
    return largestScoringMove;
}

function joelScoreBoard(board, depth) {
    if (isKingInCheckmate(board)) {
        return -Infinity;
    }
    if (isGameInDraw(board)) {
        return 0;
    }
    if (depth === 0) {
        return scoreBoard(board);
    }
    let moves = legalMoves(board);
    let largestScore = -Infinity;
    for (let move of moves) {
        let newBoard = playMove(board, move);
        let newBoardScore = -joelScoreBoard(newBoard, depth - 1);
        if (newBoardScore > largestScore) {
            largestScore = newBoardScore;
        }
    }
    return largestScore;
}
