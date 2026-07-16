import { CURRICULUM } from "@/content/curriculum";

/** The 15 badges from §7. `hint` shows in the locked silhouette state. */
export interface BadgeDef {
  id: string;
  name: string;
  hint: string;
}

export const BADGES: BadgeDef[] = [
  ...CURRICULUM.map((m) => ({
    id: m.badgeId,
    name: `Módulo ${m.index}: ${m.title}`,
    hint: `Conclua todas as lições de "${m.title}"`,
  })),
  {
    id: "primeira-faisca",
    name: "Primeira Faísca",
    hint: "Conclua sua primeira lição",
  },
  {
    id: "maratonista",
    name: "Maratonista",
    hint: "Mantenha uma ofensiva de 7 dias",
  },
  {
    id: "persistente",
    name: "Persistente",
    hint: "Resolva um exercício após 5+ tentativas, sem ver a solução",
  },
  {
    id: "cientista",
    name: "Cientista",
    hint: "Salve 10 snippets no playground",
  },
  {
    id: "perfeccionista",
    name: "Perfeccionista",
    hint: "Complete um módulo inteiro sem abrir nenhuma solução",
  },
  {
    id: "physics-nerd",
    name: "Physics Nerd",
    hint: "Conclua todas as lições de física",
  },
  { id: "formado", name: "Formado", hint: "Conclua 100% do curso" },
];

export const BADGE_IDS = new Set(BADGES.map((b) => b.id));
