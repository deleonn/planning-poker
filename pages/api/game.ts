// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { loadRoom } from "../../shared/handlers";

type NextApiResponseWithIO = NextApiResponse & {
  socket: {
    server: HTTPServer & { io?: Server };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithIO
) {
  const roomId = req.query.room as string;
  const roomList = res.socket?.server?.io
    ? Array.from(res.socket?.server?.io._nsps.keys())
    : [];

  if (roomId && !roomList.includes(`/${roomId}`)) {
    const io = res.socket.server.io || new Server(res.socket.server);

    loadRoom(io, roomId);

    res.socket.server.io = io;
  }

  res.end();
}
