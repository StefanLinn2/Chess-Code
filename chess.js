//StefanLinn2


function assert(value, message) {
    if (!value) {
        throw new Error(message);
    }
}

function invertCurrentPlayerTurn(boardHistory) {
    if (boardHistory[boardHistory.length - 1].playerTurn === 'white') {
        return 'black';
    } else if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
        return 'white';
    } else {
        return 'you have a bug in invertCurrentPlayerTurn function';
    }
}

let whitePawnPromotion = false;
let blackPawnPromotion = false;
let selectedSquare = null;
let selectedPieceType = null;
let selectedMove = null;
let gameStatus = "active";


//let boardHistory = fenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
let boardHistory = fenToBoard('5q2/6P1/8/8/8/8/8/8 w - - 0 1')
//let boardHistory = fenToBoard('rnbqkbnr/pppp2p1/4p3/5P1p/2B5/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5');
//let boardHistory = fenToBoard('rnbq1bnr/ppppk1p1/4P3/7p/2B5/5Q2/PPPP1PPP/RNB1K1NR w KQ - 1 6');
//let boardHistory = fenToBoard('Q7/1P6/3k2pb/4n3/p6P/P2K4/2P4P/R7 w - - 1 33')


let testerInitialBoard = [
    {
        board: [
            [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
            [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
            [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
        ],
        playerTurn: 'white',
        whiteKingCastleStatus: true,
        whiteQueenCastleStatus: true,
        blackKingCastleStatus: true,
        blackQueenCastleStatus: true,
        enPassant: null,
        halfMoveClock: 0,
        fullMoveClock: 1,
    }
];

function pawnPromotion() {
    if (whitePawnPromotion || blackPawnPromotion) {
        return true;
    }
    return false;
}

function promotionSelected(row, col) {
    let promotionType = null;
    if (row === 3 || row === 4) {
        if (col >= 0 && col <= 1) {
            promotionType = 'queen';
        } else if (col >= 2 && col <= 3) {
            promotionType = 'bishop';
        } else if (col >= 4 && col <= 5) {
            promotionType = 'knight';
        } else if (col >= 6 && col <= 7) {
            promotionType = 'rook';
        }
    }
    return promotionType;
}

function resetPawnPromotionFlags() {
    whitePawnPromotion = false;
    blackPawnPromotion = false;
    selectedSquare = null;
    selectedMove = null;
}

function handlePawnPromotion(row, col) {
    if (pawnPromotion()) {
        let promotionType = promotionSelected(row, col);
        if (promotionType) {
            movePiece(selectedSquare.row, selectedSquare.col, selectedMove.row, selectedMove.col, boardHistory, promotionType);
            doAIMove();
            resetPawnPromotionFlags();
        }
        return true;
    }
    return false;
}

function onClick(event) {
    let _board = boardHistory[boardHistory.length - 1].board;
    let col = Math.floor(event.offsetX / block);
    let row = Math.floor(event.offsetY / block);
    let square = _board[row][col];
    if (handlePawnPromotion(row, col)) {
        return
    }
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        selectedSquare = null;
    } else if (square.type && boardHistory[boardHistory.length - 1].playerTurn === square.color) {
        selectedSquare = { row: row, col: col };
        selectedPieceType = square.type;
    } else if (selectedSquare) {
        let validDestinations = spliceSelfCheckingMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, validMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, boardHistory), boardHistory);
        for (let i = 0; i < validDestinations.length; i++) {
            if (validDestinations[i].row === row && validDestinations[i].col === col) {
                selectedMove = validDestinations[i];
                break;
            }
        }
        if (selectedMove) {
            let piece = _board[selectedSquare.row][selectedSquare.col];
            let pawnHasMovedStatus = null;
            let capturedPieceStatus = null;

            let endSquare = _board[row][col];
            let promotion = null;
            if (endSquare.type && endSquare.color !== boardHistory[boardHistory.length - 1].playerTurn) {
                capturedPieceStatus = true;
            } else {
                capturedPieceStatus = false;
            }
            if (piece.type === 'pawn') {
                pawnHasMovedStatus = true;
            } else {
                pawnHasMovedStatus = false;
            }
            if (capturedPieceStatus || pawnHasMovedStatus) {
                halfMoveClockReset = true;
            }
            if (selectedMove.promotion) {
                if (selectedMove.row === 0) {
                    whitePawnPromotion = true;
                    blackPawnPromotion = false;
                    return;
                } else if (selectedMove.row === 7) {
                    whitePawnPromotion = false;
                    blackPawnPromotion = true;
                    return;
                }
            }
            movePiece(selectedSquare.row, selectedSquare.col, row, col, boardHistory, promotion);
            doAIMove();
            if (!pawnPromotion()) {
                selectedSquare = null;
                selectedMove = null;
            }
        } else {
            selectedSquare = null;
            selectedMove = null;
        }
    }
    updateGameStatus();
}

