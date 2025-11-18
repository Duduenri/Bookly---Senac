import { Book } from '@/components/Genericos/BookList';
import { HomeTemplate } from '@/components/Genericos/HomeTemplate';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApi } from '@/src/services/api';
import { getBooksFromSupabase } from '@/src/services/books';
import { listLatestReviews, type LatestReviewItem } from '@/src/services/reviews';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToFavorites, addToWishlist } = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [latestReviews, setLatestReviews] = useState<LatestReviewItem[]>([]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
    }
  }, [error]);

  const stores = [
    {
      id: 's1',
      name: 'Sebo Paulista',
      latitude: -23.556580,
      longitude: -46.662113,
      address: 'Av. Paulista, São Paulo - SP',
    },
    {
      id: 's2',
      name: 'Livraria Cultura (Conjunto Nacional)',
      latitude: -23.561684,
      longitude: -46.655981,
      address: 'Av. Paulista, 2073 - Bela Vista, São Paulo - SP',
    },
    {
      id: 's3',
      name: 'Blooks Livraria',
      latitude: -22.972706,
      longitude: -43.182365,
      address: 'Botafogo, Rio de Janeiro - RJ',
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const booksData = await getBooksFromSupabase();
        if (!isMounted) return;
        setBooks(booksData as Book[]);
      } catch (err) {
        if (!isMounted) return;
        setError('Erro ao carregar os livros. Tente novamente.');
        setBooks([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBooks();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await listLatestReviews(5);
      if (active) setLatestReviews(data);
    })();
    return () => { active = false; };
  }, []);

  const handleBookPress = useCallback((book: Book) => {
    router.push({ pathname: '/(private)/review/[bookId]', params: { bookId: book.id } });
  }, [router]);

  const handleFavoritePress = useCallback(async (book: Book) => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar favoritos.');
        return;
      }

      await addToFavorites(book.id, user.id);
      Alert.alert('Favorito', `"${book.title}" adicionado aos favoritos! ❤️`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos. Tente novamente.');
    }
  }, [user?.id, addToFavorites]);

  const handleWishlistPress = useCallback(async (book: Book) => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar à lista de desejos.');
        return;
      }

      await addToWishlist(book.id, user.id);
      Alert.alert('Lista de Desejos', `"${book.title}" adicionado à lista de desejos! 📝`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar à lista de desejos. Tente novamente.');
    }
  }, [user?.id, addToWishlist]);

  const handleAvatarPress = useCallback(() => {
    router.push('/(private)/profile');
  }, [router]);

  const handleTitlePress = useCallback(() => {
    router.push('/(private)/home');
  }, [router]);

  const handleAddBookPress = useCallback(() => {
    router.push('/(private)/add-book');
  }, [router]);

  const handleFriendsPress = useCallback(() => {
    router.push('/(private)/friends');
  }, [router]);

  const handleReviewPress = useCallback(() => {
    setReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => setReviewModalOpen(false), []);

  const handleSelectBookToReview = useCallback((book: Book) => {
    setReviewModalOpen(false);
    router.push({ pathname: '/(private)/review/[bookId]', params: { bookId: book.id } });
  }, [router]);

  if (loading) {
    return (
      <>
        <HomeTemplate
          books={[]}
          stores={stores}
          onBookPress={handleBookPress}
          onFavoritePress={handleFavoritePress}
          onWishlistPress={handleWishlistPress}
          onAvatarPress={handleAvatarPress}
          onTitlePress={handleTitlePress}
          onAddBookPress={handleAddBookPress}
          onFriendsPress={handleFriendsPress}
          onReviewPress={handleReviewPress}
          avatarName={user?.name ?? undefined}
          avatarSrc={user?.avatar ?? undefined}
        />
        <Modal
          visible={reviewModalOpen}
          animationType="slide"
          transparent
          onRequestClose={closeReviewModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Escolha um livro para avaliar</Text>
                <Pressable onPress={closeReviewModal} hitSlop={10}>
                  <Text style={styles.closeBtn}>✕</Text>
                </Pressable>
              </View>
              {books.length === 0 ? (
                <Text style={styles.emptyModal}>Nenhum livro disponível.</Text>
              ) : (
                <FlatList
                  data={books}
                  keyExtractor={(b) => b.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.bookRow} onPress={() => handleSelectBookToReview(item)}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bookRowTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.bookRowSub} numberOfLines={1}>{item.author}</Text>
                      </View>
                      <Text style={styles.bookRowAction}>Avaliar →</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              )}
              <TouchableOpacity style={styles.modalFooterBtn} onPress={closeReviewModal}>
                <Text style={styles.modalFooterText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <HomeTemplate
        books={books}
        stores={stores}
        onBookPress={handleBookPress}
        onFavoritePress={handleFavoritePress}
        onWishlistPress={handleWishlistPress}
        onAvatarPress={handleAvatarPress}
        onTitlePress={handleTitlePress}
        onAddBookPress={handleAddBookPress}
        onFriendsPress={handleFriendsPress}
        onReviewPress={handleReviewPress}
        latestReviews={latestReviews}
        avatarName={user?.name ?? undefined}
        avatarSrc={user?.avatar ?? undefined}
      />
      <Modal
        visible={reviewModalOpen}
        animationType="slide"
        transparent
        onRequestClose={closeReviewModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha um livro para avaliar</Text>
              <Pressable onPress={closeReviewModal} hitSlop={10}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>
            {books.length === 0 ? (
              <Text style={styles.emptyModal}>Nenhum livro disponível.</Text>
            ) : (
              <FlatList
                data={books}
                keyExtractor={(b) => b.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.bookRow} onPress={() => handleSelectBookToReview(item)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bookRowTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.bookRowSub} numberOfLines={1}>{item.author}</Text>
                    </View>
                    <Text style={styles.bookRowAction}>Avaliar →</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            )}
            <TouchableOpacity style={styles.modalFooterBtn} onPress={closeReviewModal}>
              <Text style={styles.modalFooterText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: { fontWeight: '700', fontSize: 16, color: '#2D3748' },
  closeBtn: { fontSize: 18, color: '#4A5568' },
  emptyModal: { paddingVertical: 12, color: '#718096' },
  bookRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10,
  },
  bookRowTitle: { fontWeight: '600', color: '#2D3748' },
  bookRowSub: { fontSize: 12, color: '#718096', marginTop: 2 },
  bookRowAction: { color: '#3182CE', fontWeight: '600', marginLeft: 12 },
  separator: { height: 1, backgroundColor: '#EDF2F7' },
  modalFooterBtn: {
    marginTop: 8,
    backgroundColor: '#2B6CB0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalFooterText: { color: '#fff', fontWeight: '700' },
});
