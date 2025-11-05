import { useState } from "react";

import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Build a board (3x3 array) from turns (oldest-first)
  function buildBoardFromTurns(turns) {
    const board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    for (const turn of turns) {
      const { row, col } = turn.square;
      board[row][col] = turn.player;
    }

    return board;
  }

  // Return { winner: 'X'|'O'|null, line: [[r,c], ...] }
  function calculateWinner(board) {
    const lines = [
      // rows
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      // cols
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      // diags
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      const v1 = board[a[0]][a[1]];
      const v2 = board[b[0]][b[1]];
      const v3 = board[c[0]][c[1]];

      if (v1 && v1 === v2 && v1 === v3) {
        return { winner: v1, line };
      }
    }

    return { winner: null, line: null };
  }

  function handleSelectSquare(rowIndex, colIndex) {
    // Ignore clicks after game over
    if (winner || isDraw) return;

    // Prevent selecting an occupied square
    const occupied = gameTurns.some(
      (t) => t.square.row === rowIndex && t.square.col === colIndex
    );

    if (occupied) return;

    const currentPlayer = activePlayer;

    // Append move (oldest-first order)
    const newTurns = [
      ...gameTurns,
      { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
    ];
    setGameTurns(newTurns);

    // Check winner / draw
    const board = buildBoardFromTurns(newTurns);
    const result = calculateWinner(board);

    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      // Check for draw: no nulls left
      const isFull = board.every((row) => row.every((cell) => cell !== null));
      if (isFull) {
        setIsDraw(true);
      }
    }

    // Toggle active player (only if game not finished)
    setActivePlayer((prev) => (prev === "X" ? "O" : "X"));
  }

  function handleRestart() {
    setGameTurns([]);
    setActivePlayer("X");
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
          />
        </ol>
        <GameBoard
          onSelectSquare={handleSelectSquare}
          turns={gameTurns}
          isGameOver={Boolean(winner) || isDraw}
          winningLine={winningLine}
        />
      </div>
      <div id="status-and-log">
        <div id="status">
          {winner ? (
            <strong>Winner: Player {winner}</strong>
          ) : isDraw ? (
            <strong>Draw</strong>
          ) : (
            <span>Next: Player {activePlayer}</span>
          )}
          <button onClick={handleRestart} className="restart">
            Restart
          </button>
        </div>
        <Log turns={gameTurns} />
      </div>
    </main>
  );
}

export default App;
