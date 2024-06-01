import { create } from "zustand";

export type Item = {
  id: string;
  title: string;
  poster_path: string;
};

type FavoriteStore = {
  favorites: Item[];
  addToFavorites: (item: Item) => void;
  removeFromFavorite: (itemId: string) => void;
};

const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  addToFavorites: (item) =>
    set((state) => {
      const isDuplicate = state.favorites.some((favItem) => favItem.id === item.id);
      if (!isDuplicate) {
        return { favorites: [...state.favorites, item] };
      }
      return state;
    }),

  removeFromFavorite: (itemId: string) =>
    set((state) => ({
      favorites: state.favorites.filter((favItem) => favItem.id !== itemId),
    })),
}));
export default useFavoriteStore;
