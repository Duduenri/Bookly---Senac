import {
  getStore,
  getStoreListings,
  type Store,
  type StoreListing,
  type StoreType,
} from '@/src/services/storeService';
import { paletasCores } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Paragraph,
  Text,
  Title
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const storeId = params.storeId as string;
  const storeType = (params.type as StoreType) || 'bookstore';

  const [store, setStore] = useState<Store | null>(null);
  const [listings, setListings] = useState<StoreListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStoreData = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [storeData, listingsData] = await Promise.all([
        getStore(storeId, storeType),
        getStoreListings(storeId, storeType),
      ]);

      setStore(storeData);
      setListings(listingsData);
    } catch (error) {
      console.error('Erro ao carregar dados da loja:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da loja.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [storeId, storeType]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const handleCallPhone = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleOpenWebsite = useCallback((website: string) => {
    Linking.openURL(website);
  }, []);

  const handleSendEmail = useCallback((email: string) => {
    Linking.openURL(`mailto:${email}`);
  }, []);

  const handleBookPress = useCallback((bookId: string) => {
    router.push({
      pathname: '/(private)/review/[bookId]',
      params: { bookId },
    });
  }, [router]);

  const getConditionText = (condition: string) => {
    const conditions: Record<string, string> = {
      NEW: 'Novo',
      LIKE_NEW: 'Como Novo',
      GOOD: 'Bom',
      ACCEPTABLE: 'Aceitável',
      POOR: 'Ruim',
    };
    return conditions[condition] || condition;
  };

  const getTransactionTypeText = (type: string) => {
    const types: Record<string, string> = {
      SALE: 'Venda',
      EXCHANGE: 'Troca',
      RENTAL: 'Aluguel',
    };
    return types[type] || type;
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      NEW: '#4caf50',
      LIKE_NEW: '#8bc34a',
      GOOD: '#2196f3',
      ACCEPTABLE: '#ff9800',
      POOR: '#f44336',
    };
    return colors[condition] || '#9e9e9e';
  };

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return `R$ ${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={paletasCores.principal.solido} />
          <Text style={styles.loadingText}>Carregando loja...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Avatar.Icon size={80} icon="store-off" style={styles.errorIcon} />
          <Text style={styles.errorText}>Loja não encontrada</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.errorBackButton}>
            Voltar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="#fff"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          {store.logo && (
            <Avatar.Image size={50} source={{ uri: store.logo }} style={styles.headerLogo} />
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>
              {store.type === 'bookstore' ? '📚 Livraria' : '📖 Sebo'}
            </Text>
            <Title style={styles.headerTitle} numberOfLines={1}>
              {store.name}
            </Title>
          </View>
          <View style={{ width: 8 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStoreData(true)}
            colors={[paletasCores.principal.solido]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >

        {/* Informações da loja */}
        <Card style={styles.storeInfoCard} mode="elevated">
          <Card.Content>
            {store.description && (
              <View style={styles.descriptionContainer}>
                <Ionicons name="information-circle" size={20} color={paletasCores.principal.solido} />
                <Paragraph style={styles.description}>{store.description}</Paragraph>
              </View>
            )}

            {/* Contatos em grid */}
            {(store.phone || store.email || store.website) && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.sectionTitle}>💬 Entre em Contato</Text>
                <View style={styles.contactsGrid}>
                  {store.phone && (
                    <View style={styles.contactCard}>
                      <View style={[styles.contactIcon, { backgroundColor: '#e3f2fd' }]}>
                        <Ionicons name="call" size={24} color="#1976d2" />
                      </View>
                      <Text style={styles.contactLabel}>Telefone</Text>
                      <Button
                        mode="text"
                        onPress={() => handleCallPhone(store.phone!)}
                        compact
                        textColor={paletasCores.principal.solido}
                        style={styles.contactActionButton}
                      >
                        Ligar agora
                      </Button>
                    </View>
                  )}
                  {store.email && (
                    <View style={styles.contactCard}>
                      <View style={[styles.contactIcon, { backgroundColor: '#fce4ec' }]}>
                        <Ionicons name="mail" size={24} color="#c2185b" />
                      </View>
                      <Text style={styles.contactLabel}>E-mail</Text>
                      <Button
                        mode="text"
                        onPress={() => handleSendEmail(store.email!)}
                        compact
                        textColor={paletasCores.principal.solido}
                        style={styles.contactActionButton}
                      >
                        Enviar
                      </Button>
                    </View>
                  )}
                  {store.website && (
                    <View style={styles.contactCard}>
                      <View style={[styles.contactIcon, { backgroundColor: '#e8f5e9' }]}>
                        <Ionicons name="globe" size={24} color="#388e3c" />
                      </View>
                      <Text style={styles.contactLabel}>Website</Text>
                      <Button
                        mode="text"
                        onPress={() => handleOpenWebsite(store.website!)}
                        compact
                        textColor={paletasCores.principal.solido}
                        style={styles.contactActionButton}
                      >
                        Visitar
                      </Button>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Localizações */}
            {store.locations && store.locations.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.sectionTitle}>📍 Onde Estamos</Text>
                {store.locations.map((location, index) => (
                  <View key={location.id} style={styles.locationCard}>
                    <View style={styles.locationBadge}>
                      <Ionicons name="location" size={20} color="#fff" />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>
                        {location.address}
                      </Text>
                      <Text style={styles.locationCity}>
                        {location.city} - {location.state}
                      </Text>
                      {location.zipCode && (
                        <Text style={styles.locationZip}>CEP: {location.zipCode}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </>
            )}
          </Card.Content>
        </Card>

        {/* Lista de livros */}
        <View style={styles.booksHeader}>
          <View>
            <Text style={styles.booksSectionTitle}>📚 Livros Disponíveis</Text>
            <Text style={styles.booksCount}>
              {listings.length} {listings.length === 1 ? 'livro' : 'livros'} em estoque
            </Text>
          </View>
        </View>

        {listings.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Avatar.Icon size={64} icon="book-off" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Nenhum livro disponível</Text>
              <Text style={styles.emptySubtext}>
                Esta loja ainda não cadastrou livros
              </Text>
            </Card.Content>
          </Card>
        ) : (
          listings.map((listing) => (
            <Card
              key={listing.id}
              style={styles.bookCard}
              onPress={() => handleBookPress(listing.book.id)}
              mode="elevated"
            >
              <Card.Content style={styles.bookContent}>
                <View style={styles.bookHeader}>
                  <View style={styles.bookCoverContainer}>
                    {listing.book.coverImage ? (
                      <Avatar.Image
                        size={100}
                        source={{ uri: listing.book.coverImage }}
                        style={styles.bookCover}
                      />
                    ) : (
                      <View style={[styles.bookCover, styles.bookCoverPlaceholder]}>
                        <Ionicons name="book" size={40} color={paletasCores.principal.solido} />
                      </View>
                    )}
                    {/* Badge de condição */}
                    <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(listing.condition) }]}>
                      <Text style={styles.conditionBadgeText}>{getConditionText(listing.condition)}</Text>
                    </View>
                  </View>

                  <View style={styles.bookInfo}>
                    <Title style={styles.bookTitle} numberOfLines={2}>
                      {listing.book.title}
                    </Title>
                    <Paragraph style={styles.bookAuthor} numberOfLines={1}>
                      ✍️ {listing.book.author}
                    </Paragraph>

                    {listing.book.publisher && (
                      <Text style={styles.bookPublisher} numberOfLines={1}>
                        🏢 {listing.book.publisher}
                      </Text>
                    )}

                    <View style={styles.bookMeta}>
                      <Chip
                        icon={listing.transactionType === 'SALE' ? 'tag' : 'swap-horizontal'}
                        style={styles.transactionChip}
                        textStyle={styles.transactionChipText}
                        compact
                      >
                        {getTransactionTypeText(listing.transactionType)}
                      </Chip>
                    </View>

                    {/* Preço em destaque */}
                    {listing.transactionType === 'SALE' && listing.price && (
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Apenas</Text>
                        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
                      </View>
                    )}
                    {listing.transactionType === 'RENTAL' && listing.rentalPrice && (
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(listing.rentalPrice)}</Text>
                        <Text style={styles.priceLabel}>/dia</Text>
                      </View>
                    )}
                    {listing.transactionType === 'EXCHANGE' && listing.exchangeFor && (
                      <View style={styles.exchangeContainer}>
                        <Ionicons name="repeat" size={16} color="#666" />
                        <Text style={styles.exchange} numberOfLines={1}>
                          {listing.exchangeFor}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {listing.book.description && (
                  <View style={styles.bookDescriptionContainer}>
                    <Paragraph style={styles.bookDescription} numberOfLines={3}>
                      {listing.book.description}
                    </Paragraph>
                  </View>
                )}
              </Card.Content>

              <Card.Actions style={styles.bookActions}>
                <Button
                  mode="contained"
                  icon="eye"
                  onPress={() => handleBookPress(listing.book.id)}
                  style={styles.viewBookButton}
                  contentStyle={styles.buttonContent}
                >
                  Ver Detalhes
                </Button>
                <IconButton
                  icon="heart-outline"
                  iconColor={paletasCores.principal.solido}
                  size={24}
                  onPress={() => Alert.alert('Favorito', 'Funcionalidade em breve!')}
                  style={styles.favoriteButton}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: paletasCores.principal.solido,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 20,
  },
  headerLogo: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    margin: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    backgroundColor: '#ffebee',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  errorBackButton: {
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  storeInfoCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  contactActionButton: {
    marginTop: 4,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  locationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: paletasCores.principal.solido,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  locationCity: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  locationZip: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  booksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  booksSectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: paletasCores.principal.solido,
    marginBottom: 4,
  },
  booksCount: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#fff',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  bookCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bookContent: {
    padding: 16,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookCoverContainer: {
    position: 'relative',
    marginRight: 16,
  },
  bookCover: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  bookCoverPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionBadge: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  conditionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    color: '#333',
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookPublisher: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  transactionChip: {
    backgroundColor: '#e8f5e9',
  },
  transactionChipText: {
    fontSize: 11,
    color: paletasCores.principal.solido,
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: paletasCores.verde.solido,
  },
  exchangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  exchange: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  bookDescriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
  bookActions: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  viewBookButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  favoriteButton: {
    margin: 0,
  },
});

