import { EXERCISES } from "@/content/exercises";
import type { Check } from "@/lib/validation/types";

export type ValidationMode = "auto" | "visual" | "both";
export type EditorLang = "html" | "css" | "js";

export interface EditorFile {
  name: string;
  lang: EditorLang;
  content: string;
}

export interface Lesson {
  slug: string;
  title: string;
  subtitle?: string;
  xp: number;
  validation: ValidationMode;
  /** Whether an authored MDX body exists at content/lessons/<slug>.mdx */
  hasContent?: boolean;
  /** Starter files loaded into the editor */
  starter?: EditorFile[];
  /** Hidden reference solution (unlocks after 2 attempts) */
  solution?: EditorFile[];
  /** Auto checks (validation: auto | both) */
  checks?: Check[];
  /** Self-assessment items (validation: visual | both) */
  checklist?: string[];
}

export interface Module {
  slug: string;
  index: number;
  title: string;
  tagline: string;
  badgeId: string;
  lessons: Lesson[];
}

/* ---------------------------------------------------------------
   The full 8-module map (§3). Fase 1 authors ONE complete lesson
   (m0-transitions); the rest carry real metadata so the module and
   dashboard views render the whole journey. Lessons without
   `hasContent` show an "em breve" state.
   --------------------------------------------------------------- */

export const CURRICULUM: Module[] = [
  {
    slug: "fundamentos-de-movimento",
    index: 0,
    title: "Fundamentos de Movimento",
    tagline: "O primer: o que é movimento na web e o que o torna gostoso.",
    badgeId: "modulo-0",
    lessons: [
      {
        slug: "m0-transitions",
        title: "Transitions: o que anima e o que não anima",
        subtitle:
          "As propriedades animáveis e a mágica do estado intermediário",
        xp: 50,
        validation: "auto",
      },
      {
        slug: "m0-easing",
        title: "Timing functions e easing",
        subtitle: "A personalidade do movimento (playground de cubic-bezier)",
        xp: 50,
        validation: "auto",
      },
      {
        slug: "m0-keyframes",
        title: "Keyframes e animações compostas",
        xp: 50,
        validation: "auto",
      },
      {
        slug: "m0-compositing",
        title: "transform e opacity: por que só elas são 'de graça'",
        subtitle: "GPU compositing por dentro",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m0-reduced-motion",
        title: "prefers-reduced-motion e acessibilidade de movimento",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m0-desafio-botao",
        title: "Desafio: botão com micro-interação completa",
        subtitle: "hover, press, focus, reduced-motion",
        xp: 120,
        validation: "both",
      },
    ],
  },
  {
    slug: "efeitos-de-particulas",
    index: 1,
    title: "Efeitos de Partículas",
    tagline: "O loop de animação e a matemática que dá vida às coisas.",
    badgeId: "modulo-1",
    lessons: [
      {
        slug: "m1-raf",
        title: "O loop de animação: requestAnimationFrame",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m1-dom-mass",
        title: "Criando e destruindo elementos em massa",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m1-lerp",
        title: "Linear interpolation (lerp): o tempero secreto",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m1-trig",
        title: "Trigonometria para quem odeia trigonometria",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m1-random",
        title: "Aleatoriedade controlada: ranges, distribuições, seeds",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m1-physics",
        title: "Física básica: velocidade, gravidade, atrito",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m1-perf",
        title: "Performance: DevTools, paint flashing, frame drops",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m1-react",
        title: "Portando para React: refs, cleanup, re-renders",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m1-desafio-like",
        title: "Desafio: efeito de 'curtir' que explode partículas",
        xp: 130,
        validation: "both",
      },
    ],
  },
  {
    slug: "a-magia-do-svg",
    index: 2,
    title: "A Magia do SVG",
    tagline: "Desenho vetorial que respira, do viewBox aos springs.",
    badgeId: "modulo-2",
    lessons: [
      {
        slug: "m2-viewbox",
        title: "viewBox: a janela mágica",
        xp: 60,
        validation: "auto",
      },
      {
        slug: "m2-paths",
        title: "Paths e o alfabeto do d (M, L, C, Q, A)",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m2-dasharray",
        title: "stroke-dasharray / dashoffset: linhas animadas",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m2-icons",
        title: "Ícones animados e micro-interações",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m2-gradients",
        title: "Gradientes, masks e filtros SVG",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m2-dataviz",
        title: "Data viz sem bibliotecas: gráfico de linha animado",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m2-spring",
        title: "Spring physics: por que molas parecem vivas",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m2-react",
        title: "SVG em React: componentização e animação declarativa",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m2-desafio-icones",
        title: "Desafio: 3 ícones com micro-interações",
        xp: 140,
        validation: "both",
      },
    ],
  },
  {
    slug: "interacoes-avancadas",
    index: 3,
    title: "Interações Avançadas",
    tagline: "O cursor, o scroll e as transições entre telas.",
    badgeId: "modulo-3",
    lessons: [
      {
        slug: "m3-rect",
        title: "getBoundingClientRect e a matemática do cursor",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m3-look",
        title: "Elementos que 'olham' para o mouse (atan2)",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m3-scroll-css",
        title: "Scroll-driven animations com animation-timeline",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m3-scrollytelling",
        title: "Scrollytelling com IntersectionObserver",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m3-gestures",
        title: "Press duration, gestos e estados intermediários",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m3-view-transitions",
        title: "View Transition API: animando entre rotas",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m3-desafio-card",
        title: "Desafio: card que reage ao cursor (tilt 3D + glow)",
        xp: 150,
        validation: "both",
      },
    ],
  },
  {
    slug: "html-canvas",
    index: 4,
    title: "HTML Canvas",
    tagline: "Pintar e esquecer: o modo imediato e a escala.",
    badgeId: "modulo-4",
    lessons: [
      {
        slug: "m4-immediate",
        title: "Immediate mode: pintar e esquecer",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m4-gameloop",
        title: "O game loop no Canvas: clear, update, draw",
        xp: 70,
        validation: "auto",
      },
      {
        slug: "m4-particles",
        title: "Sistemas de partículas em escala",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m4-physics",
        title: "Física realista: gravidade, resistência, bounce",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m4-noise",
        title: "Perlin/simplex noise: aleatoriedade orgânica",
        xp: 90,
        validation: "auto",
      },
      {
        slug: "m4-workers",
        title: "Web Workers e OffscreenCanvas",
        xp: 90,
        validation: "auto",
      },
      {
        slug: "m4-decision",
        title: "Canvas vs SVG vs DOM: árvore de decisão",
        xp: 60,
        validation: "visual",
      },
      {
        slug: "m4-desafio-fireworks",
        title: "Desafio: fireworks procedural",
        xp: 160,
        validation: "both",
      },
    ],
  },
  {
    slug: "design-de-animacao",
    index: 5,
    title: "Design de Animação",
    tagline: "O bom gosto: quando animar e quando ficar quieto.",
    badgeId: "modulo-5",
    lessons: [
      {
        slug: "m5-principios",
        title: "Princípios: antecipação, follow-through, squash & stretch",
        xp: 60,
        validation: "visual",
      },
      {
        slug: "m5-orquestracao",
        title: "Orquestração: stagger, sequência, hierarquia",
        xp: 60,
        validation: "visual",
      },
      {
        slug: "m5-acao",
        title: "Animar pela ação do usuário, não pelo estado",
        xp: 60,
        validation: "visual",
      },
      {
        slug: "m5-bom-gosto",
        title: "O bom gosto: quando NÃO animar",
        xp: 60,
        validation: "visual",
      },
      {
        slug: "m5-desafio-redesign",
        title: "Desafio: redesenhar uma interação sem graça",
        xp: 140,
        validation: "visual",
      },
    ],
  },
  {
    slug: "desafios-finais",
    index: 6,
    title: "Desafios Finais",
    tagline: "Peças abertas de portfólio. Sem rodinhas.",
    badgeId: "modulo-6",
    lessons: [
      {
        slug: "m6-explosao",
        title: "Explosão de partículas estilo videogame",
        xp: 180,
        validation: "visual",
      },
      {
        slug: "m6-hero",
        title: "Hero de landing 'tech startup' com SVG animado",
        xp: 180,
        validation: "visual",
      },
      {
        slug: "m6-scrollytelling",
        title: "Scrollytelling de uma página inteira",
        xp: 200,
        validation: "visual",
      },
      {
        slug: "m6-projeto-final",
        title: "Projeto final: peça autoral para o portfólio",
        xp: 250,
        validation: "visual",
      },
    ],
  },
  {
    slug: "bonus-whimsy",
    index: 7,
    title: "Bônus Whimsy",
    tagline: "3D com CSS, WAAPI e som que vira movimento.",
    badgeId: "modulo-7",
    lessons: [
      {
        slug: "m7-css-3d",
        title: "3D com CSS puro: perspective e preserve-3d",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m7-waapi",
        title: "Web Animations API: element.animate() e playback",
        xp: 80,
        validation: "auto",
      },
      {
        slug: "m7-audio",
        title: "Audio-reativo com Web Audio API",
        xp: 90,
        validation: "auto",
      },
      {
        slug: "m7-desafio-player",
        title: "Desafio: mini music player com capa 3D e visualizador",
        xp: 180,
        validation: "visual",
      },
    ],
  },
];

