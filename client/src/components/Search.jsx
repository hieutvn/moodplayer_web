import styles from '../assets/styles/search.module.css'

export default function Search() {
  return (
    <div className={styles.search}>

      <div className={styles.search_wrapper}>
        <input
          className={styles.search_bar}
          placeholder="Search for category"
          type="text"

        />
        <div className={styles.tag_count}>
          <span>4/4</span>
        </div>

        <div className={styles.tags}>
          <button className={styles.tag}>
            <p className={styles.tag_name}>soundtracks</p>
            <div className={styles.tag_close}>&#10006;</div>
          </button>
          <button className={styles.tag}>
            <p className={styles.tag_name}>soundtracks</p>
            <div className={styles.tag_close}>&#10006;</div>
          </button>
          <button className={styles.tag}>
            <p className={styles.tag_name}>soundtracks</p>
            <div className={styles.tag_close}>&#10006;</div>
          </button>
          <button className={styles.tag}>
            <p className={styles.tag_name}>soundtracks</p>
            <div className={styles.tag_close}>&#10006;</div>
          </button>
        </div>
      </div>
    </div>
  )
}