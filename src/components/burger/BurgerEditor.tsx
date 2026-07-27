import { useMemo, useState } from 'react';
import { useBurgers } from '../../context/BurgersContext';
import { IngredientPicker } from '../ingredients/IngredientPicker';
import { BurgerStack } from './BurgerStack';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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
 * - live stack in the middle (click a layer to remove it),
 * - build order ticket on the right (move up / move down / delete).
 */
export function BurgerEditor({ burger, ingredients, ingredientsById, onClose }: BurgerEditorProps) {
  const { dispatch } = useBurgers();
  const [name, setName] = useState(burger.name);

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of burger.items) {
      map.set(item.ingredientId, (map.get(item.ingredientId) ?? 0) + 1);
    }
    return map;
  }, [burger.items]);

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
            onPick={(ingredient) =>
              dispatch({ type: 'item/add', burgerId: burger.id, ingredientId: ingredient.id })
            }
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

        <section className={styles.ticket} aria-label="Build order">
          <h3 className={styles.sectionTitle}>Build order</h3>
          <p className={styles.hint}>Bottom layer first — reorder or delete.</p>
          {burger.items.length === 0 ? (
            <p className={styles.ticketEmpty}>The ticket is empty.</p>
          ) : (
            <ol className={styles.ticketList}>
              {burger.items.map((item, index) => {
                const ingredient = ingredientsById.get(item.ingredientId);
                if (!ingredient) return null;
                return (
                  <li key={item.uid} className={styles.ticketRow}>
                    <span className={styles.ticketIndex}>{index + 1}</span>
                    <span className={styles.ticketName}>{ingredient.name}</span>
                    <span className={styles.ticketActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        disabled={index === 0}
                        onClick={() =>
                          dispatch({
                            type: 'item/move',
                            burgerId: burger.id,
                            itemUid: item.uid,
                            direction: 'up',
                          })
                        }
                        aria-label={`Move ${ingredient.name} down the stack`}
                        title="Move earlier (lower in the burger)"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        disabled={index === burger.items.length - 1}
                        onClick={() =>
                          dispatch({
                            type: 'item/move',
                            burgerId: burger.id,
                            itemUid: item.uid,
                            direction: 'down',
                          })
                        }
                        aria-label={`Move ${ingredient.name} up the stack`}
                        title="Move later (higher in the burger)"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.iconDanger}`}
                        onClick={() =>
                          dispatch({ type: 'item/remove', burgerId: burger.id, itemUid: item.uid })
                        }
                        aria-label={`Delete ${ingredient.name}`}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <Button onClick={onClose}>Done</Button>
      </footer>
    </Modal>
  );
}
