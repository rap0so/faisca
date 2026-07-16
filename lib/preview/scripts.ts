/**
 * Scripts injected into the preview iframe. Authored as strings because they run
 * in the sandboxed document, not in the React app. Everything here is local —
 * no external requests — so the preview works fully offline.
 */

/**
 * Runs FIRST, before the student's code. Bridges console + errors to the parent
 * and installs a requestAnimationFrame spy so the `rafActive` check can tell
 * whether an animation loop is running.
 */
export const PRELUDE_SCRIPT = /* js */ `
(function () {
  var TARGET = "faisca-preview";
  function post(payload) {
    try { parent.postMessage(Object.assign({ source: TARGET }, payload), "*"); }
    catch (e) {}
  }
  function serialize(a) {
    return Array.prototype.map.call(a, function (v) {
      if (typeof v === "string") return v;
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }).join(" ");
  }
  ["log", "warn", "error", "info"].forEach(function (level) {
    var orig = console[level] ? console[level].bind(console) : function () {};
    console[level] = function () {
      post({ kind: "console", level: level, text: serialize(arguments) });
      orig.apply(null, arguments);
    };
  });
  window.addEventListener("error", function (e) {
    post({ kind: "console", level: "error", text: (e.message || "Erro") + (e.lineno ? " (linha " + e.lineno + ")" : "") });
  });
  window.addEventListener("unhandledrejection", function (e) {
    post({ kind: "console", level: "error", text: "Promise rejeitada: " + (e.reason && e.reason.message ? e.reason.message : e.reason) });
  });

  // rAF spy
  window.__faiscaRafUsed = false;
  var rawRaf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
  if (rawRaf) {
    window.requestAnimationFrame = function (cb) {
      window.__faiscaRafUsed = true;
      return rawRaf(cb);
    };
  }
})();
`;

/**
 * The validation harness. Reads a global `__FAISCA_CHECKS__` (JSON array of
 * checks) plus `__FAISCA_RUN_ID__`, runs each check against the live document,
 * and posts a ValidationReport back to the parent. Runs after a short delay so
 * animations / rAF loops have a chance to start.
 */
