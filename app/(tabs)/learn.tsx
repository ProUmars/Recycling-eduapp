import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Package, 
  Newspaper, 
  Wine, 
  Zap, 
  Trash2, 
  Leaf,
  ChevronRight,
  Lightbulb,
  AlertTriangle
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function LearnScreen() {
  const router = useRouter();

  const categories = [
    { id: "plastic", name: "Plastics", icon: Package, color: "#3B82F6" },
    { id: "paper", name: "Paper & Cardboard", icon: Newspaper, color: "#10B981" },
    { id: "glass", name: "Glass", icon: Wine, color: "#8B5CF6" },
    { id: "metal", name: "Metals", icon: Zap, color: "#F59E0B" },
    { id: "organic", name: "Organic Waste", icon: Leaf, color: "#84CC16" },
    { id: "hazardous", name: "Hazardous", icon: AlertTriangle, color: "#EF4444" },
    { id: "electronic", name: "E-Waste", icon: Trash2, color: "#6B7280" },
  ];

  const tips = [
    {
      title: "Clean Before Recycling",
      description: "Rinse containers to remove food residue before recycling",
      icon: Lightbulb,
    },
    {
      title: "Check Local Guidelines",
      description: "Recycling rules vary by location - check your local requirements",
      icon: AlertTriangle,
    },
    {
      title: "Reduce First",
      description: "The best waste is the waste that's never created",
      icon: Leaf,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recycling Education Center</Text>
        <Text style={styles.headerSubtitle}>
          Learn how to properly recycle different materials
        </Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Material Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/learn/${category.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <category.icon size={32} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <ChevronRight size={20} color="#9CA3AF" style={styles.categoryArrow} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <tip.icon size={24} color="#10B981" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recycling Symbols Guide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Recycling Symbols</Text>
        <View style={styles.symbolsContainer}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <View key={num} style={styles.symbolCard}>
              <View style={styles.symbolNumber}>
                <Text style={styles.symbolText}>{num}</Text>
              </View>
              <Text style={styles.symbolName}>
                {num === 1 ? "PET" : 
                 num === 2 ? "HDPE" :
                 num === 3 ? "PVC" :
                 num === 4 ? "LDPE" :
                 num === 5 ? "PP" :
                 num === 6 ? "PS" : "OTHER"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  categoryArrow: {
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B98120",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  symbolsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  symbolCard: {
    width: (width - 52) / 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  symbolNumber: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
  },
  symbolName: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
});