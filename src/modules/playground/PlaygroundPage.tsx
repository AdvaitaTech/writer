import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./playground.scss";

const App = () => {
  return <div className="editor">Hello World</div>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
