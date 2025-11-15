import LivrariasMap, { Store } from '@/components/Genericos/Map/LivrariasMap';
import { PadraoBookly, paletasCores } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Book, BookList } from '../BookList';
import { Header } from '../Header';

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
  stores?: Store[];
  latestReviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    profile?: { name: string; avatar?: string | null } | null;
    book?: { title: string; author: string } | null;
  }>;
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
  stores = [],
  latestReviews = [],
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header personalizado */}
      <Header
        avatarName="Usuário"
        avatarSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        title="Bookly"
        subtitle="Descubra milhares de livros"
        avatarSize="md"
        avatarColorPalette="blue"
        showBorder={true}
        showShadow={false}
        onAvatarPress={onAvatarPress}
        onTitlePress={onTitlePress}
        rightContent={(
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={onAddBookPress} 
              disabled={!onAddBookPress}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>Livro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReviewPress} disabled={!onReviewPress}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Avaliar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFriendsPress} disabled={!onFriendsPress}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Amigos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onTitlePress} disabled={!onTitlePress}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAvatarPress} disabled={!onAvatarPress}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Perfil</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Mapa de livrarias */}
      {stores.length > 0 && (
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>Sebos e Livrarias Próximas</Text>
          <LivrariasMap stores={stores} height={220} />
        </View>
      )}

      {/* Últimas avaliações */}
      {latestReviews.length > 0 && (
        <View style={styles.latestSection}>
          <Text style={styles.latestTitle}>Últimas avaliações</Text>
          <View style={{ gap: 10 }}>
            {latestReviews.map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewBook} numberOfLines={1}>
                    {rev.book?.title ?? 'Livro'}
                  </Text>
                  <Text style={styles.reviewMeta} numberOfLines={1}>
                    {rev.profile?.name ?? 'Usuário'} • {new Date(rev.createdAt).toLocaleDateString()}
                  </Text>
                  {rev.comment ? (
                    <Text style={styles.reviewComment} numberOfLines={2}>{rev.comment}</Text>
                  ) : null}
                </View>
                <Text style={styles.reviewStars}>
                  {'★'.repeat(Math.max(1, Math.min(5, rev.rating)))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Seção de título */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Livros Disponíveis</Text>
        <Text style={styles.subtitle}>
          {books.length} livro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de livros */}
      <BookList
        books={books}
        onBookPress={onBookPress}
        onFavoritePress={onFavoritePress}
        onWishlistPress={onWishlistPress}
      />

      {/* Botão flutuante para adicionar livro */}
      {onAddBookPress && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={onAddBookPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PadraoBookly.corSecundaria,
  },
  mapSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: paletasCores.cinza.texto, // branco da paleta
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
    gap: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  latestSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: paletasCores.cinza.texto,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
    gap: 8,
  },
  latestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewBook: { fontWeight: '600', color: '#2D3748' },
  reviewMeta: { color: '#718096', fontSize: 12 },
  reviewComment: { color: '#4A5568', fontSize: 12 },
  reviewStars: { color: '#E6B800', fontWeight: '700' },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: paletasCores.cinza.texto,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: paletasCores.cinza.solido,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: paletasCores.principal.solido,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default HomeTemplate;
