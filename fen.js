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

function boardToFen(_boardHistory) {
    let fen = '';
    for (let i = 0; i < 8; i++) {
        let counter = 0;
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
