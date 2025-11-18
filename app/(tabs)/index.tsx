import { Button } from '@/components/Genericos/Button';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Button 
        size="lg"
        variant="solid"
        onPress={() => console.log('Bem Vindo pressed!')}
      >
        Bem Vindo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
