//StefanLinn2
//readers beware: spaghetti below

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

function assert(value, message) {
    if (!value) {
        throw new Error(message);
    }
}

function invertCurrentPlayerTurn() {
    if (boardHistory[boardHistory.length - 1].playerTurn === 'white') {
        return 'black';
    } else if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
        return 'white';
    } else {
        return 'you have a bug in invertCurrentPlayerTurn function';
    }
}

//fuck, these are global variables
let whiteKingHasNotMoved = true;
let blackKingHasNotMoved = true;
let whiteKingRookHasNotMoved = true;
let whiteQueenRookHasNotMoved = true;
let blackKingRookHasNotMoved = true;
let blackQueenRookHasNotMoved = true;

let selectedSquare = null;
let selectedPieceType = null;

function algorithmicToRowCol(algoString) {
    let row = null;
    let col = null;
    if (algoString[0] === 'a') {
        col = 0;
    }
    if (algoString[0] === 'b') {
        col = 1;
    }
    if (algoString[0] === 'c') {
        col = 2;
    }
    if (algoString[0] === 'd') {
        col = 3;
    }
    if (algoString[0] === 'e') {
        col = 4;
    }
    if (algoString[0] === 'f') {
        col = 5;
    }
    if (algoString[0] === 'g') {
        col = 6;
    }
    if (algoString[0] === 'h') {
        col = 7;
    }
    if (algoString[1] === '1') {
        row = 7;
    }
    if (algoString[1] === '2') {
        row = 6;
    }
    if (algoString[1] === '3') {
        row = 5;
    }
    if (algoString[1] === '4') {
        row = 4;
    }
    if (algoString[1] === '5') {
        row = 3;
    }
    if (algoString[1] === '6') {
        row = 2;
    }
    if (algoString[1] === '7') {
        row = 1;
    }
    if (algoString[1] === '8') {
        row = 0;
    }
    return { row: row, col: col }
}

function rowColToAlgorithmic(rowColObj) {
    let square = rowColObj;
    let algorithmic = '';
    if (square.col === 0) {
        algorithmic += 'a';
    }
    if (square.col === 1) {
        algorithmic += 'b';
    }
    if (square.col === 2) {
        algorithmic += 'c';
    }
    if (square.col === 3) {
        algorithmic += 'd';
    }
    if (square.col === 4) {
        algorithmic += 'e';
    }
    if (square.col === 5) {
        algorithmic += 'f';
    }
    if (square.col === 6) {
        algorithmic += 'g';
    }
    if (square.col === 7) {
        algorithmic += 'h';
    }
    if (square.row === 7) {
        algorithmic += '1';
    }
    if (square.row === 6) {
        algorithmic += '2';
    }
    if (square.row === 5) {
        algorithmic += '3';
    }
    if (square.row === 4) {
        algorithmic += '4';
    }
    if (square.row === 3) {
        algorithmic += '5';
    }
    if (square.row === 2) {
        algorithmic += '6';
    }
    if (square.row === 1) {
        algorithmic += '7';
    }
    if (square.row === 0) {
        algorithmic += '8';
    }
    return algorithmic;
}

