import useGetMovieById from "@/hooks/useGetMovieById";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import useFavoriteStore, { Item } from "@/hooks/useFavoriteStore";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

const queryClient = new QueryClient();

function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError } = useGetMovieById(id);
  const poster_path_base_url = "https://image.tmdb.org/t/p/w500";
  const addToFavorites = useFavoriteStore((state) => state.addToFavorites);
  const removeFromFavorite = useFavoriteStore((state) => state.removeFromFavorite);
  const favorites = useFavoriteStore((state) => state.favorites);
  const [isFavorite, setisFavorite] = useState<boolean>(false);

  const handleToggleFavorite = () => {
    const item: Item = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
    };

    if (!isFavorite) {
      addToFavorites(item);
    } else {
      removeFromFavorite(item.id);
    }
  };

  useEffect(() => {
    if (data) {
      setisFavorite(favorites.some((fav) => fav.id == data.id));
    }
  }, [data, favorites]);

  if (isLoading) {
    return (
      <View style={{ ...styles.container, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    );
  }

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
                <Feather name="calendar" size={16} color="white" />
                <Text style={styles.text}>{data.release_date}</Text>
                <Text style={styles.text}>|</Text>
                <AntDesign name="clockcircleo" size={16} color="white" />
                <Text style={styles.text}>{data.runtime} Minutes</Text>
              </View>

              <View style={{ ...styles.detailContainer, marginTop: 6 }}>
                <Ionicons name="ticket" size={16} color="white" />
                <Text style={{ ...styles.text }}>{data.genres.map((genre: { id: string; name: string }) => genre.name).join(", ")}</Text>
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <AntDesign name="staro" size={24} color="orange" />
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
            {isFavorite ? <FontAwesome name="bookmark" size={24} color="black" /> : <Feather name="bookmark" size={24} color="black" />}
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
