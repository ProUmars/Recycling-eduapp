import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Recycle, 
  Leaf, 
  TrendingUp, 
  Award,
  Camera,
  BookOpen,
  Lightbulb,
  Target
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useRecycling } from "@/hooks/recycling-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { stats } = useRecycling();

  const quickActions = [
    {
      icon: Camera,
      title: "Scan Item",
      color: ["#10B981", "#059669"] as const,
      action: () => router.push("/scan"),
    },
    {
      icon: BookOpen,
      title: "Learn",
      color: ["#3B82F6", "#2563EB"] as const,
      action: () => router.push("/learn"),
    },
  ];

  const statsCards = [
    {
      icon: Recycle,
      title: "Items Scanned",
      value: stats.itemsScanned.toString(),
      color: "#10B981",
    },
    {
      icon: Leaf,
      title: "CO₂ Saved",
      value: `${stats.co2Saved} kg`,
      color: "#059669",
    },
    {
      icon: TrendingUp,
      title: "Streak",
      value: `${stats.streak} days`,
      color: "#F59E0B",
    },
    {
      icon: Award,
      title: "Level",
      value: stats.level.toString(),
      color: "#8B5CF6",
    },
  ];

  const tips = [
    {
      icon: Lightbulb,
      title: "Did you know?",
      description: "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
      color: "#F59E0B",
    },
    {
      icon: Target,
      title: "Today's Goal",
      description: "Scan 3 items to maintain your streak and earn bonus points!",
      color: "#10B981",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.heroTitle}>Let&apos;s make the world greener</Text>
          <Text style={styles.heroSubtitle}>
            You&apos;ve helped save {stats.co2Saved} kg of CO₂ this month
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={action.action}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={action.color}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <action.icon size={32} color="#FFFFFF" />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips & Goals</Text>
        {tips.map((tip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tipCard}
            activeOpacity={0.9}
          >
            <View style={[styles.tipIconContainer, { backgroundColor: `${tip.color}20` }]}>
              <tip.icon size={24} color={tip.color} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  hero: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  quickActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
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
});