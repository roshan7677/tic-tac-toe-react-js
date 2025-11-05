const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard({
  onSelectSquare,
  turns,
  isGameOver = false,
  winningLine = null,
}) {
  //   const [gameBoard, setGameBoard] = useState(initialGameBoard);

  //   function gameBoardBtnHandler(rowIndex, colIndex) {
  //     setGameBoard((prevGameBoard) => {
  //       // Create a deep copy of the previous game board
  //       const updatedBoard = prevGameBoard.map((innerArray) => [...innerArray]);
  //       updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
  //       return updatedBoard;
  //     });
  //     onSelectSquare();
  // Make a shallow copy of the initial board and its rows so we don't
  // mutate the shared `initialGameBoard` constant across renders.
  let gameBoard = initialGameBoard.map((row) => [...row]);

  for (const turn of turns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  // Helper to check if a cell is part of the winning line
  function isWinningCell(r, c) {
    if (!winningLine) return false;
    return winningLine.some(([rr, cc]) => rr === r && cc === c);
  }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => {
              const occupied = playerSymbol !== null;
              const isWinning = isWinningCell(rowIndex, colIndex);

              return (
                <li key={colIndex}>
                  <button
                    onClick={() => onSelectSquare(rowIndex, colIndex)}
                    disabled={isGameOver || occupied}
                    className={isWinning ? "winning" : undefined}
                    aria-label={`square-${rowIndex}-${colIndex}`}
                  >
                    {playerSymbol}
                  </button>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
