import { useState } from 'react';
import { useBurgers } from '../../context/BurgersContext';
import { IngredientPicker } from '../ingredients/IngredientPicker';
import { BurgerStack } from './BurgerStack';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { canAddIngredient } from '../../utils/ingredientRules';
import type { Burger, Ingredient } from '../../types';
import styles from './BurgerEditor.module.css';

interface BurgerEditorProps {
  burger: Burger;
  ingredients: Ingredient[];
  ingredientsById: Map<number, Ingredient>;
  onClose: () => void;
}

/**
 * Edit mode for a single burger:
 * - pantry on the left (click to add, in order),
 * - live stack on the right (click a layer to remove it).
 */
export function BurgerEditor({ burger, ingredients, ingredientsById, onClose }: BurgerEditorProps) {
  const { dispatch } = useBurgers();
  const [name, setName] = useState(burger.name);

  const counts = new Map<number, number>();
  for (const item of burger.items) {
    counts.set(item.ingredientId, (counts.get(item.ingredientId) ?? 0) + 1);
  }

  const maxedOutIds = new Set(
    ingredients.filter((i) => !canAddIngredient(i.id, counts)).map((i) => i.id),
  );

  const commitName = () => {
    if (name.trim() && name.trim() !== burger.name) {
      dispatch({ type: 'burger/rename', burgerId: burger.id, name });
    } else {
      setName(burger.name);
    }
  };

  return (
    <Modal title="Edit burger" onClose={onClose} size="lg">
      <div className={styles.nameRow}>
        <label className={styles.nameLabel} htmlFor="burger-name">
          Name
        </label>
        <input
          id="burger-name"
          className={styles.nameInput}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={commitName}
          onKeyDown={(event) => {
            if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
          }}
        />
      </div>

      <div className={styles.layout}>
        <section className={styles.pantry} aria-label="Pantry">
          <h3 className={styles.sectionTitle}>Pantry</h3>
          <p className={styles.hint}>Click to add — every click adds one more layer.</p>
          <IngredientPicker
            ingredients={ingredients}
            counts={counts}
            disabledIds={maxedOutIds}
            onPick={(ingredient) => {
              if (maxedOutIds.has(ingredient.id)) return;
              dispatch({ type: 'item/add', burgerId: burger.id, ingredientId: ingredient.id });
            }}
          />
        </section>

        <section className={styles.preview} aria-label="Burger preview">
          <h3 className={styles.sectionTitle}>Your burger</h3>
          <p className={styles.hint}>Click a layer to remove it.</p>
          <BurgerStack
            items={burger.items}
            ingredientsById={ingredientsById}
            onRemoveItem={(itemUid) =>
              dispatch({ type: 'item/remove', burgerId: burger.id, itemUid })
            }
          />
        </section>
      </div>

      <footer className={styles.footer}>
        <Button onClick={onClose}>Done</Button>
      </footer>
    </Modal>
  );
}
