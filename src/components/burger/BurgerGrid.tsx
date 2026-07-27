import { useState } from 'react';
import { useBurgers } from '../../context/BurgersContext';
import { BurgerCard } from './BurgerCard';
import { BurgerEditor } from './BurgerEditor';
import { BurgerViewModal } from './BurgerViewModal';
import { Button } from '../ui/Button';
import type { Ingredient } from '../../types';
import styles from './BurgerGrid.module.css';

interface BurgerGridProps {
  ingredients: Ingredient[];
  ingredientsById: Map<number, Ingredient>;
}

export function BurgerGrid({ ingredients, ingredientsById }: BurgerGridProps) {
  const { burgers, dispatch } = useBurgers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const editingBurger = burgers.find((burger) => burger.id === editingId) ?? null;
  const viewingBurger = burgers.find((burger) => burger.id === viewingId) ?? null;

  const handleCreate = () => {
    dispatch({ type: 'burger/create', name: `Burger #${burgers.length + 1}` });
  };

  return (
    <section aria-label="Your burgers">
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Your burgers</h2>
          <p className={styles.subtitle}>
            {burgers.length === 0
              ? 'Nothing on the grill yet.'
              : `${burgers.length} on the grill — view, edit, duplicate or remove.`}
          </p>
        </div>
        <Button onClick={handleCreate}>+ New burger</Button>
      </header>

      {burgers.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            🍔
          </span>
          <p>Create your first burger and start stacking ingredients.</p>
          <Button onClick={handleCreate}>Create a burger</Button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {burgers.map((burger) => (
            <li key={burger.id}>
              <BurgerCard
                burger={burger}
                ingredientsById={ingredientsById}
                onEdit={() => setEditingId(burger.id)}
                onView={() => setViewingId(burger.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {editingBurger && (
        <BurgerEditor
          burger={editingBurger}
          ingredients={ingredients}
          ingredientsById={ingredientsById}
          onClose={() => setEditingId(null)}
        />
      )}

      {viewingBurger && (
        <BurgerViewModal
          burger={viewingBurger}
          ingredientsById={ingredientsById}
          onClose={() => setViewingId(null)}
        />
      )}
    </section>
  );
}
