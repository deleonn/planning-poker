import { Server, Socket } from "socket.io";
import { FakeDB } from "./types";

const fakedb: FakeDB = {};

export const loadRoom = (io: Server, roomId: string) => {
  fakedb[roomId] = {
    io: io.of(`/${roomId}`),
    players: {},
    isGameRunning: false,
    areAnswersVisible: false,
    gameHasEnded: false,
  };

  fakedb[roomId].io.on("connect", (socket) => {
    socket.on("join", join(fakedb, socket, roomId));

    socket.on("leave", leave(fakedb, io, socket, roomId));
    socket.on("disconnect", leave(fakedb, io, socket, roomId));

    socket.on("switchPlayerStatus", switchPlayerStatus(fakedb, socket, roomId));
    socket.on("setAnswer", setAnswer(fakedb, socket, roomId));
    socket.on("revealAnswers", revealAnswers(fakedb, socket, roomId));
    socket.on("restart", restart(fakedb, roomId));
    socket.on("startGame", startGame(fakedb, roomId));
  });
};

export const join =
  (fakedb: FakeDB, socket: Socket, roomId: string) =>
  (client: { uid: string; name: string }) => {
    const isLeader = Object.keys(fakedb[roomId].players).length === 0;

    fakedb[roomId].players[socket.id] = {
      isLeader,
      isPlaying: false,
      name: client.name,
      uid: client.uid,
      answer: undefined,
      voted: false,
    };

    fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
    fakedb[roomId].io.emit("gameUpdated", {
      isGameRunning: fakedb[roomId].isGameRunning,
      areAnswersVisible: fakedb[roomId].areAnswersVisible,
    });
  };

export const leave =
  (fakedb: FakeDB, io: Server, socket: Socket, roomId: string) => () => {
    if (
      fakedb[roomId].players?.[socket.id]?.isLeader &&
      Object.keys(fakedb[roomId].players).length > 1
    ) {
      const nextLeaderId = Object.keys(fakedb[roomId].players).filter(
        (playerId) => playerId !== socket.id
      )[0];

      fakedb[roomId].players[nextLeaderId].isLeader = true;
    }

    delete fakedb[roomId].players[socket.id];

    if (Object.keys(fakedb[roomId].players).length === 0) {
      io._nsps.delete(`/${roomId}`);
    } else {
      fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
    }
  };

export const switchPlayerStatus =
  (fakedb: FakeDB, socket: Socket, roomId: string) => () => {
    fakedb[roomId].players[socket.id].isPlaying =
      !fakedb[roomId].players[socket.id].isPlaying;

    fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
  };

export const setAnswer =
  (fakedb: FakeDB, socket: Socket, roomId: string) => (answer: number) => {
    const playersInGame = Object.keys(fakedb[roomId].players).filter(
      (playerId) => fakedb[roomId].players[playerId].isPlaying
    );

    if (
      fakedb[roomId].players[socket.id] &&
      playersInGame.length &&
      !fakedb[roomId].areAnswersVisible
    ) {
      fakedb[roomId].isGameRunning = true;
      fakedb[roomId].io.emit("gameUpdated", { isGameRunning: true });

      fakedb[roomId].players[socket.id].answer = answer;
      fakedb[roomId].players[socket.id].voted = true;
      fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
    }
  };

export const revealAnswers =
  (fakedb: FakeDB, socket: Socket, roomId: string) => () => {
    const playersInGame = Object.keys(fakedb[roomId].players).filter(
      (playerId) => fakedb[roomId].players[playerId].isPlaying
    );

    if (
      fakedb[roomId].isGameRunning &&
      fakedb[roomId].players[socket.id] &&
      playersInGame.length
    ) {
      fakedb[roomId].areAnswersVisible = true;
      fakedb[roomId].isGameRunning = false;
      fakedb[roomId].gameHasEnded = true;
      fakedb[roomId].io.emit("gameUpdated", {
        isGameRunning: false,
        areAnswersVisible: true,
        gameHasEnded: true,
      });
      fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
    }
  };

export const restart = (fakedb: FakeDB, roomId: string) => () => {
  fakedb[roomId].isGameRunning = false;
  fakedb[roomId].areAnswersVisible = false;
  fakedb[roomId].gameHasEnded = false;

  const playersInGame = Object.keys(fakedb[roomId].players).filter(
    (playerId) => fakedb[roomId].players[playerId].isPlaying
  );

  playersInGame.forEach((player) => {
    fakedb[roomId].players[player].answer = undefined;
    fakedb[roomId].players[player].voted = false;
    fakedb[roomId].players[player].isPlaying = true;
  });

  fakedb[roomId].io.emit("playersUpdated", fakedb[roomId].players);
  fakedb[roomId].io.emit("gameUpdated", {
    isGameRunning: true,
    areAnswersVisible: false,
    gameHasEnded: false,
  });
};

export const startGame = (fakedb: FakeDB, roomId: string) => () => {
  fakedb[roomId].isGameRunning = true;
  fakedb[roomId].io.emit("gameUpdated", {
    isGameRunning: true,
  });
};
