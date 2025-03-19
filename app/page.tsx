"use client";

import styles from "./page.module.css";
import HomeComponent  from "./Home";

export default function Home() {
  return (
    <div className={styles.page}>
     <main style={{ height: "100vh" }}>
      <HomeComponent  />
    </main>
    </div>
  );
}
