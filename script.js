function Board() {
    const rows = 9;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board.push(Cell());
    }
    
    const getBoard = () => board;

    const selectCell = (index, player) => {
        board[index].setPlayer(player);
    };

    return {getBoard, selectCell};
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
    
    const board = Board();
    const players = [{name: playerOne, marker: "X"}, {name: playerTwo, marker: "O"}];
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    
    const playRound = (index) => {
        board.selectCell(index, getActivePlayer().marker);
        switchPlayerTurn();
    };

    return {playRound, getActivePlayer, getBoard: board.getBoard};
}

function ScreenController() {
    const game = Game();
    const boardContainer = document.querySelector('#gridContainer');
    const playerDisplay = document.querySelector('#playerDisplay');


    const updateScreen = () => {
        boardContainer.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerDisplay.textContent = ` ${activePlayer.name}(${activePlayer.marker})'s turn`;

        board.forEach((cell, index) => {
            const cellButton = document.createElement("div");
            cellButton.classList.add("cell");
            cellButton.dataset.position = index;
            cellButton.textContent = cell.getPlayer();
            boardContainer.appendChild(cellButton);
        });
    };

    function clickHandlerBoard(e) {
        const position = e.target.dataset.position;
        console.log(position);
        // Make sure I've clicked a column and not the gaps in between
        if (!position) return;
        game.playRound(position);
        updateScreen();
    }
    
    boardContainer.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();


