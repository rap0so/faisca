"use client";

import { useState } from "react";
import { Celebration } from "@/components/editor/Celebration";
import type { Lesson } from "@/content/curriculum";
import styles from "./VisualComplete.module.css";

/**
 * Completion control for `visual` lessons that have no code editor (conceptual
 * lessons and the design/challenge modules): a self-assessment checklist plus a
 * "Marcar como concluída" button that awards XP. Reused across Módulos 4–6.
 */
export function VisualComplete({
  lesson,
  initialCompleted = false,
}: {
  lesson: Lesson;
  initialCompleted?: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [celebrate, setCelebrate] = useState<{ xp: number } | null>(null);

  async function complete() {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "complete", slug: lesson.slug }),
    });
    const data = await res.json();
    setCompleted(true);
    if (!data.alreadyCompleted)
      setCelebrate({ xp: data.gainedXp ?? lesson.xp });
  }

  return (
    <div className={styles.wrap}>
      {celebrate && (
        <Celebration xp={celebrate.xp} onDone={() => setCelebrate(null)} />
      )}

      {lesson.checklist && (
        <div className={styles.checklist}>
          <p className={styles.kicker}>Auto-avaliação</p>
          <ul className={styles.items}>
            {lesson.checklist.map((item, i) => (
              <li key={item}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() =>
                      setChecked((prev) => {
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

      <button
        type="button"
        className={styles.button}
        onClick={complete}
        disabled={completed}
      >
        {completed ? "Concluída ✓" : "Marcar como concluída"}
      </button>
    </div>
  );
}
