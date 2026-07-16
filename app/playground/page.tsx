import { PlaygroundEditor } from "@/components/playground/PlaygroundEditor";
import styles from "./playground.module.css";

export const metadata = { title: "Playground — Faísca" };

export default function PlaygroundPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Playground</h1>
        <p className={styles.lede}>
          Editor livre, sem checks, sem julgamento. Rabisque uma ideia e salve
          como snippet quando algo ficar bom.
        </p>
      </header>
      <PlaygroundEditor />
    </div>
  );
}
