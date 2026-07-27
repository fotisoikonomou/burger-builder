import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { login, sessionMessage } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter both a username and a password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
    } catch {
      setError('Login failed — check your username and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {sessionMessage && (
        <p className={styles.notice} role="status">
          {sessionMessage}
        </p>
      )}

      <label className={styles.field}>
        <span className={styles.label}>Username</span>
        <input
          className={styles.input}
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoFocus
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Password</span>
        <input
          className={styles.input}
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className={styles.submit}>
        {isSubmitting ? <Spinner label="Logging in" /> : 'Log in'}
      </Button>
    </form>
  );
}
