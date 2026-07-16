# Projeto "Faísca" — Plataforma Interativa de Animações Web

> Plano de implementação para ser executado por Claude Opus (Claude Code).
> Autor do projeto: Will (senior frontend engineer, React/TS/CSS Modules, estudando GSAP/Three.js/shaders).

---

## 1. Visão geral

Uma plataforma de aprendizado pessoal, estilo Codecademy, rodando localmente/self-hosted em **Next.js**, para Will estudar animações web criativas. O currículo cobre as mesmas **áreas de tópicos** do curso "Whimsical Animations" de Josh Comeau (partículas, SVG, interações avançadas, Canvas, design de animação), mas com **conteúdo 100% original** — escrito do zero, com explicações, exemplos e exercícios próprios.

**Regra inegociável de propriedade intelectual:** NÃO copiar, parafrasear de perto, ou reconstruir lições, textos, exercícios ou soluções do curso do Josh Comeau (que é pago e protegido por copyright). Apenas a lista pública de tópicos serve de mapa. Todo o conteúdo das lições deve ser autoral.

**Estilo pedagógico (importante):** todas as lições seguem o formato "teacher mode" do Will:
1. **Analogia do mundo real primeiro** (explicar como se fosse para uma criança de 10 anos)
2. **Visualização/demo interativa**
3. **Profundidade técnica** (o "porquê" por trás)
4. **Exercício prático no editor**

**Idiomas:** explicações em **português brasileiro**, código, termos técnicos e nomes de API em **inglês** (ex: "O `requestAnimationFrame` é como o maestro de uma orquestra...").

---

## 2. Stack técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Requisito do Will |
| Estilos | CSS Modules + design tokens em CSS custom properties | Stack diária do Will; ele quer praticar CSS puro |
| Animações da UI da plataforma | Motion (LazyMotion, `m.` components) | Dogfooding — mesma lib do projeto AnimatedOdds dele |
| Conteúdo das lições | MDX (via `@next/mdx` ou `contentlayer2`) com frontmatter | Lições como arquivos versionáveis |
| Editor de código in-browser | **CodeMirror 6** (`@codemirror/*`, temas + linguagens instalados via npm) | 100% offline após `npm install`; leve; syntax highlight de HTML/CSS/JS/TS/JSX |
| Preview ao vivo | `<iframe>` sandboxed com `srcdoc` montado a partir dos arquivos do aluno | Zero dependência externa; HTML/CSS/JS/SVG/Canvas rodam nativamente |
| Lições em React | `@babel/standalone` + React/ReactDOM UMD servidos de `/public/vendor/` | Transpila JSX no browser, sem CDN, sem bundler remoto |
| Persistência | **SQLite local** (`better-sqlite3` via route handlers do Next.js), arquivo `data/progress.db` | Funciona offline, sobrevive a limpeza do browser, single-user |
| Sincronização (opcional) | Push/pull para o Supabase self-hosted do Will quando houver rede | Fila de mutações pendentes; sync é extra, nunca requisito |

**Requisito inegociável: a plataforma roda 100% offline.** Isso significa: nenhuma chamada a CDN em runtime (nem Sandpack, nem Google Fonts, nem unpkg); fontes self-hosted em `/public/fonts/` (ex: via `@fontsource`); vídeos/GIFs de referência dos desafios gravados e armazenados em `/public/media/`; todas as libs vendorizadas via npm ou `/public/vendor/`. Teste de aceitação: desligar o Wi-Fi e completar uma lição inteira (editar → verificar → XP salvo).

