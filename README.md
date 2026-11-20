# Faísca ⚡

> A self-hosted, Codecademy-style platform for learning **creative web animation**
> (CSS, SVG, Canvas, Web Audio, motion design). 8 modules and 52 original lessons
> in Brazilian Portuguese, each with an in-browser editor, a live preview and
> automated checks. It runs 100% offline.

Plataforma de estudo de **animações web criativas** no estilo Codecademy,
rodando local/self-hosted em Next.js. Conteúdo 100% autoral em pt-BR; código e
APIs em inglês.

**O que tem dentro:**

- **8 módulos, 52 lições**: partículas, SVG, interações avançadas, Canvas,
  design de animação, desafios de portfólio e um módulo bônus (3D com CSS, WAAPI,
  áudio-reativo)
- **Editor + preview ao vivo**: CodeMirror 6 com preview em `<iframe srcdoc>` e
  console integrado
- **Motor de validação**: cada exercício tem checks declarativos que rodam
  dentro do iframe (estilos computados, `requestAnimationFrame` ativo, canvas
  pintado, `prefers-reduced-motion` respeitado…)
- **Gamificação**: XP, streak, badges e um certificado com fireworks em Canvas

**Regra inegociável:** roda **100% offline**. Nenhuma requisição a CDN em runtime
— fontes self-hosted (`@fontsource`), libs vendorizadas via npm, preview em
`<iframe srcdoc>`. Teste de aceitação: desligar o Wi-Fi e completar uma lição.

## Stack

- **Next.js 16** (App Router, TypeScript, React Compiler)
- **CSS Modules** + design tokens em CSS custom properties (sem Tailwind)
- **MDX** (`@next/mdx`) para o conteúdo das lições; metadados em `content/curriculum.ts`
- **CodeMirror 6** como editor in-browser
- **better-sqlite3** para persistência local (`data/progress.db`)
- **Motion** disponível para micro-interações (dogfooding)

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint     # biome
npm run format   # biome --write
```

O banco `data/progress.db` é criado automaticamente no primeiro acesso e está no
`.gitignore`.

## Arquitetura (Fase 1)

```
app/                     rotas (dashboard, /curso/[module]/[lesson], /conquistas, /playground, /desafios)
  api/                   route handlers (progress, achievements, snippets)
components/
  editor/                CodeEditor, LessonWorkspace, Celebration
  mdx/                   Analogia / Demo / Aprofundamento / Dica / Meta + demos
  progress/              ProgressRing (o elemento-assinatura em SVG)
  layout/                Nav
content/
  curriculum.ts          os 8 módulos e ~50 lições (fonte da verdade de metadados)
  lessons/*.mdx          corpo autoral das lições (registrado em lessons/index.ts)
lib/
  db.ts, progress.ts     SQLite + regras de XP/streak/badges
  preview/               buildSrcdoc + scripts injetados (console bridge, rAF spy, harness)
  validation/            tipos dos checks declarativos
```

### Motor de validação

Cada lição `auto` declara `checks` (JSON) em `curriculum.ts`. Ao clicar em
**Verificar**, o preview é remontado com um harness injetado que roda os checks
dentro do iframe e reporta via `postMessage` (com timeout para loops travados).
Checks suportados: `elementExists`, `computedStyle`, `animationRegistered`,
`functionDefined`, `functionReturns`, `rafActive`, `particleCount`,
`canvasPainted`, `reducedMotionRespected`.

## Estado

**Curso 100% completo** — os 8 módulos e as 52 lições estão autorais (prosa MDX +
exercícios com starter/solução/checks ou checklist), verificadas em browser real.
O badge "Formado" e a página de certificado com fireworks são conquistáveis só
estudando. Próximos passos possíveis (opcionais, §10 do plano): infra de React no
browser (`@babel/standalone`) para lições React declarativas, mídia de áudio real
em `/public/media/`, sync opcional com Supabase, galeria de snippets, e um passe
de polimento visual.

### Histórico por módulo

**Fases 1 e 2.**

- **Fase 1** (fundação): scaffold, tokens, fontes offline, SQLite + rotas,
  pipeline MDX, editor + preview + console, motor de validação com todos os
  helpers, página de lição funcional, dashboard.
- **Fase 2** (conteúdo inicial + gamificação): Módulos 0 e 1 completos (15
  lições autorais com starter/solução/checks verificados em browser real),
  checklist de auto-avaliação para desafios, e todos os badges relevantes com
  gatilhos (Primeira Faísca, módulo, Maratonista, Persistente, Perfeccionista,
  Physics Nerd, Cientista, Formado).
- **Módulo 2 — A Magia do SVG** (9 lições: viewBox, paths, stroke-dasharray,
  ícones, gradientes, dataviz, spring physics, SVG em React, desafio dos 3
  ícones). Adicionado o check `attribute` ao motor (para `viewBox`/`d`/`points`).
- **Módulo 3 — Interações Avançadas** (7 lições: getBoundingClientRect, atan2,
  scroll-driven CSS, IntersectionObserver, gestos/press-duration, View
  Transitions, desafio do card com tilt 3D + glow). Adicionada a flag `declared`
  ao check `computedStyle` (lê o valor autoral do CSSOM, robusto para props
  novas como `animation-timeline` e `view-transition-name`).
- **Módulo 4 — HTML Canvas** (8 lições: immediate mode, game loop, partículas em
  escala, física, Perlin noise, Web Workers/OffscreenCanvas, árvore de decisão
  Canvas/SVG/DOM, desafio de fireworks procedural). Adicionado o check
  `expression` (avalia JS no sandbox) e o componente `VisualComplete` (checklist
  + "Marcar como concluída") para lições `visual` sem editor.
- **Módulo 5 — Design de Animação** (5 lições `visual`: princípios/squash&stretch,
  orquestração/stagger, animar pela ação vs. estado, o bom gosto de quando NÃO
  animar, e o desafio de redesenhar uma interação sem graça). Demos interativos
  `SquashStretchDemo` e `StaggerDemo`.
- **Módulo 6 — Desafios Finais** (4 desafios abertos de portfólio: explosão
  estilo videogame, hero de landing SVG, scrollytelling de página inteira,
  projeto final autoral).
- **Página de certificado** (`/certificado`): o badge "Formado" desbloqueia um
  certificado com **fireworks em Canvas** (a técnica do Módulo 4 dogfooded),
  nome, XP e stats; estado bloqueado antes da conclusão; link em `/conquistas`.

- **Módulo 7 — Bônus Whimsy** (4 lições: 3D com CSS puro/card flip, Web
  Animations API, áudio-reativo com Web Audio, e o desafio do mini music player
  com capa 3D flip + visualizador). O player toca **música real** — um loop lo-fi
  sintetizado localmente em `/public/media/faisca-loop.wav` (offline, self-hosted)
  e analisado ao vivo por `AnalyserNode`. `/media/*` é servido com CORS (`headers()`
  no `next.config`) para o iframe sandbox (origem opaca) poder analisá-lo.

Conteúdo de lição: prosa em `content/lessons/*.mdx` (registrada em
`lessons/index.ts`), exercícios em `content/exercises.ts`.

## Licença

MIT. Ver [LICENSE](LICENSE).
