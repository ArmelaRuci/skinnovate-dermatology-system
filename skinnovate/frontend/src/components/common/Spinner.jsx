import styles from './Spinner.module.css'

export default function Spinner({ fullscreen = false, size = 36 }) {
  const el = (
    <span
      className={styles.ring}
      style={{ width: size, height: size, borderWidth: size < 24 ? 2 : 3 }}
      aria-label="Loading"
    />
  )
  if (fullscreen)
    return (
      <div className={styles.fullscreen}>{el}</div>
    )
  return el
}
