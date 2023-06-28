	/*----- constants -----*/
    const BOARDCOLORS = {
        '0': 'white',
        '1': 'red',
        '-1': 'black',
    };
    
	/*----- state variables -----*/
    let board;
    let turn;
    let winner;

	/*----- cached elements  -----*/
    const messageEl = document.querySelector('h1');
    const playAgainBtn = document.querySelector('button');
    const boardDiv = document.querySelectorAll('#board > div');
    const boardBody = document.getElementById('board');

	/*----- event listeners -----*/
    boardBody.addEventListener('click', playerClicked);
    playAgainBtn.addEventListener('click', playAgain);

	/*----- functions -----*/
    init();

    function init() {
        board = [
            [0,0,0], // col 0
            [0,0,0], // col 1
            [0,0,0], // col 2
        // r 0 1 2
        ];
        turn = 1;
        winner = null;
        boardBody.style = "pointer-events:auto;";

        render();
    }

    function render() {
        renderBoard();
        renderMessage();
        renderControls();
    }

    function renderBoard() {
        board.forEach((colArr, colId) => {
            colArr.forEach((cellVal, rowId) => {
                const cellId = `c${colId}r${rowId}`;
                const cellEl = document.getElementById(cellId);
                cellEl.style.color = BOARDCOLORS[cellVal];

                // Set player symbol/no symbol
                switch (cellVal) {
                    case 0: 
                        cellEl.innerText = ''
                        break;
                    case 1: 
                        cellEl.innerText = 'O'
                        break;
                    case -1: 
                        cellEl.innerText = 'X'
                        break;
                };
            });
        });
    }

    function renderMessage() {
        if (winner === 'T') {
            messageEl.innerText = "It's a Tie!!!";
        } else if (winner) {
            messageEl.innerHTML = `<span style="color: ${BOARDCOLORS[winner]}">${BOARDCOLORS[winner].toUpperCase()}</span> Wins!`;
        } else {
            messageEl.innerHTML = `<span style="color: ${BOARDCOLORS[turn]}">${BOARDCOLORS[turn].toUpperCase()}</span>'s Turn`;
        }
    }

    function renderControls() {
        if (winner !== null)
            boardBody.style = "pointer-events:none;";
        if (winner === 'T')
            playAgainBtn.style.visibility = 'visible';
        else
            playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    }

    function playAgain(evt) {
        evt.target.style.visibility = 'hidden';
        init();
    }

    function playerClicked(evt) {
        const cell = evt.target;
        if (cell.innerHTML === '') {
            const colId = parseInt(cell.id.substring(1,2));
            const rowId = parseInt(cell.id.substring(3));
            board[colId][rowId] = turn;
            turn *= -1;
    
            winner = getWinner(colId, rowId);
            
            if (!winner)
            {
                const flatBoard = board.flat();
                if (!flatBoard.includes(0))
                    winner = 'T';
            }
            render();
        }
        else
        {
            playerTryAgainMsg();
        }
    }
    
    function playerTryAgainMsg() {
        messageEl.innerHTML = `<span style="color:${BOARDCOLORS[turn]}">${BOARDCOLORS[turn].toUpperCase()}</span> try to click again!`;
    }

    function getWinner(colId, rowId) {
        return (checkVerticalWin(colId, rowId) ||
               checkHorizontalWin(colId, rowId) ||
               checkDiagonalWinNESW(colId, rowId) ||
               checkDiagonalWinNWSE(colId, rowId));
    }

    function checkVerticalWin(colId, rowId) {
        const adjCountUp = countAdjacent(colId, rowId, 1, 0);
        const adjCountDown = countAdjacent(colId, rowId, -1, 0);
        return (adjCountUp + adjCountDown) >= 2 ? board[colId][rowId] : null;
    }

    function checkHorizontalWin(colId, rowId) {
        const adjCountRight = countAdjacent(colId, rowId, 0, 1);
        const adjCountLeft = countAdjacent(colId, rowId, 0, -1);
        return (adjCountRight + adjCountLeft) >= 2 ? board[colId][rowId] : null;
    }

    function checkDiagonalWinNESW(colId, rowId) {
        const adjCountNE = countAdjacent(colId, rowId, 1, 1);
        const adjCountSW = countAdjacent(colId, rowId, -1, -1);
        return (adjCountNE + adjCountSW) >= 2 ? board[colId][rowId] : null;
    }

    function checkDiagonalWinNWSE(colId, rowId) {
        const adjCountNW = countAdjacent(colId, rowId, 1, -1);
        const adjCountSE = countAdjacent(colId, rowId, -1, 1);
        return (adjCountNW + adjCountSE) >= 2 ? board[colId][rowId] : null;

    }

    function countAdjacent(colId, rowId, colOffset, rowOffset) {
        const player = board[colId][rowId];
        let count = 0;
        colId += colOffset;
        rowId += rowOffset;
        while (
            board[colId] !== undefined &&
            board[colId][rowId] !== undefined &&
            board[colId][rowId] === player
            ) {
            count++;
            colId += colOffset;
            rowId += rowOffset;
        }
        return count;
    }