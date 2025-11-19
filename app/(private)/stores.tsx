import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Text,
  Avatar,
  Searchbar,
  IconButton,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { listAllStores, type Store } from '@/src/services/storeService';
import { paletasCores } from '@/utils/colors';
import { shadowStyles } from '@/utils/shadowStyles';

export default function StoresListScreen() {
  const router = useRouter();
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bookstore' | 'secondhand_store'>('all');

  const loadStores = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const stores = await listAllStores();
      setAllStores(stores);
      setFilteredStores(stores);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as lojas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  useEffect(() => {
    // Filtrar lojas por tipo e busca
    let filtered = allStores;

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(store => store.type === filterType);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.description?.toLowerCase().includes(query)
      );
    }

    setFilteredStores(filtered);
  }, [allStores, filterType, searchQuery]);

  const handleStorePress = useCallback((store: Store) => {
    router.push({
      pathname: '/(private)/store/[storeId]',
      params: {
        storeId: store.id,
        type: store.type,
      },
    });
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={paletasCores.principal.solido} />
          <Text style={styles.loadingText}>Carregando lojas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com gradiente visual */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            iconColor="#fff"
            size={24}
            onPress={handleBack}
            style={styles.backButton}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>📚 Descubra</Text>
            <Title style={styles.headerTitle}>Livrarias e Sebos</Title>
          </View>
        </View>
        
        {/* Stats banner */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allStores.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {allStores.filter(s => s.type === 'bookstore').length}
            </Text>
            <Text style={styles.statLabel}>Livrarias</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {allStores.filter(s => s.type === 'secondhand_store').length}
            </Text>
            <Text style={styles.statLabel}>Sebos</Text>
          </View>
        </View>
      </View>

      {/* Busca e Filtros */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por nome ou descrição..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={paletasCores.principal.solido}
          placeholderTextColor="#999"
        />

        {/* Filtros */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('all')}
          >
            <Ionicons
              name="apps"
              size={18}
              color={filterType === 'all' ? '#fff' : paletasCores.principal.solido}
            />
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'bookstore' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('bookstore')}
          >
            <Ionicons
              name="storefront"
              size={18}
              color={filterType === 'bookstore' ? '#fff' : paletasCores.principal.solido}
            />
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'bookstore' && styles.filterButtonTextActive,
              ]}
            >
              Livrarias
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'secondhand_store' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('secondhand_store')}
          >
            <Ionicons
              name="book"
              size={18}
              color={filterType === 'secondhand_store' ? '#fff' : paletasCores.principal.solido}
            />
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'secondhand_store' && styles.filterButtonTextActive,
              ]}
            >
              Sebos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contador de resultados */}
        <Text style={styles.resultsCount}>
          {filteredStores.length} loja{filteredStores.length !== 1 ? 's' : ''} encontrada{filteredStores.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de lojas */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStores(true)}
            colors={[paletasCores.principal.solido]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {filteredStores.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Avatar.Icon size={64} icon="store-off" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Nenhuma loja encontrada</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? 'Tente buscar com outros termos'
                  : 'Não há lojas cadastradas'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredStores.map((store) => (
            <TouchableOpacity
              key={store.id}
              onPress={() => handleStorePress(store)}
              activeOpacity={0.7}
            >
              <View style={styles.storeCard}>
                {/* Header do Card */}
                <View style={styles.cardHeader}>
                  <View style={styles.logoSection}>
                    {store.logo ? (
                      <Avatar.Image size={70} source={{ uri: store.logo }} style={styles.logoAvatar} />
                    ) : (
                      <View style={styles.placeholderLogo}>
                        <Ionicons
                          name={store.type === 'bookstore' ? 'storefront' : 'book'}
                          size={32}
                          color={paletasCores.principal.solido}
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.storeMainInfo}>
                    <View style={styles.typeTagContainer}>
                      <View style={styles.typeTag}>
                        <Ionicons
                          name={store.type === 'bookstore' ? 'storefront' : 'book'}
                          size={12}
                          color="#fff"
                        />
                        <Text style={styles.typeTagText}>
                          {store.type === 'bookstore' ? 'Livraria' : 'Sebo'}
                        </Text>
                      </View>
                    </View>

                    <Title style={styles.storeName} numberOfLines={2}>
                      {store.name}
                    </Title>

                    {store.description && (
                      <Paragraph style={styles.description} numberOfLines={2}>
                        {store.description}
                      </Paragraph>
                    )}
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Info Section */}
                <View style={styles.infoSection}>
                  {/* Localizações */}
                  {store.locations && store.locations.length > 0 && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Ionicons name="location" size={18} color={paletasCores.principal.solido} />
                      </View>
                      <Text style={styles.infoText} numberOfLines={1}>
                        {store.locations[0].city}, {store.locations[0].state}
                        {store.locations.length > 1 && (
                          <Text style={styles.extraLocations}>
                            {' '}+{store.locations.length - 1} local{store.locations.length - 1 > 1 ? 'ais' : ''}
                          </Text>
                        )}
                      </Text>
                    </View>
                  )}

                  {/* Contatos */}
                  <View style={styles.contactsGrid}>
                    {store.phone && (
                      <View style={styles.contactItem}>
                        <Ionicons name="call" size={16} color={paletasCores.principal.solido} />
                        <Text style={styles.contactText}>Telefone</Text>
                      </View>
                    )}
                    {store.email && (
                      <View style={styles.contactItem}>
                        <Ionicons name="mail" size={16} color={paletasCores.principal.solido} />
                        <Text style={styles.contactText}>Email</Text>
                      </View>
                    )}
                    {store.website && (
                      <View style={styles.contactItem}>
                        <Ionicons name="globe" size={16} color={paletasCores.principal.solido} />
                        <Text style={styles.contactText}>Website</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Footer com CTA */}
                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetailsText}>Ver detalhes completos</Text>
                  <Ionicons name="arrow-forward" size={18} color={paletasCores.principal.solido} />
                </View>
              </View>
            </TouchableOpacity>
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
  // Header Styles
  header: {
    backgroundColor: paletasCores.principal.solido,
    paddingBottom: 20,
    ...shadowStyles.medium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 16,
  },
  backButton: {
    margin: 0,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Stats Banner
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  // Search and Filters
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    ...shadowStyles.small,
  },
  searchbar: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f9f8',
    borderWidth: 1.5,
    borderColor: paletasCores.principal.solido,
  },
  filterButtonActive: {
    backgroundColor: paletasCores.principal.solido,
    borderColor: paletasCores.principal.solido,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  resultsCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  // Loading & Center
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // Empty State
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    backgroundColor: '#f0f9f8',
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
  // Store Cards
  storeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadowStyles.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  logoSection: {
    justifyContent: 'flex-start',
  },
  logoAvatar: {
    borderWidth: 2,
    borderColor: '#f0f9f8',
  },
  placeholderLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f9f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: paletasCores.principal.solido,
  },
  storeMainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  typeTagContainer: {
    marginBottom: 6,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: paletasCores.principal.solido,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  typeTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  infoSection: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f9f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  extraLocations: {
    color: paletasCores.principal.solido,
    fontWeight: '600',
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9f8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  contactText: {
    fontSize: 12,
    color: paletasCores.principal.solido,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f0f9f8',
    borderTopWidth: 1,
    borderTopColor: '#e8f5e9',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
});

