/** Ingredient as returned by the API. */
export interface Ingredient {
  id: number;
  name: string;
  src: string;
}

/**
 * A single ingredient instance inside a burger.
 * The same ingredient can appear multiple times, so each instance
 * gets its own stable `uid` (used for React keys and targeted removal).
 */
export interface BurgerItem {
  uid: string;
  ingredientId: number;
}

/** A burger the user has built. */
export interface Burger {
  id: string;
  name: string;
  items: BurgerItem[];// array of BurgerItem objects representing the ingredients in the burger
  createdAt: number;
  updatedAt: number;
}

export interface LoginResponse {
  token: string;
}
