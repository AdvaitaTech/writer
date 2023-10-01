"use client";
import React, { StrictMode, useRef, useState } from "react";
import "./page.scss";
import "src/modules/core/ui/base.scss";
import { Writer, AdvaitaWriterRef } from "src/modules/core/Editor";

const App = () => {
  const [preview, setPreview] = useState<boolean>(false);
  const [html, setHtml] = useState<any>(
    "<h1>Journal Entry</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum sollicitudin porta. Curabitur pulvinar sed arcu in vestibulum. Vivamus porta tellus augue, ut bibendum massa aliquam at. Vestibulum risus arcu, congue id facilisis ut, maximus ut ante. Donec justo libero, pharetra in ligula nec, venenatis sodales nibh. Nam vel mollis ante, at elementum eros. Nulla quis tortor in quam feugiat aliquet sit amet ac augue.</p> <p>Morbi varius, dolor ac fermentum egestas, nulla elit imperdiet sem, non congue urna lectus quis mi. Nulla ex eros, semper ut est eu, consectetur luctus mi. Pellentesque ultrices malesuada dui vitae iaculis. Vestibulum aliquam enim eget neque congue euismod. Cras at sapien pellentesque elit porttitor convallis. Etiam pellentesque nisl a nunc pharetra, nec feugiat augue tempor. Donec tempus, ligula sit amet porta iaculis, nisi odio ultrices lacus, et vulputate nunc tortor vitae nunc.</p>"
  );
  const editorRef = useRef<AdvaitaWriterRef>();

  return (
    <div className="adv-editor">
      <button
        className="previewBtn"
        onClick={() => {
          console.log("yeah", editorRef.current);
          setHtml(editorRef.current?.exportHTML());
          setPreview(preview ? false : true);
        }}
      >
        {preview ? "Edit" : "Preview"}
      </button>
      {preview ? (
        <div className="editor">
          <div className="adv-content">
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>
      ) : (
        <Writer
          setEditorRef={(ref) => (editorRef.current = ref)}
          content={html}
          styles="editor"
        />
      )}
    </div>
  );
};

export default function PlaygroundPage() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}
