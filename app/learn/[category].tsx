import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Check, X, AlertCircle, Recycle } from "lucide-react-native";
import { recyclingCategories } from "@/data/recycling-data";

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams();
  const categoryData = recyclingCategories[category as string];

  if (!categoryData) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: categoryData.name }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: categoryData.color }]}>
          <View style={styles.headerIcon}>
            <Recycle size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>{categoryData.name}</Text>
          <Text style={styles.headerDescription}>{categoryData.description}</Text>
        </View>

        {/* Recyclable Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Check size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Can Be Recycled</Text>
          </View>
          {categoryData.recyclable.map((item: string, index: number) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemBullet} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Non-Recyclable Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <X size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Cannot Be Recycled</Text>
          </View>
          {categoryData.nonRecyclable.map((item: string, index: number) => (
            <View key={index} style={styles.itemCard}>
              <View style={[styles.itemBullet, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Important Tips</Text>
          </View>
          {categoryData.tips.map((tip: string, index: number) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Environmental Impact */}
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Environmental Impact</Text>
          <Text style={styles.impactText}>{categoryData.impact}</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 30,
    alignItems: "center",
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.95,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 10,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  tipText: {
    fontSize: 15,
    color: "#92400E",
    lineHeight: 22,
  },
  impactSection: {
    margin: 20,
    padding: 20,
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 10,
  },
  impactText: {
    fontSize: 15,
    color: "#047857",
    lineHeight: 24,
  },
});