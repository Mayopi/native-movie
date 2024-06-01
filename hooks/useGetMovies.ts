import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/app";

interface ApiResponse {
  results: Movie[];
}

const useGetMovies = (
  query?: string
): {
  movies: Movie[];
  loading: boolean;
  error: any;
  loadMore: () => void;
  refetch: () => void;
} => {
  // state management
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchMovies = async (reset = false) => {
    setLoading(true);
    try {
      let response;
      //   check if any query, then fetch by query. else fetch discover endpoint
      if (query) {
        response = await fetch(`https://api.themoviedb.org/3/search/movie?page=${reset ? 1 : page}&api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&query=${query}`);
      } else {
        response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${reset ? 1 : page}&api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`);
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: ApiResponse = await response.json();
      if (reset) {
        setMovies(data.results);
        setPage(2);
      } else {
        // set initial movies if page == 1
        if (page === 1) {
          setMovies(data.results);
        } else {
          // append more movies
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

  // loadMore movies by incrementing prevPage + 1
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  //   refetch the movies
  const refetch = useCallback(() => {
    fetchMovies(true);
  }, [query]);

  return { movies, loading, error, loadMore, refetch };
};

export default useGetMovies;
