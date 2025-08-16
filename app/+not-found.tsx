import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <AlertTriangle size={64} color="#EF4444" />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>The page you&apos;re looking for doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
  },
  link: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
