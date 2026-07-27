import styles from './Spinner.module.css';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <span className={styles.wrapper} role="status">
      <span className={styles.ring} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
