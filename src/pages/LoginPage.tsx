import { LoginForm } from '../components/auth/LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            🍔
          </span>
          <h1 className={styles.title}>Burger Builder</h1>
          <p className={styles.tagline}>Log in to open the kitchen.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
