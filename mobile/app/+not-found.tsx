import React from "react";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// import { ThemedText } from "@/src/shared/ui/themed-text";
// import { ThemedView } from "@/src/shared/ui/themed-view";
import { SafeAreaView } from "@/src/shared/ui-kit";

export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Text style={styles.container}>
        <Text>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
