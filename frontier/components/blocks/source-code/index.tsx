'use client';
import React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type TSourceCode = {
  code: string;
  highlight?: number;
  /**
   * @default 'javascript'
   */
  language?: string;
};

export default function SourceCode(props: TSourceCode) {
  const { code, highlight, language = 'javascript' } = props;
  const [hasEditor, setHasEditor] = React.useState(false);

  const editorRef = React.useRef(null);

  function createEditor() {
    if (hasEditor) return;

    if (editorRef.current) {
      monaco.editor.create(editorRef.current, {
        value: code,
        automaticLayout: true,
        readOnly: true,
        language,
        theme: 'vs-dark',
      });
      setHasEditor(true);
    }
  }

  React.useEffect(() => {
    if (!hasEditor) {
      createEditor();
    }
  }, []);

  return <div className="w-screen h-screen" ref={editorRef}></div>;
}
