"use strict";

let testGame;
let testP1;
let testP2;

beforeEach(function () {
  console.log("Run once before each test starts");

  testP1 = new Player("teal");
  testP2 = new Player("purple");
  testGame = new Game(testP1, testP2, 6, 7);
});


describe('makeBoard', function () {

  it('makes the in-memory board', function () {
    expect(testGame.board.length).toEqual(testGame.height);

    for (const row of testGame.board) {
      expect(row.length).toEqual(testGame.width);
    }
  });

  it('in-memory board rows should have unique identity', function () {
    const rows = new Set(testGame.board);
    expect(rows.size).toEqual(testGame.board.length);
  });
});


describe('makeHtmlBoard', function () {

  it('makes the html board', function () {
    let htmlBoard = document.getElementById('board');

    // num rows should be HEIGHT + 1 to account for clickable top row
    expect(htmlBoard.rows.length).toEqual(testGame.height + 1);

    for (const tableRow of htmlBoard.rows) {
      expect(tableRow.cells.length).toEqual(testGame.width);
    }
  });
});


describe('findSpotForCol', function () {

  it('finds the next available spot in column', function () {
    const y = testGame.height - 1;
    const x = 0;

    expect(testGame.findSpotForCol(x)).toEqual(y);

    testGame.board[y][x] = "filled";

    expect(testGame.findSpotForCol(x)).toEqual(y - 1);
  });

  it('returns null if column filled', function () {
    let y = 0;
    const x = 1;

    while (y < testGame.height) {
      testGame.board[y][x] = "filled";
      y++;
    }

    expect(testGame.findSpotForCol(x)).toEqual(null);
  });
});


describe('placeInTable', function () {

  it('adds piece to the html board', function () {
    const x = 0;
    const y = testGame.height - 1;
    const spot = document.getElementById(`c-${y}-${x}`);

    expect(spot.innerHTML).toEqual("");
    testGame.placeInTable(y, x);

    expect(spot.innerHTML).toEqual(
        `<div class="piece" style="background-color: ${testP1.color};"></div>`
    );
  });
});


describe('checkForWin', function () {

  it('returns false if no winner', function () {
    expect(testGame.checkForWin()).toEqual(false);
  });

  it('returns true if there is a horizontal winner', function () {
    testGame.board[0][1] = testP1;
    testGame.board[0][2] = testP1;
    testGame.board[0][3] = testP1;
    testGame.board[0][4] = testP1;

    expect(testGame.checkForWin()).toEqual(true);
  });

  it('returns true if there is a vertical winner', function () {
    testGame.board[1][0] = testP1;
    testGame.board[2][0] = testP1;
    testGame.board[3][0] = testP1;
    testGame.board[4][0] = testP1;

    expect(testGame.checkForWin()).toEqual(true);
  });

  it('returns true if there is a diagonal winner', function () {
    testGame.board[1][1] = testP1;
    testGame.board[2][2] = testP1;
    testGame.board[3][3] = testP1;
    testGame.board[4][4] = testP1;

    expect(testGame.checkForWin()).toEqual(true);
  });
})


describe('handleClick', function () {

  it('it switches players', function () {
    const evt = {target: {id: `top-0`}};

    expect(testGame.currPlayer).toEqual(testP1);

    testGame.handleClick(evt);
    expect(testGame.currPlayer).toEqual(testP2);

    testGame.handleClick(evt);
    expect(testGame.currPlayer).toEqual(testP1);
  });

  it('it updates in-memory board with correct player', function () {
    let y = testGame.height - 1;
    const x = 0;

    const evt = {target: {id: `top-${x}`}};

    // spot on board is empty
    // after one call to handleClick, gets updated with player 1
    expect(testGame.board[y][x]).toEqual(null);
    testGame.handleClick(evt);
    expect(testGame.board[y][x]).toEqual(testP1);

    // increment y to next unfilled row for x
    y = testGame.height - 2;

    // spot on board is empty
    // after next call to handleClick, gets updated with player 2
    expect(testGame.board[y][x]).toEqual(null);
    testGame.handleClick(evt);
    expect(testGame.board[y][x]).toEqual(testP2);
  });

  it('it updates html board with correct pieces', function () {
    let y = testGame.height - 1;
    const x = 0;

    let spot = document.getElementById(`c-${y}-${x}`);
    const evt = {target: {id: `top-${x}`}};

    // spot on html board empty
    // after one call to handleClick, gets updated with player 1 piece
    expect(spot.innerHTML).toEqual("");
    testGame.handleClick(evt);
    expect(spot.innerHTML).toEqual(
        `<div class="piece" style="background-color: ${testP1.color};"></div>`
    );

    // increment y to next empty row for x
    // get new spot
    y = testGame.height - 2;
    spot = document.getElementById(`c-${y}-${x}`);

    // spot on html board empty
    // after next call to handleClick, gets updated with player 2 piece
    expect(spot.innerHTML).toEqual("");
    testGame.handleClick(evt);
    expect(spot.innerHTML).toEqual(
        `<div class="piece" style="background-color: ${testP2.color};"></div>`
    );
  });
});
;
