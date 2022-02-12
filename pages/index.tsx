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
    console.log(event.currentTarget.value);
    setName(event.currentTarget.value);
  };

  const handleSetRoom = (event) => {
    console.log(event.currentTarget.value);
    setRoom(event.currentTarget.value);
  };

  return (
    <div>
      <input placeholder="Name" value={name} onChange={handleSetName} />
      <button onClick={createNewRoom}>Create New Room</button>
      <div>
        <input placeholder="Room ID" value={room} onChange={handleSetRoom} />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
