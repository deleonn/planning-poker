import { generate } from "randomstring";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useName(): [
  name: string,
  uid: string,
  setName: (name: string) => void
] {
  const [name, setNameState] = useState(
    globalThis?.sessionStorage?.getItem("name") || ""
  );
  const uid = useMemo(
    () => globalThis?.sessionStorage?.getItem("uid") || generate(15),
    []
  );

  useEffect(() => {
    globalThis?.sessionStorage?.setItem("uid", uid);
  }, [uid]);

  const setName = useCallback((name: string) => {
    setNameState(() => {
      sessionStorage.setItem("name", name);
      return name;
    });
  }, []);

  return [name, uid, setName];
}