export const HARNESS_SCRIPT = /* js */ `
(function () {
  var checks = window.__FAISCA_CHECKS__ || [];
  var runId = window.__FAISCA_RUN_ID__;

  function declaredValue(selector, prop) {
    // Read the authored value from the CSSOM — used for pseudo-class selectors
    // (:hover, :focus) that can't be measured with getComputedStyle.
    var wanted = selector.replace(/\\s+/g, "");
    var sheets = document.styleSheets;
    var found = null;
    for (var i = 0; i < sheets.length; i++) {
      var rules;
      try { rules = sheets[i].cssRules; } catch (e) { continue; }
      if (!rules) continue;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (!r.selectorText) continue;
        var sels = r.selectorText.split(",");
        for (var k = 0; k < sels.length; k++) {
          if (sels[k].replace(/\\s+/g, "") === wanted) {
            var v = r.style.getPropertyValue(prop);
            if (v) found = v.trim();
          }
        }
      }
    }
    return found;
  }

  function styleValue(selector, prop, forceDeclared) {
    if (forceDeclared || /:(hover|focus|active|visited|focus-visible|focus-within)/.test(selector)) {
      return declaredValue(selector, prop);
    }
    var el = document.querySelector(selector);
    if (!el) return null;
    return getComputedStyle(el).getPropertyValue(prop).trim();
  }

  function matchValue(value, check) {
    if (value == null) return false;
    if (check.equals !== undefined) return value === check.equals;
    if (check.includes !== undefined) return value.indexOf(check.includes) !== -1;
    if (check.matches !== undefined) return new RegExp(check.matches).test(value);
    return value !== "" && value !== "none";
  }

  function hasReducedMotionGuard(selector) {
    var wanted = selector.replace(/\\s+/g, "");
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      var rules;
      try { rules = sheets[i].cssRules; } catch (e) { continue; }
      if (!rules) continue;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.type !== 4 /* CSSMediaRule */) continue;
        if (r.conditionText.indexOf("prefers-reduced-motion") === -1) continue;
        if (r.conditionText.indexOf("reduce") === -1) continue;
        for (var k = 0; k < r.cssRules.length; k++) {
          var inner = r.cssRules[k];
          if (!inner.selectorText) continue;
          var sels = inner.selectorText.replace(/\\s+/g, "").split(",");
          var hits = sels.indexOf(wanted) !== -1 || sels.indexOf("*") !== -1;
          if (!hits) continue;
          var anim = inner.style.getPropertyValue("animation") + inner.style.getPropertyValue("animation-duration") + inner.style.getPropertyValue("transition") + inner.style.getPropertyValue("transition-duration");
          if (/none|0s|0\\.0*1?ms|0ms/.test(anim)) return true;
        }
      }
    }
    return false;
  }

  function runCheck(check) {
    switch (check.type) {
      case "elementExists":
        return !!document.querySelector(check.selector);
      case "attribute": {
        var attrEl = document.querySelector(check.selector);
        if (!attrEl) return { ok: false, detail: "elemento não encontrado" };
        return matchValue(attrEl.getAttribute(check.name), check);
      }
      case "computedStyle":
        return matchValue(
          styleValue(check.selector, check.prop, check.declared),
          check,
        );
      case "animationRegistered": {
        var el = document.querySelector(check.selector);
        if (!el || !el.getAnimations) return false;
        return el.getAnimations().length > 0;
      }
      case "functionDefined":
        return typeof window[check.name] === "function";
      case "functionReturns": {
        if (typeof window[check.name] !== "function") return { ok: false, detail: check.name + " não está definida" };
        var got;
        try { got = window[check.name].apply(null, check.args || []); }
        catch (e) { return { ok: false, detail: "erro ao chamar: " + e.message }; }
        if (typeof check.expected === "number" && typeof got === "number") {
          var tol = check.approx != null ? check.approx : 1e-9;
          return { ok: Math.abs(got - check.expected) <= tol, detail: "retornou " + got };
        }
        return { ok: JSON.stringify(got) === JSON.stringify(check.expected), detail: "retornou " + JSON.stringify(got) };
      }
      case "rafActive":
        return window.__faiscaRafUsed === true;
      case "particleCount": {
        if (check.clickSelector) {
          var trg = document.querySelector(check.clickSelector);
          if (trg) trg.click();
        }
        var n = document.querySelectorAll(check.selector).length;
        return { ok: n >= check.min, detail: n + " elemento(s)" };
      }
      case "canvasPainted": {
        var c = document.querySelector(check.selector);
        if (!c || !c.getContext) return false;
        var ctx = c.getContext("2d");
        if (!ctx) return false;
        var w = c.width, h = c.height, data;
        try { data = ctx.getImageData(0, 0, w, h).data; } catch (e) { return { ok: false, detail: "canvas protegido" }; }
        for (var p = 0; p < data.length; p += 4) {
          if (data[p + 3] > 8) return true; // any non-transparent pixel
        }
        return { ok: false, detail: "canvas vazio" };
      }
      case "expression": {
        try {
          // Indirect eval runs in global scope; a nested (0,eval) still sees
          // the page's global lexical bindings created by other scripts.
          return !!eval(check.expr);
        } catch (e) {
          return { ok: false, detail: e.message };
        }
      }
      case "reducedMotionRespected":
        return hasReducedMotionGuard(check.selector);
      default:
        return { ok: false, detail: "check desconhecido: " + check.type };
    }
  }

  function report() {
    var results = checks.map(function (check, index) {
      var out;
      try { out = runCheck(check); }
      catch (e) { out = { ok: false, detail: e.message }; }
      var passed = typeof out === "object" ? !!out.ok : !!out;
      var detail = typeof out === "object" ? out.detail : undefined;
      return { index: index, passed: passed, message: check.message, detail: detail };
    });
    parent.postMessage({
      source: "faisca-validation",
      runId: runId,
      ok: results.every(function (r) { return r.passed; }),
      results: results
    }, "*");
  }

  // Give animations / rAF loops a moment to start before measuring.
  if (document.readyState === "complete") setTimeout(report, 350);
  else window.addEventListener("load", function () { setTimeout(report, 350); });
})();
`;
