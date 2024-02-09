"use strict";

/*
Creates the Game Class and constructor with the following properties:
WIDTH, this.HEIGHT, currentPlayer, board
 */

class Game {
  constructor(playerOne, playerTwo, height, width) {
    this.width = width;
    this.height = height;
    this.firstPlayer = playerOne;
    this.secondPlayer = playerTwo;
    this.currPlayer = this.firstPlayer;
    this.board = [];
    this.finishedGame = false;
    this.makeHtmlBoard();
    this.makeBoard();
  }

  /** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array(this.width).fill(null);
      this.board.push(emptyRow);
    }
    console.log(this.board);
  }


  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {

    /* console.log('makeHTMLBoard method'); */

    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = '';


    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses this.this.height to create table rows
    // uses this.width to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
   *    (return null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    /* piece.classList.add(`p${this.currPlayer}`); */

    const spot = document.getElementById(`c-${y}-${x}`);
    if (!this.finishedGame) {
      spot.append(piece);
    }
  }

  /** endGame: announce game end */

  endGame(msg) {
    if (!this.finishedGame) {
      alert(msg);
      this.finishedGame = true;
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    const _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match this.currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

          return true;
        }
      }
    }
    return false;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = Number(evt.target.id.slice("top-".length));

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.firstPlayer ? this.secondPlayer : this.firstPlayer;
  }

}

/* Creates a new instance of a player
Receives the value introduced by the user -> color */
class Player {
  constructor(playerColor) {
    this.color = playerColor;
  }
}

// PART 2 SMALL IMPROVEMENTS

const startBtn = document.getElementById("start-game");

function newGame() {
  let playerOneColor = document.getElementById('player1_input').value;
  let playerTwoColor = document.getElementById('player2_input').value;

  const firstPlayer = new Player(playerOneColor);
  const secondPlayer = new Player(playerTwoColor);

  new Game(firstPlayer, secondPlayer, 6, 7);
}

startBtn.addEventListener("click", newGame);