/* Attach exercise payloads (starter/solution/checks/checklist) by slug. Keeps
   the map above focused on metadata; the code lives in content/exercises.ts. */
for (const module of CURRICULUM) {
  for (const lesson of module.lessons) {
    const ex = EXERCISES[lesson.slug];
    if (ex) Object.assign(lesson, ex);
  }
}

/* ---------------------------------------------------------------
   Lookups
   --------------------------------------------------------------- */

export function getModule(slug: string): Module | undefined {
  return CURRICULUM.find((m) => m.slug === slug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string,
): { module: Module; lesson: Lesson } | undefined {
  const module = getModule(moduleSlug);
  const lesson = module?.lessons.find((l) => l.slug === lessonSlug);
  if (!module || !lesson) return undefined;
  return { module, lesson };
}

export function getLessonBySlug(
  lessonSlug: string,
): { module: Module; lesson: Lesson } | undefined {
  for (const module of CURRICULUM) {
    const lesson = module.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return { module, lesson };
  }
  return undefined;
}

/** Flat ordered list of every lesson with its module — used for prev/next. */
export function flatLessons(): { module: Module; lesson: Lesson }[] {
  return CURRICULUM.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
}

export function adjacentLessons(lessonSlug: string): {
  prev?: { module: Module; lesson: Lesson };
  next?: { module: Module; lesson: Lesson };
} {
  const flat = flatLessons();
  const i = flat.findIndex((x) => x.lesson.slug === lessonSlug);
  if (i === -1) return {};
  return { prev: flat[i - 1], next: flat[i + 1] };
}

export const TOTAL_LESSONS = flatLessons().length;
