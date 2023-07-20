import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./playground.scss";
import Editor from "modules/core/Editor";

const App = () => {
  return <div className="play-editor"><Editor content="Hello World" /></div>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
