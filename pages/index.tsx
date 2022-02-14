import { generate } from "randomstring";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useName } from "../hooks";

export default function Home() {
  const [name, uid, setName] = useName();
  const [room, setRoom] = useState("");
  const { push } = useRouter();

  const createNewRoom = useCallback(() => {
    if (!name) {
      return alert("Please provide your name");
    }

    push(`/${generate(10)}`);
  }, []);

  const joinRoom = () => {
    if (!name) {
      return alert("Please provide your name");
    }

    if (room && room.length > 6) {
      push(`/${room}`);
    } else {
      alert("Room ID should contain at least 7 charts");
    }
  };

  const handleSetName = (event) => {
    setName(event.currentTarget.value);
  };

  const handleSetRoom = (event) => {
    setRoom(event.currentTarget.value);
  };

  return (
    <div className="flex flex-col h-screen justify-center w-screen dark:bg-slate-900 items-center">
      <h1 className="text-3xl font-bold underline text-blue-500 mb-4">
        Planning Poker
      </h1>

      <div className="flex mb-4 justify-center w-6/12 h-8">
        <input
          className="w-64 bg-transparent underline-offset-1 text-blue-500 outline-none border-2 border-l-0 border-t-0 border-r-0 border-b-blue-500"
          placeholder="Name"
          value={name}
          onChange={handleSetName}
        />
        <button
          className="bg-blue-500 text-white rounded w-40 ml-2"
          onClick={createNewRoom}
        >
          Create New Room
        </button>
      </div>
      <div className="flex mb-4 justify-center w-6/12 h-8">
        <input
          className="w-64 bg-transparent underline-offset-1 text-blue-500 outline-none border-2 border-l-0 border-t-0 border-r-0 border-b-blue-500"
          placeholder="Room ID"
          value={room}
          onChange={handleSetRoom}
        />
        <button
          className="bg-blue-500 text-white rounded w-40 ml-2"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-5 text-blue-500 w-screen text-center">
        by{" "}
        <a className="text-blue-300" href="https://github.com/deleonn">
          @deleonn
        </a>{" "}
        and{" "}
        <a className="text-blue-300" href="https://github.com/edgravill">
          @edgravill
        </a>
      </div>
    </div>
  );
}
