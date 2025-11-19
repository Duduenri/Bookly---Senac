import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletasCores } from '@/utils/colors';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface CategoryGridProps {
  onCategoryPress?: (categoryId: string) => void;
}

const categories: Category[] = [
  { id: '1', name: 'Ficção', icon: 'book', color: '#FF6B6B' },
  { id: '2', name: 'Romance', icon: 'heart', color: '#EE5A6F' },
  { id: '3', name: 'Técnico', icon: 'code-slash', color: '#4ECDC4' },
  { id: '4', name: 'Infantil', icon: 'happy', color: '#FFE66D' },
  { id: '5', name: 'HQ', icon: 'film', color: '#A8E6CF' },
  { id: '6', name: 'Biografia', icon: 'person', color: '#95E1D3' },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.color + '15' }]}
            onPress={() => onCategoryPress?.(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '30' }]}>
              <Ionicons name={category.icon} size={28} color={category.color} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: paletasCores.principal.solido,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 100,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

