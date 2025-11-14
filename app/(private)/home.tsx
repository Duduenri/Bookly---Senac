import { Book } from '@/components/Genericos/BookList';
import { HomeTemplate } from '@/components/Genericos/HomeTemplate';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApi } from '@/src/services/api';
import { getBooksFromSupabase } from '@/src/services/books';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToFavorites, addToWishlist } = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exibir alerta de erro (não condicional ao retorno)
  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
    }
  }, [error]);

  // Mock de sebos/livrarias com lat/long (substitua por dados reais depois)
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

  // Buscar livros diretamente do Supabase (sem loop de render)
  useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Buscando livros do Supabase...');
        const booksData = await getBooksFromSupabase();
        if (!isMounted) return;
        console.log(`✅ ${booksData.length} livros encontrados`);
        setBooks(booksData as Book[]);
      } catch (err) {
        console.error('❌ Erro ao buscar livros:', err);
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

  const handleBookPress = useCallback((book: Book) => {
    Alert.alert(
      'Livro Selecionado',
      `Título: ${book.title}\nAutor: ${book.author}\nPreço: R$ ${book.price?.toFixed(2) || 'Não informado'}\nLocalização: ${book.location}`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleFavoritePress = useCallback(async (book: Book) => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar favoritos.');
        return;
      }

      await addToFavorites(book.id, user.id);
      Alert.alert('Favorito', `"${book.title}" adicionado aos favoritos! ❤️`);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
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
      console.error('Erro ao adicionar à wishlist:', error);
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

  // Mostrar loading ou erro
  if (loading) {
    return (
      <HomeTemplate
        books={[]}
        stores={stores}
        onBookPress={handleBookPress}
        onFavoritePress={handleFavoritePress}
        onWishlistPress={handleWishlistPress}
        onAvatarPress={handleAvatarPress}
        onTitlePress={handleTitlePress}
        onAddBookPress={handleAddBookPress}
      />
    );
  }


  return (
    <HomeTemplate
      books={books}
      stores={stores}
      onBookPress={handleBookPress}
      onFavoritePress={handleFavoritePress}
      onWishlistPress={handleWishlistPress}
      onAvatarPress={handleAvatarPress}
      onTitlePress={handleTitlePress}
      onAddBookPress={handleAddBookPress}
    />
  );
}
