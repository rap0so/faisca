import type { EditorFile } from "@/content/curriculum";
import type { Check } from "@/lib/validation/types";

/**
 * Exercise payloads (starter code, hidden solution, auto checks, visual
 * checklist) for every authored lesson. Kept out of curriculum.ts so that file
 * stays a readable map of metadata. Attached to lessons by slug at load time.
 */
export interface LessonExercise {
  starter?: EditorFile[];
  solution?: EditorFile[];
  checks?: Check[];
  checklist?: string[];
}

const html = (content: string): EditorFile => ({
  name: "index.html",
  lang: "html",
  content,
});
const css = (content: string): EditorFile => ({
  name: "styles.css",
  lang: "css",
  content,
});
const js = (content: string): EditorFile => ({
  name: "script.js",
  lang: "js",
  content,
});

/* =====================================================================
   MÓDULO 0 — Fundamentos de Movimento
   ===================================================================== */

const m0Transitions: LessonExercise = {
  starter: [
    html(`<!-- Um cartão simples. Faça-o crescer suavemente ao passar o mouse. -->
<div class="card">
  <span>Passe o mouse</span>
</div>`),
    css(`.card {
  width: 220px;
  height: 140px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #7c5cff;
  color: white;
  font-family: system-ui, sans-serif;
  font-weight: 600;

  /* 1. Faça o cartão animar a propriedade transform.
     2. Use uma duração de 240ms.
     3. No hover, aumente a escala para 1.08. */
}

.card:hover {
  /* seu código aqui */
}
`),
  ],
  solution: [
    html(`<div class="card">
  <span>Passe o mouse</span>
</div>`),
    css(`.card {
  width: 220px;
  height: 140px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #7c5cff;
  color: white;
  font-family: system-ui, sans-serif;
  font-weight: 600;

  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover {
  transform: scale(1.08);
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".card",
      message: "Existe um elemento com a classe .card",
    },
    {
      type: "computedStyle",
      selector: ".card",
      prop: "transition-property",
      includes: "transform",
      message: "A .card faz transition da propriedade transform",
    },
    {
      type: "computedStyle",
      selector: ".card",
      prop: "transition-duration",
      equals: "0.24s",
      message: "A duração da transição é 240ms",
    },
    {
      type: "computedStyle",
      selector: ".card:hover",
      prop: "transform",
      matches: "scale\\(\\s*1\\.08",
      message: "No hover, a .card recebe transform: scale(1.08)",
    },
  ],
};

const m0Easing: LessonExercise = {
  starter: [
    html(`<div class="stage">
  <div class="ball"></div>
</div>`),
    css(`.stage {
  padding: 40px;
  display: grid;
  place-items: start center;
}
.ball {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffb03a;
}
.ball:hover {
  transform: translateY(120px);
}

/* A bolinha cai ao passar o mouse — mas o movimento está sem vida.
   1. Adicione uma transition na propriedade transform.
   2. Use a duração de 600ms.
   3. Dê personalidade com o easing de overshoot:
      cubic-bezier(0.34, 1.56, 0.64, 1)
*/
`),
  ],
  solution: [
    html(`<div class="stage">
  <div class="ball"></div>
</div>`),
    css(`.stage {
  padding: 40px;
  display: grid;
  place-items: start center;
}
.ball {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffb03a;
  transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ball:hover {
  transform: translateY(120px);
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".ball",
      message: "A bolinha .ball existe",
    },
    {
      type: "computedStyle",
      selector: ".ball",
      prop: "transition-duration",
      equals: "0.6s",
      message: "A duração é 600ms",
    },
    {
      type: "computedStyle",
      selector: ".ball",
      prop: "transition-timing-function",
      equals: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      message: "O easing é o cubic-bezier de overshoot",
    },
  ],
};

const m0Keyframes: LessonExercise = {
  starter: [
    html(`<div class="dot"></div>`),
    css(`.dot {
  width: 70px;
  height: 70px;
  margin: 60px auto;
  border-radius: 50%;
  background: #3ecf8e;
}

/* Faça o ponto "pulsar" para sempre:
   1. Crie um @keyframes chamado pulse.
   2. No meio (50%), aumente a escala para 1.4 e reduza a opacidade.
   3. Aplique a animação na .dot: 1.5s, repetindo infinitamente.
*/
`),
  ],
  solution: [
    html(`<div class="dot"></div>`),
    css(`.dot {
  width: 70px;
  height: 70px;
  margin: 60px auto;
  border-radius: 50%;
  background: #3ecf8e;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    transform: scale(1.4);
    opacity: 0.5;
  }
}
`),
  ],
  checks: [
    { type: "elementExists", selector: ".dot", message: "O ponto .dot existe" },
    {
      type: "computedStyle",
      selector: ".dot",
      prop: "animation-name",
      includes: "pulse",
      message: "A .dot usa a animação chamada pulse",
    },
    {
      type: "computedStyle",
      selector: ".dot",
      prop: "animation-iteration-count",
      equals: "infinite",
      message: "A animação repete infinitamente",
    },
    {
      type: "animationRegistered",
      selector: ".dot",
      message: "A animação está de fato rodando",
    },
  ],
};

const m0Compositing: LessonExercise = {
  starter: [
    html(`<div class="track">
  <div class="mover">arraste-me com a mente</div>
</div>`),
    css(`.track {
  padding: 30px;
  overflow: hidden;
}
.mover {
  width: 200px;
  padding: 20px;
  border-radius: 12px;
  background: #7c5cff;
  color: white;
  font-family: system-ui, sans-serif;
  position: relative;
  left: 0;
  transition: left 400ms ease;
}
.track:hover .mover {
  left: 180px;
}

/* Este código anima a propriedade "left" — e isso força o navegador a
   recalcular o layout a cada frame (caro!).
   Refatore para usar TRANSFORM, que roda no compositor (GPU):
   1. Troque a transition de "left" para "transform".
   2. Remova o "left" e no hover use transform: translateX(180px).
*/
`),
  ],
  solution: [
    html(`<div class="track">
  <div class="mover">arraste-me com a mente</div>
</div>`),
    css(`.track {
  padding: 30px;
  overflow: hidden;
}
.mover {
  width: 200px;
  padding: 20px;
  border-radius: 12px;
  background: #7c5cff;
  color: white;
  font-family: system-ui, sans-serif;
  transition: transform 400ms ease;
}
.track:hover .mover {
  transform: translateX(180px);
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".mover",
      message: "O elemento .mover existe",
    },
    {
      type: "computedStyle",
      selector: ".mover",
      prop: "transition-property",
      includes: "transform",
      message: "A transition agora anima transform (não left)",
    },
    {
      type: "computedStyle",
      selector: ".track:hover .mover",
      prop: "transform",
      matches: "translate",
      message: "No hover, o movimento usa translateX",
    },
  ],
};

const m0ReducedMotion: LessonExercise = {
  starter: [
    html(`<div class="spinner"></div>`),
    css(`.spinner {
  width: 64px;
  height: 64px;
  margin: 60px auto;
  border-radius: 50%;
  border: 6px solid #232734;
  border-top-color: #ffb03a;
  animation: spin 900ms linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Este spinner gira sem parar — um pesadelo para quem tem sensibilidade
   vestibular. Adicione um guard que DESLIGA a animação quando o usuário
   pediu menos movimento:

   @media (prefers-reduced-motion: reduce) {
     .spinner { animation: none; }
   }
*/
`),
  ],
  solution: [
    html(`<div class="spinner"></div>`),
    css(`.spinner {
  width: 64px;
  height: 64px;
  margin: 60px auto;
  border-radius: 50%;
  border: 6px solid #232734;
  border-top-color: #ffb03a;
  animation: spin 900ms linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".spinner",
      message: "O spinner existe",
    },
    {
      type: "computedStyle",
      selector: ".spinner",
      prop: "animation-name",
      includes: "spin",
      message: "O spinner tem a animação spin por padrão",
    },
    {
      type: "reducedMotionRespected",
      selector: ".spinner",
      message: "Há um guard de prefers-reduced-motion que desliga a animação",
    },
  ],
};

const m0DesafioBotao: LessonExercise = {
  starter: [
    html(`<div class="wrap">
  <button class="btn">Curtir</button>
</div>`),
    css(`.wrap {
  display: grid;
  place-items: center;
  min-height: 200px;
}
.btn {
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  background: #ffb03a;
  color: #0e0f14;
  font-family: system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
}

/* Dê vida ao botão com uma micro-interação COMPLETA:
   1. transition na propriedade transform (~140ms).
   2. :hover — sobe de leve: translateY(-2px).
   3. :active — afunda no clique: scale(0.94).
   4. :focus-visible — anel de foco visível pelo teclado (outline ou box-shadow).
   5. @media prefers-reduced-motion: reduce — desligue as transições.
*/
`),
  ],
  solution: [
    html(`<div class="wrap">
  <button class="btn">Curtir</button>
</div>`),
    css(`.wrap {
  display: grid;
  place-items: center;
  min-height: 200px;
}
.btn {
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  background: #ffb03a;
  color: #0e0f14;
  font-family: system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1);
}
.btn:hover {
  transform: translateY(-2px);
}
.btn:active {
  transform: scale(0.94);
}
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
`),
  ],
  checks: [
    { type: "elementExists", selector: ".btn", message: "O botão .btn existe" },
    {
      type: "computedStyle",
      selector: ".btn",
      prop: "transition-property",
      includes: "transform",
      message: "O botão faz transition de transform",
    },
    {
      type: "computedStyle",
      selector: ".btn:hover",
      prop: "transform",
      matches: "translate",
      message: ":hover — o botão sobe de leve",
    },
    {
      type: "computedStyle",
      selector: ".btn:active",
      prop: "transform",
      matches: "scale",
      message: ":active — o botão afunda no clique",
    },
    {
      type: "reducedMotionRespected",
      selector: ".btn",
      message: "Há guard de prefers-reduced-motion",
    },
  ],
  checklist: [
    "O hover é sutil — convida sem gritar?",
    "O press dá feedback tátil (parece afundar de verdade)?",
    "O foco pelo teclado (Tab) está claramente visível?",
    "Com reduced-motion ligado, o botão ainda responde, só que sem se mover?",
  ],
};

/* =====================================================================
   MÓDULO 1 — Efeitos de Partículas
   ===================================================================== */

const m1Raf: LessonExercise = {
  starter: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box {
  width: 48px; height: 48px; border-radius: 10px;
  background: #7c5cff;
}`),
    js(`const box = document.querySelector(".box");
let x = 0;

// Crie um loop de animação com requestAnimationFrame:
// 1. Defina uma função frame().
// 2. Dentro dela, aumente x e mova o box com transform: translateX.
// 3. No fim de frame(), chame requestAnimationFrame(frame) de novo.
// 4. Dê o pontapé inicial chamando requestAnimationFrame(frame) uma vez.

`),
  ],
  solution: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box {
  width: 48px; height: 48px; border-radius: 10px;
  background: #7c5cff;
}`),
    js(`const box = document.querySelector(".box");
let x = 0;

function frame() {
  x = (x + 2) % 260;
  box.style.transform = "translateX(" + x + "px)";
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".box",
      message: "O elemento .box existe",
    },
    {
      type: "rafActive",
      message: "Um loop com requestAnimationFrame está rodando",
    },
  ],
};

const m1DomMass: LessonExercise = {
  starter: [
    html(`<div class="ui">
  <button class="spawn">Soltar partículas</button>
  <div class="field"></div>
</div>`),
    css(`.ui { padding: 20px; font-family: system-ui, sans-serif; }
.spawn {
  padding: 10px 18px; border: none; border-radius: 999px;
  background: #ffb03a; color: #0e0f14; font-weight: 700;
}
.field { position: relative; height: 200px; }
.particle {
  position: absolute; top: 100px; left: 50%;
  width: 12px; height: 12px; border-radius: 50%;
  background: #3ecf8e;
}`),
    js(`const field = document.querySelector(".field");
const button = document.querySelector(".spawn");

// Ao clicar no botão, crie 12 elementos <div class="particle"> e
// adicione-os ao .field. Dica: document.createElement + appendChild.

button.addEventListener("click", () => {
  // seu código aqui
});
`),
  ],
  solution: [
    html(`<div class="ui">
  <button class="spawn">Soltar partículas</button>
  <div class="field"></div>
</div>`),
    css(`.ui { padding: 20px; font-family: system-ui, sans-serif; }
.spawn {
  padding: 10px 18px; border: none; border-radius: 999px;
  background: #ffb03a; color: #0e0f14; font-weight: 700;
}
.field { position: relative; height: 200px; }
.particle {
  position: absolute; top: 100px; left: 50%;
  width: 12px; height: 12px; border-radius: 50%;
  background: #3ecf8e;
}`),
    js(`const field = document.querySelector(".field");
const button = document.querySelector(".spawn");

button.addEventListener("click", () => {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    field.appendChild(p);
  }
});
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".spawn",
      message: "O botão .spawn existe",
    },
    {
      type: "particleCount",
      selector: ".particle",
      min: 10,
      clickSelector: ".spawn",
      message: "Ao clicar, pelo menos 10 partículas são criadas",
    },
  ],
};

const m1Lerp: LessonExercise = {
  starter: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Abra o console. Implemente <code>lerp</code> e clique em Verificar.
</p>`),
    js(`// lerp = "linear interpolation": o valor entre A e B numa fração t (0..1).
// t = 0   -> A
// t = 1   -> B
// t = 0.5 -> o ponto do meio
//
// Implemente:
function lerp(a, b, t) {
  // seu código aqui
}

console.log("lerp(0, 100, 0.5) =", lerp(0, 100, 0.5));
`),
  ],
  solution: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Abra o console. Implemente <code>lerp</code> e clique em Verificar.
</p>`),
    js(`function lerp(a, b, t) {
  return a + (b - a) * t;
}

console.log("lerp(0, 100, 0.5) =", lerp(0, 100, 0.5));
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "lerp",
      message: "A função lerp está definida",
    },
    {
      type: "functionReturns",
      name: "lerp",
      args: [0, 100, 0.5],
      expected: 50,
      approx: 1e-6,
      message: "lerp(0, 100, 0.5) === 50",
    },
    {
      type: "functionReturns",
      name: "lerp",
      args: [10, 20, 0.25],
      expected: 12.5,
      approx: 1e-6,
      message: "lerp(10, 20, 0.25) === 12.5",
    },
    {
      type: "functionReturns",
      name: "lerp",
      args: [100, 0, 1],
      expected: 0,
      approx: 1e-6,
      message: "lerp respeita t = 1 (chega em B)",
    },
  ],
};

const m1Trig: LessonExercise = {
  starter: [
    html(`<div class="wave"><div class="rider"></div></div>`),
    css(`.wave {
  height: 200px; display: grid; place-items: center;
}
.rider {
  width: 40px; height: 40px; border-radius: 50%;
  background: #ffb03a;
}`),
    js(`// Uma onda é só o seno subindo e descendo ao longo do tempo.
// Implemente oscillate(t): retorne o seno de t multiplicado por 50
// (a amplitude — o quão alto a onda sobe).
function oscillate(t) {
  // seu código aqui
}

// --- demo: um surfista que sobe e desce na SUA onda ---
const rider = document.querySelector(".rider");
let t = 0;
function frame() {
  t += 0.05;
  rider.style.transform = "translateY(" + oscillate(t) + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(`<div class="wave"><div class="rider"></div></div>`),
    css(`.wave {
  height: 200px; display: grid; place-items: center;
}
.rider {
  width: 40px; height: 40px; border-radius: 50%;
  background: #ffb03a;
}`),
    js(`function oscillate(t) {
  return Math.sin(t) * 50;
}

const rider = document.querySelector(".rider");
let t = 0;
function frame() {
  t += 0.05;
  rider.style.transform = "translateY(" + oscillate(t) + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "oscillate",
      message: "A função oscillate está definida",
    },
    {
      type: "functionReturns",
      name: "oscillate",
      args: [0],
      expected: 0,
      approx: 1e-6,
      message: "oscillate(0) === 0",
    },
    {
      type: "functionReturns",
      name: "oscillate",
      args: [1.5707963267948966],
      expected: 50,
      approx: 1e-4,
      message: "no pico (π/2) a onda chega a 50",
    },
    {
      type: "rafActive",
      message: "O surfista está animando com requestAnimationFrame",
    },
  ],
};

const m1Random: LessonExercise = {
  starter: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>randRange</code> e clique em Verificar.
</p>`),
    js(`// Math.random() dá um número entre 0 e 1. Sozinho ele é pouco útil —
// o truque é MAPEAR esse 0..1 para o intervalo que você quer.
//
// Implemente randRange(min, max, r), onde r é um valor 0..1:
//   r = 0   -> min
//   r = 1   -> max
//   r = 0.5 -> o meio
// (repare: é o mesmo espírito do lerp!)
function randRange(min, max, r) {
  // seu código aqui
}
`),
  ],
  solution: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>randRange</code> e clique em Verificar.
</p>`),
    js(`function randRange(min, max, r) {
  return min + (max - min) * r;
}
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "randRange",
      message: "A função randRange está definida",
    },
    {
      type: "functionReturns",
      name: "randRange",
      args: [10, 20, 0.5],
      expected: 15,
      approx: 1e-6,
      message: "randRange(10, 20, 0.5) === 15",
    },
    {
      type: "functionReturns",
      name: "randRange",
      args: [0, 100, 0],
      expected: 0,
      approx: 1e-6,
      message: "r = 0 devolve o mínimo",
    },
    {
      type: "functionReturns",
      name: "randRange",
      args: [0, 100, 1],
      expected: 100,
      approx: 1e-6,
      message: "r = 1 devolve o máximo",
    },
  ],
};

