import { useQuery } from "@tanstack/react-query";

// fething movie details by id
const fetchMovieById = async (movieId: string | string[] | undefined) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`);
  const data = await response.json();
  return data;
};

const useGetMovieById = (movieId: string | string[] | undefined) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieById(movieId),
    enabled: !!movieId,
  });
};

export default useGetMovieById;
