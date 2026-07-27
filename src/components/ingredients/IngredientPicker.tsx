import { ingredientImageUrl } from '../../api/config';
import type { Ingredient } from '../../types';
import styles from './IngredientPicker.module.css';

interface IngredientPickerProps {
  ingredients: Ingredient[];
  onPick: (ingredient: Ingredient) => void;
  /** How many of each ingredient the current burger contains. */
  counts: Map<number, number>;
}

/**
 * The pantry: every ingredient the API offers. Clicking one adds it to the
 * burger being edited — repeat clicks add repeat layers.
 */
export function IngredientPicker({ ingredients, onPick, counts }: IngredientPickerProps) {
  return (
    <ul className={styles.grid} aria-label="Available ingredients">
      {ingredients.map((ingredient) => {
        const count = counts.get(ingredient.id) ?? 0;
        return (
          <li key={ingredient.id}>
            <button
              type="button"
              className={styles.card}
              onClick={() => onPick(ingredient)}
              aria-label={`Add ${ingredient.name}${count > 0 ? ` (${count} in burger)` : ''}`}
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
