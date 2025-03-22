"use client";
<<<<<<< HEAD

import styles from "./page.module.css";
import HomeComponent  from "./Home";
=======
import styles from "@/styles/page.module.css";
import HomeComponent from "@/components/Home";
>>>>>>> fix-folder-structure

export default function Home() {
  return (
    <div className={styles.page}>
<<<<<<< HEAD
     <main style={{ height: "100vh" }}>
      <HomeComponent  />
    </main>
=======
      <main style={{ height: "100vh" }}>
        <HomeComponent />
      </main>
>>>>>>> fix-folder-structure
    </div>
  );
}
