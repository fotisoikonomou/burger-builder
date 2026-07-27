/** Realistic cap: no single ingredient can be stacked more than this many times. */
const MAX_COUNT_PER_INGREDIENT = 4;

/** Whether adding another instance of `ingredientId` would exceed the per-ingredient cap. */
export function canAddIngredient(ingredientId: number, counts: Map<number, number>): boolean {
  return (counts.get(ingredientId) ?? 0) < MAX_COUNT_PER_INGREDIENT;
}
