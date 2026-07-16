/**
 * Declarative validation checks (§6). Each lesson's `checks` are plain JSON so
 * they can be serialised and injected into the preview iframe, where the harness
 * (lib/validation/harness.ts) interprets them. `message` is shown to the learner
 * in pt-BR for both pass and fail states.
 */

export type Check =
  | { type: "elementExists"; selector: string; message: string }
  | {
      type: "attribute";
      selector: string;
      /** attribute name, e.g. "viewBox", "d", "points" */
      name: string;
      equals?: string;
      includes?: string;
      matches?: string;
      message: string;
    }
  | {
      type: "computedStyle";
      selector: string;
      prop: string;
      /** exact match of the resolved computed value */
      equals?: string;
      /** substring match (e.g. a transform must contain "matrix") */
      includes?: string;
      /** regex source, tested against the computed value */
      matches?: string;
      /**
       * Read the authored CSSOM value instead of getComputedStyle. Use for
       * newer properties (animation-timeline, view-transition-name) whose
       * computed value varies across browsers, or for pseudo-class selectors.
       */
      declared?: boolean;
      message: string;
    }
  | { type: "animationRegistered"; selector: string; message: string }
  | { type: "functionDefined"; name: string; message: string }
  | {
      type: "functionReturns";
      name: string;
      args: unknown[];
      expected: unknown;
      /** allowed absolute error for numeric comparison */
      approx?: number;
      message: string;
    }
  | { type: "rafActive"; message: string }
  | {
      type: "particleCount";
      /** selector whose matched-count is measured after the interaction */
      selector: string;
      min: number;
      /** optional element to click first to trigger the burst */
      clickSelector?: string;
      message: string;
    }
  | { type: "canvasPainted"; selector: string; message: string }
  | {
      /**
       * Evaluate a JS expression inside the preview and require it to be truthy.
       * Reads globals the student's code created (function declarations, `var`s,
       * and top-level `let`/`const` share the page's global lexical scope).
       */
      type: "expression";
      expr: string;
      message: string;
    }
  | {
      type: "reducedMotionRespected";
      selector: string;
      message: string;
    };

export type CheckType = Check["type"];

/** Result of a single check, reported back from the iframe via postMessage. */
export interface CheckResult {
  index: number;
  passed: boolean;
  message: string;
  /** optional extra detail for debugging a failure */
  detail?: string;
}

/** Envelope posted from the iframe harness to the parent workspace. */
export interface ValidationReport {
  source: "faisca-validation";
  ok: boolean;
  results: CheckResult[];
  /** set when the run itself failed (e.g. student code threw, or timed out) */
  error?: string;
}
