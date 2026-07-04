import UserInput from "./UserInput";
import Settings from "./Settings";

import styles from "../assets/styles/navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_wrapper}>
        <div className={styles.logo}>moodply.</div>
        <Settings />
      </div>
    </nav>
  );
}