const m1Physics: LessonExercise = {
  starter: [
    html(`<div class="scene"><div class="ball"></div></div>`),
    css(`.scene { height: 260px; padding: 20px; }
.ball {
  width: 44px; height: 44px; border-radius: 50%;
  background: #7c5cff;
}`),
    js(`// Gravidade é só isto: a cada frame, a velocidade aumenta um pouquinho,
// e a posição anda de acordo com a velocidade.
//
// Implemente stepGravity(state, gravity), com state = { y, vy }:
//   novaVelocidade (vy) = state.vy + gravity
//   novaPosicao   (y)  = state.y + novaVelocidade
//   retorne { y, vy }
function stepGravity(state, gravity) {
  // seu código aqui
}

// --- demo: bola que cai e quica perdendo energia ---
const ball = document.querySelector(".ball");
let s = { y: 0, vy: 0 };
const floor = 200;
function frame() {
  s = stepGravity(s, 0.6) || s;
  if (s.y > floor) { s.y = floor; s.vy *= -0.7; }
  ball.style.transform = "translateY(" + s.y + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(`<div class="scene"><div class="ball"></div></div>`),
    css(`.scene { height: 260px; padding: 20px; }
.ball {
  width: 44px; height: 44px; border-radius: 50%;
  background: #7c5cff;
}`),
    js(`function stepGravity(state, gravity) {
  const vy = state.vy + gravity;
  const y = state.y + vy;
  return { y, vy };
}

const ball = document.querySelector(".ball");
let s = { y: 0, vy: 0 };
const floor = 200;
function frame() {
  s = stepGravity(s, 0.6) || s;
  if (s.y > floor) { s.y = floor; s.vy *= -0.7; }
  ball.style.transform = "translateY(" + s.y + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "stepGravity",
      message: "A função stepGravity está definida",
    },
    {
      type: "functionReturns",
      name: "stepGravity",
      args: [{ y: 0, vy: 0 }, 1],
      expected: { y: 1, vy: 1 },
      message: "primeiro passo: cai 1 e acelera para 1",
    },
    {
      type: "functionReturns",
      name: "stepGravity",
      args: [{ y: 0, vy: 5 }, 2],
      expected: { y: 7, vy: 7 },
      message: "a velocidade se acumula corretamente",
    },
  ],
};

const m1Perf: LessonExercise = {
  starter: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box {
  width: 60px; height: 60px; border-radius: 12px;
  background: #3ecf8e;
  transition: transform 500ms ease;
}
.track:hover .box { transform: translateX(200px) rotate(20deg); }

/* Este movimento já usa transform (bom!). Agora avise o navegador que
   ele vai mudar, para que prepare uma camada dedicada e evite engasgos:
   1. Adicione will-change: transform; na .box.
*/
`),
  ],
  solution: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box {
  width: 60px; height: 60px; border-radius: 12px;
  background: #3ecf8e;
  transition: transform 500ms ease;
  will-change: transform;
}
.track:hover .box { transform: translateX(200px) rotate(20deg); }
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".box",
      message: "O elemento .box existe",
    },
    {
      type: "computedStyle",
      selector: ".box",
      prop: "transition-property",
      includes: "transform",
      message: "O movimento anima transform",
    },
    {
      type: "computedStyle",
      selector: ".box",
      prop: "will-change",
      includes: "transform",
      message: "will-change: transform avisa o navegador",
    },
  ],
};

const m1React: LessonExercise = {
  starter: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>shallowEqual</code> e clique em Verificar.
</p>`),
    js(`// No React, um componente re-renderiza quando suas props "mudam". Mas
// { x: 1 } e { x: 1 } são objetos diferentes na memória, mesmo iguais por
// dentro. A comparação RASA (shallow) resolve isso: mesmos valores nas
// mesmas chaves -> considere iguais -> pule o re-render.
//
// Implemente shallowEqual(a, b): true se todas as chaves e valores baterem.
function shallowEqual(a, b) {
  // seu código aqui
}
`),
  ],
  solution: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>shallowEqual</code> e clique em Verificar.
</p>`),
    js(`function shallowEqual(a, b) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => a[k] === b[k]);
}
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "shallowEqual",
      message: "A função shallowEqual está definida",
    },
    {
      type: "functionReturns",
      name: "shallowEqual",
      args: [{ x: 1 }, { x: 1 }],
      expected: true,
      message: "objetos com os mesmos valores são iguais",
    },
    {
      type: "functionReturns",
      name: "shallowEqual",
      args: [{ x: 1 }, { x: 2 }],
      expected: false,
      message: "valores diferentes -> diferentes",
    },
    {
      type: "functionReturns",
      name: "shallowEqual",
      args: [{ x: 1 }, { x: 1, y: 2 }],
      expected: false,
      message: "número de chaves diferente -> diferentes",
    },
  ],
};

