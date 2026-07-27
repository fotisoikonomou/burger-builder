import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { Burger, BurgerItem } from '../types';

const STORAGE_KEY = 'burger-builder.burgers';

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export type BurgersAction =
  | { type: 'burger/create'; name: string }
  | { type: 'burger/remove'; burgerId: string }
  | { type: 'burger/duplicate'; burgerId: string }
  | { type: 'burger/rename'; burgerId: string; name: string }
  | { type: 'item/add'; burgerId: string; ingredientId: number }
  | { type: 'item/remove'; burgerId: string; itemUid: string }
  | { type: 'item/move'; burgerId: string; itemUid: string; direction: 'up' | 'down' };

function updateBurger(
  state: Burger[],
  burgerId: string,
  update: (burger: Burger) => Burger,
): Burger[] {
  return state.map((burger) =>
    burger.id === burgerId ? { ...update(burger), updatedAt: Date.now() } : burger,
  );
}

export function burgersReducer(state: Burger[], action: BurgersAction): Burger[] {
  switch (action.type) {
    case 'burger/create': {
      const now = Date.now();
      const burger: Burger = {
        id: newId(),
        name: action.name.trim() || `Burger #${state.length + 1}`,
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      return [...state, burger];
    }

    case 'burger/remove':
      return state.filter((burger) => burger.id !== action.burgerId);

    case 'burger/duplicate': {
      const source = state.find((burger) => burger.id === action.burgerId);
      if (!source) return state;
      const now = Date.now();
      const copy: Burger = {
        ...source,
        id: newId(),
        name: `${source.name} (copy)`,
        // Item instances get fresh uids so the copy is fully independent.
        items: source.items.map((item) => ({ ...item, uid: newId() })),
        createdAt: now,
        updatedAt: now,
      };
      const index = state.findIndex((burger) => burger.id === action.burgerId);
      return [...state.slice(0, index + 1), copy, ...state.slice(index + 1)];
    }

    case 'burger/rename':
      return updateBurger(state, action.burgerId, (burger) => ({
        ...burger,
        name: action.name.trim() || burger.name,
      }));

    case 'item/add': {
      const item: BurgerItem = { uid: newId(), ingredientId: action.ingredientId };
      // Appending preserves the invariant: array order === order of selection.
      return updateBurger(state, action.burgerId, (burger) => ({
        ...burger,
        items: [...burger.items, item],
      }));
    }

    case 'item/remove':
      return updateBurger(state, action.burgerId, (burger) => ({
        ...burger,
        items: burger.items.filter((item) => item.uid !== action.itemUid),
      }));

    case 'item/move':
      return updateBurger(state, action.burgerId, (burger) => {
        const from = burger.items.findIndex((item) => item.uid === action.itemUid);
        const to = action.direction === 'up' ? from - 1 : from + 1;
        if (from === -1 || to < 0 || to >= burger.items.length) return burger;
        const items = [...burger.items];
        [items[from], items[to]] = [items[to], items[from]];
        return { ...burger, items };
      });

    default:
      return state;
  }
}

function readStoredBurgers(): Burger[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Burger[]) : [];
  } catch {
    return [];
  }
}

interface BurgersContextValue {
  burgers: Burger[];
  dispatch: Dispatch<BurgersAction>;
}

const BurgersContext = createContext<BurgersContextValue | null>(null);

export function BurgersProvider({ children }: { children: ReactNode }) {
  const [burgers, dispatch] = useReducer(burgersReducer, undefined, readStoredBurgers);

  // Persist so a page refresh (or the 10-minute re-login) never loses work.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(burgers));
    } catch {
      // Storage may be unavailable (private mode / quota); the app still works.
    }
  }, [burgers]);

  const value = useMemo(() => ({ burgers, dispatch }), [burgers]);
  return <BurgersContext.Provider value={value}>{children}</BurgersContext.Provider>;
}

export function useBurgers(): BurgersContextValue {
  const context = useContext(BurgersContext);
  if (!context) throw new Error('useBurgers must be used within a BurgersProvider');
  return context;
}