canvas.addEventListener('click', onClick);

function doAIMove() {
    if (legalMoves(boardHistory).length === 0) {
        return;
    }
    let randomMove = joelAI(boardHistory);
    movePiece(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol, boardHistory, randomMove.promotion);
}

function updateCastlingStatus(piece, fromRow, fromCol, boardHistory) {
    let lastState = boardHistory[boardHistory.length - 1];
    let castlingUpdate = {
        whiteKing: lastState.whiteKingCastleStatus,
        whiteQueen: lastState.whiteQueenCastleStatus,
        blackKing: lastState.blackKingCastleStatus,
        blackQueen: lastState.blackQueenCastleStatus,
    };
    if (piece.type === 'king') {
        if (piece.color === 'white') {
            castlingUpdate.whiteKing = false;
            castlingUpdate.whiteQueen = false;
        } else {
            castlingUpdate.blackKing = false;
            castlingUpdate.blackQueen = false;
        }
    } else if (piece.type === 'rook') {
        if (piece.color === 'white') {
            if (fromRow === 7 && fromCol === 7) {
                castlingUpdate.whiteKing = false;
            } else if (fromRow === 7 && fromCol === 0) {
                castlingUpdate.whiteQueen = false;
            }
        } else if (piece.color === 'black') {
            if (fromRow === 0 && fromCol === 0) {
                castlingUpdate.blackQueen = false;
            } else if (fromRow === 0 && fromCol === 7) {
                castlingUpdate.blackKing = false;
            }
        }
    }
    return castlingUpdate;
}

function pushBoardHistory(epsq, castlingUpdate, halfMoveClockReset, updatedBoard, boardHistory) {
    let fullMoveModifier = 0;
    let halfMoveModifier = 0;
    if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
        fullMoveModifier = 1;
    }
    else {
        fullMoveModifier = 0;
    }
    if (halfMoveClockReset) {
        halfMoveModifier = 0;
    } else {
        halfMoveModifier = boardHistory[boardHistory.length - 1].halfMoveClock + 1;
    }
    boardHistory.push(
        {
            board: deepCopyBoard(updatedBoard),
            playerTurn: invertCurrentPlayerTurn(boardHistory),
            whiteKingCastleStatus: castlingUpdate.whiteKing,
            whiteQueenCastleStatus: castlingUpdate.whiteQueen,
            blackKingCastleStatus: castlingUpdate.blackKing,
            blackQueenCastleStatus: castlingUpdate.blackQueen,
            enPassant: epsq,
            halfMoveClock: halfMoveModifier,
            fullMoveClock: boardHistory[boardHistory.length - 1].fullMoveClock + fullMoveModifier,
        }
    );
}

function returnEnPassantSquare(piece, fromRow, toRow, col) {
    if (piece.type === 'pawn' && Math.abs(fromRow - toRow) === 2) {
        let behindRow = (piece.color === 'white') ? toRow + 1 : toRow - 1;
        return { row: behindRow, col: col };
    }
    return null;
}