//'rnbqkbnr/pppppppp/7r/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
function fenToBoard(_fen) {
    let boardHistory = [
    ];
    let board = [
        [], [], [], [], [], [], [], []
    ];
    let playerTurn = null;
    let whiteKingCastleStatus = false;
    let whiteQueenCastleStatus = false;
    let blackKingCastleStatus = false;
    let blackQueenCastleStatus = false;
    let enPassant = null;
    let halfMoveClock = '';
    let fullMoveClock = '';
    let rowArray = 0;
    let algoFenAdded = false;
    for (let i = 0; i < _fen.length; i++) {
        if (i < fenSpaceIndex(_fen)[0]) {
            if (_fen[i] === 'r') {
                board[rowArray].push({ type: 'rook', color: 'black' });
            }
            else if (_fen[i] === 'n') {
                board[rowArray].push({ type: 'knight', color: 'black' });
            }
            else if (_fen[i] === 'b') {
                board[rowArray].push({ type: 'bishop', color: 'black' });
            }
            else if (_fen[i] === 'q') {
                board[rowArray].push({ type: 'queen', color: 'black' });
            }
            else if (_fen[i] === 'k') {
                board[rowArray].push({ type: 'king', color: 'black' });
            }
            else if (_fen[i] === 'p') {
                board[rowArray].push({ type: 'pawn', color: 'black' });
            }
            else if (_fen[i] === 'P') {
                board[rowArray].push({ type: 'pawn', color: 'white' });
            }
            else if (_fen[i] === 'R') {
                board[rowArray].push({ type: 'rook', color: 'white' });
            }
            else if (_fen[i] === 'N') {
                board[rowArray].push({ type: 'knight', color: 'white' });
            }
            else if (_fen[i] === 'B') {
                board[rowArray].push({ type: 'bishop', color: 'white' });
            }
            else if (_fen[i] === 'Q') {
                board[rowArray].push({ type: 'queen', color: 'white' });
            }
            else if (_fen[i] === 'K') {
                board[rowArray].push({ type: 'king', color: 'white' });
            }
            else if (isNumberLike(_fen[i])) {
                for (let j = 0; j < parseInt(_fen[i]); j++) {
                    board[rowArray].push({});
                }
            }
            else if (_fen[i] === '/') {
                rowArray++;
            }
            else {
                board[rowArray].push(0);
            }
        }
        if (i > fenSpaceIndex(_fen)[0] && i < fenSpaceIndex(_fen)[1]) {
            if (_fen[i] === 'w') {
                playerTurn = 'white';
            }
            if (_fen[i] === 'b') {
                playerTurn = 'black';
            }
        }
        if (i > fenSpaceIndex(_fen)[1] && i < fenSpaceIndex(_fen)[2]) {
            for (let i = fenSpaceIndex(_fen)[1] + 1; i < fenSpaceIndex(_fen)[2]; i++) {
                if (_fen[i] === '-') {
                    break;
                }
                else if (_fen[i] === 'K') {
                    whiteKingCastleStatus = true;
                }
                else if (_fen[i] === 'Q') {
                    whiteQueenCastleStatus = true;
                }
                else if (_fen[i] === 'k') {
                    blackKingCastleStatus = true;
                }
                else if (_fen[i] === 'q') {
                    blackQueenCastleStatus = true;
                }
            }
        }
        if (i > fenSpaceIndex(_fen)[2] && i < fenSpaceIndex(_fen)[3]) {
            if (_fen[i] === '-' && !algoFenAdded) {
                enPassant = null;
                algoFenAdded = true;
            } else if (!algoFenAdded) {
                let algo = _fen[i] + _fen[i + 1];
                enPassant = algorithmicToRowCol(algo);
                algoFenAdded = true;
            }
        }
        if (i > fenSpaceIndex(_fen)[3] && i < fenSpaceIndex(_fen)[4]) {
            halfMoveClock += _fen[i];
        }
        if (i > fenSpaceIndex(_fen)[4]) {
            fullMoveClock += _fen[i];
        }
    }
    boardHistory.push(
        {
            board: board,
            playerTurn: playerTurn,
            whiteKingCastleStatus: whiteKingCastleStatus,
            whiteQueenCastleStatus: whiteQueenCastleStatus,
            blackKingCastleStatus: blackKingCastleStatus,
            blackQueenCastleStatus: blackQueenCastleStatus,
            enPassant: enPassant,
            halfMoveClock: parseInt(halfMoveClock),
            fullMoveClock: parseInt(fullMoveClock),
        })
    return boardHistory;
}

//'rnbqkbnr/pppppppp/7r/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
function boardToFen(_boardHistory) {
    let fen = '';
    for (let i = 0; i < _boardHistory.board.length; i++) {
        counter = 0;
        for (let j = 0; j < 8; j++) {
            if (_boardHistory.board[i][j].type) {
                if (counter > 0) {
                    fen += counter;
                    counter = 0
                }
                if (_boardHistory.board[i][j].type === 'rook' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'r';
                }
                if (_boardHistory.board[i][j].type === 'knight' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'n';
                }
                if (_boardHistory.board[i][j].type === 'bishop' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'b';
                }
                if (_boardHistory.board[i][j].type === 'queen' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'q';
                }
                if (_boardHistory.board[i][j].type === 'king' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'k';
                }
                if (_boardHistory.board[i][j].type === 'pawn' && _boardHistory.board[i][j].color === 'black') {
                    fen += 'p';
                }
                if (_boardHistory.board[i][j].type === 'rook' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'R';
                }
                if (_boardHistory.board[i][j].type === 'knight' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'N';
                }
                if (_boardHistory.board[i][j].type === 'bishop' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'B';
                }
                if (_boardHistory.board[i][j].type === 'queen' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'Q';
                }
                if (_boardHistory.board[i][j].type === 'king' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'K';
                }
                if (_boardHistory.board[i][j].type === 'pawn' && _boardHistory.board[i][j].color === 'white') {
                    fen += 'P';
                }
            }
            if (!_boardHistory.board[i][j].type) {
                counter++;
            }
        }
        if (counter > 0) {
            fen += counter;
        }
        if (i < _boardHistory.board.length - 1) {
            fen = fen + '/';
        }
    }
    fen += ' ';
    if (_boardHistory.playerTurn === 'white') {
        fen += 'w';
    }
    else if (_boardHistory.playerTurn === 'black') {
        fen += 'b';
    }
    fen += ' ';
    let anyCastlingRights = false;
    if (_boardHistory.whiteKingCastleStatus) {
        fen += 'K';
        anyCastlingRights = true;
    }
    if (_boardHistory.whiteQueenCastleStatus) {
        fen += 'Q';
        anyCastlingRights = true;
    }
    if (_boardHistory.blackKingCastleStatus) {
        fen += 'k';
        anyCastlingRights = true;
    }
    if (_boardHistory.blackQueenCastleStatus) {
        fen += 'q';
        anyCastlingRights = true;
    }
    if (!anyCastlingRights) {
        fen += '-';
    }
    fen += ' ';
    if (_boardHistory.enPassant) {
        let algo = rowColToAlgorithmic(_boardHistory.enPassant);
        fen += algo;
    } else {
        fen += '-';
    }
    fen += ' ';
    fen += _boardHistory.halfMoveClock;
    fen += ' ';
    fen += _boardHistory.fullMoveClock;
    return fen;
}

