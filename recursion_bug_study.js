const canvas = document.createElement('canvas');
canvas.width = canvas.height = 700;
canvas.style.border = '1px solid black';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
const boardGraphics = new Image();
boardGraphics.src = "./chessboard.png";
const piecesGraphics = new Image();
piecesGraphics.src = './chesspieces.png';

let block = canvas.width / 8;

let currentPlayerTurn = 'white';
function switchPlayerTurn() {
    if (currentPlayerTurn === 'white') {
        currentPlayerTurn = 'black';
    } else {
        currentPlayerTurn = 'white';
    }
}

function invertedCurrentPlayerTurn() {
    if (currentPlayerTurn === 'white') {
        return 'black';
    } else {
        return 'white';
    }
}

let board = [
    [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
    [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
    [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
];

//tester board
// [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, {}, { type: 'knight', color: 'black' }, {}],
// [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, {}, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, {}],
// [{}, {}, {}, {}, { type: 'pawn', color: 'black' }, {}, {}, { type: 'pawn', color: 'black' }],
// [{}, {}, {}, {}, {}, {}, {}, {}],
// [{ type: 'pawn', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'rook', color: 'white' }, {}, { type: 'pawn', color: 'white' }, {}, {}, {}],
// [{ type: 'pawn', color: 'white' }, {}, {}, { type: 'pawn', color: 'white' }, { type: 'rook', color: 'black' }, {}, {}, {}],
// [{}, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, {}, {}, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
// [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
// ];

function drawSquare(block, row, col) {
    let squareX = col * block;
    let squareY = row * block;
    if ((row + col) % 2 === 0) {
        ctx.drawImage(
            boardGraphics,
            483,
            114,
            72,
            72,
            squareX,
            squareY,
            block,
            block);
    } else {
        ctx.drawImage(boardGraphics,
            483,
            19,
            72,
            72,
            squareX,
            squareY,
            block,
            block);
    }
}

let pieceSprites = [
    { type: 'pawn', color: 'white', x: 1600, y: 0, w: 320, h: 320 },
    { type: 'rook', color: 'white', x: 1280, y: 0, w: 320, h: 320 },
    { type: 'knight', color: 'white', x: 960, y: 0, w: 320, h: 320 },
    { type: 'bishop', color: 'white', x: 640, y: 0, w: 320, h: 320 },
    { type: 'queen', color: 'white', x: 320, y: 0, w: 320, h: 320 },
    { type: 'king', color: 'white', x: 0, y: 0, w: 320, h: 320 },
    { type: 'pawn', color: 'black', x: 1600, y: 320, w: 320, h: 320 },
    { type: 'rook', color: 'black', x: 1280, y: 320, w: 320, h: 320 },
    { type: 'knight', color: 'black', x: 960, y: 320, w: 320, h: 320 },
    { type: 'bishop', color: 'black', x: 640, y: 320, w: 320, h: 320 },
    { type: 'queen', color: 'black', x: 320, y: 320, w: 320, h: 320 },
    { type: 'king', color: 'black', x: 0, y: 320, w: 320, h: 320 },
];

function drawPiece(type, color, squareX, squareY) {
    let currentPiece = null;
    for (let i = 0; i < pieceSprites.length; i++) {
        if (pieceSprites[i].type === type && pieceSprites[i].color === color) {
            currentPiece = pieceSprites[i];
            break
        }
    }
    if (currentPiece) {
        ctx.drawImage(piecesGraphics,
            currentPiece.x,
            currentPiece.y,
            currentPiece.w,
            currentPiece.h,
            squareX,
            squareY,
            block,
            block);
    }
}

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = board[row][col];
            let squareX = col * block;
            let squareY = row * block;
            drawSquare(block, row, col);
            if (square.type) {
                drawPiece(square.type, square.color, squareX, squareY);
            }
        }
    }
    if (!selectedSquare) {
        return;
    }
    if (selectedSquare !== null) {
        highlightPiece(selectedSquare.row, selectedSquare.col)
    }
    let moves = validMoves(board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col);
    if (moves.length === 0) {
        return;
    }
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let targetSquare = board[move.row][move.col];
        if (targetSquare.type && targetSquare.color != currentPlayerTurn) {
            highlightEnemyPiece(move.row, move.col);
        } else {
            highlightValidMoves(move.row, move.col);
        }
    }
}

function highlightPiece(row, col) {
    let x = col * block;
    let y = row * block;
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35)';
    ctx.fillRect(x, y, block, block);
}

