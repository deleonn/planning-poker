import { AppProps } from "next/app";

import "../styles/globals.css";
import "../styles/cards.css";
import "../styles/buttons.css";
import "../styles/room.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
