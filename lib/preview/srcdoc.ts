import type { EditorFile } from "@/content/curriculum";
import type { Check } from "@/lib/validation/types";
import { HARNESS_SCRIPT, PRELUDE_SCRIPT } from "./scripts";

interface BuildOptions {
  /** When present, the validation harness + these checks are appended. */
  checks?: Check[];
  runId?: string;
}

function byLang(files: EditorFile[], lang: EditorFile["lang"]): string {
  return files
    .filter((f) => f.lang === lang)
    .map((f) => f.content)
    .join("\n\n");
}

/**
 * Assemble the sandboxed iframe document from the student's files. The prelude
 * (console bridge + rAF spy) always runs first; the validation harness is only
 * appended when checks are provided ("Verificar"). Everything is inline — no
 * external resources — so the preview runs with the Wi-Fi off.
 */
export function buildSrcdoc(
  files: EditorFile[],
  opts: BuildOptions = {},
): string {
  const html = byLang(files, "html");
  const css = byLang(files, "css");
  const js = byLang(files, "js");

  const validation = opts.checks
    ? `<script>window.__FAISCA_CHECKS__ = ${JSON.stringify(
        opts.checks,
      )}; window.__FAISCA_RUN_ID__ = ${JSON.stringify(opts.runId ?? "")};</script>
<script>${HARNESS_SCRIPT}</script>`
    : "";

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script>${PRELUDE_SCRIPT}</script>
<style>
  html, body { margin: 0; height: 100%; }
  body { font-family: system-ui, sans-serif; color: #111; }
</style>
<style>
${css}
</style>
</head>
<body>
${html}
<!-- Student JS runs at top-level script scope so function declarations become
     globals (the functionDefined/functionReturns checks read window[name]).
     Runtime errors are surfaced by the prelude's window.onerror bridge. -->
<script>
${js}
</script>
${validation}
</body>
</html>`;
}
