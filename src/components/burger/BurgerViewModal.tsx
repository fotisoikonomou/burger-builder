import { Modal } from '../ui/Modal';
import { BurgerStack } from './BurgerStack';
import type { Burger, Ingredient } from '../../types';
import styles from './BurgerViewModal.module.css';

interface BurgerViewModalProps {
  burger: Burger;
  ingredientsById: Map<number, Ingredient>;
  onClose: () => void;
}

/** Read-only presentation of the finished burger, exactly as it was built. */
export function BurgerViewModal({ burger, ingredientsById, onClose }: BurgerViewModalProps) {
  return (
    <Modal title={burger.name} onClose={onClose}>
      <div className={styles.stage}>
        <BurgerStack items={burger.items} ingredientsById={ingredientsById} />
      </div>
      <ol className={styles.recipe} aria-label="Ingredients from bottom to top">
        {burger.items.map((item) => {
          const ingredient = ingredientsById.get(item.ingredientId);
          return ingredient ? (
            <li key={item.uid} className={styles.recipeItem}>
              {ingredient.name}
            </li>
          ) : null;
        })}
      </ol>
     
    </Modal>
  );
}
