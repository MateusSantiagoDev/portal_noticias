import { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { db, firestore_db } from "./src/services/firebaseConfig";

function HomeScreen({ navigation }) {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const noticiasRef = firestore_db.collection(db, "noticias");
    firestore_db
      .getDocs(
        firestore_db.query(noticiasRef, firestore_db.orderBy("data", "desc"))
      )
      .then((val) => {
        setNoticias(
          val.docs.map((doc) => ({
            id: doc.id,
            titulo: doc.data().titulo,
            conteudo: doc.data().conteudo,
            imagem: doc.data().imagem,
            data: doc.data().data,
          }))
        );
      });
  }, []);

  console.log("noticias", noticias);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.4 }}>
        <ScrollView
          horizontal
          contentContainerStyle={{ width: "200%", height: 250 }}
          style={{ flex: 1 }}
        >
          {noticias.map((val, index) => {
            if (index < 2) {
              return (
                <ImageBackground
                  source={{ uri: val.imagem }}
                  style={styles.image}
                >
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      justifyContent: "flex-end",
                    }}
                    onPress={() =>
                      navigation.navigate("Noticias", {
                        titulo: "Um titulo de exemplo",
                        conteudo: "Minha notícia de teste!",
                      })
                    }
                  >
                    <Text style={{ fontSize: 27, color: "#fff" }}>
                      {val.titulo}
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              );
            }
          })}
        </ScrollView>
      </View>

      <View style={{ flex: 0.6, padding: 20 }}>
        <View
          style={{
            width: 50,
            height: 2,
            backgroundColor: "#069",
            position: "absolute",
            left: 40,
            top: 40,
          }}
        ></View>
        <Text>Mais notícias</Text>

        <ScrollView contentContainerStyle={{ padding: 20 }} style={{ flex: 1 }}>
          {noticias.map((val, index) => {
            if (index >= 2) {
              return (
                <View style={{ flexDirection: "row", marginBotton: 10 }}>
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() =>
                      navigation.navigate("Noticias", {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        imagem: val.imagem,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri: val.imagem,
                      }}
                      style={{ width: 100, height: 100 }}
                    />
                    <Text style={{ padding: 10 }}>{val.titulo}</Text>
                  </TouchableOpacity>
                </View>
              );
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
}

function NoticiaScreen({ route, navigation }) {
  return (
    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
      <ImageBackground
        source={{ uri: route.params.imagem }}
        style={styles.image}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 27, color: "#fff"}}>
            {route.params.titulo}
          </Text>
        </View>
      </ImageBackground>
      <Text>{route.params.titulo}</Text>
      <Text>{route.params.conteudo}</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Portal" component={HomeScreen} />
        <Stack.Screen name="Noticias" component={NoticiaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    width: "100%",
  },
});
