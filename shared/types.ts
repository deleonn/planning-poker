import { Namespace } from "socket.io";

export type Player = {
  name: string;
  isPlaying: boolean;
  isLeader: boolean;
  uid: string;
  answer: number;
  voted: boolean;
};

export type Room = {
  io: Namespace;
  players: {
    [id: string]: Player;
  };
  isGameRunning: boolean;
  areAnswersVisible: boolean;
  gameHasEnded: boolean;
};

export type FakeDB = Record<string, Room>;
