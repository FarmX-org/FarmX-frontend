"use client";

import styles from "@/styles/page.module.css";
import HomeComponent from "@/components/Home";

export default function Home() {
  return (
    <div className={styles.page}>

      <main style={{ height: "100vh" }}>
        <HomeComponent />
      </main>
    </div>
  );
}