const m1DesafioLike: LessonExercise = {
  starter: [
    html(`<div class="wrap">
  <button class="like">♥ Curtir</button>
</div>`),
    css(`.wrap { display: grid; place-items: center; min-height: 240px; }
.like {
  position: relative;
  padding: 14px 26px; border: none; border-radius: 999px;
  background: #1b1e27; color: #ff6b6b; font-weight: 700; font-size: 16px;
  font-family: system-ui, sans-serif;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.like:active { transform: scale(0.92); }

.spark {
  position: absolute; top: 50%; left: 50%;
  width: 10px; height: 10px; border-radius: 50%;
  background: #ff6b6b;
  animation: burst 600ms ease-out forwards;
}
@keyframes burst {
  to { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
}

/* Ao clicar em .like, exploda pelo menos 8 partículas <span class="spark">
   em direções aleatórias. Cada spark precisa das custom properties --dx e
   --dy (a direção do voo). Veja o JS. */
`),
    js(`const like = document.querySelector(".like");

like.addEventListener("click", () => {
  // Crie ~10 sparks com direções aleatórias e adicione ao botão.
  // Dica: use um ângulo aleatório e seno/cosseno para o --dx/--dy.
});
`),
  ],
  solution: [
    html(`<div class="wrap">
  <button class="like">♥ Curtir</button>
</div>`),
    css(`.wrap { display: grid; place-items: center; min-height: 240px; }
.like {
  position: relative;
  padding: 14px 26px; border: none; border-radius: 999px;
  background: #1b1e27; color: #ff6b6b; font-weight: 700; font-size: 16px;
  font-family: system-ui, sans-serif;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.like:active { transform: scale(0.92); }

.spark {
  position: absolute; top: 50%; left: 50%;
  width: 10px; height: 10px; border-radius: 50%;
  background: #ff6b6b;
  animation: burst 600ms ease-out forwards;
}
@keyframes burst {
  to { transform: translate(var(--dx), var(--dy)) scale(0.2); opacity: 0; }
}`),
    js(`const like = document.querySelector(".like");

like.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 40;
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    like.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
});
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".like",
      message: "O botão .like existe",
    },
    {
      type: "particleCount",
      selector: ".spark",
      min: 8,
      clickSelector: ".like",
      message: "Um clique explode pelo menos 8 partículas",
    },
  ],
  checklist: [
    "As partículas saem em direções variadas (não todas iguais)?",
    "O timing é gostoso — rápido o bastante para parecer uma explosão?",
    "O botão reage ao toque (afunda no :active)?",
    "As partículas somem sozinhas e não entopem o DOM?",
  ],
};

/* =====================================================================
   MÓDULO 2 — A Magia do SVG
   ===================================================================== */

const m2Viewbox: LessonExercise = {
  starter: [
    html(`<!-- O círculo está no ponto (50,50) com raio 40 — mas a janela do
     viewBox está pequena demais e corta tudo. -->
<svg width="200" height="200" viewBox="0 0 40 40">
  <circle cx="50" cy="50" r="40" fill="#7c5cff" />
</svg>

<!-- Ajuste o viewBox para "0 0 100 100" e veja o círculo aparecer inteiro,
     centralizado. -->`),
  ],
  solution: [
    html(`<svg width="200" height="200" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#7c5cff" />
</svg>`),
  ],
  checks: [
    { type: "elementExists", selector: "svg", message: "O <svg> existe" },
    { type: "elementExists", selector: "circle", message: "O <circle> existe" },
    {
      type: "attribute",
      selector: "svg",
      name: "viewBox",
      equals: "0 0 100 100",
      message: 'A janela do viewBox é "0 0 100 100"',
    },
  ],
};

const m2Paths: LessonExercise = {
  starter: [
    html(`<svg width="200" height="200" viewBox="0 0 100 100">
  <!-- Desenhe um "check" (tique de confirmação) preenchendo o atributo d.
       O alfabeto: M = mover a caneta, L = linha reta até um ponto.
       Faça: M 20 52  ->  L 42 74  ->  L 80 30 -->
  <path d="" fill="none" stroke="#3ecf8e" stroke-width="8"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>`),
  ],
  solution: [
    html(`<svg width="200" height="200" viewBox="0 0 100 100">
  <path d="M 20 52 L 42 74 L 80 30" fill="none" stroke="#3ecf8e" stroke-width="8"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>`),
  ],
  checks: [
    { type: "elementExists", selector: "path", message: "O <path> existe" },
    {
      type: "attribute",
      selector: "path",
      name: "d",
      matches: "M.*L.*L",
      message: "O d usa M seguido de dois L (mover + duas linhas)",
    },
  ],
};

const m2Dasharray: LessonExercise = {
  starter: [
    html(`<svg width="220" height="120" viewBox="0 0 220 120">
  <path class="line" d="M 10 60 C 70 10, 150 110, 210 60"
        fill="none" stroke="#ffb03a" stroke-width="6" stroke-linecap="round" />
</svg>`),
    css(`/* A linha já está desenhada. Faça ela SE DESENHAR sozinha, como uma
   caneta invisível traçando o caminho:
   1. Dê à .line um stroke-dasharray de 300 (o comprimento aproximado).
   2. Crie um @keyframes "draw" que vai de stroke-dashoffset: 300 até 0.
   3. Aplique a animação na .line (2s, repetindo). */
`),
  ],
  solution: [
    html(`<svg width="220" height="120" viewBox="0 0 220 120">
  <path class="line" d="M 10 60 C 70 10, 150 110, 210 60"
        fill="none" stroke="#ffb03a" stroke-width="6" stroke-linecap="round" />
</svg>`),
    css(`.line {
  stroke-dasharray: 300;
  animation: draw 2s ease-in-out infinite;
}
@keyframes draw {
  from { stroke-dashoffset: 300; }
  to { stroke-dashoffset: 0; }
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".line",
      message: "O caminho .line existe",
    },
    {
      type: "computedStyle",
      selector: ".line",
      prop: "stroke-dasharray",
      matches: "\\d",
      message: "A .line tem um stroke-dasharray definido",
    },
    {
      type: "animationRegistered",
      selector: ".line",
      message: "A animação de desenho está rodando",
    },
  ],
};

const m2Icons: LessonExercise = {
  starter: [
    html(`<div class="stage">
  <svg class="icon" width="64" height="64" viewBox="0 0 24 24" fill="none"
       stroke="#f5f2ea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
</div>`),
    css(`.stage { display: grid; place-items: center; min-height: 160px; }

/* Faça o ícone reagir ao hover:
   1. transition na propriedade transform (~250ms).
   2. transform-origin: center (o pivô no meio do ícone).
   3. No hover, gire: transform: rotate(-8deg) scale(1.15). */
.icon {
  /* seu código */
}
.icon:hover {
  /* seu código */
}
`),
  ],
  solution: [
    html(`<div class="stage">
  <svg class="icon" width="64" height="64" viewBox="0 0 24 24" fill="none"
       stroke="#f5f2ea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
</div>`),
    css(`.stage { display: grid; place-items: center; min-height: 160px; }
.icon {
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}
.icon:hover {
  transform: rotate(-8deg) scale(1.15);
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".icon",
      message: "O ícone .icon existe",
    },
    {
      type: "computedStyle",
      selector: ".icon",
      prop: "transition-property",
      includes: "transform",
      message: "O ícone faz transition de transform",
    },
    {
      type: "computedStyle",
      selector: ".icon",
      prop: "transform-origin",
      matches: "\\d",
      message: "transform-origin está definido (o pivô)",
    },
    {
      type: "computedStyle",
      selector: ".icon:hover",
      prop: "transform",
      matches: "rotate",
      message: "No hover, o ícone gira",
    },
  ],
};

const m2Gradients: LessonExercise = {
  starter: [
    html(`<svg width="200" height="200" viewBox="0 0 100 100">
  <defs>
    <!-- Crie um gradiente linear com id="grad", indo do âmbar ao violeta -->

  </defs>
  <rect class="shape" x="10" y="10" width="80" height="80" rx="16" />
</svg>`),
    css(`/* Pinte o .shape com o gradiente que você criou:
   fill: url(#grad); */
.shape {
  /* seu código */
}
`),
  ],
  solution: [
    html(`<svg width="200" height="200" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffb03a" />
      <stop offset="100%" stop-color="#7c5cff" />
    </linearGradient>
  </defs>
  <rect class="shape" x="10" y="10" width="80" height="80" rx="16" />
</svg>`),
    css(`.shape {
  fill: url(#grad);
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: "#grad",
      message: "Existe um gradiente com id grad",
    },
    {
      type: "elementExists",
      selector: "#grad stop",
      message: "O gradiente tem paradas de cor (stops)",
    },
    {
      type: "computedStyle",
      selector: ".shape",
      prop: "fill",
      includes: "url",
      message: "O .shape é preenchido com o gradiente (url(#grad))",
    },
  ],
};

const m2Dataviz: LessonExercise = {
  starter: [
    html(`<svg width="260" height="160" viewBox="0 0 260 160" style="background:#14161d;border-radius:12px">
  <polyline class="chart" fill="none" stroke="#3ecf8e" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" />
</svg>`),
    js(`// Para desenhar um gráfico, você mapeia CADA valor dos dados para uma
// coordenada de tela. O eixo Y é invertido (0 fica embaixo, no SVG y cresce
// para baixo), então valor alto = y pequeno.
//
// Implemente scaleY(value, min, max, height):
//   converte um valor (entre min e max) numa coordenada y (entre height e 0).
//   value = min  -> height (embaixo)
//   value = max  -> 0      (em cima)
function scaleY(value, min, max, height) {
  // seu código aqui
}

// --- demo: desenha a linha usando o seu scaleY ---
const data = [20, 45, 30, 70, 55, 90, 60];
const w = 260, h = 160;
const points = data.map((v, i) => {
  const x = (i / (data.length - 1)) * w;
  const y = scaleY(v, 0, 100, h);
  return x + "," + y;
}).join(" ");
document.querySelector(".chart").setAttribute("points", points);
`),
  ],
  solution: [
    html(`<svg width="260" height="160" viewBox="0 0 260 160" style="background:#14161d;border-radius:12px">
  <polyline class="chart" fill="none" stroke="#3ecf8e" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" />
</svg>`),
    js(`function scaleY(value, min, max, height) {
  return height - ((value - min) / (max - min)) * height;
}

const data = [20, 45, 30, 70, 55, 90, 60];
const w = 260, h = 160;
const points = data.map((v, i) => {
  const x = (i / (data.length - 1)) * w;
  const y = scaleY(v, 0, 100, h);
  return x + "," + y;
}).join(" ");
document.querySelector(".chart").setAttribute("points", points);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "scaleY",
      message: "A função scaleY está definida",
    },
    {
      type: "functionReturns",
      name: "scaleY",
      args: [50, 0, 100, 200],
      expected: 100,
      approx: 1e-6,
      message: "o valor do meio cai no meio da altura",
    },
    {
      type: "functionReturns",
      name: "scaleY",
      args: [0, 0, 100, 200],
      expected: 200,
      approx: 1e-6,
      message: "o mínimo fica embaixo (y = height)",
    },
    {
      type: "functionReturns",
      name: "scaleY",
      args: [100, 0, 100, 200],
      expected: 0,
      approx: 1e-6,
      message: "o máximo fica no topo (y = 0)",
    },
  ],
};

const m2Spring: LessonExercise = {
  starter: [
    html(`<div class="scene"><div class="box"></div></div>`),
    css(`.scene { padding: 30px; }
.box {
  width: 50px; height: 50px; border-radius: 12px; background: #7c5cff;
}`),
    js(`// Uma mola persegue um alvo com uma força proporcional à distância —
// e essa força é amortecida (damping) para não oscilar para sempre.
//
// Implemente stepSpring(state, target, stiffness, damping), state = { value, velocity }:
//   force    = (target - value) * stiffness   // quanto mais longe, mais puxa
//   velocity = (velocity + force) * damping   // acumula e perde um pouco
//   value    = value + velocity
//   retorne { value, velocity }
function stepSpring(state, target, stiffness, damping) {
  // seu código aqui
}

// --- demo: o quadrado persegue o mouse com mola ---
const box = document.querySelector(".box");
let s = { value: 0, velocity: 0 };
let target = 220;
function frame() {
  s = stepSpring(s, target, 0.08, 0.75) || s;
  box.style.transform = "translateX(" + s.value + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.body.addEventListener("pointermove", (e) => { target = e.clientX - 40; });
`),
  ],
  solution: [
    html(`<div class="scene"><div class="box"></div></div>`),
    css(`.scene { padding: 30px; }
.box {
  width: 50px; height: 50px; border-radius: 12px; background: #7c5cff;
}`),
    js(`function stepSpring(state, target, stiffness, damping) {
  const force = (target - state.value) * stiffness;
  const velocity = (state.velocity + force) * damping;
  const value = state.value + velocity;
  return { value, velocity };
}

const box = document.querySelector(".box");
let s = { value: 0, velocity: 0 };
let target = 220;
function frame() {
  s = stepSpring(s, target, 0.08, 0.75) || s;
  box.style.transform = "translateX(" + s.value + "px)";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.body.addEventListener("pointermove", (e) => { target = e.clientX - 40; });
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "stepSpring",
      message: "A função stepSpring está definida",
    },
    {
      type: "functionReturns",
      name: "stepSpring",
      args: [{ value: 0, velocity: 0 }, 100, 0.5, 0.5],
      expected: { value: 25, velocity: 25 },
      message: "primeiro passo da mola bate certo",
    },
    {
      type: "functionReturns",
      name: "stepSpring",
      args: [{ value: 25, velocity: 25 }, 100, 0.5, 0.5],
      expected: { value: 56.25, velocity: 31.25 },
      message: "a mola acelera em direção ao alvo",
    },
  ],
};

const m2React: LessonExercise = {
  starter: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>polarToCartesian</code> e clique em Verificar.
</p>`),
    js(`// Componentes SVG em React (medidores, arcos, relógios) quase sempre
// precisam converter um ÂNGULO num PONTO (x, y) na circunferência. É a mesma
// trigonometria do Módulo 1, agora a serviço de geometria declarativa.
//
// Implemente polarToCartesian(cx, cy, r, angleDeg): o ponto na circunferência
// de centro (cx, cy) e raio r, no ângulo dado (em graus). Arredonde x e y.
//   ângulo 0   -> à direita do centro
//   ângulo 90  -> abaixo do centro
//   ângulo 180 -> à esquerda do centro
function polarToCartesian(cx, cy, r, angleDeg) {
  // dica: rad = angleDeg * Math.PI / 180
  // x = cx + r * Math.cos(rad),  y = cy + r * Math.sin(rad)
}
`),
  ],
  solution: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>polarToCartesian</code> e clique em Verificar.
</p>`),
    js(`function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(cx + r * Math.cos(rad)),
    y: Math.round(cy + r * Math.sin(rad)),
  };
}
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "polarToCartesian",
      message: "A função polarToCartesian está definida",
    },
    {
      type: "functionReturns",
      name: "polarToCartesian",
      args: [50, 50, 40, 0],
      expected: { x: 90, y: 50 },
      message: "ângulo 0 aponta para a direita",
    },
    {
      type: "functionReturns",
      name: "polarToCartesian",
      args: [50, 50, 40, 90],
      expected: { x: 50, y: 90 },
      message: "ângulo 90 aponta para baixo",
    },
    {
      type: "functionReturns",
      name: "polarToCartesian",
      args: [50, 50, 40, 180],
      expected: { x: 10, y: 50 },
      message: "ângulo 180 aponta para a esquerda",
    },
  ],
};

const m2DesafioIcones: LessonExercise = {
  starter: [
    html(`<div class="row">
  <button class="icon icon-download" aria-label="Baixar">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4v10M8 11l4 4 4-4M5 20h14" />
    </svg>
  </button>
  <button class="icon icon-external" aria-label="Abrir link">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5" />
    </svg>
  </button>
  <button class="icon icon-wand" aria-label="Mágica">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 4V2M15 10V8M12 7h-2M20 7h-2M6 20l11-11-2-2L4 18z" />
    </svg>
  </button>
</div>`),
    css(`.row { display: flex; gap: 20px; justify-content: center; padding: 40px; }
.icon {
  width: 56px; height: 56px; display: grid; place-items: center;
  border-radius: 14px; border: 1px solid #2c3140; background: #14161d; color: #f5f2ea;
}

/* Dê a cada ícone uma micro-interação com PERSONALIDADE própria:
   - .icon-download no hover: a seta "desce" (translateY para baixo)
   - .icon-external no hover: o ícone "sobe/sai" (translate diagonal)
   - .icon-wand no hover: a varinha gira levemente (rotate)
   Use transition em todos e transform-origin: center. E um guard de
   prefers-reduced-motion desligando os movimentos. */
`),
  ],
  solution: [
    html(`<div class="row">
  <button class="icon icon-download" aria-label="Baixar">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4v10M8 11l4 4 4-4M5 20h14" />
    </svg>
  </button>
  <button class="icon icon-external" aria-label="Abrir link">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5" />
    </svg>
  </button>
  <button class="icon icon-wand" aria-label="Mágica">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 4V2M15 10V8M12 7h-2M20 7h-2M6 20l11-11-2-2L4 18z" />
    </svg>
  </button>
</div>`),
    css(`.row { display: flex; gap: 20px; justify-content: center; padding: 40px; }
.icon {
  width: 56px; height: 56px; display: grid; place-items: center;
  border-radius: 14px; border: 1px solid #2c3140; background: #14161d; color: #f5f2ea;
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), color 200ms ease;
  transform-origin: center;
}
.icon:hover { color: #ffb03a; }
.icon-download:hover svg { transform: translateY(3px); }
.icon-external:hover svg { transform: translate(2px, -2px); }
.icon-wand:hover svg { transform: rotate(-12deg); }
.icon svg { transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }

@media (prefers-reduced-motion: reduce) {
  .icon, .icon svg { transition: color 200ms ease; }
  .icon:hover svg { transform: none; }
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".icon-download",
      message: "O ícone de download existe",
    },
    {
      type: "elementExists",
      selector: ".icon-external",
      message: "O ícone de link externo existe",
    },
    {
      type: "elementExists",
      selector: ".icon-wand",
      message: "O ícone de varinha existe",
    },
    {
      type: "computedStyle",
      selector: ".icon-download svg",
      prop: "transition-property",
      includes: "transform",
      message: "Os ícones têm transition de transform",
    },
    {
      type: "computedStyle",
      selector: ".icon-wand:hover svg",
      prop: "transform",
      matches: "rotate",
      message: "A varinha gira no hover",
    },
    {
      type: "reducedMotionRespected",
      selector: ".icon",
      message: "Há guard de prefers-reduced-motion",
    },
  ],
  checklist: [
    "Cada ícone tem um gesto que combina com seu significado (baixar desce, link sai, varinha encanta)?",
    "Os movimentos são discretos — convidam sem distrair?",
    "A cor também responde ao hover, reforçando o feedback?",
    "Com reduced-motion, o feedback continua (cor) mas sem deslocamento?",
  ],
};

/* =====================================================================
   MÓDULO 3 — Interações Avançadas
   ===================================================================== */

const m3Rect: LessonExercise = {
  starter: [
    html(`<div class="box"><div class="dot"></div></div>`),
    css(`.box {
  position: relative;
  width: 300px; height: 200px; margin: 40px auto;
  border-radius: 16px; background: #14161d; border: 1px solid #2c3140;
}
.dot {
  position: absolute; top: 0; left: 0;
  width: 16px; height: 16px; margin: -8px 0 0 -8px;
  border-radius: 50%; background: #ffb03a;
}`),
    js(`// getBoundingClientRect() te dá a posição da caixa NA JANELA. O cursor
// (e.clientX/Y) também é relativo à janela. Para saber a posição do cursor
// DENTRO da caixa, você subtrai um do outro.
//
// Implemente relativePos(rect, clientX, clientY): retorne { x, y } relativo
// ao canto superior-esquerdo da caixa (rect tem .left e .top).
function relativePos(rect, clientX, clientY) {
  // seu código aqui
}

// --- demo: um ponto que segue o cursor DENTRO da caixa ---
const box = document.querySelector(".box");
const dot = document.querySelector(".dot");
box.addEventListener("pointermove", (e) => {
  const rect = box.getBoundingClientRect();
  const p = relativePos(rect, e.clientX, e.clientY);
  if (p) dot.style.transform = "translate(" + p.x + "px," + p.y + "px)";
});
`),
  ],
  solution: [
    html(`<div class="box"><div class="dot"></div></div>`),
    css(`.box {
  position: relative;
  width: 300px; height: 200px; margin: 40px auto;
  border-radius: 16px; background: #14161d; border: 1px solid #2c3140;
}
.dot {
  position: absolute; top: 0; left: 0;
  width: 16px; height: 16px; margin: -8px 0 0 -8px;
  border-radius: 50%; background: #ffb03a;
}`),
    js(`function relativePos(rect, clientX, clientY) {
  return { x: clientX - rect.left, y: clientY - rect.top };
}

const box = document.querySelector(".box");
const dot = document.querySelector(".dot");
box.addEventListener("pointermove", (e) => {
  const rect = box.getBoundingClientRect();
  const p = relativePos(rect, e.clientX, e.clientY);
  if (p) dot.style.transform = "translate(" + p.x + "px," + p.y + "px)";
});
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "relativePos",
      message: "A função relativePos está definida",
    },
    {
      type: "functionReturns",
      name: "relativePos",
      args: [{ left: 100, top: 50 }, 150, 80],
      expected: { x: 50, y: 30 },
      message: "converte a posição da janela para dentro da caixa",
    },
    {
      type: "functionReturns",
      name: "relativePos",
      args: [{ left: 0, top: 0 }, 20, 40],
      expected: { x: 20, y: 40 },
      message: "com a caixa na origem, a posição é a mesma",
    },
  ],
};

const m3Look: LessonExercise = {
  starter: [
    html(`<div class="field"><div class="arrow">➤</div></div>`),
    css(`.field { min-height: 220px; display: grid; place-items: center; }
.arrow {
  font-size: 48px; color: #7c5cff;
  transition: transform 80ms linear;
}`),
    js(`// atan2(dy, dx) devolve o ÂNGULO da direção que aponta de um ponto para
// outro — a peça que faz um elemento "olhar" para o mouse.
//
// Implemente angleTo(fromX, fromY, toX, toY): o ângulo em GRAUS.
//   dica: Math.atan2(toY - fromY, toX - fromX) dá radianos;
//         converta para graus multiplicando por 180 / Math.PI.
function angleTo(fromX, fromY, toX, toY) {
  // seu código aqui
}

// --- demo: a seta olha para o seu mouse ---
const arrow = document.querySelector(".arrow");
document.body.addEventListener("pointermove", (e) => {
  const r = arrow.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const a = angleTo(cx, cy, e.clientX, e.clientY);
  arrow.style.transform = "rotate(" + a + "deg)";
});
`),
  ],
  solution: [
    html(`<div class="field"><div class="arrow">➤</div></div>`),
    css(`.field { min-height: 220px; display: grid; place-items: center; }
.arrow {
  font-size: 48px; color: #7c5cff;
  transition: transform 80ms linear;
}`),
    js(`function angleTo(fromX, fromY, toX, toY) {
  return (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
}

const arrow = document.querySelector(".arrow");
document.body.addEventListener("pointermove", (e) => {
  const r = arrow.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const a = angleTo(cx, cy, e.clientX, e.clientY);
  arrow.style.transform = "rotate(" + a + "deg)";
});
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "angleTo",
      message: "A função angleTo está definida",
    },
    {
      type: "functionReturns",
      name: "angleTo",
      args: [0, 0, 1, 0],
      expected: 0,
      approx: 1e-6,
      message: "apontar para a direita é 0°",
    },
    {
      type: "functionReturns",
      name: "angleTo",
      args: [0, 0, 0, 1],
      expected: 90,
      approx: 1e-6,
      message: "apontar para baixo é 90°",
    },
    {
      type: "functionReturns",
      name: "angleTo",
      args: [0, 0, -1, 0],
      expected: 180,
      approx: 1e-6,
      message: "apontar para a esquerda é 180°",
    },
  ],
};

const m3ScrollCss: LessonExercise = {
  starter: [
    html(`<div class="bar"></div>
<div class="tall">Role a página para preencher a barra ↑</div>`),
    css(`body { margin: 0; }
.bar {
  position: fixed; top: 0; left: 0; height: 6px; width: 100%;
  background: #ffb03a; transform: scaleX(0); transform-origin: left;
}
.tall {
  height: 200vh; padding: 20px;
  font-family: system-ui, sans-serif; color: #b9b4a8;
}

/* Faça a barra preencher conforme a rolagem — SEM JavaScript — usando uma
   scroll-driven animation:
   1. Crie um @keyframes "grow" de scaleX(0) até scaleX(1).
   2. Aplique animation: grow linear; na .bar.
   3. Ligue a animação à rolagem: animation-timeline: scroll(root block); */
`),
  ],
  solution: [
    html(`<div class="bar"></div>
<div class="tall">Role a página para preencher a barra ↑</div>`),
    css(`body { margin: 0; }
.bar {
  position: fixed; top: 0; left: 0; height: 6px; width: 100%;
  background: #ffb03a; transform: scaleX(0); transform-origin: left;
  animation: grow linear;
  animation-timeline: scroll(root block);
}
.tall {
  height: 200vh; padding: 20px;
  font-family: system-ui, sans-serif; color: #b9b4a8;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
`),
  ],
  checks: [
    { type: "elementExists", selector: ".bar", message: "A barra .bar existe" },
    {
      type: "computedStyle",
      selector: ".bar",
      prop: "animation-name",
      includes: "grow",
      message: "A .bar usa a animação grow",
    },
    {
      type: "computedStyle",
      selector: ".bar",
      prop: "animation-timeline",
      matches: "scroll",
      declared: true,
      message: "A animação está ligada à rolagem (scroll timeline)",
    },
  ],
};

const m3Scrollytelling: LessonExercise = {
  starter: [
    html(`<div class="panel">Eu apareço quando entro na tela.</div>`),
    css(`.panel {
  margin: 30px; padding: 40px; border-radius: 16px;
  background: #14161d; border: 1px solid #2c3140; color: #f5f2ea;
  font-family: system-ui, sans-serif;
  opacity: 0; transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.panel.visible {
  opacity: 1; transform: translateY(0);
}`),
    js(`// O IntersectionObserver avisa quando um elemento entra ou sai da tela —
// sem você ficar calculando scroll na mão. É o motor do scrollytelling.
//
// Complete o callback: quando um elemento estiver visível (entry.isIntersecting),
// adicione a classe "visible" a ele (entry.target).
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // seu código aqui
  });
});
document.querySelectorAll(".panel").forEach((p) => io.observe(p));
`),
  ],
  solution: [
    html(`<div class="panel">Eu apareço quando entro na tela.</div>`),
    css(`.panel {
  margin: 30px; padding: 40px; border-radius: 16px;
  background: #14161d; border: 1px solid #2c3140; color: #f5f2ea;
  font-family: system-ui, sans-serif;
  opacity: 0; transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.panel.visible {
  opacity: 1; transform: translateY(0);
}`),
    js(`const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});
document.querySelectorAll(".panel").forEach((p) => io.observe(p));
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".panel",
      message: "O painel .panel existe",
    },
    {
      type: "computedStyle",
      selector: ".panel",
      prop: "transition-property",
      includes: "opacity",
      message: "O painel faz transition de opacidade",
    },
    {
      type: "elementExists",
      selector: ".panel.visible",
      message: "O observer adicionou a classe visible ao entrar na tela",
    },
  ],
};

const m3Gestures: LessonExercise = {
  starter: [
    html(`<div class="wrap">
  <button class="btn">Segure-me</button>
  <p class="label" style="font-family: system-ui; color:#b9b4a8">solte para ver o gesto</p>
</div>`),
    css(`.wrap { display: grid; place-items: center; gap: 12px; min-height: 200px; }
.btn {
  padding: 16px 30px; border: none; border-radius: 999px;
  background: #7c5cff; color: white; font-weight: 700; font-size: 16px;
}`),
    js(`// O mesmo gesto (apertar) tem SIGNIFICADOS diferentes conforme a duração:
// um toque rápido é uma coisa, segurar é outra. Estados intermediários dão
// riqueza às interações.
//
// Implemente pressLevel(ms): classifique a duração do aperto.
//   ms < 200  -> "tap"
//   ms < 600  -> "hold"
//   senão     -> "longpress"
function pressLevel(ms) {
  // seu código aqui
}

// --- demo: segure o botão e veja o gesto ---
const btn = document.querySelector(".btn");
const label = document.querySelector(".label");
let start = 0;
btn.addEventListener("pointerdown", () => { start = performance.now(); });
btn.addEventListener("pointerup", () => {
  label.textContent = pressLevel(performance.now() - start);
});
`),
  ],
  solution: [
    html(`<div class="wrap">
  <button class="btn">Segure-me</button>
  <p class="label" style="font-family: system-ui; color:#b9b4a8">solte para ver o gesto</p>
</div>`),
    css(`.wrap { display: grid; place-items: center; gap: 12px; min-height: 200px; }
.btn {
  padding: 16px 30px; border: none; border-radius: 999px;
  background: #7c5cff; color: white; font-weight: 700; font-size: 16px;
}`),
    js(`function pressLevel(ms) {
  if (ms < 200) return "tap";
  if (ms < 600) return "hold";
  return "longpress";
}

const btn = document.querySelector(".btn");
const label = document.querySelector(".label");
let start = 0;
btn.addEventListener("pointerdown", () => { start = performance.now(); });
btn.addEventListener("pointerup", () => {
  label.textContent = pressLevel(performance.now() - start);
});
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "pressLevel",
      message: "A função pressLevel está definida",
    },
    {
      type: "functionReturns",
      name: "pressLevel",
      args: [100],
      expected: "tap",
      message: "aperto curto (<200ms) é um tap",
    },
    {
      type: "functionReturns",
      name: "pressLevel",
      args: [400],
      expected: "hold",
      message: "aperto médio é um hold",
    },
    {
      type: "functionReturns",
      name: "pressLevel",
      args: [800],
      expected: "longpress",
      message: "aperto longo é um longpress",
    },
  ],
};

const m3ViewTransitions: LessonExercise = {
  starter: [
    html(`<div class="gallery">
  <img class="hero" alt="foto"
       src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140'%3E%3Crect width='200' height='140' fill='%237c5cff'/%3E%3C/svg%3E" />
</div>`),
    css(`.gallery { padding: 40px; display: grid; place-items: center; }
.hero { border-radius: 16px; }

/* Para que um elemento MORFE suavemente entre duas telas (ex: miniatura ->
   detalhe) com a View Transition API, ele precisa de um nome de transição
   estável, igual nos dois estados:
   1. Dê à .hero um view-transition-name: hero; */
`),
  ],
  solution: [
    html(`<div class="gallery">
  <img class="hero" alt="foto"
       src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140'%3E%3Crect width='200' height='140' fill='%237c5cff'/%3E%3C/svg%3E" />
</div>`),
    css(`.gallery { padding: 40px; display: grid; place-items: center; }
.hero {
  border-radius: 16px;
  view-transition-name: hero;
}
`),
  ],
  checks: [
    {
      type: "elementExists",
      selector: ".hero",
      message: "O elemento .hero existe",
    },
    {
      type: "computedStyle",
      selector: ".hero",
      prop: "view-transition-name",
      equals: "hero",
      declared: true,
      message: "A .hero tem um view-transition-name estável",
    },
  ],
};

const m3DesafioCard: LessonExercise = {
  starter: [
    html(`<div class="scene">
  <div class="card">
    <div class="glow"></div>
    <span>Passe o mouse por mim</span>
  </div>
</div>`),
    css(`.scene {
  min-height: 300px; display: grid; place-items: center;
  perspective: 800px;
}
.card {
  position: relative; width: 240px; height: 160px;
  display: grid; place-items: center; border-radius: 18px;
  background: #1b1e27; border: 1px solid #2c3140; color: #f5f2ea;
  font-family: system-ui, sans-serif;
  overflow: hidden;
}
.glow {
  position: absolute; width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,92,255,0.5), transparent 60%);
  pointer-events: none; left: var(--mx, 50%); top: var(--my, 50%);
  transform: translate(-50%, -50%);
}

/* Transforme o card num objeto 3D que reage ao cursor:
   1. Dê ao .card: transform-style: preserve-3d e transition em transform.
   2. Veja o JS — ele calcula a inclinação e um glow que segue o cursor. */
`),
    js(`const card = document.querySelector(".card");

card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;   // 0..1
  const py = (e.clientY - r.top) / r.height;   // 0..1
  const rotY = (px - 0.5) * 20;                 // -10..10 graus
  const rotX = (0.5 - py) * 20;
  card.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
  card.style.setProperty("--mx", px * 100 + "%");
  card.style.setProperty("--my", py * 100 + "%");
});
card.addEventListener("pointerleave", () => {
  card.style.transform = "rotateX(0) rotateY(0)";
});
`),
  ],
  solution: [
    html(`<div class="scene">
  <div class="card">
    <div class="glow"></div>
    <span>Passe o mouse por mim</span>
  </div>
</div>`),
    css(`.scene {
  min-height: 300px; display: grid; place-items: center;
  perspective: 800px;
}
.card {
  position: relative; width: 240px; height: 160px;
  display: grid; place-items: center; border-radius: 18px;
  background: #1b1e27; border: 1px solid #2c3140; color: #f5f2ea;
  font-family: system-ui, sans-serif;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 200ms ease;
}
.glow {
  position: absolute; width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,92,255,0.5), transparent 60%);
  pointer-events: none; left: var(--mx, 50%); top: var(--my, 50%);
  transform: translate(-50%, -50%);
}
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}`),
    js(`const card = document.querySelector(".card");

card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  const rotY = (px - 0.5) * 20;
  const rotX = (0.5 - py) * 20;
  card.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
  card.style.setProperty("--mx", px * 100 + "%");
  card.style.setProperty("--my", py * 100 + "%");
});
card.addEventListener("pointerleave", () => {
  card.style.transform = "rotateX(0) rotateY(0)";
});
`),
  ],
  checks: [
    { type: "elementExists", selector: ".card", message: "O card existe" },
    {
      type: "computedStyle",
      selector: ".scene",
      prop: "perspective",
      matches: "\\d",
      message: "A cena tem perspective (o espaço 3D)",
    },
    {
      type: "computedStyle",
      selector: ".card",
      prop: "transform-style",
      equals: "preserve-3d",
      message: "O card preserva o 3D (preserve-3d)",
    },
    {
      type: "computedStyle",
      selector: ".card",
      prop: "transition-property",
      includes: "transform",
      message: "O card volta suavemente ao sair (transition)",
    },
  ],
  checklist: [
    "A inclinação segue o cursor de forma natural (não invertida)?",
    "O glow acompanha o cursor por dentro do card?",
    "Ao tirar o mouse, o card volta suave à posição neutra?",
    "Com reduced-motion, o efeito fica calmo (sem a volta animada)?",
  ],
};

/* =====================================================================
   MÓDULO 4 — HTML Canvas
   ===================================================================== */

const CANVAS_HTML = `<canvas width="300" height="200" style="background:#14161d;border-radius:12px"></canvas>`;

const m4Immediate: LessonExercise = {
  starter: [
    html(CANVAS_HTML),
    js(`// O Canvas é "immediate mode": você não cria objetos que ficam guardados —
// você PINTA pixels e esquece. Não há um "elemento círculo"; há tinta.
//
// Desenhe um círculo preenchido no centro:
// 1. const ctx = canvas.getContext("2d")
// 2. ctx.fillStyle = "#7c5cff"
// 3. ctx.beginPath(); ctx.arc(150, 100, 60, 0, Math.PI * 2); ctx.fill();
const canvas = document.querySelector("canvas");

`),
  ],
  solution: [
    html(CANVAS_HTML),
    js(`const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#7c5cff";
ctx.beginPath();
ctx.arc(150, 100, 60, 0, Math.PI * 2);
ctx.fill();
`),
  ],
  checks: [
    { type: "elementExists", selector: "canvas", message: "O <canvas> existe" },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "Algo foi pintado no canvas",
    },
  ],
};

const m4Gameloop: LessonExercise = {
  starter: [
    html(CANVAS_HTML),
    js(`// O game loop tem três batidas, toda vez: LIMPA, ATUALIZA, DESENHA.
// Sem o "limpa", os quadros se empilham num borrão. Complete o loop:
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let x = 0;

function frame() {
  // 1. LIMPA: ctx.clearRect(0, 0, canvas.width, canvas.height)
  // 2. ATUALIZA: x = (x + 3) % canvas.width
  // 3. DESENHA: ctx.fillStyle = "#ffb03a"; ctx.fillRect(x, 80, 40, 40)
  // 4. requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(CANVAS_HTML),
    js(`const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let x = 0;

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x = (x + 3) % canvas.width;
  ctx.fillStyle = "#ffb03a";
  ctx.fillRect(x, 80, 40, 40);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    { type: "elementExists", selector: "canvas", message: "O <canvas> existe" },
    {
      type: "rafActive",
      message: "O game loop está rodando com requestAnimationFrame",
    },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "O quadrado está sendo desenhado",
    },
  ],
};

const m4Particles: LessonExercise = {
  starter: [
    html(CANVAS_HTML),
    js(`// Em escala, cada partícula é só um punhado de números. makeParticle cria
// uma: posição (x, y) e velocidade decomposta a partir de um ângulo e uma
// rapidez (trigonometria do Módulo 1!).
//
// Implemente makeParticle(x, y, angle, speed): retorne { x, y, vx, vy }
// onde vx = cos(angle) * speed e vy = sin(angle) * speed.
function makeParticle(x, y, angle, speed) {
  // seu código aqui
}

// --- demo: 200 partículas explodindo do centro ---
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let ps = [];
for (let i = 0; i < 200; i++) {
  ps.push(makeParticle(150, 100, Math.random() * Math.PI * 2, 1 + Math.random() * 3));
}
function frame() {
  ctx.fillStyle = "rgba(20,22,29,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#3ecf8e";
  ps.forEach((p) => { p.x += p.vx; p.y += p.vy; ctx.fillRect(p.x, p.y, 3, 3); });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(CANVAS_HTML),
    js(`function makeParticle(x, y, angle, speed) {
  return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let ps = [];
for (let i = 0; i < 200; i++) {
  ps.push(makeParticle(150, 100, Math.random() * Math.PI * 2, 1 + Math.random() * 3));
}
function frame() {
  ctx.fillStyle = "rgba(20,22,29,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#3ecf8e";
  ps.forEach((p) => { p.x += p.vx; p.y += p.vy; ctx.fillRect(p.x, p.y, 3, 3); });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "makeParticle",
      message: "A função makeParticle está definida",
    },
    {
      type: "functionReturns",
      name: "makeParticle",
      args: [0, 0, 0, 5],
      expected: { x: 0, y: 0, vx: 5, vy: 0 },
      message: "decompõe ângulo 0 em vx=5, vy=0",
    },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "As partículas estão sendo pintadas",
    },
  ],
};

const m4Physics: LessonExercise = {
  starter: [
    html(CANVAS_HTML),
    js(`// Física realista soma gravidade (puxa para baixo) e atrito/arrasto (rouba
// energia a cada frame). Implemente stepPhysics(p, gravity, friction) com
// p = { x, y, vx, vy }:
//   vy = (p.vy + gravity) * friction
//   vx = p.vx * friction
//   retorne { x: p.x + vx, y: p.y + vy, vx, vy }
function stepPhysics(p, gravity, friction) {
  // seu código aqui
}

// --- demo: bola que cai, quica e desacelera ---
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let ball = { x: 150, y: 20, vx: 2, vy: 0 };
function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball = stepPhysics(ball, 0.4, 0.99) || ball;
  if (ball.y > 190) { ball.y = 190; ball.vy *= -0.7; }
  ctx.fillStyle = "#7c5cff";
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2); ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(CANVAS_HTML),
    js(`function stepPhysics(p, gravity, friction) {
  const vy = (p.vy + gravity) * friction;
  const vx = p.vx * friction;
  return { x: p.x + vx, y: p.y + vy, vx, vy };
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let ball = { x: 150, y: 20, vx: 2, vy: 0 };
function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball = stepPhysics(ball, 0.4, 0.99) || ball;
  if (ball.y > 190) { ball.y = 190; ball.vy *= -0.7; }
  ctx.fillStyle = "#7c5cff";
  ctx.beginPath(); ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2); ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "stepPhysics",
      message: "A função stepPhysics está definida",
    },
    {
      type: "functionReturns",
      name: "stepPhysics",
      args: [{ x: 0, y: 0, vx: 10, vy: 0 }, 0.5, 0.5],
      expected: { x: 5, y: 0.25, vx: 5, vy: 0.25 },
      message: "aplica gravidade e atrito no primeiro passo",
    },
    {
      type: "functionReturns",
      name: "stepPhysics",
      args: [{ x: 5, y: 0.25, vx: 5, vy: 0.25 }, 0.5, 0.5],
      expected: { x: 7.5, y: 0.625, vx: 2.5, vy: 0.375 },
      message: "a velocidade decai com o atrito",
    },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "A bola está sendo desenhada",
    },
  ],
};

const m4Noise: LessonExercise = {
  starter: [
    html(CANVAS_HTML),
    js(`// A diferença entre aleatoriedade "elétrica" (nervosa, saltitante) e
// "orgânica" (suave, natural) é a INTERPOLAÇÃO entre os valores. O Perlin
// noise usa uma curva de suavização especial, a fade:
//   fade(t) = 6t⁵ − 15t⁴ + 10t³   (forma otimizada: t*t*t*(t*(t*6-15)+10))
// Ela tem inclinação zero nas pontas (0 e 1), o que elimina os "cantos".
//
// Implemente fade(t):
function fade(t) {
  // seu código aqui
}

// --- demo: um terreno suave usando o SEU fade para interpolar ---
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const heights = [40, 120, 60, 150, 90, 130, 50, 100];
function heightAt(x) {
  const i = Math.floor(x), f = x - i;
  const a = heights[i % heights.length], b = heights[(i + 1) % heights.length];
  return a + (b - a) * fade(f);
}
ctx.strokeStyle = "#3ecf8e"; ctx.lineWidth = 2; ctx.beginPath();
for (let px = 0; px <= 300; px++) { ctx.lineTo(px, 190 - heightAt(px / 45)); }
ctx.stroke();
`),
  ],
  solution: [
    html(CANVAS_HTML),
    js(`function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const heights = [40, 120, 60, 150, 90, 130, 50, 100];
function heightAt(x) {
  const i = Math.floor(x), f = x - i;
  const a = heights[i % heights.length], b = heights[(i + 1) % heights.length];
  return a + (b - a) * fade(f);
}
ctx.strokeStyle = "#3ecf8e"; ctx.lineWidth = 2; ctx.beginPath();
for (let px = 0; px <= 300; px++) { ctx.lineTo(px, 190 - heightAt(px / 45)); }
ctx.stroke();
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "fade",
      message: "A função fade está definida",
    },
    {
      type: "functionReturns",
      name: "fade",
      args: [0],
      expected: 0,
      approx: 1e-9,
      message: "fade(0) = 0",
    },
    {
      type: "functionReturns",
      name: "fade",
      args: [1],
      expected: 1,
      approx: 1e-9,
      message: "fade(1) = 1",
    },
    {
      type: "functionReturns",
      name: "fade",
      args: [0.5],
      expected: 0.5,
      approx: 1e-9,
      message: "fade(0.5) = 0.5 (simétrica)",
    },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "O terreno suave foi desenhado",
    },
  ],
};

const m4Workers: LessonExercise = {
  starter: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>chunk</code> e clique em Verificar.
</p>`),
    js(`// Web Workers rodam código numa thread SEPARADA — o cálculo pesado não trava
// a animação na thread principal. Um padrão comum é DIVIDIR o trabalho em
// pedaços e distribuir entre workers.
//
// Implemente chunk(array, size): quebre o array em pedaços de tamanho "size".
//   chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
function chunk(array, size) {
  // seu código aqui
}
`),
  ],
  solution: [
    html(`<p style="font-family: system-ui; padding: 20px; color: #333">
  Implemente <code>chunk</code> e clique em Verificar.
</p>`),
    js(`function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) {
    out.push(array.slice(i, i + size));
  }
  return out;
}
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "chunk",
      message: "A função chunk está definida",
    },
    {
      type: "functionReturns",
      name: "chunk",
      args: [[1, 2, 3, 4, 5], 2],
      expected: [[1, 2], [3, 4], [5]],
      message: "divide em pedaços de 2, com sobra",
    },
    {
      type: "functionReturns",
      name: "chunk",
      args: [[1, 2, 3, 4], 2],
      expected: [
        [1, 2],
        [3, 4],
      ],
      message: "divide exatamente quando cabe",
    },
  ],
};

const m4Decision: LessonExercise = {
  checklist: [
    "Sei dizer por que MILHARES de objetos em movimento pedem Canvas (e não DOM/SVG)?",
    "Entendo por que ícones interativos e acessíveis pedem SVG ou DOM (e não Canvas)?",
    "Consigo justificar quando o DOM comum já basta (poucos elementos, com texto e eventos)?",
    "Lembro do trade-off central: Canvas é rápido mas 'cego' (sem elementos, sem acessibilidade nativa)?",
  ],
};

const m4DesafioFireworks: LessonExercise = {
  starter: [
    html(`<canvas width="320" height="240" style="background:#0e0f14;border-radius:12px;cursor:pointer"></canvas>
<p style="font-family: system-ui; color:#78736a; font-size:13px">clique para soltar fogos</p>`),
    js(`const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let particles = [];

// Ao clicar, crie uma explosão: ~40 partículas saindo em todas as direções.
// Cada uma: posição no clique, velocidade por ângulo (cos/sin), uma cor, e
// uma "vida" (life) que decai. Veja o loop abaixo — ele já atualiza e desenha.
function burst(x, y) {
  // seu código: preencha "particles" com as faíscas da explosão
}

canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  burst(e.clientX - r.left, e.clientY - r.top);
});
// dá as boas-vindas com um fogo automático (assim que seu burst funcionar)
burst(160, 120);
setInterval(() => burst(40 + Math.random() * 240, 40 + Math.random() * 120), 1400);

function frame() {
  ctx.fillStyle = "rgba(14,15,20,0.25)"; // rastro que desvanece
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += 0.05;            // gravidade
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.01;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
  });
  ctx.globalAlpha = 1;
  particles = particles.filter((p) => p.life > 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(`<canvas width="320" height="240" style="background:#0e0f14;border-radius:12px;cursor:pointer"></canvas>
<p style="font-family: system-ui; color:#78736a; font-size:13px">clique para soltar fogos</p>`),
    js(`const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const colors = ["#ffb03a", "#7c5cff", "#3ecf8e", "#ff6b6b"];

function burst(x, y) {
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 40; i++) {
    const angle = (Math.PI * 2 * i) / 40;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 1,
    });
  }
}

canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  burst(e.clientX - r.left, e.clientY - r.top);
});
// solta um automático para dar as boas-vindas
burst(160, 120);
setInterval(() => burst(40 + Math.random() * 240, 40 + Math.random() * 120), 1400);

function frame() {
  ctx.fillStyle = "rgba(14,15,20,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += 0.05;
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.01;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
  });
  ctx.globalAlpha = 1;
  particles = particles.filter((p) => p.life > 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    { type: "elementExists", selector: "canvas", message: "O <canvas> existe" },
    { type: "rafActive", message: "O loop dos fogos está rodando" },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "Os fogos estão pintando o canvas",
    },
    {
      type: "expression",
      expr: "Array.isArray(particles) && particles.length > 0",
      message: "Seu burst() está criando partículas de verdade",
    },
  ],
  checklist: [
    "As faíscas saem em todas as direções (círculo completo)?",
    "A gravidade puxa as faíscas para baixo conforme caem?",
    "As partículas desvanecem (fade) e somem, deixando um rastro?",
    "Cada explosão tem cor própria e o efeito é satisfatório de ver?",
  ],
};

/* =====================================================================
   MÓDULO 5 — Design de Animação (lições visuais, de julgamento)
   ===================================================================== */

const m5Principios: LessonExercise = {
  checklist: [
    "Consigo apontar a antecipação (o 'recuo antes do golpe') numa animação boa?",
    "Entendo por que squash & stretch dá peso e vida, sem distorcer a identidade do objeto?",
    "Sei o que é follow-through (partes que continuam depois que o corpo para)?",
    "Consigo olhar uma animação sem graça e dizer QUAL princípio está faltando?",
  ],
};

const m5Orquestracao: LessonExercise = {
  checklist: [
    "Entendo por que o stagger (cascata) guia o olho melhor que tudo aparecendo junto?",
    "Sei sequenciar uma entrada para criar uma hierarquia de atenção (o que o olho vê primeiro)?",
    "Consigo escolher uma duração de stagger que soa 'orquestrado' e não 'lento'?",
    "Percebo quando a orquestração vira exagero e atrapalha em vez de guiar?",
  ],
};

const m5Acao: LessonExercise = {
  checklist: [
    "Entendo a diferença entre animar pela AÇÃO do usuário e animar por mudança de ESTADO?",
    "Sei por que responder ao gesto (não só ao resultado) faz a interface parecer viva?",
    "Consigo identificar uma animação que 'acontece sozinha' e deveria estar ligada a uma ação?",
    "Reconheço quando o feedback imediato é mais importante que uma transição bonita?",
  ],
};

const m5BomGosto: LessonExercise = {
  checklist: [
    "Sei reconhecer quando uma animação está atrapalhando em vez de ajudar (irritante vs. deliciosa)?",
    "Entendo por que a repetição frequente muda tudo — o que encanta uma vez, cansa na décima?",
    "Consigo defender a decisão de NÃO animar algo como uma escolha de design madura?",
    "Tenho um radar para 'animação de portfólio' (impressiona uma vez) vs. 'de produto' (serve todo dia)?",
  ],
};

const m5DesafioRedesign: LessonExercise = {
  starter: [
    html(`<div class="wrap">
  <button class="cart">Adicionar ao carrinho</button>
</div>`),
    css(`.wrap { display: grid; place-items: center; min-height: 220px; }
.cart {
  padding: 14px 26px; border: none; border-radius: 12px;
  background: #7c5cff; color: white; font-weight: 700; font-size: 16px;
  font-family: system-ui, sans-serif;
}
.cart.added { background: #3ecf8e; color: #0e0f14; }

/* Esta interação é honesta, mas SEM GRAÇA: o texto e a cor trocam na hora,
   um corte seco. Dê personalidade a ela usando tudo que você aprendeu:

   - uma transition (não deixe a cor trocar no susto)
   - um micro-movimento no clique (:active afunda? um pulinho ao confirmar?)
   - talvez um ✓ que entra animado, um shake sutil, um brilho...
   - RESPEITE prefers-reduced-motion (o módulo inteiro prega isso)

   Não existe resposta única. O objetivo é transformar "funciona" em
   "que gostoso". Depois, use o checklist para julgar seu próprio gosto. */
`),
    js(`const btn = document.querySelector(".cart");
let added = false;
btn.addEventListener("click", () => {
  added = !added;
  btn.classList.toggle("added", added);
  btn.textContent = added ? "Adicionado ✓" : "Adicionar ao carrinho";
});
`),
  ],
  checklist: [
    "A troca de estado agora tem uma transição suave (nada de corte seco)?",
    "Há um feedback tátil no clique (o botão responde ao toque)?",
    "A confirmação tem um momento de deleite (o ✓, um pulinho, um brilho) — mas discreto?",
    "Você resistiu ao exagero? A interação encanta sem cansar na décima vez?",
    "Funciona com prefers-reduced-motion ligado (sem deslocamentos bruscos)?",
  ],
};

/* =====================================================================
   MÓDULO 6 — Desafios Finais (peças abertas de portfólio, visuais)
   ===================================================================== */

const m6Explosao: LessonExercise = {
  starter: [
    html(`<div class="stage">
  <canvas width="360" height="240" style="background:#0e0f14;border-radius:12px;cursor:crosshair"></canvas>
  <p style="font-family:system-ui;color:#78736a;font-size:13px">clique para acertar um "golpe"</p>
</div>`),
    css(
      `.stage { display: grid; place-items: center; gap: 10px; padding: 16px; }`,
    ),
    js(`// DESAFIO ABERTO — um efeito de "hit" estilo videogame 2D.
// Junte tudo do Módulo 4: partículas, física, cor, rastro. Mire no "juice":
// screen shake, flash, partículas que variam, um número de dano que sobe...
// Não há resposta certa. Faça algo que dê VONTADE de clicar de novo.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function hit(x, y) {
  // crie sua explosão aqui (ângulos em círculo, velocidades variadas, cores…)
}

canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  hit(e.clientX - r.left, e.clientY - r.top);
});

function frame() {
  ctx.fillStyle = "rgba(14,15,20,0.28)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += 0.15; p.x += p.vx; p.y += p.vy; p.life -= 0.02;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color || "#ffb03a";
    ctx.fillRect(p.x, p.y, p.size || 3, p.size || 3);
  });
  ctx.globalAlpha = 1;
  particles = particles.filter((p) => p.life > 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checklist: [
    "O impacto tem 'juice' — várias camadas (partículas + flash/shake) que se somam?",
    "Há variação (tamanhos, velocidades, cores) para o efeito não parecer mecânico?",
    "O timing é punchy — rápido o bastante para parecer força, com um rastro que respira?",
    "Dá vontade de clicar de novo? (o teste final de um bom efeito de game)",
  ],
};

const m6Hero: LessonExercise = {
  starter: [
    html(`<section class="hero">
  <svg class="blob" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M45,-58C58,-47,66,-29,68,-11C70,7,66,25,56,39C46,53,30,62,12,66C-6,70,-25,68,-40,59C-55,50,-66,33,-70,14C-74,-5,-71,-26,-60,-40C-49,-54,-30,-61,-11,-63C8,-65,25,-69,45,-58Z"
          transform="translate(100 100)" fill="url(#g)" />
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7c5cff" />
        <stop offset="100%" stop-color="#ffb03a" />
      </linearGradient>
    </defs>
  </svg>
  <h1>Construa coisas <em>vivas</em>.</h1>
  <p>A plataforma que transforma dados em decisões, em tempo real.</p>
  <button class="cta">Começar agora</button>
</section>`),
    css(`.hero {
  min-height: 320px; display: grid; place-items: center; text-align: center;
  gap: 14px; padding: 30px; position: relative; overflow: hidden;
  font-family: system-ui, sans-serif; color: #f5f2ea;
  background: #0e0f14;
}
.blob { position: absolute; width: 320px; opacity: 0.25; z-index: 0; }
.hero > :not(.blob) { position: relative; z-index: 1; }
h1 { font-size: 2rem; margin: 0; } h1 em { color: #ffb03a; font-style: normal; }
p { color: #b9b4a8; max-width: 40ch; margin: 0; }
.cta { padding: 12px 24px; border: none; border-radius: 999px; background: #ffb03a; color: #0e0f14; font-weight: 700; }

/* DESAFIO ABERTO — um hero de landing "tech startup".
   Dê vida: o blob que respira/gira devagar, o título que entra em stagger,
   o CTA com micro-interação, talvez o blob reagindo ao cursor (Módulo 3).
   Mire em "profissional e com personalidade", não em "árvore de natal".
   Respeite prefers-reduced-motion. */
`),
  ],
  checklist: [
    "Há UMA assinatura de movimento forte (o blob/SVG) e o resto fica quieto?",
    "O texto entra com hierarquia clara (título primeiro, com stagger sutil)?",
    "O CTA convida ao clique com uma micro-interação discreta?",
    "Parece um produto real de startup — polido, não exagerado?",
    "prefers-reduced-motion desliga o que se move?",
  ],
};

const m6Scrollytelling: LessonExercise = {
  starter: [
    html(`<div class="story">
  <section class="panel"><h2>Capítulo 1</h2><p>Role para baixo…</p></section>
  <section class="panel"><h2>Capítulo 2</h2><p>Cada seção revela ao entrar.</p></section>
  <section class="panel"><h2>Capítulo 3</h2><p>Conte uma história com o scroll.</p></section>
</div>`),
    css(`.story { font-family: system-ui, sans-serif; color: #f5f2ea; }
.panel {
  min-height: 70vh; display: grid; place-content: center; gap: 8px;
  padding: 24px; text-align: center;
  opacity: 0; transform: translateY(30px);
  transition: opacity 700ms ease, transform 700ms ease;
}
.panel.visible { opacity: 1; transform: translateY(0); }
h2 { font-size: 1.8rem; margin: 0; color: #ffb03a; }
p { color: #b9b4a8; margin: 0; }

/* DESAFIO ABERTO — uma página inteira de scrollytelling.
   Use o IntersectionObserver (Módulo 3) para revelar cada capítulo, e talvez
   uma barra de progresso scroll-driven (Módulo 3) no topo. Crie um RITMO:
   nem tudo igual, varie entradas, dê um clímax. */
`),
    js(`// Revele cada .panel ao entrar na tela (IntersectionObserver do Módulo 3).
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.3 });
document.querySelectorAll(".panel").forEach((p) => io.observe(p));
`),
  ],
  checklist: [
    "Cada seção revela de forma agradável ao entrar na tela (sem piscar)?",
    "Há um RITMO — as entradas variam, criando uma narrativa, não uma repetição?",
    "O scroll parece 'contar uma história', com começo, meio e um clímax?",
    "Existe orientação (barra de progresso, âncoras) para o leitor não se perder?",
    "prefers-reduced-motion troca os deslizes por fades simples?",
  ],
};

const m6ProjetoFinal: LessonExercise = {
  starter: [
    html(`<!-- Tela em branco. Esta é a sua peça. -->
<div class="canvas">
  <span>a sua assinatura vai aqui</span>
</div>`),
    css(`.canvas {
  min-height: 320px; display: grid; place-items: center;
  background: #0e0f14; color: #78736a; border-radius: 12px;
  font-family: system-ui, sans-serif;
}

/* PROJETO FINAL — uma peça autoral, candidata ao seu portfólio (awsomee.com).
   Sem regras, sem starter que te limite. Escolha UMA ideia e leve ao acabamento:
   um efeito, uma micro-cena interativa, uma visualização viva. Aplique o que
   te deixou mais orgulhoso no curso, e trate acessibilidade e performance como
   parte do acabamento, não como remendo. Faça algo que você teria orgulho de
   assinar. */
`),
    js(`// seu código — o palco é seu
`),
  ],
  checklist: [
    "É uma peça AUTORAL — uma ideia sua, não um exercício refeito?",
    "Tem uma assinatura de movimento memorável (a coisa que faz alguém dizer 'como você fez isso?')?",
    "O acabamento está lá: timing afinado, easing com gosto, detalhes cuidados?",
    "Performance e acessibilidade foram tratadas (transform/opacity, reduced-motion, teclado)?",
    "Você teria orgulho de colocar isto no awsomee.com como um case?",
  ],
};

/* =====================================================================
   MÓDULO 7 — Bônus Whimsy
   ===================================================================== */

const m7Css3d: LessonExercise = {
  starter: [
    html(`<div class="scene">
  <div class="card">
    <div class="face front">Faísca ✦</div>
    <div class="face back">Vira!</div>
  </div>
</div>`),
    css(`.scene {
  display: grid; place-items: center; min-height: 240px;
  font-family: system-ui, sans-serif; color: white; font-weight: 700;
  /* 1. dê profundidade à cena: perspective: 900px; */
}
.card {
  position: relative; width: 170px; height: 210px;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  /* 2. preserve o 3D dos filhos: transform-style: preserve-3d; */
}
.card:hover {
  /* 3. no hover, vire o card: transform: rotateY(180deg); */
}
.face {
  position: absolute; inset: 0; display: grid; place-items: center;
  border-radius: 16px; font-size: 1.3rem;
  /* 4. esconda o verso das faces: backface-visibility: hidden; */
}
.front { background: #7c5cff; }
.back {
  background: #ffb03a; color: #0e0f14;
  /* 5. deixe a face de trás já virada: transform: rotateY(180deg); */
}
`),
  ],
  solution: [
    html(`<div class="scene">
  <div class="card">
    <div class="face front">Faísca ✦</div>
    <div class="face back">Vira!</div>
  </div>
</div>`),
    css(`.scene {
  display: grid; place-items: center; min-height: 240px;
  font-family: system-ui, sans-serif; color: white; font-weight: 700;
  perspective: 900px;
}
.card {
  position: relative; width: 170px; height: 210px;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
}
.card:hover {
  transform: rotateY(180deg);
}
.face {
  position: absolute; inset: 0; display: grid; place-items: center;
  border-radius: 16px; font-size: 1.3rem;
  backface-visibility: hidden;
}
.front { background: #7c5cff; }
.back {
  background: #ffb03a; color: #0e0f14;
  transform: rotateY(180deg);
}
`),
  ],
  checks: [
    { type: "elementExists", selector: ".card", message: "O card existe" },
    {
      type: "computedStyle",
      selector: ".scene",
      prop: "perspective",
      matches: "\\d",
      message: "A cena tem perspective (o espaço 3D)",
    },
    {
      type: "computedStyle",
      selector: ".card",
      prop: "transform-style",
      equals: "preserve-3d",
      message: "O card preserva o 3D dos filhos",
    },
    {
      type: "computedStyle",
      selector: ".card:hover",
      prop: "transform",
      matches: "rotateY",
      message: "No hover, o card gira em Y (o flip)",
    },
    {
      type: "computedStyle",
      selector: ".face",
      prop: "backface-visibility",
      equals: "hidden",
      message: "As faces escondem o próprio verso",
    },
  ],
};

const m7Waapi: LessonExercise = {
  starter: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box { width: 54px; height: 54px; border-radius: 12px; background: #3ecf8e; }`),
    js(`// A Web Animations API (WAAPI) anima via JavaScript, sem CSS @keyframes, e
// devolve um OBJETO Animation que você controla (play, pause, reverse,
// playbackRate…). Anime a .box e GUARDE a animação numa variável "anim".
const box = document.querySelector(".box");

// const anim = box.animate(keyframes, options)
//   keyframes: [{ transform: "translateX(0)" }, { transform: "translateX(220px)" }]
//   options:   { duration: 900, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }
// Depois, experimente: anim.playbackRate = 1.5;

`),
  ],
  solution: [
    html(`<div class="track"><div class="box"></div></div>`),
    css(`.track { padding: 40px; overflow: hidden; }
.box { width: 54px; height: 54px; border-radius: 12px; background: #3ecf8e; }`),
    js(`const box = document.querySelector(".box");

const anim = box.animate(
  [{ transform: "translateX(0)" }, { transform: "translateX(220px)" }],
  { duration: 900, iterations: Infinity, direction: "alternate", easing: "ease-in-out" },
);
anim.playbackRate = 1.5;
`),
  ],
  checks: [
    { type: "elementExists", selector: ".box", message: "A .box existe" },
    {
      type: "animationRegistered",
      selector: ".box",
      message: "A .box tem uma animação rodando (via WAAPI)",
    },
    {
      type: "expression",
      expr: "typeof anim !== 'undefined' && anim && typeof anim.reverse === 'function'",
      message: "Você guardou o objeto Animation para controlá-lo",
    },
  ],
};

const m7Audio: LessonExercise = {
  starter: [
    html(
      `<canvas width="320" height="160" style="background:#0e0f14;border-radius:12px"></canvas>`,
    ),
    js(`// Áudio vira movimento quando você lê os NÍVEIS de frequência (o AnalyserNode
// entrega um array de 0..255 por faixa) e os mapeia para o visual. O primeiro
// passo é reduzir esse array a um NÍVEL geral (0..1) para pulsar algo.
//
// Implemente averageLevel(data): a média dos valores, normalizada para 0..1
// (divida a média por 255). Se o array estiver vazio, retorne 0.
function averageLevel(data) {
  // seu código aqui
}

// --- demo: um espectro sintético (sem áudio real) para você VER funcionando ---
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let t = 0;
function frame() {
  t += 0.05;
  const bars = 24;
  const data = Array.from({ length: bars }, (_, i) =>
    Math.floor((Math.sin(t + i * 0.4) * 0.5 + 0.5) * 255));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // barras
  const w = canvas.width / bars;
  data.forEach((v, i) => {
    const h = (v / 255) * canvas.height;
    ctx.fillStyle = "#7c5cff";
    ctx.fillRect(i * w + 2, canvas.height - h, w - 4, h);
  });
  // círculo central que pulsa com o SEU averageLevel
  const level = averageLevel(data);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 8 + level * 30, 0, Math.PI * 2);
  ctx.fillStyle = "#ffb03a";
  ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  solution: [
    html(
      `<canvas width="320" height="160" style="background:#0e0f14;border-radius:12px"></canvas>`,
    ),
    js(`function averageLevel(data) {
  if (!data.length) return 0;
  let sum = 0;
  for (const v of data) sum += v;
  return sum / data.length / 255;
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let t = 0;
function frame() {
  t += 0.05;
  const bars = 24;
  const data = Array.from({ length: bars }, (_, i) =>
    Math.floor((Math.sin(t + i * 0.4) * 0.5 + 0.5) * 255));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width / bars;
  data.forEach((v, i) => {
    const h = (v / 255) * canvas.height;
    ctx.fillStyle = "#7c5cff";
    ctx.fillRect(i * w + 2, canvas.height - h, w - 4, h);
  });
  const level = averageLevel(data);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 8 + level * 30, 0, Math.PI * 2);
  ctx.fillStyle = "#ffb03a";
  ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checks: [
    {
      type: "functionDefined",
      name: "averageLevel",
      message: "A função averageLevel está definida",
    },
    {
      type: "functionReturns",
      name: "averageLevel",
      args: [[0, 255]],
      expected: 0.5,
      approx: 1e-9,
      message: "a média de 0 e 255 normaliza para 0.5",
    },
    {
      type: "functionReturns",
      name: "averageLevel",
      args: [[255, 255, 255]],
      expected: 1,
      approx: 1e-9,
      message: "tudo no máximo = nível 1",
    },
    {
      type: "functionReturns",
      name: "averageLevel",
      args: [[]],
      expected: 0,
      message: "array vazio = nível 0 (guard)",
    },
    {
      type: "canvasPainted",
      selector: "canvas",
      message: "O visualizador está desenhando",
    },
  ],
};

const m7DesafioPlayer: LessonExercise = {
  // Open capstone (validation: visual). The starter is a COMPLETE, working player
  // that plays a real local track (/media/faisca-loop.wav) and reacts to it via
  // AnalyserNode — the payoff of the whole course. Judged by the checklist.
  starter: [
    html(`<div class="player">
  <div class="scene">
    <div class="cover">
      <div class="face art">♪</div>
      <div class="face info">Faísca FM<br /><small>lo-fi loop</small></div>
    </div>
  </div>
  <canvas width="280" height="80" style="background:#0e0f14;border-radius:10px"></canvas>
  <button class="play">▶ Tocar</button>
  <!-- música local, self-hosted (offline). crossorigin permite a análise de áudio -->
  <audio src="/media/faisca-loop.wav" crossorigin="anonymous" loop></audio>
</div>`),
    css(`.player {
  display: grid; place-items: center; gap: 14px; padding: 20px;
  font-family: system-ui, sans-serif;
}
.scene { perspective: 800px; }
.cover {
  position: relative; width: 130px; height: 130px; cursor: pointer;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
}
.cover.flipped { transform: rotateY(180deg); }
.cover.playing .art { animation: spin 6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.face {
  position: absolute; inset: 0; display: grid; place-items: center;
  border-radius: 14px; backface-visibility: hidden; color: white; text-align: center;
}
.art { background: linear-gradient(135deg, #7c5cff, #ffb03a); font-size: 2.2rem; }
.info { background: #1b1e27; transform: rotateY(180deg); font-size: 1rem; line-height: 1.5; }
.info small { color: #78736a; font-size: 0.75rem; }
.play {
  padding: 10px 22px; border: none; border-radius: 999px;
  background: #ffb03a; color: #0e0f14; font-weight: 700;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.play:active { transform: scale(0.94); }

/* DESAFIO FINAL — o mini music player, com MÚSICA DE VERDADE.
   Clique em "Tocar": o loop lo-fi local toca e o visualizador dança com o som
   real (via AnalyserNode). A capa gira como um vinil e vira ao clicar.
   Agora torne-o SEU: cores, layout, controles, uma capa mais bonita, um
   slider de progresso… E veja o JS para entender a cadeia de áudio. */
@media (prefers-reduced-motion: reduce) {
  .cover, .play { transition: none; }
  .cover.playing .art { animation: none; }
}`),
    js(`const cover = document.querySelector(".cover");
cover.addEventListener("click", () => cover.classList.toggle("flipped"));

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const audio = document.querySelector("audio");
const playBtn = document.querySelector(".play");

// --- cadeia de áudio (Módulo 7): <audio> -> AnalyserNode -> alto-falantes ---
let audioCtx, analyser, data, playing = false;
playBtn.addEventListener("click", async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;                       // -> 32 barras de frequência
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    data = new Uint8Array(analyser.frequencyBinCount);
  }
  await audioCtx.resume();                        // o gesto que o navegador exige
  if (playing) { audio.pause(); playBtn.textContent = "▶ Tocar"; }
  else { await audio.play(); playBtn.textContent = "⏸ Pausar"; }
  playing = !playing;
  cover.classList.toggle("playing", playing);
});

// --- loop do visualizador (Módulo 4), suavizado com lerp (Módulo 1) ---
const smooth = [];
let t = 0;
function frame() {
  t += 0.08;
  const bars = analyser ? data.length : 24;
  const w = canvas.width / bars;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (analyser && playing) analyser.getByteFrequencyData(data);
  for (let i = 0; i < bars; i++) {
    const target = (analyser && playing)
      ? (data[i] / 255) * canvas.height
      : (Math.sin(t + i * 0.4) * 0.5 + 0.5) * canvas.height * 0.4; // idle
    smooth[i] = (smooth[i] || 0) + (target - (smooth[i] || 0)) * 0.35;
    ctx.fillStyle = i % 2 ? "#7c5cff" : "#3ecf8e";
    ctx.fillRect(i * w + 1, canvas.height - smooth[i], w - 2, smooth[i]);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`),
  ],
  checklist: [
    "Clicou em Tocar? O loop local toca e o visualizador reage ao som REAL?",
    "O flip da capa é suave e revela a info da faixa no verso?",
    "A capa gira como um vinil enquanto toca (e para ao pausar)?",
    "Os controles são claros e respondem ao toque?",
    "Com prefers-reduced-motion, o giro e as micro-interações se acalmam?",
    "Você tornou o player SEU — cores, layout, um toque de personalidade?",
  ],
};

export const EXERCISES: Record<string, LessonExercise> = {
  "m0-transitions": m0Transitions,
  "m0-easing": m0Easing,
  "m0-keyframes": m0Keyframes,
  "m0-compositing": m0Compositing,
  "m0-reduced-motion": m0ReducedMotion,
  "m0-desafio-botao": m0DesafioBotao,
  "m1-raf": m1Raf,
  "m1-dom-mass": m1DomMass,
  "m1-lerp": m1Lerp,
  "m1-trig": m1Trig,
  "m1-random": m1Random,
  "m1-physics": m1Physics,
  "m1-perf": m1Perf,
  "m1-react": m1React,
  "m1-desafio-like": m1DesafioLike,
  "m2-viewbox": m2Viewbox,
  "m2-paths": m2Paths,
  "m2-dasharray": m2Dasharray,
  "m2-icons": m2Icons,
  "m2-gradients": m2Gradients,
  "m2-dataviz": m2Dataviz,
  "m2-spring": m2Spring,
  "m2-react": m2React,
  "m2-desafio-icones": m2DesafioIcones,
  "m3-rect": m3Rect,
  "m3-look": m3Look,
  "m3-scroll-css": m3ScrollCss,
  "m3-scrollytelling": m3Scrollytelling,
  "m3-gestures": m3Gestures,
  "m3-view-transitions": m3ViewTransitions,
  "m3-desafio-card": m3DesafioCard,
  "m4-immediate": m4Immediate,
  "m4-gameloop": m4Gameloop,
  "m4-particles": m4Particles,
  "m4-physics": m4Physics,
  "m4-noise": m4Noise,
  "m4-workers": m4Workers,
  "m4-decision": m4Decision,
  "m4-desafio-fireworks": m4DesafioFireworks,
  "m5-principios": m5Principios,
  "m5-orquestracao": m5Orquestracao,
  "m5-acao": m5Acao,
  "m5-bom-gosto": m5BomGosto,
  "m5-desafio-redesign": m5DesafioRedesign,
  "m6-explosao": m6Explosao,
  "m6-hero": m6Hero,
  "m6-scrollytelling": m6Scrollytelling,
  "m6-projeto-final": m6ProjetoFinal,
  "m7-css-3d": m7Css3d,
  "m7-waapi": m7Waapi,
  "m7-audio": m7Audio,
  "m7-desafio-player": m7DesafioPlayer,
};
