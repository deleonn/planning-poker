import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Player {
  name: string;
  isPlaying: boolean;
  isLeader: boolean;
  answer: number;
}

interface PlayersMap {
  [id: string]: Player;
}

interface Room {
  players: PlayersMap;
  isGameRunning: boolean;
  areAnswersVisible: boolean;
}

export default function useGame(
  roomId: string,
  userId: string,
  name: string
): Room & {
  myId: string;
  selection: number;
  switchStatus: () => void;
  select: (answer: number) => void;
  reveal: () => void;
  restart: () => void;
} {
  const socket = useRef<Socket>(null);
  const [room, setRoom] = useState<Room>({
    isGameRunning: false,
    players: {},
    areAnswersVisible: false,
  });
  const [selection, setSelection] = useState<number | null>(null);

  useEffect(() => {
    if (room) {
      // Initialize the socket and register the room
      fetch(`/api/game?room=${roomId}`).finally(() => {
        socket.current = io(`/${roomId}`);

        // subscribe to playersUpdated event to update players list
        socket.current.on("playersUpdated", (players: PlayersMap) => {
          setRoom((prevState) => ({ ...prevState, players }));
        });

        // subscribe to gameUpdated event to update game status
        socket.current.on(
          "gameUpdated",
          ({ isGameRunning, areAnswersVisible }: Room) => {
            setRoom((prevState) => ({
              ...prevState,
              isGameRunning,
              areAnswersVisible,
            }));
          }
        );

        // After register all the events, emit a join action in order to be aware for incoming changes
        socket.current.emit("join", { uid: userId, name });
      });

      // Unsuscribe
      return () => {
        if (socket.current) {
          socket.current.emit("leave");

          socket.current.disconnect();
        }
      };
    }
  }, [roomId, userId, name]);

  const switchStatus = () => {
    socket.current.emit("switchPlayerStatus");
  };

  const select = (answer: number) => {
    setSelection(answer);
    socket.current.emit("setAnswer", answer);
  };

  const reveal = () => {
    socket.current.emit("revealAnswers");
  };

  const restart = () => {
    socket.current.emit("restart");
  };

  return {
    ...room,
    selection,
    switchStatus,
    select,
    reveal,
    restart,
    myId: socket.current?.id,
  };
}