function fenSpaceIndex(_fen) {
    let spaceIndex = [];
    for (let i = 0; i < _fen.length; i++) {
        if (_fen[i] === ' ') {
            spaceIndex.push(i);
        }
    }
    return spaceIndex;
}

function isNumberLike(_string) {
    return _string === parseInt(_string).toString();
}

//testerinitialboard
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

let boardHistory = fenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

let board = deepCopyBoard(boardHistory[boardHistory.length - 1].board);

// let board = [
//     [{}, {}, {}, {}, {}, {}, {}, { type: 'king', color: 'black' }],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, { type: 'queen', color: 'black' }, {}],
//     [{}, {}, {}, {}, {}, {}, { type: 'queen', color: 'white' }, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{ type: 'king', color: 'white' }, {}, {}, {}, {}, {}, {}, {}],
// ];
//stalemate check^

// let enPassantTestBoard = [
//     [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
//     [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{}, {}, {}, {}, {}, {}, {}, {}],
//     [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'black' }],
//     [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
// ];
//this is a fake board^^^

let blackPawnCheckingWhiteKing = [
    [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
    [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
    [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
];

let blackKnightCheckingWhiteKing = [
    [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
    [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'knight', color: 'white' }, { type: 'pawn', color: 'black' }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'knight', color: 'black' }, { type: 'pawn', color: 'white' }],
    [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
];

let blackQueenCheckingWhiteKing = [
    [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
    [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'queen', color: 'white' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'queen', color: 'black' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
    [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }]
];

let fourStepCheckmateForBlack = [
    [{ "type": "rook", "color": "black" }, { "type": "knight", "color": "black" }, { "type": "bishop", "color": "black" }, {}, { "type": "king", "color": "black" }, {}, { "type": "knight", "color": "black" }, { "type": "rook", "color": "black" }],
    [{ "type": "pawn", "color": "black" }, { "type": "pawn", "color": "black" }, { "type": "pawn", "color": "black" }, { "type": "pawn", "color": "black" }, {}, { "type": "pawn", "color": "black" }, { "type": "pawn", "color": "black" }, { "type": "pawn", "color": "black" }],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, { "type": "bishop", "color": "black" }, {}, { "type": "pawn", "color": "black" }, {}, {}, {}],
    [{ "type": "pawn", "color": "white" }, {}, {}, {}, {}, {}, {}, {}],
    [{ "type": "knight", "color": "white" }, {}, {}, {}, {}, {}, {}, { "type": "pawn", "color": "white" }],
    [{}, { "type": "pawn", "color": "white" }, { "type": "pawn", "color": "white" }, { "type": "pawn", "color": "white" }, { "type": "pawn", "color": "white" }, { "type": "queen", "color": "black" }, { "type": "pawn", "color": "white" }, {}],
    [{ "type": "rook", "color": "white" }, {}, { "type": "bishop", "color": "white" }, { "type": "queen", "color": "white" }, { "type": "king", "color": "white" }, { "type": "bishop", "color": "white" }, { "type": "knight", "color": "white" }, { "type": "rook", "color": "white" }]
]

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

let whitePawnPromotionBanner = { x: 320, y: 0, w: 1280, h: 320 };
let blackPawnPromotionBanner = { x: 320, y: 320, w: 1280, h: 320 };
let promotionSelected = false;
let whitePawnPromotion = false;
let blackPawnPromotion = false;

function drawPawnPromotionBanner() {
    if (whitePawnPromotion) {
        ctx.drawImage(piecesGraphics,
            whitePawnPromotionBanner.x,
            whitePawnPromotionBanner.y,
            whitePawnPromotionBanner.w,
            whitePawnPromotionBanner.h,
            0,
            3 * block,
            canvas.width,
            2 * block,
        )
    }
    if (blackPawnPromotion) {
        ctx.drawImage(piecesGraphics,
            blackPawnPromotionBanner.x,
            blackPawnPromotionBanner.y,
            blackPawnPromotionBanner.w,
            blackPawnPromotionBanner.h,
            0,
            3 * block,
            canvas.width,
            2 * block,
        )
    }
}

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
    if (!selectedSquare) {
        return;
    }
    if (selectedSquare !== null) {
        highlightPiece(selectedSquare.row, selectedSquare.col)
    }
    //add logic for highlighting en passant capture, poss refactor
    let moves = spliceSelfCheckingMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, validMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, board));
    if (moves.length === 0) {
        return;
    }
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let targetSquare = _board[move.row][move.col];
        if (targetSquare.type && targetSquare.color != boardHistory[boardHistory.length - 1].playerTurn) {
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

function bannerFilm() {
    if (whitePawnPromotion || blackPawnPromotion) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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

function findPawnInEndRow(_board) {
    if (whitePawnPromotion) {
        for (let col = 0; col < _board[0].length; col++) {
            let piece = _board[0][col];
            if (piece.type === 'pawn' && piece.color === boardHistory[boardHistory.length - 1].playerTurn) {
                return { row: 0, col: col };
            }
        }
    }
    if (blackPawnPromotion) {
        for (let col = 0; col < _board[7].length; col++) {
            let piece = _board[7][col];
            if (piece.type === 'pawn' && piece.color === boardHistory[boardHistory.length - 1].playerTurn) {
                return { row: 7, col: col };
            }
        }
    }
    return null;
}

function pawnPromotion() {
    if (whitePawnPromotion || blackPawnPromotion) {
        return true;
    }
    return false;
}

function onClick(event) {
    let _board = boardHistory[boardHistory.length - 1].board;
    let col = Math.floor(event.offsetX / block);
    let row = Math.floor(event.offsetY / block);
    let square = _board[row][col];
    if (pawnPromotion()) {
        let pawnRow = findPawnInEndRow(board).row;
        let pawnCol = findPawnInEndRow(board).col;
        if (row === 3 || row === 4) {
            if (col === 0 || col === 1) {
                board[pawnRow][pawnCol] = { type: 'queen', color: boardHistory[boardHistory.length - 1].playerTurn };
                whitePawnPromotion = false;
                blackPawnPromotion = false;
            }
            if (col === 2 || col === 3) {
                board[pawnRow][pawnCol] = { type: 'bishop', color: boardHistory[boardHistory.length - 1].playerTurn };
                whitePawnPromotion = false;
                blackPawnPromotion = false;
            }
            if (col === 4 || col === 5) {
                board[pawnRow][pawnCol] = { type: 'knight', color: boardHistory[boardHistory.length - 1].playerTurn };
                whitePawnPromotion = false;
                blackPawnPromotion = false;
            }
            if (col === 6 || col === 7) {
                board[pawnRow][pawnCol] = { type: 'rook', color: boardHistory[boardHistory.length - 1].playerTurn };
                whitePawnPromotion = false;
                blackPawnPromotion = false;
            }
            pushBoardHistory(null);
        }
    }
    else if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
        selectedSquare = null;
    } else if (square.type && boardHistory[boardHistory.length - 1].playerTurn === square.color) {
        selectedSquare = { row: row, col: col };
        selectedPieceType = square.type;
    } else if (selectedSquare) {
        let validDestinations = spliceSelfCheckingMoves(_board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, validMoves(board[selectedSquare.row][selectedSquare.col], selectedSquare.row, selectedSquare.col, board));
        let isDestinationValid = false;
        for (let i = 0; i < validDestinations.length; i++) {
            if (validDestinations[i].row === row && validDestinations[i].col === col) {
                isDestinationValid = true;
                break;
            }
        }
        if (isDestinationValid) {
            // let enPassantSquare = returnEnPassantSquare(piece, );
            // if (enPassantSquare && selectedPieceType === 'pawn') {
            //     let lastMove = moveHistory[moveHistory.length - 1];
            //     let behindRow = (boardHistory[boardHistory.length - 1].playerTurn === 'white') ? 2 : 5;
            //     if (row === behindRow && col === lastMove.to.col) {
            //         board[lastMove.to.row][lastMove.to.col] = {};
            //     }
            // }
            let piece = _board[selectedSquare.row][selectedSquare.col];
            let fromRow = selectedSquare.row;
            let fromCol = selectedSquare.col;
            movePiece(selectedSquare.row, selectedSquare.col, row, col);
            selectedSquare = null;
            if (!pawnPromotion()) {
                if (piece.type === 'pawn') {
                    let epsq = returnEnPassantSquare(piece, fromRow, row, fromCol);
                    console.log(epsq);
                    pushBoardHistory(epsq);
                } else {
                    pushBoardHistory(null)
                }
            }
        }
        else {
            selectedSquare = null;
        }
    }
}

canvas.addEventListener('click', onClick);

function pushBoardHistory(epsq) {
    let fullMoveModifier = 0;
    let halfMoveModifier = 0;
    if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
        fullMoveModifier = 1;
    }
    else {
        fullMoveModifier = 0;
    }
    if (capturedPieceStatus || pawnHasMovedStatus) {
        halfMoveModifier = 0;
    }
    else {
        halfMoveModifier = boardHistory[boardHistory.length - 1].halfMoveClock + 1;
    }
    boardHistory.push(
        {
            board: deepCopyBoard(board),
            playerTurn: invertCurrentPlayerTurn(),
            whiteKingCastleStatus: castlingRightsWhiteKingSide(boardHistory),
            whiteQueenCastleStatus: castlingRightsWhiteQueenSide(boardHistory),
            blackKingCastleStatus: castlingRightsBlackKingSide(boardHistory),
            blackQueenCastleStatus: castlingRightsBlackQueenSide(boardHistory),
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
//don't freak out, but if you run this function after pushBoardHistory, it will appear wrong, but it's cuz this actually gets called before boardHistory's latest entry
//you should do boardHistory[boardHistory length - 2] when you want to call it after pushBoardHistory
//you should probably fix this to take in a parameter of the player turn properly

let pawnHasMovedStatus = null;
// global variable
// this function below is creating global variables.
function movePiece(startRow, startCol, endRow, endCol) {
    let endSquare = board[endRow][endCol];
    if (endSquare.type && endSquare.color !== boardHistory[boardHistory.length - 1].playerTurn) {
        capturedPieceStatus = true;
    } else {
        capturedPieceStatus = false;
    }
    let piece = board[startRow][startCol];
    if (piece.type === 'pawn') {
        pawnHasMovedStatus = true;
    } else {
        pawnHasMovedStatus = false;
    }
    if (piece.type === 'king' && (endCol - startCol === 2)) {
        if (boardHistory[boardHistory.length - 1].playerTurn === 'white') {
            board[endRow][endCol] = piece;
            board[7][7] = {};
            board[7][5] = { type: 'rook', color: 'white' };
            board[startRow][startCol] = {};
        }
        if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
            board[endRow][endCol] = piece;
            board[0][7] = {};
            board[0][5] = { type: 'rook', color: 'black' };
            board[startRow][startCol] = {};
        }
    } else if (piece.type === 'king' && (endCol - startCol === -2)) {
        if (boardHistory[boardHistory.length - 1].playerTurn === 'white') {
            board[endRow][endCol] = piece;
            board[7][0] = {};
            board[7][3] = { type: 'rook', color: 'white' };
            board[startRow][startCol] = {};
        }
        if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
            board[endRow][endCol] = piece;
            board[0][0] = {};
            board[0][3] = { type: 'rook', color: 'black' };
            board[startRow][startCol] = {};
        }
    } else {
        board[endRow][endCol] = piece;
        board[startRow][startCol] = {};
    }
    if (piece.type === 'king') {
        piece.color === 'white' ? whiteKingHasNotMoved = false : blackKingHasNotMoved = false;
    }
    if (piece.type === 'rook') {
        if (whiteQueenRookHasNotMoved && piece.color === 'white' && startCol === 0) {
            whiteQueenRookHasNotMoved = false;
        }
        if (whiteKingRookHasNotMoved && piece.color === 'white' && startCol === 7) {
            whiteKingRookHasNotMoved = false;
        }
        if (blackQueenRookHasNotMoved && piece.color === 'black' && startCol === 0) {
            blackQueenRookHasNotMoved = false;
        }
        if (blackKingRookHasNotMoved && piece.color === 'black' && startCol === 7) {
            blackKingRookHasNotMoved = false;
        }
    }
    if (piece.type === 'pawn') {
        if (piece.color === 'white' && endRow === 0) {
            whitePawnPromotion = true;
        }
        if (piece.color === 'black' && endRow === 7) {
            blackPawnPromotion = true;
        }
    }
}

function validMoves(piece, row, col, _board) {
    if (piece.type === 'pawn') {
        return validPawnMoves(piece, row, col, _board);
    }
    if (piece.type === 'rook') {
        return validRookMoves(piece, row, col, _board);
    }
    if (piece.type === 'knight') {
        return validKnightMoves(piece, row, col, _board);
    }
    if (piece.type === 'bishop') {
        return validBishopMoves(piece, row, col, _board);
    }
    if (piece.type === 'queen') {
        return validQueenMoves(piece, row, col, _board);
    }
    if (piece.type === 'king') {
        return validKingMoves(piece, row, col, _board);
    }
}

function validPawnMoves(piece, currentRow, currentCol, _board, espq) {
    let moves = [];
    let direction = (piece.color === 'white') ? -1 : 1;
    if ((piece.color === 'white' && currentRow === 0) || (piece.color === 'black' && currentRow === 7)) {
        return moves;
    }
    if (!_board[currentRow + direction][currentCol].type) {
        moves.push({ row: currentRow + direction, col: currentCol });
        if ((piece.color === 'white' && currentRow === 6) || (piece.color === 'black' && currentRow === 1)) {
            if (!_board[currentRow + 2 * direction][currentCol].type) {
                moves.push({ row: currentRow + 2 * direction, col: currentCol });
            }
        }
    }
    if (currentCol > 0 && _board[currentRow + direction][currentCol - 1].type &&
        _board[currentRow + direction][currentCol - 1].color !== piece.color) {
        moves.push({ row: currentRow + direction, col: currentCol - 1 });
    }
    if (currentCol < 7 && _board[currentRow + direction][currentCol + 1].type &&
        _board[currentRow + direction][currentCol + 1].color !== piece.color) {
        moves.push({ row: currentRow + direction, col: currentCol + 1 });
    }
    //throw new Error ('i am overwhelemed by espq')
    // if (returnEnPassantSquare(moveHistoryParam) && currentRow === lastMove.to.row && lastMove) {
    //     if (currentCol === lastMove.to.col - 1 || currentCol === lastMove.to.col + 1) {
    //         moves.push({ row: currentRow + direction, col: lastMove.to.col });
    //     }
    // }
    return moves;
}

let preEnPassantBoard = [
    [
        {
            "type": "rook",
            "color": "black"
        },
        {},
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "queen",
            "color": "black"
        },
        {
            "type": "king",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "rook",
            "color": "black"
        }
    ],
    [
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        }
    ],
    [
        {
            "type": "knight",
            "color": "black"
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        }
    ],
    [
        {
            "type": "rook",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {
            "type": "queen",
            "color": "white"
        },
        {
            "type": "king",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "rook",
            "color": "white"
        }
    ]
]


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

function validRookMoves(piece, currentRow, currentCol, _board) {
    let moves = [];
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

function validKnightMoves(piece, currentRow, currentCol, _board) {
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
            let targetSquare = _board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
}

function validBishopMoves(piece, currentRow, currentCol, _board) {
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

function validQueenMoves(piece, currentRow, currentCol, _board) {
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

function validKingMoves(piece, currentRow, currentCol, _board) {
    let moves = [];
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
            let targetSquare = _board[newRow][newCol];
            if (!targetSquare.type || targetSquare.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    if (boardHistory[boardHistory.length - 1].playerTurn === 'white') {
        if (castlingRightsWhiteKingSide(boardHistory) &&
            !isSquareThreatened(_board, 7, 4, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 7, 5, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 7, 6, boardHistory[boardHistory.length - 1].playerTurn) &&
            _board[7][5].type === undefined &&
            _board[7][6].type === undefined) {
            moves.push({ row: 7, col: 6 });
        }
        if (castlingRightsWhiteQueenSide(boardHistory) &&
            !isSquareThreatened(board, 7, 4, _board, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 7, 3, _board, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 7, 2, _board, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 7, 1, _board, boardHistory[boardHistory.length - 1].playerTurn) &&
            _board[7][3].type === undefined &&
            _board[7][2].type === undefined &&
            _board[7][1].type === undefined) {
            moves.push({ row: 7, col: 2 });
        }
    }
    if (boardHistory[boardHistory.length - 1].playerTurn === 'black') {
        if (castlingRightsBlackKingSide(boardHistory) &&
            !isSquareThreatened(_board, 0, 4, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 0, 5, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 0, 6, boardHistory[boardHistory.length - 1].playerTurn) &&
            _board[0][5].type === undefined &&
            _board[0][6].type === undefined) {
            moves.push({ row: 0, col: 6 });
        }
        if (castlingRightsBlackQueenSide(boardHistory) &&
            !isSquareThreatened(board, 0, 4, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 0, 3, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 0, 2, boardHistory[boardHistory.length - 1].playerTurn) &&
            !isSquareThreatened(_board, 0, 1, boardHistory[boardHistory.length - 1].playerTurn) &&
            _board[0][3].type === undefined &&
            _board[0][2].type === undefined &&
            _board[0][1].type === undefined) {
            moves.push({ row: 0, col: 2 });
        }
    }
    return moves;
}

function castlingRightsWhiteKingSide(_boardHistory) {
    if (_boardHistory.length > 0 && _boardHistory[_boardHistory.length - 1].castlingRightsWhiteKingSide) {
        return (whiteKingHasNotMoved && whiteKingRookHasNotMoved);
    } else {
        return false;
    };
}
let whiteCanCastleKingSideBoard = [
    [
        {
            "type": "rook",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "queen",
            "color": "black"
        },
        {
            "type": "king",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {},
        {
            "type": "rook",
            "color": "black"
        }
    ],
    [
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {
            "type": "pawn",
            "color": "black"
        }
    ],
    [
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {
            "type": "bishop",
            "color": "white"
        },
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {},
        {}
    ],
    [
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        }
    ],
    [
        {
            "type": "rook",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {
            "type": "queen",
            "color": "white"
        },
        {
            "type": "king",
            "color": "white"
        },
        {},
        {},
        {
            "type": "rook",
            "color": "white"
        }
    ]
]

function castlingRightsWhiteQueenSide(_boardHistory) {
    if (_boardHistory.length > 0 && _boardHistory[_boardHistory.length - 1].castlingRightsWhiteQueenSide) {
        return (
            whiteKingHasNotMoved && whiteQueenRookHasNotMoved
        )
    } else {
        return false;
    }

}

let whiteCanCastleQueenSideBoard = [
    [
        {
            "type": "rook",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "queen",
            "color": "black"
        },
        {
            "type": "king",
            "color": "black"
        },
        {},
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "rook",
            "color": "black"
        }
    ],
    [
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        }
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "queen",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {},
        {},
        {}
    ],
    [
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        }
    ],
    [
        {
            "type": "rook",
            "color": "white"
        },
        {},
        {},
        {},
        {
            "type": "king",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "rook",
            "color": "white"
        }
    ]
]

//assert(castlingRightsWhiteQueenSide(whiteCanCastleQueenSideBoard, 'white'), 'neither K or QR has moved, so you should be able to castle');
//this is testing canCastle 

function castlingRightsBlackKingSide(_boardHistory) {
    if (_boardHistory.length > 0 && _boardHistory[_boardHistory.length - 1].castlingRightsBlackKingSide) {
        return (
            blackKingHasNotMoved && blackKingRookHasNotMoved
        )
    } else {
        return false;
    }
}
function castlingRightsBlackQueenSide(_boardHistory) {
    if (_boardHistory.length > 0 && _boardHistory[_boardHistory.length - 1].castlingRightsWhiteQueenSide) {
        return (
            blackKingHasNotMoved && blackQueenRookHasNotMoved
        )
    } else {
        return false;
    }
}

function findKingPosition(_board) {
    for (let row = 0; row < _board.length; row++) {
        for (let col = 0; col < _board[row].length; col++) {
            let piece = _board[row][col];
            if (piece.type === 'king' && piece.color === boardHistory[boardHistory.length - 1].playerTurn) {
                return { row: row, col: col };
            }
        }
    }
    return null;
}

function isSquareThreatened(_board, _row, _col, _currentPlayerTurn) {
    let attackedSquare = { row: _row, col: _col };
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
            let adjacentSquare = _board[newRow][newCol];
            if (adjacentSquare.type !== undefined) {
                if (adjacentSquare.color === _currentPlayerTurn) {
                    break;
                }
                if ((adjacentSquare.type === 'queen' || adjacentSquare.type === 'rook') && (dx === 0 || dy === 0)) {
                    return true;
                } else if (adjacentSquare.type === 'queen' && (dx !== 0 && dy !== 0)) {
                    return true;
                } else if (adjacentSquare.type === 'bishop' && (dx !== 0 && dy !== 0)) {
                    return true;
                }
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
            let adjacentSquare = _board[newRow][newCol];
            if (adjacentSquare.color !== _currentPlayerTurn && adjacentSquare.type === 'knight') {
                return true;
            }
        }
    }
    let pawnThreats = [];
    if (_currentPlayerTurn === 'white') {
        pawnThreats.push([attackedSquare.row - 1, attackedSquare.col - 1]);
        pawnThreats.push([attackedSquare.row - 1, attackedSquare.col + 1]);
    } else {
        pawnThreats.push([attackedSquare.row + 1, attackedSquare.col - 1]);
        pawnThreats.push([attackedSquare.row + 1, attackedSquare.col + 1]);
    }
    for (let square of pawnThreats) {
        let newRow = square[0];
        let newCol = square[1];
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            let adjacentSquare = _board[newRow][newCol];
            if (adjacentSquare.type === 'pawn' && adjacentSquare.color !== _currentPlayerTurn) {
                return true
            }
        }
    }
    return false;
}

let whiteQueenCheckingWhiteKing = [
    [
        {
            "type": "rook",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "queen",
            "color": "black"
        },
        {
            "type": "king",
            "color": "black"
        },
        {
            "type": "bishop",
            "color": "black"
        },
        {
            "type": "knight",
            "color": "black"
        },
        {
            "type": "rook",
            "color": "black"
        }
    ],
    [
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        },
        {
            "type": "pawn",
            "color": "black"
        }
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "black"
        },
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {
            "type": "pawn",
            "color": "white"
        },
        {},
        {},
        {}
    ],
    [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
    ],
    [
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "queen",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        },
        {
            "type": "pawn",
            "color": "white"
        }
    ],
    [
        {
            "type": "rook",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {},
        {
            "type": "king",
            "color": "white"
        },
        {
            "type": "bishop",
            "color": "white"
        },
        {
            "type": "knight",
            "color": "white"
        },
        {
            "type": "rook",
            "color": "white"
        }
    ]
]

