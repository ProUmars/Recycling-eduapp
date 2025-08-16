import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Leaf,
  ArrowLeft,
  Lightbulb
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScanResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const recyclable = params.recyclable === "true";
  const alternatives = params.alternatives ? JSON.parse(params.alternatives as string) : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={recyclable ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            {recyclable ? (
              <CheckCircle size={64} color="#FFFFFF" />
            ) : (
              <XCircle size={64} color="#FFFFFF" />
            )}
            <Text style={styles.headerTitle}>
              {recyclable ? "Recyclable!" : "Not Recyclable"}
            </Text>
            <Text style={styles.itemName}>{params.item}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{params.category}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Disposal Instructions</Text>
          </View>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>{params.instructions}</Text>
          </View>
        </View>

        {/* Environmental Impact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactText}>{params.impact}</Text>
          </View>
        </View>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Eco-Friendly Alternatives</Text>
            </View>
            {alternatives.map((alt: string, index: number) => (
              <View key={index} style={styles.alternativeCard}>
                <View style={styles.alternativeBullet} />
                <Text style={styles.alternativeText}>{alt}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push("/(tabs)/scan")}
          >
            <Text style={styles.primaryButtonText}>Scan Another Item</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/learn")}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 15,
  },
  itemName: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 8,
    opacity: 0.95,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  instructionCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  instructionText: {
    fontSize: 15,
    color: "#92400E",
    lineHeight: 24,
  },
  impactCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  impactText: {
    fontSize: 15,
    color: "#047857",
    lineHeight: 24,
  },
  alternativeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  alternativeBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
    marginRight: 12,
    marginTop: 6,
  },
  alternativeText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  secondaryButtonText: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "600",
  },
});