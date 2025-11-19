import { Stack } from 'expo-router';
import React from 'react';

export default function PrivateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="stores" />
      <Stack.Screen name="store/[storeId]" />
    </Stack>
  );
}
