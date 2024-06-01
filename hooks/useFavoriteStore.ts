import { create } from "zustand";

// interfaces / types
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
  // addToFavorite function
  addToFavorites: (item) =>
    set((state) => {
      // check is there any duplicate movies before appending it on favorites movie list
      const isDuplicate = state.favorites.some((favItem) => favItem.id === item.id);
      if (!isDuplicate) {
        return { favorites: [...state.favorites, item] };
      }
      return state;
    }),

  // remove from favorite function
  removeFromFavorite: (itemId: string) =>
    set((state) => ({
      favorites: state.favorites.filter((favItem) => favItem.id !== itemId),
    })),
}));
export default useFavoriteStore;
