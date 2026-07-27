import { ingredientImageUrl } from '../../api/config';
import type { BurgerItem, Ingredient } from '../../types';
import styles from './BurgerStack.module.css';

interface BurgerStackProps {
  items: BurgerItem[];
  ingredientsById: Map<number, Ingredient>;
  /** When provided, clicking a layer removes that exact item. */
  onRemoveItem?: (itemUid: string) => void;
  size?: 'md' | 'sm';
}

/**
 * The live burger. Items are stacked in the order they were added:
 * the first pick is the bottom layer, each new pick lands on top —
 * exactly like assembling a real burger on the counter.
 */
export function BurgerStack({ items, ingredientsById, onRemoveItem, size = 'md' }: BurgerStackProps) {
  if (items.length === 0) {
    return (
      <div className={`${styles.empty} ${size === 'sm' ? styles.emptySm : ''}`}>
        <span aria-hidden="true">🍽️</span>
        <p>No ingredients yet — pick something from the pantry to start stacking.</p>
      </div>
    );
  }

  // Newest item renders first (top of the stack), oldest last (bottom).
  const layers = [...items].reverse();
  const interactive = Boolean(onRemoveItem);

  return (
    <div
      className={`${styles.tray} ${size === 'sm' ? styles.traySm : ''}`}
      role={interactive ? 'list' : undefined}
      aria-label={`Burger with ${items.length} ingredient${items.length === 1 ? '' : 's'}`}
    >
      {layers.map((item, index) => {
        const ingredient = ingredientsById.get(item.ingredientId);
        if (!ingredient) return null;

        const image = (
          <img
            className={styles.image}
            src={ingredientImageUrl(ingredient.src)}
            alt={interactive ? '' : ingredient.name}
          />
        );

        return interactive ? (
          <button
            key={item.uid}
            type="button"
            role="listitem"
            className={styles.layer}
            style={{ zIndex: layers.length - index }}
            onClick={() => onRemoveItem?.(item.uid)}
            aria-label={`Remove ${ingredient.name} (layer ${items.length - index} from the bottom)`}
            title={`Remove ${ingredient.name}`}
          >
            {image}
          </button>
        ) : (
          <div key={item.uid} className={styles.layerStatic} style={{ zIndex: layers.length - index }}>
            {image}
          </div>
        );
      })}
    </div>
  );
}