function movePiece(startRow, startCol, endRow, endCol, boardHistory, promotion = null) {
    let board = deepCopyBoard(boardHistory[boardHistory.length - 1].board);
    let testboard = deepCopyBoard(board);
    let piece = board[startRow][startCol];
    let pawnHasMovedStatus = null;
    let capturedPieceStatus = null;
    let endSquare = board[endRow][endCol];
    let halfMoveClockReset = null;
    let enPassantCapture = boardHistory[boardHistory.length - 1].enPassant;
    if (endSquare.type && endSquare.color !== boardHistory[boardHistory.length - 1].playerTurn) {
        capturedPieceStatus = true;
    } else {
        capturedPieceStatus = false;
    }
    if (piece.type === 'pawn') {
        pawnHasMovedStatus = true;
    } else {
        pawnHasMovedStatus = false;
    }
    if (capturedPieceStatus || pawnHasMovedStatus) {
        halfMoveClockReset = true;
    }
    if (piece.type === 'king' && (endCol - startCol === 2)) {
        if (boardHistory[boardHistory.length - 1].playerTurn === 'white' &&
            boardHistory[boardHistory.length - 1].whiteKingCastleStatus) {
            board[endRow][endCol] = piece;
            board[7][7] = {};
            board[7][5] = { type: 'rook', color: 'white' };
            board[startRow][startCol] = {};
        }
        else if (boardHistory[boardHistory.length - 1].playerTurn === 'black' &&
            boardHistory[boardHistory.length - 1].blackKingCastleStatus) {
            board[endRow][endCol] = piece;
            board[0][7] = {};
            board[0][5] = { type: 'rook', color: 'black' };
            board[startRow][startCol] = {};
        }
    } else if (piece.type === 'king' && (endCol - startCol === -2)) {
        if (boardHistory[boardHistory.length - 1].playerTurn === 'white' &&
            boardHistory[boardHistory.length - 1].whiteQueenCastleStatus
        ) {
            board[endRow][endCol] = piece;
            board[7][0] = {};
            board[7][3] = { type: 'rook', color: 'white' };
            board[startRow][startCol] = {};
        }
        if (boardHistory[boardHistory.length - 1].playerTurn === 'black' &&
            boardHistory[boardHistory.length - 1].blackQueenCastleStatus
        ) {
            board[endRow][endCol] = piece;
            board[0][0] = {};
            board[0][3] = { type: 'rook', color: 'black' };
            board[startRow][startCol] = {};
        }
    } else if (enPassantCapture && enPassantCapture.row === endRow && enPassantCapture.col === endCol && piece.type === 'pawn') {
        if (piece.color === 'white') {
            board[endRow + 1][endCol] = {};
            board[endRow][endCol] = piece;
            board[startRow][startCol] = {};
        } else {
            board[endRow - 1][endCol] = {};
            board[endRow][endCol] = piece;
            board[startRow][startCol] = {};
        }
    }
    else {
        board[endRow][endCol] = piece;
        board[startRow][startCol] = {};
    }
    if (piece.type === 'pawn' && (endRow === 0 || endRow === 7)) {
        if (promotion) {
            board[endRow][endCol] = { type: promotion, color: piece.color };
        }
    }
    let fromRow = startRow;
    let fromCol = startCol;
    let castlingUpdate = {
        whiteKing: boardHistory[boardHistory.length - 1].whiteKingCastleStatus,
        whiteQueen: boardHistory[boardHistory.length - 1].whiteQueenCastleStatus,
        blackKing: boardHistory[boardHistory.length - 1].blackKingCastleStatus,
        blackQueen: boardHistory[boardHistory.length - 1].blackQueenCastleStatus,
    };
    if (piece.type !== 'pawn' || (endRow !== 7 && endRow !== 0)) {
        if (piece.type === 'pawn') {
            let epsq = returnEnPassantSquare(piece, startRow, endRow, fromCol);
            pushBoardHistory(epsq, castlingUpdate, halfMoveClockReset, board, boardHistory);
        } else {
            castlingUpdate = updateCastlingStatus(piece, fromRow, fromCol, boardHistory);
            pushBoardHistory(null, castlingUpdate, halfMoveClockReset, board, boardHistory);
        }
    } else {
        if (endRow === 0) {
            if (endCol === 0) {
                castlingUpdate.blackQueen = false;
            }
            if (endCol === 7) {
                castlingUpdate.blackKing = false;
            }
        }
        if (endRow === 7) {
            if (endCol === 0) {
                castlingUpdate.whiteQueen = false;
            }
            if (endCol === 7) {
                castlingUpdate.whiteKing = false;
            }
        }
        pushBoardHistory(null, castlingUpdate, halfMoveClockReset, board, boardHistory);
    }
    let whiteKingPresent = false;
    let blackKingPresent = false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = board[row][col];
            if (square.type === 'king') {
                if (square.color === 'white') whiteKingPresent = true;
                if (square.color === 'black') blackKingPresent = true;
            }
        }
    }

    if (!whiteKingPresent || !blackKingPresent) {
        console.error(`King missing from board after move from (${startRow}, ${startCol}) to (${endRow}, ${endCol})`);
        console.log("Board state after move:", board);
        console.log("previous board is: ", testboard);
        throw new Error("A king is missing from the board.");
    }
    return board;
}

function validMoves(piece, row, col, _boardHistory) {
    if (piece.type === 'pawn') {
        return validPawnMoves(piece, row, col, _boardHistory);
    }
    if (piece.type === 'rook') {
        return validRookMoves(piece, row, col, _boardHistory);
    }
    if (piece.type === 'knight') {
        return validKnightMoves(piece, row, col, _boardHistory);
    }
    if (piece.type === 'bishop') {
        return validBishopMoves(piece, row, col, _boardHistory);
    }
    if (piece.type === 'queen') {
        return validQueenMoves(piece, row, col, _boardHistory);
    }
    if (piece.type === 'king') {
        return validKingMoves(piece, row, col, _boardHistory);
    }
}

function validPawnMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let _board = _boardHistory[_boardHistory.length - 1].board;
    let direction = (piece.color === 'white') ? -1 : 1;
    if ((piece.color === 'white' && currentRow === 0) || (piece.color === 'black' && currentRow === 7)) {
        return moves;
    }
    if (!_board[currentRow + direction][currentCol].type) {
        if ((piece.color === 'white' && currentRow + direction === 0) || (piece.color === 'black' && currentRow + direction === 7)) {
            moves.push({ row: currentRow + direction, col: currentCol, promotion: 'queen' });
            moves.push({ row: currentRow + direction, col: currentCol, promotion: 'rook' });
            moves.push({ row: currentRow + direction, col: currentCol, promotion: 'bishop' });
            moves.push({ row: currentRow + direction, col: currentCol, promotion: 'knight' });
        } else {
            moves.push({ row: currentRow + direction, col: currentCol });
        }

        if ((piece.color === 'white' && currentRow === 6) || (piece.color === 'black' && currentRow === 1)) {
            if (!_board[currentRow + 2 * direction][currentCol].type) {
                moves.push({ row: currentRow + 2 * direction, col: currentCol });
            }
        }
    }
    if (currentCol > 0 && _board[currentRow + direction][currentCol - 1].type &&
        _board[currentRow + direction][currentCol - 1].color !== piece.color) {
        if ((piece.color === 'white' && currentRow + direction === 0) || (piece.color === 'black' && currentRow + direction === 7)) {
            moves.push({ row: currentRow + direction, col: currentCol - 1, promotion: 'queen' });
            moves.push({ row: currentRow + direction, col: currentCol - 1, promotion: 'rook' });
            moves.push({ row: currentRow + direction, col: currentCol - 1, promotion: 'bishop' });
            moves.push({ row: currentRow + direction, col: currentCol - 1, promotion: 'knight' });
        } else {
            moves.push({ row: currentRow + direction, col: currentCol - 1 });
        }
    }
    if (currentCol < 7 && _board[currentRow + direction][currentCol + 1].type &&
        _board[currentRow + direction][currentCol + 1].color !== piece.color) {
        if ((piece.color === 'white' && currentRow + direction === 0) || (piece.color === 'black' && currentRow + direction === 7)) {
            moves.push({ row: currentRow + direction, col: currentCol + 1, promotion: 'queen' });
            moves.push({ row: currentRow + direction, col: currentCol + 1, promotion: 'rook' });
            moves.push({ row: currentRow + direction, col: currentCol + 1, promotion: 'bishop' });
            moves.push({ row: currentRow + direction, col: currentCol + 1, promotion: 'knight' });
        } else {
            moves.push({ row: currentRow + direction, col: currentCol + 1 });
        }
    }
    if (_boardHistory[_boardHistory.length - 1].enPassant) {
        let enPassantRow = _boardHistory[_boardHistory.length - 1].enPassant.row;
        let enPassantCol = _boardHistory[_boardHistory.length - 1].enPassant.col;
        if ((piece.color === 'white' && currentRow === 3 && enPassantRow == 2) ||
            (piece.color === 'black' && currentRow === 4 && enPassantRow == 5)) {
            if (currentCol === enPassantCol - 1 || currentCol === enPassantCol + 1) {
                moves.push({ row: enPassantRow, col: enPassantCol });
            }
        }
    }
    return moves;
}

function equalMoveArrayCheck(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].row !== array2[i].row || array1[i].col !== array2[i].col) {
            return false;
        }
    }
    return true;
}

function validRookMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let _board = _boardHistory[_boardHistory.length - 1].board;
    for (let row = currentRow - 1; row >= 0; row--) {
        if (_board[row][currentCol] && _board[row][currentCol].type) {
            if (_board[row][currentCol].color !== piece.color) {
                moves.push({ row: row, col: currentCol });
            }
            break;
        }
        moves.push({ row: row, col: currentCol });
    }
    for (let row = currentRow + 1; row < 8; row++) {
        if (_board[row][currentCol] && _board[row][currentCol].type) {
            if (_board[row][currentCol].color !== piece.color) {
                moves.push({ row: row, col: currentCol });
            }
            break;
        }
        moves.push({ row: row, col: currentCol });
    }
    for (let col = currentCol - 1; col >= 0; col--) {
        if (_board[currentRow][col].type) {
            if (_board[currentRow][col].color !== piece.color) {
                moves.push({ row: currentRow, col: col });
            }
            break;
        }
        moves.push({ row: currentRow, col: col });
    }
    for (let col = currentCol + 1; col < 8; col++) {
        if (_board[currentRow][col].type) {
            if (_board[currentRow][col].color !== piece.color) {
                moves.push({ row: currentRow, col: col });
            }
            break;
        }
        moves.push({ row: currentRow, col: col });
    }
    return moves;
}

function validKnightMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let _board = _boardHistory[_boardHistory.length - 1].board;
    let directions = [
        { row: -2, col: -1 },
        { row: -2, col: 1 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 }
    ];

    for (let i = 0; i < directions.length; i++) {
        let dir = directions[i];
        let newRow = currentRow + dir.row;
        let newCol = currentCol + dir.col;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let targetSquare = _board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
}

function validBishopMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let _board = _boardHistory[_boardHistory.length - 1].board;
    let directions = [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
    ];
    for (let i = 0; i < directions.length; i++) {
        let dir = directions[i];
        for (let newRow = currentRow + dir.row, newCol = currentCol + dir.col;
            newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8;
            newRow += dir.row, newCol += dir.col) {
            let targetSquare = _board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
            if (targetSquare.type) {
                break;
            }
        }
    }
    return moves;
}

function validQueenMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let _board = _boardHistory[_boardHistory.length - 1].board;
    let directions = [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
    ];
    for (let dir of directions) {
        let newRow = currentRow + dir.row;
        let newCol = currentCol + dir.col;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let targetSquare = _board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
            if (targetSquare.type) {
                break;
            }
            newRow += dir.row;
            newCol += dir.col;
        }
    }
    return moves;
}

function validKingMoves(piece, currentRow, currentCol, _boardHistory) {
    let moves = [];
    let lastState = _boardHistory[_boardHistory.length - 1];
    let _board = lastState.board;
    let directions = [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 }
    ];
    let enemyKingMoveArray = [];
    let enemyKing = findKingPosition(_board, invertCurrentPlayerTurn(_boardHistory))
    for (let dir of directions) {
        let enemyKingRow = enemyKing.row + dir.row;
        let enemyKingCol = enemyKing.col + dir.col;
        if (enemyKingRow >= 0 && enemyKingRow < 8 && enemyKingCol >= 0 && enemyKingCol < 8) {
            enemyKingMoveArray.push({ row: enemyKingRow, col: enemyKingCol })
        }
    }
    for (let dir of directions) {
        let newRow = currentRow + dir.row;
        let newCol = currentCol + dir.col;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let targetSquare = _board[newRow][newCol];
            let isAllyOccupied = targetSquare.type && targetSquare.color === piece.color;
            let isThreatenedByEnemyKing = false;
            for (let enemySquare of enemyKingMoveArray) {
                if (enemySquare.row === newRow && enemySquare.col === newCol) {
                    isThreatenedByEnemyKing = true;
                    break;
                }
            }
            if (!isAllyOccupied && !isThreatenedByEnemyKing) {
                moves.push({ row: newRow, col: newCol });
            }

        }
    }
    if (lastState.playerTurn === 'white') {
        if (lastState.whiteKingCastleStatus &&
            !isSquareThreatened(7, 4, _boardHistory) &&
            !isSquareThreatened(7, 5, _boardHistory) &&
            !isSquareThreatened(7, 6, _boardHistory) &&
            _board[7][5].type === undefined &&
            _board[7][6].type === undefined) {
            moves.push({ row: 7, col: 6 });
        }
        if (lastState.whiteQueenCastleStatus &&
            !isSquareThreatened(7, 4, _boardHistory) &&
            !isSquareThreatened(7, 3, _boardHistory) &&
            !isSquareThreatened(7, 2, _boardHistory) &&
            !isSquareThreatened(7, 1, _boardHistory) &&
            _board[7][3].type === undefined &&
            _board[7][2].type === undefined &&
            _board[7][1].type === undefined
        ) {
            moves.push({ row: 7, col: 2 });
        }
    }
    if (lastState.playerTurn === 'black') {
        if (lastState.blackKingCastleStatus &&
            !isSquareThreatened(0, 4, _boardHistory) &&
            !isSquareThreatened(0, 5, _boardHistory) &&
            !isSquareThreatened(0, 6, _boardHistory) &&
            _board[0][5].type === undefined &&
            _board[0][6].type === undefined) {
            moves.push({ row: 0, col: 6 });
        }
        if (lastState.blackQueenCastleStatus &&
            !isSquareThreatened(0, 4, _boardHistory) &&
            !isSquareThreatened(0, 3, _boardHistory) &&
            !isSquareThreatened(0, 1, _boardHistory) &&
            !isSquareThreatened(0, 2, _boardHistory) &&
            _board[0][3].type === undefined &&
            _board[0][2].type === undefined &&
            _board[0][1].type === undefined) {
            moves.push({ row: 0, col: 2 });
        }
    }
    return moves;
}

function findKingPosition(_board, playerTurn) {
    for (let row = 0; row < _board.length; row++) {
        for (let col = 0; col < _board[row].length; col++) {
            let piece = _board[row][col];
            if (piece.type === 'king' && piece.color === playerTurn) {
                return { row: row, col: col };
            }
        }
    }
    return null;
}

