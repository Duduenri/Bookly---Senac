import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  price?: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  transactionType: 'SALE' | 'EXCHANGE' | 'RENTAL';
  location: string;
  sellerName: string;
  sellerAvatar?: string;
}

export interface BookListProps {
  books: Book[];
  onBookPress?: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  onWishlistPress?: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onBookPress,
  onFavoritePress,
  onWishlistPress,
}) => {
  const getConditionText = (condition: string) => {
    const conditions = {
      NEW: 'Novo',
      LIKE_NEW: 'Como novo',
      GOOD: 'Bom',
      FAIR: 'Regular',
      POOR: 'Ruim'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getTransactionTypeText = (type: string) => {
    const types = {
      SALE: 'Venda',
      EXCHANGE: 'Troca',
      RENTAL: 'Aluguel'
    };
    return types[type as keyof typeof types] || type;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      NEW: '#38A169',
      LIKE_NEW: '#319795',
      GOOD: '#3182CE',
      FAIR: '#D69E2E',
      POOR: '#E53E3E'
    };
    return colors[condition as keyof typeof colors] || '#718096';
  };

  const getTransactionTypeColor = (type: string) => {
    const colors = {
      SALE: '#38A169',
      EXCHANGE: '#805AD5',
      RENTAL: '#3182CE'
    };
    return colors[type as keyof typeof colors] || '#718096';
  };

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum livro encontrado</Text>
        <Text style={styles.emptySubtitle}>Tente ajustar os filtros de busca</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {books.map((book) => (
        <TouchableOpacity
          key={book.id}
          style={styles.bookCard}
          onPress={() => onBookPress?.(book)}
          activeOpacity={0.7}
        >
          {/* Imagem do livro */}
          <View style={styles.imageContainer}>
            {book.coverImage ? (
              <Image source={{ uri: book.coverImage }} style={styles.bookImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📚</Text>
              </View>
            )}
          </View>

          {/* Informações do livro */}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.author}
            </Text>
            
            {book.description && (
              <Text style={styles.bookDescription} numberOfLines={2}>
                {book.description}
              </Text>
            )}

            {/* Preço */}
            {book.price && (
              <Text style={styles.bookPrice}>
                R$ {book.price.toFixed(2)}
              </Text>
            )}

            {/* Tags de condição e tipo */}
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: getConditionColor(book.condition) }]}>
                <Text style={styles.tagText}>{getConditionText(book.condition)}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: getTransactionTypeColor(book.transactionType) }]}>
                <Text style={styles.tagText}>{getTransactionTypeText(book.transactionType)}</Text>
              </View>
            </View>

            {/* Localização */}
            <Text style={styles.locationText} numberOfLines={1}>
              📍 {book.location}
            </Text>

            {/* Vendedor */}
            <View style={styles.sellerContainer}>
              {book.sellerAvatar ? (
                <Image source={{ uri: book.sellerAvatar }} style={styles.sellerAvatar} />
              ) : (
                <View style={styles.sellerAvatarPlaceholder}>
                  <Text style={styles.sellerAvatarText}>
                    {book.sellerName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.sellerName} numberOfLines={1}>
                {book.sellerName}
              </Text>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onFavoritePress?.(book)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.actionButtonText}>❤️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onWishlistPress?.(book)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.actionButtonText}>📝</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 16,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeholderText: {
    fontSize: 32,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 13,
    color: '#A0AEC0',
    marginBottom: 8,
    lineHeight: 18,
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38A169',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  locationText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  sellerAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sellerAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  sellerName: {
    fontSize: 12,
    color: '#718096',
  },
  actionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});

export default BookList;
