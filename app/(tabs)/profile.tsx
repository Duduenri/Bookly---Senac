import { Collapsible } from '@/components/Collapsible';
import { Header } from '@/components/Genericos/Header';
import { useAuth } from '@/src/contexts/AuthContext';
import { getMyFavorites, type FavoriteItem } from '@/src/services/favoritesService';
import { getMyFriends, type FriendItem } from '@/src/services/friendsService';
import { getMyListings, type ListingItem, type ListingStatus } from '@/src/services/listingsService';
import { Profile, getProfileByEmail, updateProfile } from '@/src/services/profileService';
import { getMyReviews, type ReviewItem } from '@/src/services/reviewsService';
import { getMyWishlist, type WishlistItem } from '@/src/services/wishlistService';
import { PadraoBookly, paletasCores } from '@/utils/colors';
import { shadowStyles } from '@/utils/shadowStyles';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    avatar: '',
    bio: '',
  });

  // Pagination states
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingsTotal, setListingsTotal] = useState(0);
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsStatus, setListingsStatus] = useState<ListingStatus | undefined>(undefined);
  const listingsPageSize = 5;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsPageSize = 5;

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesTotal, setFavoritesTotal] = useState(0);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const favoritesPageSize = 5;

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistTotal, setWishlistTotal] = useState(0);
  const [wishlistPage, setWishlistPage] = useState(1);
  const wishlistPageSize = 5;

  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [friendsTotal, setFriendsTotal] = useState(0);
  const [friendsPage, setFriendsPage] = useState(1);
  const friendsPageSize = 5;

  // Proteção de rota: redireciona para login se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/(public)/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const data = await getProfileByEmail(user.email);
        setProfile(data);
        setForm({
          name: data?.name ?? user.name ?? '',
          phone: data?.phone ?? '',
          avatar: data?.avatar ?? user.avatar ?? '',
          bio: data?.bio ?? '',
        });
      } catch (e: any) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.email, user?.name, user?.avatar]);

  // Loaders for sections
  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const { items, total } = await getMyListings(profile.id, listingsPage, listingsPageSize, listingsStatus);
      setListings(items);
      setListingsTotal(total);
    };
    load();
  }, [profile?.id, listingsPage, listingsStatus]);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const { items, total } = await getMyReviews(profile.id, reviewsPage, reviewsPageSize);
      setReviews(items);
      setReviewsTotal(total);
    };
    load();
  }, [profile?.id, reviewsPage]);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const { items, total } = await getMyFavorites(profile.id, favoritesPage, favoritesPageSize);
      setFavorites(items);
      setFavoritesTotal(total);
    };
    load();
  }, [profile?.id, favoritesPage]);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const { items, total } = await getMyWishlist(profile.id, wishlistPage, wishlistPageSize);
      setWishlist(items);
      setWishlistTotal(total);
    };
    load();
  }, [profile?.id, wishlistPage]);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const { items, total } = await getMyFriends(profile.id, friendsPage, friendsPageSize);
      setFriends(items);
      setFriendsTotal(total);
    };
    load();
  }, [profile?.id, friendsPage]);

  const onSave = async () => {
    if (!profile?.id) {
      Alert.alert('Aviso', 'Perfil ainda não existe no banco para este usuário.');
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile(profile.id, {
        name: form.name || undefined,
        phone: form.phone || null,
        avatar: form.avatar || null,
        bio: form.bio || null,
      });
      setProfile(updated);
      setEditMode(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const onCancelEdit = () => {
    setForm({
      name: profile?.name ?? user?.name ?? '',
      phone: profile?.phone ?? '',
      avatar: profile?.avatar ?? user?.avatar ?? '',
      bio: profile?.bio ?? '',
    });
    setEditMode(false);
  };

  if (authLoading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color={PadraoBookly.corPrincipal} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Você não está logado</Text>
        <Text style={styles.subtitle}>Faça login para ver e editar seu perfil.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <Header
        avatarName={profile?.name || user?.name || 'Usuário'}
        avatarSrc={profile?.avatar ?? user?.avatar ?? undefined}
        title="Meu Perfil"
        subtitle={user?.email ?? undefined}
        avatarSize="md"
        avatarColorPalette="blue"
        showBorder={true}
        showShadow={false}
        onAvatarPress={() => {}}
        onTitlePress={() => router.push('/(private)/home')}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Card - Avatar e Info Principal */}
        <View style={styles.heroCard}>
          <View style={styles.avatarContainer}>
            {form.avatar ? (
              <Image source={{ uri: form.avatar }} style={styles.avatarLarge} />
            ) : (
              <View style={[styles.avatarLarge, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>
                  {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {editMode && (
              <TouchableOpacity style={styles.editAvatarButton}>
                <Text style={styles.editAvatarIcon}>📷</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.profileName}>{profile?.name || user?.name || 'Usuário'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          {profile?.bio && !editMode && (
            <Text style={styles.profileBio}>{profile.bio}</Text>
          )}

          {/* Estatísticas rápidas */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{listingsTotal}</Text>
              <Text style={styles.statLabel}>Anúncios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviewsTotal}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{friendsTotal}</Text>
              <Text style={styles.statLabel}>Amigos</Text>
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.actionRow}>
            {!editMode ? (
              <>
                <TouchableOpacity 
                  style={[styles.primaryButton, { flex: 1 }]} 
                  onPress={() => setEditMode(true)}
                >
                  <Text style={styles.primaryButtonText}>✏️ Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={logout}
                >
                  <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.primaryButton, { flex: 1 }]} 
                  onPress={onSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>💾 Salvar</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={onCancelEdit}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>✖️ Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Formulário de Edição */}
        {editMode && (
          <View style={styles.editCard}>
            <Text style={styles.sectionTitle}>Editar Informações</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={styles.textInput}
                value={form.name}
                onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                multiline
                numberOfLines={4}
                value={form.bio}
                onChangeText={(t) => setForm((f) => ({ ...f, bio: t }))}
                placeholder="Conte um pouco sobre você..."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.textInput}
                value={form.phone}
                onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>URL do Avatar</Text>
              <TextInput
                style={styles.textInput}
                value={form.avatar}
                onChangeText={(t) => setForm((f) => ({ ...f, avatar: t }))}
                placeholder="https://..."
                placeholderTextColor="#999"
                autoCapitalize='none'
              />
            </View>
          </View>
        )}

        {/* Seções com Collapsible */}
        <View style={styles.sectionsContainer}>
          {/* Meus Anúncios */}
          <View style={styles.sectionCard}>
            <Collapsible title={`📚 Meus Anúncios (${listingsTotal})`}>
              <View style={styles.filterRow}>
                {(['ACTIVE','SOLD','RENTED','INACTIVE'] as ListingStatus[]).map(s => (
                  <TouchableOpacity 
                    key={s} 
                    style={[styles.filterChip, listingsStatus === s && styles.filterChipActive]} 
                    onPress={() => { 
                      setListingsStatus(s === listingsStatus ? undefined : s); 
                      setListingsPage(1); 
                    }}
                  >
                    <Text style={[styles.filterChipText, listingsStatus === s && styles.filterChipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {listings.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum anúncio encontrado</Text>
              ) : (
                listings.map(it => (
                  <View key={it.id} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{it.book?.title ?? `Anúncio ${it.id}`}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {it.transactionType} • {it.status} • {new Date(it.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    {it.book?.coverImage && (
                      <Image source={{ uri: it.book.coverImage }} style={styles.listItemImage} />
                    )}
                  </View>
                ))
              )}
              <Pagination 
                total={listingsTotal} 
                page={listingsPage} 
                pageSize={listingsPageSize} 
                onPrev={() => setListingsPage(p => Math.max(1, p-1))} 
                onNext={() => setListingsPage(p => p + 1)} 
              />
            </Collapsible>
          </View>

          {/* Minhas Reviews */}
          <View style={styles.sectionCard}>
            <Collapsible title={`⭐ Minhas Reviews (${reviewsTotal})`}>
              {reviews.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma review encontrada</Text>
              ) : (
                reviews.map(rv => (
                  <View key={rv.id} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <View style={styles.ratingRow}>
                        <Text style={styles.ratingStars}>{'⭐'.repeat(rv.rating)}</Text>
                        <Text style={styles.ratingNumber}>{rv.rating}/5</Text>
                      </View>
                      <Text style={styles.listItemSubtitle}>
                        {rv.book?.title ?? rv.bookstore?.name ?? rv.secondhandStore?.name ?? `Listing ${rv.listing?.id ?? ''}`}
                      </Text>
                      {rv.comment && <Text style={styles.reviewComment}>{rv.comment}</Text>}
                    </View>
                    <Text style={styles.dateText}>{new Date(rv.createdAt).toLocaleDateString()}</Text>
                  </View>
                ))
              )}
              <Pagination 
                total={reviewsTotal} 
                page={reviewsPage} 
                pageSize={reviewsPageSize} 
                onPrev={() => setReviewsPage(p => Math.max(1, p-1))} 
                onNext={() => setReviewsPage(p => p + 1)} 
              />
            </Collapsible>
          </View>

          {/* Favoritos */}
          <View style={styles.sectionCard}>
            <Collapsible title={`❤️ Favoritos (${favoritesTotal})`}>
              {favorites.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum favorito encontrado</Text>
              ) : (
                favorites.map(fv => (
                  <View key={fv.id} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>
                        {fv.book?.title ?? fv.bookstore?.name ?? fv.secondhandStore?.name ?? `Listing ${fv.listing?.id ?? ''}`}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>{new Date(fv.createdAt).toLocaleDateString()}</Text>
                  </View>
                ))
              )}
              <Pagination 
                total={favoritesTotal} 
                page={favoritesPage} 
                pageSize={favoritesPageSize} 
                onPrev={() => setFavoritesPage(p => Math.max(1, p-1))} 
                onNext={() => setFavoritesPage(p => p + 1)} 
              />
            </Collapsible>
          </View>

          {/* Wishlist */}
          <View style={styles.sectionCard}>
            <Collapsible title={`📝 Lista de Desejos (${wishlistTotal})`}>
              {wishlist.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum item na wishlist</Text>
              ) : (
                wishlist.map(w => (
                  <View key={w.id} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{w.book?.title ?? w.title ?? `Item ${w.id}`}</Text>
                      <Text style={styles.listItemSubtitle}>{[w.author, w.isbn].filter(Boolean).join(' • ')}</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date(w.createdAt).toLocaleDateString()}</Text>
                  </View>
                ))
              )}
              <Pagination 
                total={wishlistTotal} 
                page={wishlistPage} 
                pageSize={wishlistPageSize} 
                onPrev={() => setWishlistPage(p => Math.max(1, p-1))} 
                onNext={() => setWishlistPage(p => p + 1)} 
              />
            </Collapsible>
          </View>

          {/* Amigos */}
          <View style={styles.sectionCard}>
            <Collapsible title={`👥 Amigos (${friendsTotal})`}>
              {friends.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum amigo encontrado</Text>
              ) : (
                friends.map(fr => (
                  <View key={fr.id} style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{fr.profile.name}</Text>
                    </View>
                    {fr.profile.avatar ? (
                      <Image source={{ uri: fr.profile.avatar }} style={styles.friendAvatar} />
                    ) : (
                      <View style={[styles.friendAvatar, styles.avatarPlaceholder]}>
                        <Text style={styles.friendInitial}>{fr.profile.name.charAt(0).toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
              <Pagination 
                total={friendsTotal} 
                page={friendsPage} 
                pageSize={friendsPageSize} 
                onPrev={() => setFriendsPage(p => Math.max(1, p-1))} 
                onNext={() => setFriendsPage(p => p + 1)} 
              />
            </Collapsible>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#ffffff',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: paletasCores.cinza.solido,
    marginTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Hero Card - Card principal com avatar e stats
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    ...shadowStyles.medium,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PadraoBookly.corPrincipal,
  },
  avatarInitials: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PadraoBookly.corPrincipal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    ...shadowStyles.small,
  },
  editAvatarIcon: {
    fontSize: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: PadraoBookly.corPrincipal,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: paletasCores.cinza.solido,
    textAlign: 'center',
  },
  profileBio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: PadraoBookly.corPrincipal,
  },
  statLabel: {
    fontSize: 12,
    color: paletasCores.cinza.solido,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
  },
  
  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: PadraoBookly.corPrincipal,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyles.button,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: PadraoBookly.corPrincipal,
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    backgroundColor: '#f5f5f5',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Edit Card
  editCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    ...shadowStyles.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PadraoBookly.corPrincipal,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  
  // Sections Container
  sectionsContainer: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    ...shadowStyles.medium,
  },
  
  // Filters
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  filterChip: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    ...shadowStyles.small,
  },
  filterChipActive: {
    backgroundColor: PadraoBookly.corPrincipal,
    borderColor: PadraoBookly.corPrincipal,
  },
  filterChipText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  
  // List Items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    ...shadowStyles.small,
  },
  listItemContent: {
    flex: 1,
    gap: 6,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PadraoBookly.corPrincipal,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  listItemImage: {
    width: 52,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  
  // Reviews
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    fontSize: 16,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: paletasCores.amarelo.solido,
  },
  reviewComment: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 18,
  },
  
  // Friends
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ffffff',
    ...shadowStyles.small,
  },
  friendInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  
  // Empty State
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 40,
    fontStyle: 'italic',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  
  // Date
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  
  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#ffffff',
  },
  paginationInfo: {
    fontSize: 13,
    color: '#666',
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  paginationButton: {
    backgroundColor: PadraoBookly.corPrincipal,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    ...shadowStyles.small,
  },
  paginationButtonDisabled: {
    opacity: 0.3,
    backgroundColor: '#d0d0d0',
  },
  paginationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationPageText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});

// Simple pagination component
function Pagination({ total, page, pageSize, onPrev, onNext }: { total: number; page: number; pageSize: number; onPrev: () => void; onNext: () => void }) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  return (
    <View style={styles.paginationContainer}>
      <Text style={styles.paginationInfo}>Total: {total}</Text>
      <View style={styles.paginationButtons}>
        <TouchableOpacity 
          onPress={onPrev} 
          disabled={page <= 1} 
          style={[styles.paginationButton, page <= 1 && styles.paginationButtonDisabled]}
        >
          <Text style={styles.paginationButtonText}>◀ Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.paginationPageText}>{page} / {maxPage}</Text>
        <TouchableOpacity 
          onPress={onNext} 
          disabled={page >= maxPage} 
          style={[styles.paginationButton, page >= maxPage && styles.paginationButtonDisabled]}
        >
          <Text style={styles.paginationButtonText}>Próxima ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