function isSquareThreatened(_row, _col, _boardHistory) {
    let board = _boardHistory[_boardHistory.length - 1].board;
    let attackedSquare = { row: _row, col: _col };
    let pieceColor = _boardHistory[_boardHistory.length - 1].playerTurn;
    let direction = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
    ]
    for (let dir of direction) {
        let dy = dir.row;
        let dx = dir.col;
        for (let i = 1; i <= 7; i++) {
            let newRow = attackedSquare.row + i * dy;
            let newCol = attackedSquare.col + i * dx;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
                break;
            }
            let adjacentSquare = board[newRow][newCol];
            if (adjacentSquare.type) {
                if (adjacentSquare.color === pieceColor) {
                    break;
                }
                let isStraight = dx === 0 || dy === 0;
                let isDiagonal = dx !== 0 && dy !== 0;
                if (
                    (adjacentSquare.type === 'queen') ||
                    (adjacentSquare.type === 'rook' && isStraight) ||
                    (adjacentSquare.type === 'bishop' && isDiagonal)
                ) {
                    return true;
                }
                break;
            }

        }
    }
    let knightThreats = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
    ];
    for (let square of knightThreats) {
        let dx = square[0];
        let dy = square[1];
        let newRow = attackedSquare.row + dx;
        let newCol = attackedSquare.col + dy;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let adjacentSquare = board[newRow][newCol];
            if (adjacentSquare.color !== pieceColor && adjacentSquare.type === 'knight') {
                return true;
            }
        }
    }
    let pawnThreats = [];
    if (pieceColor === 'white') {
        pawnThreats.push([attackedSquare.row - 1, attackedSquare.col - 1]);
        pawnThreats.push([attackedSquare.row - 1, attackedSquare.col + 1]);
    } else
        if (pieceColor === 'black') {
            pawnThreats.push([attackedSquare.row + 1, attackedSquare.col - 1]);
            pawnThreats.push([attackedSquare.row + 1, attackedSquare.col + 1]);
        }
    for (let square of pawnThreats) {
        let newRow = square[0];
        let newCol = square[1];
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let adjacentSquare = board[newRow][newCol];
            if (adjacentSquare.type === 'pawn' && adjacentSquare.color !== pieceColor) {
                return true
            }
        }
    }
    return false;
}

function isKingInCheckmate(_boardHistory) {
    let simulatedBoardHistory = deepCopyBoardHistory(_boardHistory);
    let simulatedBoard = simulatedBoardHistory[simulatedBoardHistory.length - 1].board;
    let playerTurn = simulatedBoardHistory[simulatedBoardHistory.length - 1].playerTurn;
    let enPassantCapture = simulatedBoardHistory[simulatedBoardHistory.length - 1].enPassant;
    let kingLocation = findKingPosition(simulatedBoard, playerTurn);
    for (let row = 0; row < simulatedBoard.length; row++) {
        for (let col = 0; col < simulatedBoard[row].length; col++) {
            let piece = simulatedBoard[row][col];
            if (piece.color === playerTurn && piece.type !== undefined) {
                let moves = validMoves(piece, row, col, simulatedBoardHistory);
                for (let move of moves) {
                    let simulatedMove = simulatedBoard[move.row][move.col];
                    let capturedPawn = null;
                    if (enPassantCapture &&
                        enPassantCapture.row === move.row &&
                        enPassantCapture.col === move.col &&
                        piece.type === 'pawn') {
                        if (piece.color === 'white') {
                            capturedPawn = simulatedBoard[move.row + 1][move.col];
                            simulatedBoard[move.row + 1][move.col] = {};
                        } else {
                            capturedPawn = simulatedBoard[move.row - 1][move.col];
                            simulatedBoard[move.row - 1][move.col] = {};
                        }
                        simulatedBoard[move.row][move.col] = piece;
                        simulatedBoard[row][col] = {};
                    } else {
                        simulatedBoard[move.row][move.col] = piece;
                        simulatedBoard[row][col] = {};
                    }
                    let simulatedKingLocation = findKingPosition(simulatedBoard, playerTurn);
                    if (!isSquareThreatened(simulatedKingLocation.row, simulatedKingLocation.col, simulatedBoardHistory)) {
                        simulatedBoard[row][col] = piece;
                        simulatedBoard[move.row][move.col] = simulatedMove;
                        return false;
                    }
                    simulatedBoard[row][col] = piece;
                    simulatedBoard[move.row][move.col] = simulatedMove;
                    if (capturedPawn) {
                        if (piece.color === 'white') {
                            simulatedBoard[move.row + 1][move.col] = capturedPawn;
                        } else {
                            simulatedBoard[move.row - 1][move.col] = capturedPawn;
                        }
                    }
                }
            }
        }
    }
    if (!isSquareThreatened(kingLocation.row, kingLocation.col, simulatedBoardHistory)) {
        return false;
    }
    return true;
}

function deepCopyBoard(_board) {
    let newBoard = [];
    for (let row = 0; row < _board.length; row++) {
        let newRow = [];
        for (let col = 0; col < _board[row].length; col++) {
            let square = _board[row][col];
            let newSquare = {};
            if (square.type !== undefined) {
                newSquare.type = square.type;
            }
            if (square.color !== undefined) {
                newSquare.color = square.color;
            }
            newRow.push(newSquare);
        }
        newBoard.push(newRow);
    }
    return newBoard;
}

