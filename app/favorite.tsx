import { Text, StyleSheet, View, FlatList } from "react-native";
import useFavoriteStore from "@/hooks/useFavoriteStore";
import Card from "@/components/Card";

const Favourite = () => {
  // get all favorite movies list using global state
  const favorites = useFavoriteStore((state) => state.favorites);

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.heading, textAlign: "center" }}>Favorites</Text>

      {/* check if there any fav movie */}
      {favorites.length == 0 ? (
        <View style={{ ...styles.container, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ ...styles.heading }}>There is no favorite movie yet!</Text>
          <Text style={{ ...styles.text, opacity: 0.5 }}>Add your favorite movie first</Text>
        </View>
      ) : (
        <FlatList
          style={{ height: "100%" }}
          numColumns={3}
          data={favorites.filter((item) => item.poster_path)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Card key={item.id} title={item.title} poster_path={item.poster_path} id={item.id} />}
        />
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#242A32",
    padding: 12,
  },
  text: {
    color: "white",
  },

  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default Favourite;
