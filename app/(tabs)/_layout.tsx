import { Tabs } from "expo-router";
import { Camera, Home, ChevronUp, GraduationCap, Bell, MapPin, MessageCircle } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";

function MoreTabButton({ color, focused }: { color: string; focused: boolean }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Reminders", icon: Bell, route: "/(tabs)/reminders" as const },
    { name: "Locations", icon: MapPin, route: "/(tabs)/locations" as const },
    { name: "AI Chat", icon: MessageCircle, route: "/(tabs)/chat" as const },
  ];

  const handleMenuPress = (route: typeof menuItems[0]['route']) => {
    setShowMenu(false);
    router.push(route);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMenu(true)}
        activeOpacity={0.7}
      >
        <ChevronUp size={24} color={color} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.sideMenuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderText}>More Options</Text>
            </View>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={styles.sideMenuItem}
                  onPress={() => handleMenuPress(item.route)}
                  activeOpacity={0.7}
                >
                  <IconComponent size={20} color="#10B981" />
                  <Text style={styles.sideMenuItemText}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: Platform.OS === "ios" ? 0 : 5,
          paddingTop: 5,
          height: Platform.OS === "ios" ? 85 : 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => <GraduationCap size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, focused }) => <MoreTabButton color={color} focused={focused} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      
      {/* Hidden tabs that are accessible through the More menu */}
      <Tabs.Screen
        name="reminders"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      
      {/* Hide the (learn) folder from tabs */}
      <Tabs.Screen
        name="(learn)"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  moreButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  sideMenuContainer: {
    backgroundColor: '#FFFFFF',
    width: 250,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  sideMenuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
});