function deepCopyBoardHistory(boardHistory) {
    let newBoardHistory = [];
    for (let i = 0; i < boardHistory.length; i++) {
        let history = boardHistory[i];
        let newHistory = {
            board: deepCopyBoard(history.board),
            playerTurn: history.playerTurn,
            whiteKingCastleStatus: history.whiteKingCastleStatus,
            whiteQueenCastleStatus: history.whiteQueenCastleStatus,
            blackKingCastleStatus: history.blackKingCastleStatus,
            blackQueenCastleStatus: history.blackQueenCastleStatus,
            enPassant: history.enPassant,
            halfMoveClock: history.halfMoveClock,
            fullMoveClock: history.fullMoveClock
        };
        newBoardHistory.push(newHistory);
    }
    return newBoardHistory;
}
// build a test

//splice is not removing 3, 3 from the broken board
function spliceSelfCheckingMoves(simulatedPiece, _pieceRow, _pieceCol, _moveArray, boardHistory) {
    let splicedMoveArray = [];
    let simulatedBoardHistory = deepCopyBoardHistory(boardHistory);
    let simulatedBoard = simulatedBoardHistory[simulatedBoardHistory.length - 1].board;
    let enPassantCapture = simulatedBoardHistory[simulatedBoardHistory.length - 1].enPassant;
    if (!_moveArray) {
        return;
    }
    let kingPosition = findKingPosition(simulatedBoard, simulatedBoardHistory[simulatedBoardHistory.length - 1].playerTurn);
    if (!kingPosition) {
        return _moveArray;
    }
    for (let i = 0; i < _moveArray.length; i++) {
        let testedMove = _moveArray[i];
        let testedSquare = simulatedBoard[testedMove.row][testedMove.col];
        let capturedPawn = null;
        if (enPassantCapture &&
            enPassantCapture.row === testedMove.row &&
            enPassantCapture.col === testedMove.col &&
            simulatedPiece.type === 'pawn') {
            if (simulatedPiece.color === 'white') {
                capturedPawn = simulatedBoard[testedMove.row + 1][testedMove.col];
                simulatedBoard[testedMove.row + 1][testedMove.col] = {};
            } else {
                capturedPawn = simulatedBoard[testedMove.row - 1][testedMove.col];
                simulatedBoard[testedMove.row - 1][testedMove.col] = {};
            }
            simulatedBoard[testedMove.row][testedMove.col] = simulatedPiece;
            simulatedBoard[_pieceRow][_pieceCol] = {};
        } else {
            simulatedBoard[testedMove.row][testedMove.col] = simulatedPiece;
            simulatedBoard[_pieceRow][_pieceCol] = {};
        }
        let kingPosition2 = findKingPosition(simulatedBoard, simulatedBoardHistory[simulatedBoardHistory.length - 1].playerTurn);
        let kingPosition3 = findKingPosition(simulatedBoard, simulatedBoardHistory[simulatedBoardHistory.length - 1].playerTurn);
        if (!isSquareThreatened(kingPosition2.row, kingPosition3.col, simulatedBoardHistory)) {
            simulatedBoard[_pieceRow][_pieceCol] = simulatedPiece;
            simulatedBoard[testedMove.row][testedMove.col] = testedSquare;
            splicedMoveArray.push(testedMove);
        }
        simulatedBoard[testedMove.row][testedMove.col] = testedSquare;
        simulatedBoard[_pieceRow][_pieceCol] = simulatedPiece;
        if (capturedPawn) {
            if (simulatedPiece.color === 'white') {
                simulatedBoard[testedMove.row + 1][testedMove.col] = capturedPawn;
            } else {
                simulatedBoard[testedMove.row - 1][testedMove.col] = capturedPawn;
            }
        }
    }
    return splicedMoveArray;
}

function areBoardsEqual(_board1, _board2) {
    if (_board1.length !== _board2.length) {
        return false;
    }
    for (let i = 0; i < _board1.length; i++) {
        if (_board1[i].length !== _board2[i].length) {
            return false;
        }
        for (let j = 0; j < _board1[i].length; j++) {
            let square1 = _board1[i][j];
            let square2 = _board2[i][j];
            if ((!square1 && square2) || (square1 && !square2)) {
                return false;
            }
            if (square1 && square2 && (square1.type !== square2.type || square1.color !== square2.color)) {
                return false;
            }
        }
    }
    return true;
}

function threefoldRepetitionCheck(_boardHistory) {
    if (_boardHistory.length < 3) {
        return false;
    }
    for (let i = 0; i < _boardHistory.length; i++) {
        let distinctCountIdenticalBoard = 1;
        for (let j = i + 1; j < _boardHistory.length; j++) {
            if (areBoardsEqual(_boardHistory[i].board, _boardHistory[j].board) &&
                _boardHistory[i].whiteKingCastleStatus === _boardHistory[j].whiteKingCastleStatus &&
                _boardHistory[i].whiteQueenCastleStatus === _boardHistory[j].whiteQueenCastleStatus &&
                _boardHistory[i].blackKingCastleStatus === _boardHistory[j].blackKingCastleStatus &&
                _boardHistory[i].blackQueenCastleStatus === _boardHistory[j].blackQueenCastleStatus &&
                _boardHistory[i].enPassant === _boardHistory[j].enPassant) {
                distinctCountIdenticalBoard++;
            }
            if (distinctCountIdenticalBoard === 3) {
                return true;
            }
        }
    }
    return false;
}

