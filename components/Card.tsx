import { View, Image, Text, TouchableOpacity } from "react-native";
const reactLogo = require("@/assets/images/react-logo.png");
import { Link } from "expo-router";

interface CardProps {
  title: string;
  poster_path?: string;
  id: string;
}

const Card: React.FC<CardProps> = ({ title, poster_path, id }) => {
  const poster_path_base_url = "https://image.tmdb.org/t/p/w500";
  return (
    <Link href={`/details/${id}`} style={{ maxWidth: "33%" }}>
      <View style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 10 }}>
        <Image source={{ uri: poster_path_base_url + poster_path }} style={{ width: 100, height: 150, borderRadius: 10 }} />
        <Text style={{ color: "white", width: 100 }} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Link>
  );
};

export default Card;
