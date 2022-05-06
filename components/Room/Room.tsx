import { useEffect, useMemo, useRef } from "react";
import { toCanvas } from "qrcode";

import { Button, Card, CardOptions } from "../../components";
import { useGame, useName } from "../../hooks";

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

  const isAtLeastOnePlaying = () => {
    return Object.entries(players)
      .map((el) => el[1])
      .some((el) => el.isPlaying === true);
  };

  const isAtLeastOneAnswer = () => {
    return Object.entries(players)
      .map((el) => el[1])
      .some((el) => typeof el.answer === "number");
  };

  return (
    <section className="flex flex-col min-h-screen justify-start w-screen bg-slate-100 dark:bg-slate-900 items-center p-6">
      <div className="flex w-full justify-between items-start">
        <h1 className="text-blue-500">
          Hello <span className="text-blue-700 dark:text-blue-300">{name}</span>
          , you are currently
          {me && me.isPlaying ? " a Player" : " an Spectator"}
        </h1>

        {me && me.isPlaying && typeof me.answer !== "number" ? (
          <p className="text-blue-500">Select a card</p>
        ) : null}

        {me && !me.isPlaying ? (
          <p className="text-blue-500">
            <button
              className="bg-blue-500 text-slate-100 dark:text-slate-800 rounded w-40 ml-2"
              onClick={switchStatus}
            >
              Switch status
            </button>{" "}
            to start playing
          </p>
        ) : null}
      </div>

      <div className="flex w-full bg-indigo-900 m-6 rounded-lg flex-wrap">
        {players &&
          Object.keys(players) &&
          Object.keys(players).map((playerId) => {
            const player = players[playerId];
            const { answer } = player;

            return (
              <div
                className="player m-6 flex flex-col justify-center items-center"
                key={playerId}
              >
                <h2 className="text-blue-500">
                  {player.name} {player.isLeader ? "👑" : null}
                </h2>
                <Card
                  selectedAmount={answer}
                  amount={answer}
                  visible={areAnswersVisible}
                  answered={typeof player.answer === "number"}
                />
                <p className="text-blue-500">
                  {player.isPlaying ? "Player" : "Spectator"}
                </p>
              </div>
            );
          })}
      </div>

      <div className="actions flex flex-col items-center">
        {Object.keys(players).length <= 1 ? (
          <p className="text-blue-500 dark:text-slate-100 my-4">
            Waiting for more players...
          </p>
        ) : (
          <CardOptions
            onSelection={select}
            selectedAmount={selection}
            disabled={
              !isGameRunning || areAnswersVisible || (me && !me.isPlaying)
            }
          />
        )}

        {me && me.isLeader && (
          <>
            {isAtLeastOnePlaying() &&
              !isGameRunning &&
              !areAnswersVisible &&
              Object.keys(players).length >= 1 && (
                <Button onClick={restart} className="bg-blue-500">
                  Start round
                </Button>
              )}

            {areAnswersVisible && (
              <Button onClick={restart} className="bg-blue-500">
                Play again
              </Button>
            )}

            {!areAnswersVisible && isGameRunning && isAtLeastOneAnswer() ? (
              <Button onClick={reveal} className="bg-blue-500">
                Reveal answers
              </Button>
            ) : null}
          </>
        )}
      </div>

      <div className="invite flex flex-col justify-center items-center mt-6">
        <h3 className="text-blue-500">Invite Others</h3>
        <a className="text-blue-500" href={currentUrl}>
          {currentUrl}
        </a>
        <br />
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
}

export default Room;