function highlightValidMoves(row, col) {
    let x = col * block + block / 2;
    let y = row * block + block / 2;
    let radius = block / 4;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35';
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function highlightEnemyPiece(row, col) {
    let x = col * block;
    let y = row * block;
    let quarterBlock = block / 4;
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35)';

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + quarterBlock, y);
    ctx.lineTo(x, y + quarterBlock);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + block, y);
    ctx.lineTo(x + block - quarterBlock, y);
    ctx.lineTo(x + block, y + quarterBlock);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y + block);
    ctx.lineTo(x + quarterBlock, y + block);
    ctx.lineTo(x, y + block - quarterBlock);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + block, y + block);
    ctx.lineTo(x + block - quarterBlock, y + block);
    ctx.lineTo(x + block, y + block - quarterBlock);
    ctx.closePath();
    ctx.fill();
}

let selectedSquare = null;
canvas.addEventListener('click', function (event) {
    let col = Math.floor(event.offsetX / block);
    let row = Math.floor(event.offsetY / block);
    let square = board[row][col];
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        selectedSquare = null;

    } else if (square.type && ((currentPlayerTurn === 'white' && square.color === 'white') || (currentPlayerTurn === 'black' && square.color === 'black'))) {
        selectedSquare = { row: row, col: col };
    } else if (selectedSquare) {
        let moves = validMoves(board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col);
        let isValidMove = false;
        for (let i = 0; i < moves.length; i++){
            if (moves[i].row === row && moves[i].col === col){
                isValidMove = true;
                break;
            }
        }
        if (isValidMove){
            movePiece(selectedSquare.row, selectedSquare.col, row, col);
            selectedSquare = null;
            switchPlayerTurn();
        }
        else {
            selectedSquare = null;
        }
    }
}
);

function movePiece(startRow, startCol, endRow, endCol) {
    let piece = board[startRow][startCol];
    let capturedPiece = null;
    if (board[endRow][endCol].type) {
        capturedPiece = board[endRow][endCol];
    }
    board[endRow][endCol] = piece;
    board[startRow][startCol] = {};
    return capturedPiece;
}

let previousMoves = [];

function validMoves(piece, row, col) {
    if (piece.type === 'pawn') {
        return validPawnMoves(piece, row, col);
    }
    if (piece.type === 'rook') {
        return validRookMoves(piece, row, col);
    }
    if (piece.type === 'knight') {
        return validKnightMoves(piece, row, col);
    }
    if (piece.type === 'bishop') {
        return validBishopMoves(piece, row, col);
    }
    if (piece.type === 'queen') {
        return validQueenMoves(piece, row, col);
    }
    if (piece.type === 'king') {
        return validKingMoves(piece, row, col);
    }
}

function validPawnMoves(piece, currentRow, currentCol) {
    let moves = [];
    let direction;
    if (piece.color === 'white') {
        direction = -1;
    } else {
        direction = 1;
    }
    if (!board[currentRow + direction][currentCol].type) {
        moves.push({ row: currentRow + direction, col: currentCol });
        if ((piece.color === 'white' && currentRow === 6) || (piece.color === 'black' && currentRow === 1)) {
            if (!board[currentRow + 2 * direction][currentCol].type) {
                moves.push({ row: currentRow + 2 * direction, col: currentCol });
            }
        }
    }
    if (currentCol > 0 && board[currentRow + direction][currentCol - 1].type &&
        board[currentRow + direction][currentCol - 1].color !== piece.color) {
        moves.push({ row: currentRow + direction, col: currentCol - 1 });
    }
    if (currentCol < 7 && board[currentRow + direction][currentCol + 1].type &&
        board[currentRow + direction][currentCol + 1].color !== piece.color) {
        moves.push({ row: currentRow + direction, col: currentCol + 1 });
    }
    //en passant nightmare, use previousMoves [] probably
    //add last file promotion later
    return moves;
}

function validRookMoves(piece, currentRow, currentCol) {
    let moves = [];
    for (let row = currentRow - 1; row >= 0; row--) {
        if (board[row][currentCol].type) {
            if (board[row][currentCol].color !== piece.color) {
                moves.push({ row: row, col: currentCol });
            }
            break;
        }
        moves.push({ row: row, col: currentCol });
    }
    for (let row = currentRow + 1; row < 8; row++) {
        if (board[row][currentCol].type) {
            if (board[row][currentCol].color !== piece.color) {
                moves.push({ row: row, col: currentCol });
            }
            break;
        }
        moves.push({ row: row, col: currentCol });
    }
    for (let col = currentCol - 1; col >= 0; col--) {
        if (board[currentRow][col].type) {
            if (board[currentRow][col].color !== piece.color) {
                moves.push({ row: currentRow, col: col });
            }
            break;
        }
        moves.push({ row: currentRow, col: col });
    }
    for (let col = currentCol + 1; col < 8; col++) {
        if (board[currentRow][col].type) {
            if (board[currentRow][col].color !== piece.color) {
                moves.push({ row: currentRow, col: col });
            }
            break;
        }
        moves.push({ row: currentRow, col: col });
    }
    return moves;
}