Variáveis de ambiente (só para o sync opcional): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`. Sem elas, o app funciona normalmente em modo local puro — sem auth, já que é single-user rodando na máquina do Will.

---

## 3. Currículo (8 módulos, ~50 lições)

Cada lição tem: slug, tipo de validação (`auto` | `visual` | `both`), XP, e arquivos iniciais do editor (starter code).

### Módulo 0 — Fundamentos de Movimento (primer, 6 lições)
1. Transitions: o que anima e o que não anima (propriedades animáveis)
2. Timing functions e easing — a personalidade do movimento (cubic-bezier playground)
3. Keyframes e animações compostas
4. `transform` e `opacity`: por que só elas são "de graça" (GPU compositing — Will já estudou isso, ir fundo)
5. `prefers-reduced-motion` e acessibilidade de movimento
6. **Desafio do módulo:** botão com micro-interação completa (hover, press, focus, reduced-motion)

### Módulo 1 — Efeitos de Partículas (9 lições)
1. O loop de animação: `requestAnimationFrame` como coração pulsante
2. Criando e destruindo elementos DOM em massa (pooling, cleanup)
3. Linear interpolation (`lerp`) — o tempero secreto
4. Trigonometria para quem odeia trigonometria (sin/cos como "máquina de ondas" — conectar com o que Will já aprendeu em shaders)
5. Aleatoriedade controlada: ranges, distribuições, seeds
6. Física básica: velocidade, gravidade, atrito
7. Performance: DevTools, paint flashing, diagnóstico de frame drops
8. Portando para React: refs, cleanup de efeitos, evitar re-renders
9. **Desafio:** efeito de "curtir" que explode partículas (estilo botão de like)

### Módulo 2 — A Magia do SVG (9 lições)
1. viewBox: a janela mágica (analogia da moldura de quadro)
2. Paths e o alfabeto do `d` (M, L, C, Q, A)
3. `stroke-dasharray` / `stroke-dashoffset`: desenhando linhas animadas
4. Ícones animados e micro-interações (morphing simples, transform-origin em SVG)
5. Gradientes, masks e filtros SVG
6. Data viz sem bibliotecas: um gráfico de linha animado do zero
7. Spring physics: por que molas parecem vivas (implementar spring simples + usar Motion)
8. SVG em React: componentização, animação declarativa
9. **Desafio:** conjunto de 3 ícones com micro-interações (download, external link, wand)

### Módulo 3 — Interações Avançadas (7 lições)
1. `getBoundingClientRect` e a matemática do cursor
2. Elementos que "olham" para o mouse (ângulos, atan2)
3. Scroll-driven animations com CSS moderno (`animation-timeline`)
4. Scrollytelling com `IntersectionObserver`
5. Press duration, gestos e estados intermediários
6. View Transition API: animando entre rotas no Next.js
7. **Desafio:** card que reage ao cursor (tilt 3D + glow que segue o mouse)

### Módulo 4 — HTML Canvas (8 lições)
1. Immediate mode: pintar e esquecer (analogia do quadro branco vs. teatro de fantoches — DOM/SVG são fantoches, Canvas é desenho)
2. O game loop no Canvas: clear, update, draw
3. Sistemas de partículas em escala (centenas de objetos)
4. Física realista: gravidade, resistência do ar, bounce
5. Perlin/simplex noise: aleatoriedade orgânica (conectar com shaders/GLSL que Will estuda)
6. Web Workers e OffscreenCanvas
7. Canvas vs SVG vs DOM: árvore de decisão
8. **Desafio:** fireworks procedural (celebração customizada, sem lib de confetti)

### Módulo 5 — Design de Animação (5 lições, validação `visual`)
1. Princípios: antecipação, follow-through, squash & stretch aplicados à web
2. Orquestração: stagger, sequência, hierarquia de atenção
3. Animar pela ação do usuário, não pelo estado
4. O bom gosto: quando NÃO animar (animação irritante vs. deliciosa)
5. **Desafio:** redesenhar uma interação sem graça dando personalidade a ela

### Módulo 6 — Desafios Finais (4 desafios abertos, validação `visual`)
1. Explosão de partículas estilo videogame (referência: efeitos de plataforma 2D)
2. Hero de landing page "tech startup" com SVG animado
3. Scrollytelling de uma página inteira
4. **Projeto final:** uma peça autoral para o portfólio awsomee.com (candidata a case study)

### Módulo 7 — Bônus Whimsy (4 lições)
1. 3D com CSS puro: `perspective`, `transform-style: preserve-3d`, `backface-visibility` (card flip e cubo rotativo — analogia do palco de teatro com profundidade)
2. Web Animations API: `element.animate()`, `playbackRate`, `composite`, controle de playback — animação imperativa sem nenhuma lib
3. Audio-reativo com Web Audio API: `AnalyserNode`, frequência vs. waveform, mapeando som em movimento (arquivos de áudio locais em `/public/media/`, mantendo o offline)
4. **Desafio:** mini music player com capa em 3D flip e visualizador que dança com a música

---

## 4. Estrutura de rotas

```
/                       → Dashboard: progresso geral, streak, "continuar de onde parou", próxima lição
/curso/[module]         → Visão do módulo: lista de lições, anel de progresso, badge do módulo
/curso/[module]/[lesson]→ Página da lição (layout em §5)
/conquistas             → Grid de badges (bloqueadas em silhueta), XP total, streak, certificado
/playground             → Editor livre (vanilla ou react), sem validação, com botão "salvar snippet"
/desafios               → Lista dos desafios finais do Módulo 6
```

## 5. Layout da página de lição

Duas colunas em desktop (conteúdo MDX à esquerda ~45%, editor+preview à direita ~55%), tabs empilhadas em mobile. Elementos:

- Conteúdo MDX com componentes customizados: `<Analogia>` (callout destacado, sempre o primeiro bloco), `<Demo>` (componente interativo inline), `<Aprofundamento>` (collapsible com detalhe técnico), `<Dica>`, `<Meta>` (objetivo do exercício)
- Editor CodeMirror com abas de arquivos (html/css/js), preview no iframe `srcdoc` com hot reload (debounce ~400ms), e console capturado (proxy de `console.log/warn/error` via `postMessage`)
- Barra de ações: **"Verificar"** (roda os checks), **"Resetar código"**, **"Ver solução"** (só habilita após 2 tentativas), **"Marcar como concluída"** (lições `visual`)
- Feedback de validação: lista de checks com ✅/❌ e mensagem por check
- Ao completar: animação de celebração (usar as próprias técnicas do curso — partículas no Módulo 1+, fireworks em Canvas após Módulo 4), toast de XP, atualização do progresso
- Navegação anterior/próxima no rodapé

## 6. Motor de validação

Frontmatter da lição define `validation: auto | visual | both` e uma lista de `checks`.

**Modo `auto` (estilo Codecademy):** ao clicar em "Verificar", o preview é remontado com um script de testes injetado no final do `srcdoc`, depois do código do aluno. Ele roda dentro do iframe e reporta resultados via `postMessage` para a página (com timeout de segurança para código travado em loop). Tipos de check suportados (implementar como pequenas helpers):

- `elementExists(selector)`
- `computedStyle(selector, prop, expected | predicate)` — ex: verificar `transform`, `transition-duration`
- `animationRegistered(selector)` — via `element.getAnimations()`
- `functionDefined(name)` / `functionReturns(name, args, expected)` — para lições de lerp, trig, noise
- `rafActive()` — spy em `requestAnimationFrame` para confirmar loop rodando
- `particleCount(selector, min)` — após simular um clique
- `canvasPainted(canvasSelector)` — amostragem de pixels via `getImageData` (não-branco/não-transparente)
- `reducedMotionRespected()` — emular media query e verificar que a animação desliga

**Modo `visual`:** vídeo/GIF ou componente de referência lado a lado + checklist de auto-avaliação (3–5 itens) + botão "Marcar como concluída".

**Modo `both`:** checks automáticos + checklist visual.

## 7. Modelo de dados (SQLite local — `data/progress.db`)

```sql
-- single user, sem tabela de usuários
create table profile (
  id integer primary key check (id = 1),
  display_name text,
  xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date text
);

