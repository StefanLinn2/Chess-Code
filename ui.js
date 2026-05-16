// ui.js - Graphics and Rendering logic

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

let whitePawnPromotionBanner = { x: 320, y: 0, w: 1280, h: 320 };
let blackPawnPromotionBanner = { x: 320, y: 320, w: 1280, h: 320 };

function drawSquare(block, row, col) {
    let squareX = col * block;
    let squareY = row * block;
    if ((row + col) % 2 === 0) {
        ctx.drawImage(boardGraphics, 483, 114, 72, 72, squareX, squareY, block, block);
    } else {
        ctx.drawImage(boardGraphics, 483, 19, 72, 72, squareX, squareY, block, block);
    }
}

function drawPiece(type, color, squareX, squareY) {
    let currentPiece = pieceSprites.find(p => p.type === type && p.color === color);
    if (currentPiece) {
        ctx.drawImage(piecesGraphics, currentPiece.x, currentPiece.y, currentPiece.w, currentPiece.h, squareX, squareY, block, block);
    }
}

function drawBoard(_board) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = _board[row][col];
            let squareX = col * block;
            let squareY = row * block;
            drawSquare(block, row, col);
            if (square.type) {
                drawPiece(square.type, square.color, squareX, squareY);
            }
        }
    }
    if (selectedSquare) {
        highlightPiece(selectedSquare.row, selectedSquare.col);
        let moves = spliceSelfCheckingMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, validMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, boardHistory), boardHistory);
        let highlightedSquares = new Set();
        for (let move of moves) {
            let squareKey = `${move.row},${move.col}`;
            if (highlightedSquares.has(squareKey)) continue;
            highlightedSquares.add(squareKey);

            let targetSquare = _board[move.row][move.col];
            if (targetSquare.type && targetSquare.color != boardHistory[boardHistory.length - 1].playerTurn) {
                highlightEnemyPiece(move.row, move.col);
            } else {
                highlightValidMoves(move.row, move.col);
            }
        }
    }
}

function highlightPiece(row, col) {
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35)';
    ctx.fillRect(col * block, row * block, block, block);
}

function highlightValidMoves(row, col) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35)';
    ctx.arc(col * block + block / 2, row * block + block / 2, block / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function highlightEnemyPiece(row, col) {
    let x = col * block, y = row * block, q = block / 4;
    ctx.fillStyle = 'rgba(144, 238, 144, 0.35)';
    // Corner marks logic
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + q, y); ctx.lineTo(x, y + q); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + block, y); ctx.lineTo(x + block - q, y); ctx.lineTo(x + block, y + q); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y + block); ctx.lineTo(x + q, y + block); ctx.lineTo(x, y + block - q); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + block, y + block); ctx.lineTo(x + block - q, y + block); ctx.lineTo(x + block, y + block - q); ctx.fill();
}

function bannerFilm() {
    if (whitePawnPromotion || blackPawnPromotion) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawPawnPromotionBanner() {
    if (whitePawnPromotion) {
        ctx.drawImage(piecesGraphics, whitePawnPromotionBanner.x, whitePawnPromotionBanner.y, whitePawnPromotionBanner.w, whitePawnPromotionBanner.h, 0, 3 * block, canvas.width, 2 * block);
    }
    if (blackPawnPromotion) {
        ctx.drawImage(piecesGraphics, blackPawnPromotionBanner.x, blackPawnPromotionBanner.y, blackPawnPromotionBanner.w, blackPawnPromotionBanner.h, 0, 3 * block, canvas.width, 2 * block);
    }
}
