export default function Log({ turns = [] }) {
  if (!turns || turns.length === 0) {
    return <ol id="log" />;
  }

  return (
    <ol id="log">
      {turns.map((turn, idx) => (
        <li key={`${turn.square.row}-${turn.square.col}-${idx}`}>
          Player {turn.player} selected {turn.square.row},{turn.square.col}
        </li>
      ))}
    </ol>
  );
}
