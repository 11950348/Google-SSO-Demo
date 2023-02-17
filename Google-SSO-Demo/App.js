import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import googleAuthKeys from "./app/config/googleAuthKeys";

export default function App() {
  const [googleAccessToken, setGoogleAccessToken] = React.useState(null);
  const [googleUser, setGoogleUser] = React.useState(null);
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useIdTokenAuthRequest({
      clientId: googleAuthKeys.clientKey,
      iosClientId: googleAuthKeys.iosClientKey,
      androidClientId: googleAuthKeys.androidClientKey,
    });

  React.useEffect(() => {
    if (googleResponse?.type === "success") {
      setGoogleAccessToken(googleResponse.authentication.accessToken);
      googleAccessToken && fetchGoogleUserInfo();
    }
  }, [googleResponse, googleAccessToken]);

  async function fetchGoogleUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });

    const googleUserInfo = await response.json();
    setGoogleUser(googleUserInfo);
  }

  //Show only if user is logged in
  const ShowGoogleUserInfo = () => {
    if (googleUser) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 35, fontWeight: "bold", marginBottom: 20 }}>
            Welcome
          </Text>
          <Image
            source={{ uri: googleUser.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {googleUser.name}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {googleUser.email}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {googleUser.gender}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {googleUser && <ShowGoogleUserInfo />}
      {googleUser === null && (
        <>
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Welcome</Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 20,
              color: "gray",
            }}
          >
            Please login
          </Text>
          <TouchableOpacity
            disabled={!googleRequest}
            onPress={() => {
              googlePromptAsync();
            }}
          >
            <Image
              source={require("./app/assets/btn.png")}
              style={{ width: 300, height: 40 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