function validKnightMoves(piece, currentRow, currentCol) {
    let moves = [];
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
            let targetSquare = board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
}

function validBishopMoves(piece, currentRow, currentCol) {
    let moves = [];
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
            let targetSquare = board[newRow][newCol];
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

function validQueenMoves(piece, currentRow, currentCol) {
    let moves = [];
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
            let targetSquare = board[newRow][newCol];
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

function validKingMoves(piece, currentRow, currentCol, board) {
    let moves = [];
    let simulatedBoard = createSimulatedBoard(board);
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
    for (let i = 0; i < directions.length; i++) {
        let dir = directions[i];
        let newRow = currentRow + dir.row;
        let newCol = currentCol + dir.col;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let targetSquare = simulatedBoard[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                let originalPiece = simulatedBoard[newRow][newCol];
                simulatedBoard[newRow][newCol] = piece;
                simulatedBoard[currentRow][currentCol] = {};
                if (!isKingInCheck(simulatedBoard)) {
                    moves.push({ row: newRow, col: newCol });
                }
                simulatedBoard[currentRow][currentCol] = piece;
                simulatedBoard[newRow][newCol] = originalPiece;
            }
        }
    }
    return moves;
}

function findKingPosition(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let piece = board[row][col];
            if (piece.type === 'king' && piece.color === currentPlayerTurn) {
                return { row: row, col: col };
            }
        }
    }
    return null;
}

function doesPieceThreatenKing(piece, row, col, kingRow, kingCol) {
    let moves = validMoves(piece, row, col);
    for (let i = 0; i < moves.length; i++) {
        if (moves[i].row === kingRow && moves[i].col === kingCol) {
            return true;
        }
    }
    return false;
}

function isKingInCheck(board) {
    let kingPosition = findKingPosition(board);
    if (!kingPosition) {
        return false;
    }
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let piece = board[row][col];
            if (piece.color !== currentPlayerTurn && piece.type !== undefined) {
                if (doesPieceThreatenKing(piece, row, col, kingPosition.row, kingPosition.col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isKingInCheckmate() {
    let simulatedBoard = createSimulatedBoard(board);
    if (!isKingInCheck(simulatedBoard)) {
        return false;
    }
    for (let row = 0; row < simulatedBoard.length; row++) {
        for (let col = 0; col < simulatedBoard[row].length; col++) {
            let piece = simulatedBoard[row][col];
            if (piece.color === currentPlayerTurn && piece.type !== undefined) {
                let moves = validMoves(piece, row, col, simulatedBoard);
                for (let i = 0; i < moves.length; i++) {
                    let move = moves[i];
                    let originalPiece = simulatedBoard[move.row][move.col];
                    simulatedBoard[move.row][move.col] = piece;
                    simulatedBoard[row][col] = {};
                    if (!isKingInCheck(simulatedBoard)) {
                        simulatedBoard[row][col] = piece;
                        simulatedBoard[move.row][move.col] = originalPiece;
                        return false;
                    }
                    simulatedBoard[row][col] = piece;
                    simulatedBoard[move.row][move.col] = originalPiece;
                }
            }
        }
    }
    return true;
}

function createSimulatedBoard(board) {
    let simulatedBoard = [];
    for (let row = 0; row < simulatedBoard.length; row++) {
        simulatedBoard.push([]);
        for (let col = 0; col < board[row].length; col++) {
            let piece = board[row][col];
            simulatedBoard[row].push({ type: piece.type, color: piece.color });
        }
    }
    return simulatedBoard;
}

let inGameTime = 0;
function drawGame() {
    inGameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    if (isKingInCheckmate() === true) {
        console.log(invertedCurrentPlayerTurn() + " won!")
    }
};

setInterval(drawGame, 16);

//remove the option to go to places where you get checked
//en passant
//pawn promotion nightmare tooltip
//castling!!!!!!!!1!!!
//store all moves in an array
//some translator from array[blah] to actual algebraic notation