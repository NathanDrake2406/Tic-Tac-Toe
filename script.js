const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const updateBoard = (index, marker) => {
        if (board[index] === '') board[index] = marker;
    };
    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };
    const getBoard = () => board;
    return {updateBoard, resetBoard, getBoard};
})();

const Player = (name, marker) => {
    return { name, marker };
};

const gameController = (() => {
    const players = {}; //Stores player objects with markers as the keys
    let currentMarker = "X";//Initialize 
    let isGameActive = true;
    const getCurrentPlayer = () => players[currentMarker];

    
    const initializePlayers = (player1Name, player2Name) => {
        players["X"] = Player(player1Name, "X");
        players["O"] = Player(player2Name, "O");
        currentMarker = "X"; //X always go first
        console.log(`Player X: ${player1Name}, Player O: ${player2Name}`);
    };

    const checkDraw = () => {
        const board = gameBoard.getBoard();
        const isFilled = board.every(item => item !== '');
        return isFilled;
    };
    //Change turns
    const switchTurn = () => {
        currentMarker = currentMarker === "X" ? "O" : "X"
    };

    const resetGame = () => {
        isGameActive = true;
        currentMarker = "X";
    };

    const checkRows = (marker) => {
        const board = gameBoard.getBoard();
        for (let row = 0; row < 3; row++) {
            let rowWin = true;
            for (let pos = 0; pos < 3; pos++) {
                if (board[row * 3 + pos] !== marker) {
                    rowWin = false;
                    break;
                }
            }
            if (rowWin) return true;
        }
        return false;
    };

    const checkColumns = (marker) => {
        const board = gameBoard.getBoard();
        for (let column = 0; column < 3; column++) {
            let columnWin = true;
            for (let pos = 0; pos < 3; pos++) {
                if (board[column + (pos * 3)] !== marker) {
                    columnWin = false;
                    break;
                }
            }
            if (columnWin) return true;
        }
        return false;
    };

    const checkDiagonals = (marker) => {
        const board = gameBoard.getBoard();
        let diagonalWin = true;
        for (let i = 0; i < 3; i++) {
            if (board[i*4] !== marker) {
                diagonalWin = false;
                break;
            }
        }
        if (diagonalWin) return true;

        diagonalWin = true;
        for (let i = 0; i < 3; i++) {
            if (board[2+i*2] !== marker) {
                diagonalWin = false;
                break;
            }
        }
        return diagonalWin;
    };

    const checkWin = (marker) => {
        return checkColumns(marker) || checkRows(marker) || checkDiagonals(marker);
    };

    const playRound = (index) => {
        if (!isGameActive) return;
        const board = gameBoard.getBoard();

        if (board[index] !== '') {
            return;
        }

        const currentPlayer = getCurrentPlayer();
        gameBoard.updateBoard(index, currentPlayer.marker);

        if (checkWin(currentPlayer.marker)) {
            console.log(`Player ${currentPlayer.name} wins!`);
            displayController.displayMessage(`${currentPlayer.name} wins`);
            isGameActive = false;
            return;
        }
        if (checkDraw()) {
            console.log(`Draw!`)
            displayController.displayMessage(`Draw!`);
            isGameActive = false;
            return;
        }

        switchTurn();
    };

    const gameActive = () => {
        return isGameActive;
    };
    
    return { checkWin, initializePlayers, getCurrentPlayer, switchTurn, playRound, resetGame, gameActive };
})();

const displayController = (() => { 

    let messageDisplay;
    let cells;
    const displayMessage = (message) => {
        messageDisplay = document.querySelector('#message');
        console.log("Message Display: ", messageDisplay);
        messageDisplay.textContent = message;
    };

    console.log("Message Display: ", messageDisplay);

    const updateCell = (index, marker) => {
        cells[index].textContent = marker;
    };

    const resetBoard = () => {
        const reset = document.querySelector('#reset');
        reset.addEventListener('click', () => {
            gameBoard.resetBoard();
            cells.forEach(cell => cell.textContent = '');
            gameController.resetGame();
            displayMessage('');
    });
};

    const initialize = () => {
        messageDisplay = document.querySelector('#message');
        cells = document.querySelectorAll('.cell');
        const display = container.firstElementChild;
        console.log("At ini Message Display: ", messageDisplay);
        resetBoard();
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                const currentPlayer = gameController.getCurrentPlayer();
                const board = gameBoard.getBoard();

                console.log(`Cell index: ${index}, board[index] === '': ${board[index] === ''}, gameController.isGameActive: ${gameController.gameActive()}`); 

                if (board[index] === '' && gameController.gameActive()) {
                    displayController.updateCell(index, currentPlayer.marker);
                    gameController.playRound(index);
                }
            });
        });
    };

    return { initialize, updateCell, resetBoard, displayMessage }

})();

gameController.initializePlayers("Player 1", "Player 2");
displayController.initialize();

