"use client";

import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef } from "react";
import type { EditorLang } from "@/content/curriculum";
import styles from "./CodeEditor.module.css";

const LANG_EXT = {
  html: () => htmlLang(),
  css: () => cssLang(),
  js: () => jsLang({ jsx: true, typescript: true }),
} as const;

interface Props {
  /** identity of the open file — a change rebuilds the editor state */
  fileKey: string;
  lang: EditorLang;
  value: string;
  onChange: (next: string) => void;
}

/** CodeMirror 6 editor. Fully local (packages via npm), no CDN. */
export function CodeEditor({ fileKey, lang, value, onChange }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Rebuild the editor whenever the open file changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: value is seeded only on file switch by design
  useEffect(() => {
    if (!host.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        LANG_EXT[lang](),
        oneDark,
        EditorView.theme({
          "&": { height: "100%", fontSize: "13.5px" },
          ".cm-scroller": { fontFamily: "var(--font-mono)" },
          "&.cm-focused": { outline: "none" },
        }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChangeRef.current(u.state.doc.toString());
        }),
      ],
    });

    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => v.destroy();
  }, [fileKey, lang]);

  return <div ref={host} className={styles.editor} />;
}