create table lesson_progress (
  lesson_slug text primary key,
  status text check (status in ('not_started','in_progress','completed')),
  attempts integer default 0,
  completed_at text,
  saved_code text,           -- JSON com snapshot dos arquivos do editor
  updated_at text default (datetime('now'))  -- usado pelo sync
);

create table achievements (
  badge_id text primary key,
  unlocked_at text default (datetime('now'))
);

create table playground_snippets (
  id text primary key,       -- uuid gerado na aplicação
  title text,
  files text,                -- JSON
  created_at text default (datetime('now'))
);
```

Acesso via route handlers (`/api/progress`, `/api/achievements`, `/api/snippets`) com `better-sqlite3`. **Sync opcional para o Supabase:** tabelas espelhadas na instância dele; estratégia last-write-wins por `updated_at`; botão "Sincronizar" no dashboard + tentativa automática silenciosa quando houver rede. O sync nunca bloqueia nada.

**Badges (15):** 1 por módulo concluído (8), "Primeira Faísca" (1ª lição), "Maratonista" (streak de 7 dias), "Persistente" (exercício resolvido após 5+ tentativas sem ver solução), "Cientista" (10 snippets salvos no playground), "Perfeccionista" (módulo inteiro sem abrir soluções), "Physics Nerd" (todas as lições de física), "Formado" (curso 100% — desbloqueia página de certificado com efeito de fireworks em Canvas).

## 8. Direção de design da plataforma

A identidade visual deve **encarnar o assunto**: a própria plataforma é uma demonstração de whimsy — mas com disciplina (uma assinatura forte, o resto quieto).

- **Conceito:** "caderno de laboratório de um animador" — fundo escuro profundo (o curso é estudado à noite), com elementos que reagem ao usuário
- **Paleta (tokens):** `--ink: #0E0F14` (fundo), `--paper: #F5F2EA` (texto), `--spark: #FFB03A` (âmbar, ações/XP), `--pulse: #7C5CFF` (violeta, progresso), `--mint: #3ECF8E` (sucesso/checks)
- **Tipografia:** display com personalidade para títulos de módulo (ex: "Clash Display" ou "Bricolage Grotesque"), corpo legível (ex: "Inter" ou "Public Sans"), mono para código ("JetBrains Mono")
- **Elemento-assinatura:** o **anel de progresso de cada módulo é uma linha SVG viva** — desenhada com `stroke-dashoffset`, que "respira" com uma ondulação sutil de spring quando ganha progresso. É literalmente a técnica do Módulo 2 aplicada na UI.
- Micro-interações discretas em botões e cards; celebrações grandes só ao concluir lições/módulos
- `prefers-reduced-motion` respeitado em TUDO (a plataforma pratica o que ensina)
- Responsivo até mobile (Will estuda no celular às vezes); foco de teclado visível

