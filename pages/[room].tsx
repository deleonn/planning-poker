import { useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Room } from "../components";
import { useName } from "../hooks";

export default function Game() {
  const { query } = useRouter();
  const roomId = useMemo(() => query.room as string, [query]);
  const [name, _, setName] = useName();
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
      <div className="flex flex-col h-screen justify-center w-screen dark:bg-slate-900 items-center">
        <h2 className="text-3xl font-bold underline text-blue-500 mb-4">
          Joining room... What&apos;s your name?
        </h2>

        <div className="flex mb-4 justify-center w-6/12 h-8">
          <input
            className="w-64 bg-transparent underline-offset-1 text-blue-500 outline-none border-2 border-l-0 border-t-0 border-r-0 border-b-blue-500"
            placeholder="Name"
            value={tempName}
            onChange={(event) => setTempName(event.currentTarget.value)}
          />
          <button
            onClick={join}
            className="bg-blue-500 text-white rounded w-40 ml-2"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return <Room roomId={roomId} />;
}
