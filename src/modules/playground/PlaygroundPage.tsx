import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./playground.scss";
import Editor from "modules/core/Editor";

const App = () => {
  return (
    <Editor
      content="<h1>Journal Entry</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum sollicitudin porta. Curabitur pulvinar sed arcu in vestibulum. Vivamus porta tellus augue, ut bibendum massa aliquam at. Vestibulum risus arcu, congue id facilisis ut, maximus ut ante. Donec justo libero, pharetra in ligula nec, venenatis sodales nibh. Nam vel mollis ante, at elementum eros. Nulla quis tortor in quam feugiat aliquet sit amet ac augue.</p> <p>Morbi varius, dolor ac fermentum egestas, nulla elit imperdiet sem, non congue urna lectus quis mi. Nulla ex eros, semper ut est eu, consectetur luctus mi. Pellentesque ultrices malesuada dui vitae iaculis. Vestibulum aliquam enim eget neque congue euismod. Cras at sapien pellentesque elit porttitor convallis. Etiam pellentesque nisl a nunc pharetra, nec feugiat augue tempor. Donec tempus, ligula sit amet porta iaculis, nisi odio ultrices lacus, et vulputate nunc tortor vitae nunc.</p>"
    />
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