## 9. Fases de implementação (para o Opus executar em sessões)

**Fase 1 — Fundação (1 sessão):**
Scaffold Next.js + TS + CSS Modules, design tokens, fontes self-hosted, layout global, SQLite + route handlers, pipeline MDX com componentes customizados, editor CodeMirror + preview `srcdoc` + console, motor de validação com todos os helpers, página de lição completa funcionando com 1 lição de exemplo, dashboard básico. **Teste de aceitação: tudo funciona com Wi-Fi desligado.**

**Fase 2 — Conteúdo inicial + gamificação (1–2 sessões):**
Módulos 0 e 1 completos (15 lições), sistema de XP/streak/badges, página de conquistas, celebrações.

**Fase 3 — Módulos 2 e 3 (1–2 sessões):** 16 lições + playground.

**Fase 4 — Módulos 4, 5, 6 e 7 (1–2 sessões):** 21 lições/desafios, certificado, polimento final, View Transitions entre rotas.

**Critérios de qualidade por lição:** analogia genuinamente boa (não genérica), demo interativa funcional, exercício com starter code que compila, solução oculta que passa nos próprios checks, e todo texto em pt-BR natural (não tradução literal do inglês).

## 10. Prompt de handoff para o Opus

> Implemente a Fase 1 do plano em anexo (plano-plataforma-whimsy.md). Siga o plano exatamente: stack, estrutura de rotas, modelo de dados, motor de validação e direção de design. Regras: (1) todo conteúdo de lição é original — não reproduza material do curso Whimsical Animations do Josh Comeau; (2) explicações em pt-BR, código em inglês; (3) toda lição começa com uma analogia do mundo real; (4) CSS Modules, sem Tailwind; (5) `prefers-reduced-motion` respeitado em toda a UI; (6) **zero requisições externas em runtime** — nenhuma CDN, fonte remota ou API externa; tudo vendorizado localmente. Ao final da fase, rode o build, teste a lição de exemplo de ponta a ponta com a rede desabilitada (editar código → Verificar → checks passam → XP salvo no SQLite) e liste o que ficou para a Fase 2.

### Prompt opcional de refinamento visual (usar depois da Fase 1, se a UI sair genérica)

> Faça um passe exclusivamente visual na plataforma, sem tocar em lógica. Critique a UI atual contra a §8 do plano: a identidade "caderno de laboratório de um animador" está presente ou parece um template escuro qualquer? Verifique: (1) o anel de progresso SVG é realmente o elemento-assinatura — desenhado com stroke-dashoffset e com a ondulação de spring ao ganhar progresso; (2) a tipografia display tem personalidade e hierarquia clara; (3) as micro-interações existem mas são discretas (hover/press/focus em botões e cards); (4) espaçamento e ritmo vertical consistentes via tokens; (5) estados vazios e de erro têm voz própria (pt-BR, tom de convite, nunca vagos); (6) `prefers-reduced-motion` desliga tudo que se move; (7) mobile impecável. Liste o que está genérico, proponha a correção, aplique, e tire screenshots antes/depois de dashboard, página de módulo e página de lição.

---

*Notas em aberto (decidir durante a Fase 1, não bloqueiam o início): nome final do projeto ("Faísca" é sugestão), fonte display definitiva, e se o certificado final vira uma página pública linkável no awsomee.com.*
