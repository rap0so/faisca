"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorFile, Lesson } from "@/content/curriculum";
import { buildSrcdoc } from "@/lib/preview/srcdoc";
import type { CheckResult } from "@/lib/validation/types";
import { Celebration } from "./Celebration";
import { CodeEditor } from "./CodeEditor";
import styles from "./LessonWorkspace.module.css";

type ConsoleMsg = { level: string; text: string; id: number };
type Panel = "preview" | "console" | "checks";

const VALIDATION_TIMEOUT = 4000;
const AUTOSAVE_DEBOUNCE = 800;
const PREVIEW_DEBOUNCE = 400;

interface Props {
  lesson: Lesson;
  initialFiles?: EditorFile[] | null;
  initialAttempts?: number;
  initialCompleted?: boolean;
}

export function LessonWorkspace({
  lesson,
  initialFiles,
  initialAttempts = 0,
  initialCompleted = false,
}: Props) {
  const starter = useMemo(() => lesson.starter ?? [], [lesson.starter]);
  const [files, setFiles] = useState<EditorFile[]>(() =>
    structuredClone(initialFiles?.length ? initialFiles : starter),
  );
  const [active, setActive] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);

  const [previewDoc, setPreviewDoc] = useState("");
  const [panel, setPanel] = useState<Panel>("preview");
  const [logs, setLogs] = useState<ConsoleMsg[]>([]);

  const [attempts, setAttempts] = useState(initialAttempts);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [solutionShown, setSolutionShown] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const [completed, setCompleted] = useState(initialCompleted);
  const [celebrate, setCelebrate] = useState<{ xp: number } | null>(null);

  // Mirrored in a ref because the message listener is installed once (empty
  // deps) and must read the *current* completion state, not the mount value.
  const completedRef = useRef(initialCompleted);
  const runIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logId = useRef(0);

  const isAuto = lesson.validation === "auto" || lesson.validation === "both";
  const isVisual =
    lesson.validation === "visual" || lesson.validation === "both";

  /* --- debounced live preview -------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setLogs([]);
      setPreviewDoc(buildSrcdoc(files));
    }, PREVIEW_DEBOUNCE);
    return () => clearTimeout(t);
  }, [files]);

  /* --- autosave --------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      void fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "save", slug: lesson.slug, files }),
      }).catch(() => {});
    }, AUTOSAVE_DEBOUNCE);
    return () => clearTimeout(t);
  }, [files, lesson.slug]);

  /* --- messages from the iframe ----------------------------- */
  // biome-ignore lint/correctness/useExhaustiveDependencies: listener installed once; latest state read via refs/updaters
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.source === "faisca-preview" && d.kind === "console") {
        setLogs((prev) => [
          ...prev.slice(-40),
          { level: d.level, text: d.text, id: logId.current++ },
        ]);
      }
      if (
        d.source === "faisca-validation" &&
        d.runId === String(runIdRef.current)
      ) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setRunning(false);
        setResults(d.results as CheckResult[]);
        setRunError(null);
        if (d.ok) void handlePassed();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const updateActiveFile = useCallback(
    (content: string) => {
      setFiles((prev) => {
        const next = prev.slice();
        next[active] = { ...next[active], content };
        return next;
      });
    },
    [active],
  );

  async function complete() {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "complete", slug: lesson.slug }),
    });
    const data = await res.json();
    completedRef.current = true;
    setCompleted(true);
    if (!data.alreadyCompleted)
      setCelebrate({ xp: data.gainedXp ?? lesson.xp });
  }

  async function handlePassed() {
    if (!completedRef.current) await complete();
  }

  async function verify() {
    if (!isAuto || !lesson.checks) return;
    setPanel("checks");
    setResults(null);
    setRunError(null);
    setRunning(true);
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);
    void fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "attempt", slug: lesson.slug }),
    }).catch(() => {});

    runIdRef.current += 1;
    const runId = String(runIdRef.current);
    setLogs([]);
    setPreviewDoc(buildSrcdoc(files, { checks: lesson.checks, runId }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setRunning(false);
      setRunError(
        "O código não respondeu a tempo — talvez tenha travado num loop infinito. Revise e tente de novo.",
      );
    }, VALIDATION_TIMEOUT);
  }

  function resetCode() {
    setFiles(structuredClone(starter));
    setResults(null);
    setRunError(null);
    setResetNonce((n) => n + 1);
    setActive(0);
  }

  function showSolution() {
    if (!lesson.solution) return;
    setFiles(structuredClone(lesson.solution));
    setSolutionShown(true);
    setResetNonce((n) => n + 1);
    setActive(0);
    // Tell the server so the "Persistente"/"Perfeccionista" badges know.
    void fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reveal", slug: lesson.slug }),
    }).catch(() => {});
  }

  const activeFile = files[active];
  const passedCount = results?.filter((r) => r.passed).length ?? 0;

  return (
    <div className={styles.workspace}>
      {celebrate && (
        <Celebration xp={celebrate.xp} onDone={() => setCelebrate(null)} />
      )}

      {/* --- editor with file tabs --- */}
      <div className={styles.editorPane}>
        <div className={styles.tabs} role="tablist" aria-label="Arquivos">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={styles.tab}
              data-active={i === active || undefined}
              onClick={() => setActive(i)}
            >
              {f.name}
            </button>
          ))}
        </div>
        {activeFile && (
          <CodeEditor
            fileKey={`${lesson.slug}:${activeFile.name}:${resetNonce}`}
            lang={activeFile.lang}
            value={activeFile.content}
            onChange={updateActiveFile}
          />
        )}
      </div>

      {/* --- action bar --- */}
      <div className={styles.actions}>
        {isAuto && (
          <button
            type="button"
            className={styles.primary}
            onClick={verify}
            disabled={running}
          >
            {running ? "Verificando…" : "Verificar"}
          </button>
        )}
        {isVisual && !isAuto && (
          <button
            type="button"
            className={styles.primary}
            onClick={complete}
            disabled={completed}
          >
            {completed ? "Concluída ✓" : "Marcar como concluída"}
          </button>
        )}
        <button type="button" className={styles.ghost} onClick={resetCode}>
          Resetar código
        </button>
        {lesson.solution && (
          <button
            type="button"
            className={styles.ghost}
            onClick={showSolution}
            disabled={attempts < 2}
            title={
              attempts < 2
                ? "Disponível após 2 tentativas"
                : "Revela a solução de referência"
            }
          >
            Ver solução{attempts < 2 ? ` (${2 - attempts} p/ liberar)` : ""}
          </button>
        )}
        {isVisual && isAuto && (
          <button
            type="button"
            className={styles.ghost}
            onClick={complete}
            disabled={completed}
          >
            {completed ? "Concluída ✓" : "Marcar como concluída"}
          </button>
        )}
      </div>

      {/* --- lower panel: preview / console / checks --- */}
      <div className={styles.lower}>
        <div className={styles.panelTabs}>
          <PanelTab
            id="preview"
            panel={panel}
            setPanel={setPanel}
            label="Preview"
          />
          <PanelTab
            id="console"
            panel={panel}
            setPanel={setPanel}
            label={`Console${logs.length ? ` (${logs.length})` : ""}`}
          />
          {(isAuto || lesson.checklist) && (
            <PanelTab
              id="checks"
              panel={panel}
              setPanel={setPanel}
              label={isAuto ? "Verificação" : "Checklist"}
            />
          )}
        </div>

        <div className={styles.panelBody}>
          {/* keep the iframe mounted so it isn't torn down between tabs */}
          <div hidden={panel !== "preview"} className={styles.previewWrap}>
            <iframe
              className={styles.iframe}
              title="Preview da lição"
              sandbox="allow-scripts allow-modals"
              srcDoc={previewDoc}
            />
          </div>

          {panel === "console" && (
            <div className={styles.console}>
              {logs.length === 0 ? (
                <p className={styles.emptyConsole}>
                  Nada no console ainda. Use <code>console.log()</code> no seu
                  JS para ver mensagens aqui.
                </p>
              ) : (
                logs.map((l) => (
                  <div
                    key={l.id}
                    className={styles.logLine}
                    data-level={l.level}
                  >
                    {l.text}
                  </div>
                ))
              )}
            </div>
          )}

          {panel === "checks" && (
            <div className={styles.checks}>
              {solutionShown && (
                <p className={styles.solutionNote}>
                  Solução revelada — dá uma boa olhada e depois tente refazer
                  com suas palavras. Aprender é reescrever.
                </p>
              )}
              {isAuto && runError && (
                <p className={styles.runError}>{runError}</p>
              )}
              {isAuto && running && (
                <p className={styles.checkPending}>Rodando os checks…</p>
              )}
              {isAuto && results && !running && (
                <>
                  <p className={styles.checkScore}>
                    {passedCount}/{results.length} checks passando
                    {results.every((r) => r.passed) && " — mandou bem! 🎉"}
                  </p>
                  <ul className={styles.checkList}>
                    {results.map((r) => (
                      <li
                        key={r.index}
                        className={styles.checkItem}
                        data-passed={r.passed || undefined}
                      >
                        <span className={styles.checkIcon} aria-hidden="true">
                          {r.passed ? "✓" : "✕"}
                        </span>
                        <span>
                          {r.message}
                          {!r.passed && r.detail && (
                            <em className={styles.checkDetail}>
                              {" "}
                              — {r.detail}
                            </em>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {isAuto && !results && !running && !runError && (
                <p className={styles.emptyConsole}>
                  Clique em <strong>Verificar</strong> para rodar os checks
                  desta lição.
                </p>
              )}

              {lesson.checklist && (
                <div className={styles.checklist}>
                  {isAuto && (
                    <p className={styles.checklistKicker}>Auto-avaliação</p>
                  )}
                  <p className={styles.checklistIntro}>
                    Passar nos testes é o mínimo. Julgue o <em>gosto</em> da sua
                    interação:
                  </p>
                  <ul className={styles.checklistItems}>
                    {lesson.checklist.map((item, i) => (
                      <li key={item} className={styles.checklistItem}>
                        <label>
                          <input
                            type="checkbox"
                            checked={checkedItems.has(i)}
                            onChange={() =>
                              setCheckedItems((prev) => {
                                const next = new Set(prev);
                                if (next.has(i)) next.delete(i);
                                else next.add(i);
                                return next;
                              })
                            }
                          />
                          <span>{item}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelTab({
  id,
  panel,
  setPanel,
  label,
}: {
  id: Panel;
  panel: Panel;
  setPanel: (p: Panel) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={styles.panelTab}
      data-active={panel === id || undefined}
      onClick={() => setPanel(id)}
    >
      {label}
    </button>
  );
}
