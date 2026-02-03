import UserInput from './UserInput';
import Settings from './Settings';

import styles from '../assets/styles/navigation.module.css';

export default function Navigation() {
    return (
        <div className={styles.navbar_wrapper}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>What's your mood today?</div>
                <UserInput />
                <Settings />
            </nav>
        </div>
    )
}