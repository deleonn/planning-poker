import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toCanvas } from "qrcode";

import { Button, Card, CardOptions } from "../components";
import { useGame, useName } from "../hooks";

function Room({ roomId }: { roomId: string }) {
  const [name, uid] = useName();
  const {
    isGameRunning,
    myId,
    players,
    selection,
    areAnswersVisible,
    reveal,
    select,
    switchStatus,
    restart,
  } = useGame(roomId, uid, name);
  const me = useMemo(() => players[myId], [players, myId]);
  const currentUrl = useMemo(() => globalThis?.window?.location.toString(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      toCanvas(canvasRef.current, currentUrl);
    }
  }, [canvasRef, currentUrl]);

  return (
    <section className="room-container">
      <div className="header">
        <h1>
          Hello {name}, you are currently a{" "}
          {me && me.isPlaying ? "Player" : "Guest"}
        </h1>

        {me && me.isPlaying && typeof me.answer !== "number" ? (
          <p>Select a card</p>
        ) : null}

        {me && !me.isPlaying ? (
          <p>
            <button onClick={switchStatus}>Switch status</button> to start
            playing
          </p>
        ) : null}
      </div>

      <div className="board">
        {players &&
          Object.keys(players) &&
          Object.keys(players).map((playerId) => {
            const player = players[playerId];
            const { answer } = player;

            return (
              <div className="player" key={playerId}>
                <h2>{player.name}</h2>
                <Card
                  selectedAmount={answer}
                  amount={answer}
                  visible={areAnswersVisible}
                  answered={typeof player.answer === "number"}
                />
                <p>{player.isPlaying ? "Player" : "Guest"}</p>
              </div>
            );
          })}
      </div>

      <div className="invite">
        <h3>Invite Others</h3>
        <a href={currentUrl}>{currentUrl}</a>
        <br />
        <canvas ref={canvasRef} />
      </div>

      <div className="actions">
        <CardOptions
          onSelection={select}
          selectedAmount={selection}
          disabled={!isGameRunning || areAnswersVisible}
        />
        {!areAnswersVisible && isGameRunning && me.isLeader ? (
          <Button onClick={reveal}>Reveal answers</Button>
        ) : Object.keys(players).length <= 1 ? (
          "Waiting for more players..."
        ) : null}

        {areAnswersVisible && <Button onClick={restart}>Play again</Button>}
      </div>
    </section>
  );
}

export default function Game() {
  const { query } = useRouter();
  const roomId = useMemo(() => query.room as string, [query]);
  const [name, uid, setName] = useName();
  const [tempName, setTempName] = useState("");

  const join = () => {
    if (tempName.length) {
      setName(tempName);
    } else {
      alert("Please provide your name");
    }
  };

  if (!name) {
    return (
      <div>
        <h2>What&apos;s your name?</h2>
        <input
          placeholder="Name"
          value={tempName}
          onChange={(event) => setTempName(event.currentTarget.value)}
        />
        <button onClick={join}>Join</button>
      </div>
    );
  }

  return <Room roomId={roomId} />;
}
