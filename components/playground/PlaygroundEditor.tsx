"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import type { EditorFile } from "@/content/curriculum";
import { buildSrcdoc } from "@/lib/preview/srcdoc";
import styles from "./PlaygroundEditor.module.css";

const DEFAULTS: EditorFile[] = [
  { name: "index.html", lang: "html", content: '<div class="box"></div>\n' },
  {
    name: "styles.css",
    lang: "css",
    content: `.box {
  width: 90px;
  height: 90px;
  margin: 60px auto;
  border-radius: 18px;
  background: #7c5cff;
  animation: spin 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}
@keyframes spin {
  50% { transform: rotate(180deg) scale(1.3); border-radius: 50%; }
}
`,
  },
  { name: "script.js", lang: "js", content: "// experimente à vontade\n" },
];

export function PlaygroundEditor() {
  const [files, setFiles] = useState<EditorFile[]>(() =>
    structuredClone(DEFAULTS),
  );
  const [active, setActive] = useState(0);
  const [doc, setDoc] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDoc(buildSrcdoc(files)), 400);
    return () => clearTimeout(t);
  }, [files]);

  const activeFile = files[active];
  const update = useMemo(
    () => (content: string) =>
      setFiles((prev) => {
        const next = prev.slice();
        next[active] = { ...next[active], content };
        return next;
      }),
    [active],
  );

  async function saveSnippet() {
    setSaving(true);
    setSaved(null);
    const title =
      typeof window !== "undefined"
        ? window.prompt("Nome do snippet:", "Sem título")
        : "Sem título";
    if (title === null) {
      setSaving(false);
      return;
    }
    try {
      await fetch("/api/snippets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, files }),
      });
      setSaved(`"${title}" salvo`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.grid}>
      <div className={styles.left}>
        <div className={styles.bar}>
          <div className={styles.tabs}>
            {files.map((f, i) => (
              <button
                key={f.name}
                type="button"
                className={styles.tab}
                data-active={i === active || undefined}
                onClick={() => setActive(i)}
              >
                {f.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.save}
            onClick={saveSnippet}
            disabled={saving}
          >
            {saving ? "Salvando…" : "Salvar snippet"}
          </button>
        </div>
        {activeFile && (
          <div className={styles.editor}>
            <CodeEditor
              fileKey={activeFile.name}
              lang={activeFile.lang}
              value={activeFile.content}
              onChange={update}
            />
          </div>
        )}
        {saved && <p className={styles.savedNote}>{saved}</p>}
      </div>
      <div className={styles.previewWrap}>
        <iframe
          className={styles.iframe}
          title="Preview do playground"
          sandbox="allow-scripts allow-modals"
          srcDoc={doc}
        />
      </div>
    </div>
  );
}
