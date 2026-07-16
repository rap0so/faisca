import type { ComponentType } from "react";

/**
 * Registry of authored lesson bodies. Keys must match a lesson `slug` in the
 * curriculum. Kept explicit (not a dynamic template import) so Turbopack can
 * statically resolve every MDX module. Add a line here per authored lesson.
 */
export const LESSON_CONTENT: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  // Módulo 0 — Fundamentos de Movimento
  "m0-transitions": () => import("./m0-transitions.mdx"),
  "m0-easing": () => import("./m0-easing.mdx"),
  "m0-keyframes": () => import("./m0-keyframes.mdx"),
  "m0-compositing": () => import("./m0-compositing.mdx"),
  "m0-reduced-motion": () => import("./m0-reduced-motion.mdx"),
  "m0-desafio-botao": () => import("./m0-desafio-botao.mdx"),
  // Módulo 1 — Efeitos de Partículas
  "m1-raf": () => import("./m1-raf.mdx"),
  "m1-dom-mass": () => import("./m1-dom-mass.mdx"),
  "m1-lerp": () => import("./m1-lerp.mdx"),
  "m1-trig": () => import("./m1-trig.mdx"),
  "m1-random": () => import("./m1-random.mdx"),
  "m1-physics": () => import("./m1-physics.mdx"),
  "m1-perf": () => import("./m1-perf.mdx"),
  "m1-react": () => import("./m1-react.mdx"),
  "m1-desafio-like": () => import("./m1-desafio-like.mdx"),
  // Módulo 2 — A Magia do SVG
  "m2-viewbox": () => import("./m2-viewbox.mdx"),
  "m2-paths": () => import("./m2-paths.mdx"),
  "m2-dasharray": () => import("./m2-dasharray.mdx"),
  "m2-icons": () => import("./m2-icons.mdx"),
  "m2-gradients": () => import("./m2-gradients.mdx"),
  "m2-dataviz": () => import("./m2-dataviz.mdx"),
  "m2-spring": () => import("./m2-spring.mdx"),
  "m2-react": () => import("./m2-react.mdx"),
  "m2-desafio-icones": () => import("./m2-desafio-icones.mdx"),
  // Módulo 3 — Interações Avançadas
  "m3-rect": () => import("./m3-rect.mdx"),
  "m3-look": () => import("./m3-look.mdx"),
  "m3-scroll-css": () => import("./m3-scroll-css.mdx"),
  "m3-scrollytelling": () => import("./m3-scrollytelling.mdx"),
  "m3-gestures": () => import("./m3-gestures.mdx"),
  "m3-view-transitions": () => import("./m3-view-transitions.mdx"),
  "m3-desafio-card": () => import("./m3-desafio-card.mdx"),
  // Módulo 4 — HTML Canvas
  "m4-immediate": () => import("./m4-immediate.mdx"),
  "m4-gameloop": () => import("./m4-gameloop.mdx"),
  "m4-particles": () => import("./m4-particles.mdx"),
  "m4-physics": () => import("./m4-physics.mdx"),
  "m4-noise": () => import("./m4-noise.mdx"),
  "m4-workers": () => import("./m4-workers.mdx"),
  "m4-decision": () => import("./m4-decision.mdx"),
  "m4-desafio-fireworks": () => import("./m4-desafio-fireworks.mdx"),
  // Módulo 5 — Design de Animação
  "m5-principios": () => import("./m5-principios.mdx"),
  "m5-orquestracao": () => import("./m5-orquestracao.mdx"),
  "m5-acao": () => import("./m5-acao.mdx"),
  "m5-bom-gosto": () => import("./m5-bom-gosto.mdx"),
  "m5-desafio-redesign": () => import("./m5-desafio-redesign.mdx"),
  // Módulo 6 — Desafios Finais
  "m6-explosao": () => import("./m6-explosao.mdx"),
  "m6-hero": () => import("./m6-hero.mdx"),
  "m6-scrollytelling": () => import("./m6-scrollytelling.mdx"),
  "m6-projeto-final": () => import("./m6-projeto-final.mdx"),
  // Módulo 7 — Bônus Whimsy
  "m7-css-3d": () => import("./m7-css-3d.mdx"),
  "m7-waapi": () => import("./m7-waapi.mdx"),
  "m7-audio": () => import("./m7-audio.mdx"),
  "m7-desafio-player": () => import("./m7-desafio-player.mdx"),
};

export function hasLessonContent(slug: string): boolean {
  return slug in LESSON_CONTENT;
}
