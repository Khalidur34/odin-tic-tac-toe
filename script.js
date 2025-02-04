function Board() {
    const rows = 9;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board.push(Cell());
    }
    
    const getBoard = () => board;

    const getBoardString = () => {

        let boardString = []

        board.forEach((boardItem, index) => {
            boardString[index] = boardItem.getPlayer()
        })

        return boardString;
    }

    const selectCell = (index, player) => {
        board[index].setPlayer(player);
    };

    return {getBoard, selectCell, getBoardString};
}

function checkWin(boardString) {
    const win = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6],
    ];

    for(let combo of win){
        const [a, b, c] = combo;
        if (boardString[a] === boardString[b] && boardString[a] === boardString[c] && boardString[a] !== '') {
            return combo;
        }
    }
    return null;

}

function Cell() {
    let player = "";

    const setPlayer = (e) => {
        player = e;
    };

    const getPlayer = () => player;

    return {setPlayer, getPlayer};
}

function Game(
    playerOne = "Player One",
    playerTwo = "Player Two"
) {
    let gameStatus = "running"
    const board = Board();
    const players = [{name: playerOne, marker: "X"}, {name: playerTwo, marker: "O"}];
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    
    const playRound = (index) => {
        if(gameStatus === "paused") return;
        board.selectCell(index, getActivePlayer().marker);
        switchPlayerTurn();
    };

    const getWholeBoard = () =>  {
        return board;
    }

    const makeGamePause = () => {
        gameStatus = "paused"
    }

    return {playRound, getActivePlayer, getBoard: board.getBoard, getWholeBoard, makeGamePause};
}

function ScreenController() {
    const game = Game();
    const boardContainer = document.querySelector('#gridContainer');
    const playerDisplay = document.querySelector('#playerDisplay');


    const updateScreen = () => {
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const winningCombo = checkWin(game.getWholeBoard().getBoardString());
        if(winningCombo) game.makeGamePause();

        playerDisplay.textContent = ` ${activePlayer.name}(${activePlayer.marker})'s turn`;

        board.forEach((cell, index) => {
            const cellButton = document.createElement("div");
            cellButton.classList.add("cell");
            cellButton.dataset.position = index;
            cellButton.textContent = cell.getPlayer();

            if (winningCombo && winningCombo.includes(index)) {
                cellButton.classList.add("winning-line");
            }

            boardContainer.appendChild(cellButton);

        });

        
    };

    function clickHandlerBoard(e) {
        const position = e.target.dataset.position;
        //console.log(position);
        // Make sure I've clicked a column and not the gaps in between
        if (!position) return;
        game.playRound(position);
        updateScreen();
        
    }
    
    boardContainer.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();