function isGameInDraw(boardHistory) {
    if (threefoldRepetitionCheck(boardHistory)) {
        return true;
    }
    if (isStalemate(boardHistory)) {
        return true;
    }
    if (boardHistory[boardHistory.length - 1].halfMoveClock === 100) {
        return true;
    }
    return false;
}

function isStalemate(boardHistory) {
    let simulatedBoardHistory = deepCopyBoardHistory(boardHistory);
    let simulatedBoard = simulatedBoardHistory[simulatedBoardHistory.length - 1].board;
    let allPlayerMoves = [];
    let latestBoard = boardHistory[boardHistory.length - 1];
    for (let row = 0; row < simulatedBoard.length; row++) {
        for (let col = 0; col < simulatedBoard[row].length; col++) {
            let piece = simulatedBoard[row][col];
            if (piece.color === boardHistory[boardHistory.length - 1].playerTurn && piece.type !== undefined) {
                let moves = spliceSelfCheckingMoves(piece, row, col, validMoves(piece, row, col, simulatedBoardHistory), boardHistory);
                for (let i = 0; i < moves.length; i++) {
                    allPlayerMoves.push(moves[i]);
                }
            }
        }
    }
    if (allPlayerMoves.length === 0
        &&
        !isSquareThreatened(findKingPosition(latestBoard.board, latestBoard.playerTurn).row, findKingPosition(latestBoard.board, latestBoard.playerTurn).col, boardHistory)
    ) {
        return true;
    }
    return false;
}

function legalMoves(boardHistory) {
    let currentPlayerTurn = boardHistory[boardHistory.length - 1].playerTurn;
    let currentBoard = boardHistory[boardHistory.length - 1].board;
    let playerMoves = [];
    function processPieceMoves(piece, row, col) {
        let pieceMoves = legalMovesPerPiece(piece, row, col, boardHistory);
        //board is correct up to here dude
        if (pieceMoves.length > 0) {
            for (let move of pieceMoves) {
                playerMoves.push(move);
            }
        }

    }
    function iterateBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let square = currentBoard[row][col];
                if (square.type && square.color === currentPlayerTurn) {
                    processPieceMoves(square, row, col);
                }
            }
        }
    }
    iterateBoard();
    return playerMoves;
}

function legalMovesPerPiece(piece, fromRow, fromCol, boardHistory) {
    let currentBoardState = deepCopyBoardHistory(boardHistory);
    let validMovesForPiece = validMoves(piece, fromRow, fromCol, currentBoardState);
    let legalMovesForPiece = spliceSelfCheckingMoves(piece, fromRow, fromCol, validMovesForPiece, currentBoardState);
    let moves = [];
    for (let i = 0; i < legalMovesForPiece.length; i++) {
        let move = legalMovesForPiece[i];
        moves.push({
            piece: piece.type,
            fromRow: fromRow,
            fromCol: fromCol,
            toRow: move.row,
            toCol: move.col,
            promotion: move.promotion
        });
    }
    return moves;
}

function playMove(boardHistory, move) {
    let copyBoardHistory = deepCopyBoardHistory(boardHistory);
    movePiece(move.fromRow, move.fromCol, move.toRow, move.toCol, copyBoardHistory, move.promotion);
    return copyBoardHistory;
}




function drawGame() {
    let latestBoardHistory = boardHistory[boardHistory.length - 1];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(boardHistory[boardHistory.length - 1].board);
    if (whitePawnPromotion || blackPawnPromotion) {
        bannerFilm();
        drawPawnPromotionBanner();
    }
};
setInterval(drawGame, 16);


//you need to test isKingInCheckmate for en passant'ing out of check

function updateGameStatus() {
    let latest = boardHistory[boardHistory.length - 1];
    let kingPos = findKingPosition(latest.board, latest.playerTurn);

    if (isKingInCheckmate(boardHistory)) {
        gameStatus = "checkmate";
        console.log(invertCurrentPlayerTurn(boardHistory) + " won!");
    } else if (isGameInDraw(boardHistory)) {
        gameStatus = "draw";
        console.log("Game has ended in a draw!");
    } else if (kingPos && isSquareThreatened(kingPos.row, kingPos.col, boardHistory)) {
        gameStatus = "check";
        console.log(latest.playerTurn + ' is in check!');
    } else {
        gameStatus = "active";
    }
}