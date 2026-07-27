import { useBurgers } from '../../context/BurgersContext';
import { BurgerStack } from './BurgerStack';
import { Button } from '../ui/Button';
import type { Burger, Ingredient } from '../../types';
import styles from './BurgerCard.module.css';

interface BurgerCardProps {
  burger: Burger;
  ingredientsById: Map<number, Ingredient>;
  onEdit: () => void;
  onView: () => void;
}

export function BurgerCard({ burger, ingredientsById, onEdit, onView }: BurgerCardProps) {
  const { dispatch } = useBurgers();

  const handleRemove = () => {
    if (window.confirm(`Remove "${burger.name}"? This can't be undone.`)) {
      dispatch({ type: 'burger/remove', burgerId: burger.id });
    }
  };

  return (
    <article className={styles.card} aria-label={burger.name}>
      <header className={styles.header}>
        <h3 className={styles.name}>{burger.name}</h3>
        <span className={styles.badge}>
          {burger.items.length} {burger.items.length === 1 ? 'layer' : 'layers'}
        </span>
      </header>

      <div
        className={styles.preview}
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onEdit();
          }
        }}
        aria-label={`Edit ${burger.name}`}
      >
        <BurgerStack items={burger.items} ingredientsById={ingredientsById} size="sm" />
      </div>

      <footer className={styles.actions}>
        <Button size="sm" onClick={onView} disabled={burger.items.length === 0}>
          View
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => dispatch({ type: 'burger/duplicate', burgerId: burger.id })}
        >
          Duplicate
        </Button>
        <Button size="sm" variant="danger" onClick={handleRemove}>
          Remove
        </Button>
      </footer>
    </article>
  );
}
