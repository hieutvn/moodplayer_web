import styles from '../assets/styles/settings.module.css';


export default function Settings() {

    return (

        <div className={styles.settings}>
            <div className={styles.profile}></div>
            <div className={styles.added_songs}></div>
            <div className={styles.log_out}>
                <span>Log out</span>
            </div>
        </div>
    )
}