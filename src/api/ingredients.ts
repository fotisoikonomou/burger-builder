import { request } from './client';
import type { Ingredient } from '../types';

export const getIngredients = (token: string): Promise<Ingredient[]> =>
  request<Ingredient[]>('/ingredients', { token });
