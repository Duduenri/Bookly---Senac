import LivrariasMap, { Store } from '@/components/Genericos/Map/LivrariasMap';
import { paletasCores } from '@/utils/colors';
import { shadowStyles } from '@/utils/shadowStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Book, BookList } from '../BookList';
import { Header } from '../Header';
import { SearchBar } from '../SearchBar';
import { CategoryGrid } from '../CategoryGrid';
import { PromoBanner } from '../PromoBanner';

export interface HomeTemplateProps {
  books: Book[];
  onBookPress?: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  onWishlistPress?: (book: Book) => void;
  onAvatarPress?: () => void;
  onTitlePress?: () => void;
  onAddBookPress?: () => void;
  onFriendsPress?: () => void;
  onReviewPress?: () => void;
  onStorePress?: (storeId: string, storeType?: 'bookstore' | 'secondhand_store') => void;
  onViewAllStoresPress?: () => void;
  onCategoryPress?: (categoryId: string) => void;
  onSearchPress?: () => void;
  onPromoPress?: () => void;
  stores?: Store[];
  latestReviews?: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    profile?: { name: string; avatar?: string | null } | null;
    book?: { title: string; author: string } | null;
  }[];
  avatarName?: string;
  avatarSrc?: string;
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({
  books,
  onBookPress,
  onFavoritePress,
  onWishlistPress,
  onAvatarPress,
  onTitlePress,
  onAddBookPress,
  onFriendsPress,
  onReviewPress,
  onStorePress,
  onViewAllStoresPress,
  onCategoryPress,
  onSearchPress,
  onPromoPress,
  stores = [],
  latestReviews = [],
  avatarName,
  avatarSrc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      {/* Header personalizado */}
      <Header
        avatarName={avatarName || 'Usuário'}
        avatarSrc={avatarSrc}
        title={avatarName || 'Bookly'}
        subtitle="Descubra novos livros"
        avatarSize="md"
        avatarColorPalette="blue"
        showBorder={false}
        showShadow={false}
        onAvatarPress={onAvatarPress}
        onTitlePress={onTitlePress}
        rightContent={(
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={onFriendsPress} 
              disabled={!onFriendsPress}
              style={styles.headerIconButton}
            >
              <Ionicons name="people-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onReviewPress} 
              disabled={!onReviewPress}
              style={styles.headerIconButton}
            >
              <Ionicons name="star-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Barra de Pesquisa */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={onSearchPress}
          placeholder="Buscar livros, autores, livrarias..."
        />

        {/* Banner Promocional */}
        <PromoBanner onPress={onPromoPress} />

        {/* Grade de Categorias */}
        <CategoryGrid onCategoryPress={onCategoryPress} />

      {/* Mapa de livrarias */}
      {stores.length > 0 && (
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Sebos e Livrarias Próximas</Text>
            {onViewAllStoresPress && (
              <TouchableOpacity onPress={onViewAllStoresPress}>
                <Text style={styles.viewAllText}>Ver todas →</Text>
              </TouchableOpacity>
            )}
          </View>
          <LivrariasMap stores={stores} height={220} onStorePress={onStorePress} />
        </View>
      )}

        {/* Últimas avaliações */}
        {latestReviews.length > 0 && (
          <View style={styles.latestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.latestTitle}>✨ Últimas Avaliações</Text>
            </View>
            <View style={styles.reviewsContainer}>
              {latestReviews.slice(0, 3).map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {(rev.profile?.name || 'U')[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewUserName}>
                          {rev.profile?.name ?? 'Usuário'}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reviewStars}>
                      {'★'.repeat(Math.max(1, Math.min(5, rev.rating)))}
                    </Text>
                  </View>
                  <Text style={styles.reviewBook} numberOfLines={1}>
                    📖 {rev.book?.title ?? 'Livro'}
                  </Text>
                  {rev.comment && (
                    <Text style={styles.reviewComment} numberOfLines={2}>
                      {rev.comment}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Seção de título dos livros */}
        <View style={styles.booksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.mainTitle}>📚 Para Você</Text>
            <Text style={styles.booksCount}>
              {books.length} livro{books.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Lista de livros */}
          <BookList
            books={books}
            onBookPress={onBookPress}
            onFavoritePress={onFavoritePress}
            onWishlistPress={onWishlistPress}
          />
        </View>
      </ScrollView>

      {/* Botão flutuante para adicionar livro */}
      {onAddBookPress && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={onAddBookPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
          <Text style={styles.floatingButtonText}>Anunciar</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  booksSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  booksCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  mapSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  latestSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  latestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: paletasCores.principal.solido,
  },
  reviewsContainer: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: paletasCores.principal.solido,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  reviewBook: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  reviewStars: {
    fontSize: 18,
    color: '#FFD700',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: paletasCores.principal.solido,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: paletasCores.principal.solido,
    ...shadowStyles.large,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default HomeTemplate;
