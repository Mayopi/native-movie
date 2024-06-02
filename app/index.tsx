import { Text, View, TouchableOpacity, TextInput, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Card from "@/components/Card";
import useGetMovies from "@/hooks/useGetMovies";
import { useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Link } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

//preparing query client for react query
const queryClient = new QueryClient();

//interfaces
export interface Movie {
  title: string;
  poster_path: string;
  id: string;
}

export interface Data {
  results: Movie[];
}

const Index = () => {
  const [search, setSearch] = useState<string>();
  // use debounce for delaying search feature for minimizing api calls
  const [debouncedSearch] = useDebounce(search, 1000);

  // useGeMovies hooks for getting all discoveries movies or by query if given
  let { movies, loading, error, loadMore, refetch } = useGetMovies(debouncedSearch);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // refetch movies when onRefresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.heading}>Simple Movie App</Text>
          {loading && (
            <View style={{ padding: 10, alignItems: "center" }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          {error && (
            <View style={{ padding: 10, alignItems: "center" }}>
              <Text>Error: {error.message}</Text>
            </View>
          )}
        </View>
        <Link href={"/favorite"}>
          <FontAwesome5 name="bookmark" size={30} color="white" />
        </Link>
      </View>

      <View style={{ display: "flex", flexDirection: "row", borderWidth: 1, borderColor: "white", borderRadius: 5, width: "100%", justifyContent: "space-between", marginTop: 24, padding: 6 }}>
        <TextInput placeholder="Search here..." style={{ width: "90%", color: "white" }} placeholderTextColor={"white"} onChangeText={setSearch} />
        <TouchableOpacity>
          <FontAwesome6 name="magnifying-glass" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {movies.length == 0 ? (
        <View style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.heading}>Oops Nothing Here</Text>
          <Text style={{ color: "white", textAlign: "center" }}>We couldn't find any movies matching your search. Please check your spelling or try using different terms.</Text>
        </View>
      ) : (
        <FlatList
          style={{ height: "100%" }}
          numColumns={3}
          data={movies.filter((item) => item.poster_path)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Card key={item.id} title={item.title} poster_path={item.poster_path} id={item.id} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
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

export default App;
