import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/app";

interface ApiResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

const useSearchMovies = (
  query: string | undefined
): {
  movies: Movie[];
  loading: boolean;
  error: any;
  loadMore: () => void;
  refetch: () => void;
} => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchMovies = async (reset = false) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?page=${reset ? 1 : page}&api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&query=${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ApiResponse = await response.json();
      if (reset) {
        setMovies(data.results);
        setPage(2);
      } else {
        if (page === 1) {
          setMovies(data.results);
        } else if (page >= data.total_pages) {
          return;
        } else {
          setMovies((prevMovies) => [...prevMovies, ...data.results]);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    fetchMovies();
  }, [query, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const refetch = useCallback(() => {
    fetchMovies(true);
  }, [query]);

  return { movies, loading, error, loadMore, refetch };
};

export default useSearchMovies;
