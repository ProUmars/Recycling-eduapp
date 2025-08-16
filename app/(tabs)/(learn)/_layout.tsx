import { Stack } from "expo-router";

export default function LearnLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Learn",
          headerStyle: {
            backgroundColor: "#10B981",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
      <Stack.Screen 
        name="[category]" 
        options={{ 
          headerStyle: {
            backgroundColor: "#10B981",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} 
      />
    </Stack>
  );
}