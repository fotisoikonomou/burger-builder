import { useCallback, useEffect, useMemo, useState } from 'react';
import { getIngredients } from '../api/ingredients';
import { isUnauthorized } from '../api/client';
import { useAuth, SESSION_EXPIRED_MESSAGE } from '../context/AuthContext';
import type { Ingredient } from '../types';

interface UseIngredientsResult {
  ingredients: Ingredient[];
  /** Fast lookup for rendering burger items by ingredientId. */
  ingredientsById: Map<number, Ingredient>;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function useIngredients(): UseIngredientsResult {
  const { token, logout } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getIngredients(token)
      .then((data) => {
        if (!cancelled) setIngredients(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          logout(SESSION_EXPIRED_MESSAGE);
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load ingredients.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, logout, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const ingredientsById = useMemo(
    () => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [ingredients],
  );

  return { ingredients, ingredientsById, isLoading, error, reload };
}
