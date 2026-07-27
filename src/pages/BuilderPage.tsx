import { useAuth } from '../context/AuthContext';
import { useIngredients } from '../hooks/useIngredients';
import { BurgerGrid } from '../components/burger/BurgerGrid';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import styles from './BuilderPage.module.css';

export function BuilderPage() {
  const { logout } = useAuth();
  const { ingredients, ingredientsById, isLoading, error, reload } = useIngredients();

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span aria-hidden="true">🍔</span>
          <span className={styles.brandName}>Burger Builder</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => logout()}>
          Log out
        </Button>
      </header>

      <main className={styles.main}>
        {isLoading && (
          <div className={styles.state}>
            <Spinner label="Loading ingredients" />
            <p>Firing up the grill…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.state} role="alert">
            <p>{error}</p>
            <Button variant="secondary" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <BurgerGrid ingredients={ingredients} ingredientsById={ingredientsById} />
        )}
      </main>
    </div>
  );
}