function isKingInCheckmate(_board) {
    let simulatedBoard = deepCopyBoard(_board);
    for (let row = 0; row < simulatedBoard.length; row++) {
        for (let col = 0; col < simulatedBoard[row].length; col++) {
            let piece = simulatedBoard[row][col];
            if (piece.color === boardHistory[boardHistory.length - 1].playerTurn && piece.type !== undefined) {
                let moves = validMoves(piece, row, col, simulatedBoard);
                for (let i = 0; i < moves.length; i++) {
                    let move = moves[i];
                    let simulatedMove = simulatedBoard[move.row][move.col];
                    simulatedBoard[move.row][move.col] = piece;
                    simulatedBoard[row][col] = {};
                    if (!isSquareThreatened(simulatedBoard, findKingPosition(simulatedBoard).row, findKingPosition(simulatedBoard).col, boardHistory[boardHistory.length - 1].playerTurn)) {
                        simulatedBoard[row][col] = piece;
                        simulatedBoard[move.row][move.col] = simulatedMove;
                        return false;
                    }
                    simulatedBoard[row][col] = piece;
                    simulatedBoard[move.row][move.col] = simulatedMove;
                }
            }
        }
    }
    if (!isSquareThreatened(simulatedBoard, findKingPosition(simulatedBoard).row, findKingPosition(simulatedBoard).col, boardHistory[boardHistory.length - 1].playerTurn)) {
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
// build a test

function spliceSelfCheckingMoves(_piece, _pieceRow, _pieceCol, _moveArray) {
    let splicedMoveArray = [];
    let simulatedBoard = deepCopyBoard(board);
    let simulatedPiece = _piece;
    for (let i = 0; i < _moveArray.length; i++) {
        let testedMove = _moveArray[i];
        let testedSquare = simulatedBoard[testedMove.row][testedMove.col];
        simulatedBoard[testedMove.row][testedMove.col] = simulatedPiece;
        simulatedBoard[_pieceRow][_pieceCol] = {};
        if (!isSquareThreatened(simulatedBoard, findKingPosition(simulatedBoard).row, findKingPosition(simulatedBoard).col, boardHistory[boardHistory.length - 1].playerTurn)) {
            simulatedBoard[_pieceRow][_pieceCol] = simulatedPiece;
            simulatedBoard[testedMove.row][testedMove.col] = testedSquare;
            splicedMoveArray.push(testedMove);
        }
        simulatedBoard[testedMove.row][testedMove.col] = testedSquare;
        simulatedBoard[_pieceRow][_pieceCol] = simulatedPiece;
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

function isGameInDraw() {
    if (threefoldRepetitionCheck(boardHistory)) {
        return true;
    }
    if (isStalemate()) {
        return true;
    }
    if (boardHistory[boardHistory.length - 1].halfMoveClock === 50) {
        return true;
        //build a test for me
    }
    return false;
}

function isStalemate() {
    let simulatedBoard = deepCopyBoard(board);
    let allPlayerMoves = [];
    let latestBoard = boardHistory[boardHistory.length - 1];
    for (let row = 0; row < simulatedBoard.length; row++) {
        for (let col = 0; col < simulatedBoard[row].length; col++) {
            let piece = simulatedBoard[row][col];
            if (piece.color === boardHistory[boardHistory.length - 1].playerTurn && piece.type !== undefined) {
                let moves = spliceSelfCheckingMoves(piece, row, col, validMoves(piece, row, col, simulatedBoard));
                for (let i = 0; i < moves.length; i++) {
                    allPlayerMoves.push(moves[i]);
                }
            }
        }
    }
    if (allPlayerMoves.length === 0 &&
        !isSquareThreatened(latestBoard.board, findKingPosition(latestBoard.board).row, findKingPosition(latestBoard.board).col, latestBoard.playerTurn)) {
        return true;
    }
    return false;
}

let inGameTime = 0;
function drawGame() {
    inGameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(boardHistory[boardHistory.length - 1].board);
    // let testfentoboard = fenToBoard('rnbqkbnr/pppppppp/8/8/6bb/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    // drawBoard(testfentoboard[testfentoboard.length - 1].board);
    if (whitePawnPromotion || blackPawnPromotion) {
        bannerFilm();
        drawPawnPromotionBanner();
    }
    if (isGameInDraw()) {
        console.log("game has ended in a draw!");
    } else if (isKingInCheckmate(boardHistory[boardHistory.length - 1].board) === true) {
        console.log(invertCurrentPlayerTurn() + " won!")
    }
    else if (isSquareThreatened(boardHistory[boardHistory.length - 1].board, findKingPosition(boardHistory[boardHistory.length - 1].board).row, findKingPosition(boardHistory[boardHistory.length - 1].board).col, boardHistory[boardHistory.length - 1].playerTurn)) {
        console.log(boardHistory[boardHistory.length - 1].playerTurn + ' is in check!');
    }
};

setInterval(drawGame, 16);

//fix validmoves, sub out all board for boardHistory.board
//fix multiple digit bug in fen translator
//fix update checkPotential En Passant so it's just a function that returns the epsq
//remove global variables