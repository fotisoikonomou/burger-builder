import { ingredientImageUrl } from '../../api/config';
import type { Ingredient } from '../../types';
import styles from './IngredientPicker.module.css';

interface IngredientPickerProps {
  ingredients: Ingredient[];
  onPick: (ingredient: Ingredient) => void;
  /** How many of each ingredient the current burger contains. */
  counts: Map<number, number>;
  /** Ingredients that already hit their realistic per-burger limit. */
  disabledIds?: Set<number>;
}

/**
 * The pantry: every ingredient the API offers. Clicking one adds it to the
 * burger being edited — repeat clicks add repeat layers.
 */
export function IngredientPicker({ ingredients, onPick, counts, disabledIds }: IngredientPickerProps) {
  return (
    <ul className={styles.grid} aria-label="Available ingredients">
      {ingredients.map((ingredient) => {
        const count = counts.get(ingredient.id) ?? 0;
        const disabled = disabledIds?.has(ingredient.id) ?? false;
        return (
          <li key={ingredient.id}>
            <button
              type="button"
              className={styles.card}
              disabled={disabled}
              onClick={() => onPick(ingredient)}
              aria-label={`Add ${ingredient.name}${count > 0 ? ` (${count} in burger)` : ''}${disabled ? ' — limit reached' : ''}`}
              title={disabled ? 'Limit reached for this ingredient' : undefined}
            >
              {count > 0 && (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              )}
              <img
                className={styles.image}
                src={ingredientImageUrl(ingredient.src)}
                alt=""
                loading="lazy"
              />
              <span className={styles.name}>{ingredient.name}</span>
              <span className={styles.plus} aria-hidden="true">
                +
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
