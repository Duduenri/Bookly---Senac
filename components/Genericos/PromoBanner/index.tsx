import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { paletasCores } from '@/utils/colors';

interface PromoBannerProps {
  onPress?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.banner}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.badge}>✨ NOVIDADE</Text>
            <Text style={styles.title}>Descubra livros raros{'\n'}em sebos próximos</Text>
            <Text style={styles.subtitle}>Encontre edições especiais e clássicos</Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Explorar agora →</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Text style={styles.emoji}>📚</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  banner: {
    backgroundColor: paletasCores.principal.solido,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: paletasCores.principal.solido,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: paletasCores.principal.solido,
  },
  imageContainer: {
    marginLeft: 12,
  },
  emoji: {
    fontSize: 60,
  },
});

