import useGetMovieById from "@/hooks/useGetMovieById";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import useFavoriteStore, { Item } from "@/hooks/useFavoriteStore";
import { useEffect, useState } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

// prepare query client for react-query
const queryClient = new QueryClient();

function DetailsScreen() {
  // get parameter for id
  const { id } = useLocalSearchParams();
  // get movies by id with useGetMovieById hooks
  const { data, isLoading, isError } = useGetMovieById(id);
  // base url for poster in TMDB API
  const poster_path_base_url = "https://image.tmdb.org/t/p/w500";
  // add to favorite using useFavoriteStore hooks
  const addToFavorites = useFavoriteStore((state) => state.addToFavorites);
  // remove from favorite using useFavoriteStore hooks
  const removeFromFavorite = useFavoriteStore((state) => state.removeFromFavorite);
  // get all favorite movie list
  const favorites = useFavoriteStore((state) => state.favorites);
  // state for tracking is current movie already in favorite list
  const [isFavorite, setisFavorite] = useState<boolean>(false);

  // toggle for add / remove movie to / from favorite list
  const handleToggleFavorite = () => {
    const item: Item = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
    };

    // check if movie not in favorite list
    if (!isFavorite) {
      addToFavorites(item);
    } else {
      removeFromFavorite(item.id);
    }
  };

  useEffect(() => {
    // set isFavorite value by finding movie already in favorite list or not
    if (data) {
      setisFavorite(favorites.some((fav) => fav.id == data.id)); // boolean
    }
  }, [data, favorites]);

  // check is fetching on loading
  if (isLoading) {
    return (
      <View style={{ ...styles.container, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    );
  }

  // check if there any error while fetching

  if (isError) {
    return (
      <View style={{ ...styles.container, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ ...styles.heading, color: "red" }}>Oops something went wrong...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{ ...styles.heading, textAlign: "center" }}>Detail</Text>
        <Image source={{ uri: poster_path_base_url + data.poster_path }} style={{ width: "100%", height: 250, borderRadius: 12 }}></Image>
        <Text style={{ ...styles.heading, marginTop: 24, width: "50%" }}>{data.title}</Text>

        <View style={{ marginTop: 12 }}>
          <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <View style={styles.detailContainer}>
                <FontAwesome5 name="calendar" size={16} color="white" />
                <Text style={styles.text}>{data.release_date}</Text>
                <Text style={styles.text}>|</Text>
                <FontAwesome5 name="clock" size={16} color="white" />
                <Text style={styles.text}>{data.runtime} Minutes</Text>
              </View>

              <View style={{ ...styles.detailContainer, marginTop: 6 }}>
                <FontAwesome5 name="ticket-alt" size={16} color="white" />
                <Text style={{ ...styles.text }}>{data.genres.map((genre: { id: string; name: string }) => genre.name).join(", ")}</Text>
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name="star" size={24} color="orange" />
              <Text style={{ color: "orange", fontSize: 18, fontWeight: "bold" }}>{data.vote_average.toFixed(1)}</Text>
            </View>
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={styles.text}>{data.overview}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleToggleFavorite}>
          <View style={{ display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.buttonText}>{isFavorite ? "Added to Favorite" : "Add to Favorite"}</Text>
            {isFavorite ? <FontAwesome name="bookmark" size={24} color="black" /> : <FontAwesome5 name="bookmark" size={24} color="black" />}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DetailsScreen />
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242A32",
    padding: 12,
    height: "100%",
  },

  text: {
    color: "white",
  },

  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },

  detailContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    opacity: 0.7,
  },

  button: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
});

export default App;
