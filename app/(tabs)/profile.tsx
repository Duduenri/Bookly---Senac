import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { Profile, getProfileByEmail, updateProfile } from '@/src/services/profileService';
import { Collapsible } from '@/components/Collapsible';
import { getMyListings, type ListingItem, type ListingStatus } from '@/src/services/listingsService';
import { getMyReviews, type ReviewItem } from '@/src/services/reviewsService';
import { getMyFavorites, type FavoriteItem } from '@/src/services/favoritesService';
import { getMyWishlist, type WishlistItem } from '@/src/services/wishlistService';
import { getMyFriends, type FriendItem } from '@/src/services/friendsService';
import { Header } from '@/components/Genericos/Header';
import { PadraoBookly, paletasCores } from '@/utils/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
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
    if (!isAuthenticated) {
      router.replace('/(public)/login');
    }
  }, [isAuthenticated, router]);

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
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Header no mesmo estilo da Home */}
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
        {/* Card de edição do perfil */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações</Text>

          <View style={styles.avatarRow}>
            {form.avatar ? (
              <Image source={{ uri: form.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={{ color: '#888' }}>Sem foto</Text>
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
              placeholder="Seu nome"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 80 }]} multiline
              value={form.bio}
              onChangeText={(t) => setForm((f) => ({ ...f, bio: t }))}
              placeholder="Fale um pouco sobre você"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
              placeholder="(xx) xxxxx-xxxx"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>URL do Avatar</Text>
            <TextInput
              style={styles.input}
              value={form.avatar}
              onChangeText={(t) => setForm((f) => ({ ...f, avatar: t }))}
              placeholder="https://..."
              autoCapitalize='none'
            />
          </View>

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={onSave} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={logout}>
            <Text style={[styles.buttonText, { color: '#333' }]}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Sections with collapsible and pagination */}
        <View style={styles.sectionCard}>
          <Collapsible title={`Meus Anúncios (${listingsTotal})`}>
        {/* Filtros simples por status */}
        <View style={styles.row}>
          {(['ACTIVE','SOLD','RENTED','INACTIVE'] as ListingStatus[]).map(s => (
            <TouchableOpacity key={s} style={[styles.chip, listingsStatus === s && styles.chipActive]} onPress={() => { setListingsStatus(s === listingsStatus ? undefined : s); setListingsPage(1); }}>
              <Text style={[styles.chipText, listingsStatus === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {listings.map(it => (
          <View key={it.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{it.book?.title ?? `Anúncio ${it.id}`}</Text>
              <Text style={styles.itemSub}>{it.transactionType} • {it.status} • {new Date(it.createdAt).toLocaleDateString()}</Text>
            </View>
            {it.book?.coverImage ? (
              <Image source={{ uri: it.book.coverImage }} style={styles.thumb} />
            ) : null}
          </View>
        ))}
        <Pagination total={listingsTotal} page={listingsPage} pageSize={listingsPageSize} onPrev={() => setListingsPage(p => Math.max(1, p-1))} onNext={() => setListingsPage(p => p + 1)} />
          </Collapsible>
        </View>

        <View style={styles.sectionCard}>
          <Collapsible title={`Minhas Reviews (${reviewsTotal})`}>
        {reviews.map(rv => (
          <View key={rv.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Nota {rv.rating}/5</Text>
              <Text style={styles.itemSub}>{rv.book?.title ?? rv.bookstore?.name ?? rv.secondhandStore?.name ?? `Listing ${rv.listing?.id ?? ''}`}</Text>
              {rv.comment ? <Text style={styles.itemSub}>{rv.comment}</Text> : null}
            </View>
            <Text style={styles.itemSub}>{new Date(rv.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
        <Pagination total={reviewsTotal} page={reviewsPage} pageSize={reviewsPageSize} onPrev={() => setReviewsPage(p => Math.max(1, p-1))} onNext={() => setReviewsPage(p => p + 1)} />
          </Collapsible>
        </View>

        <View style={styles.sectionCard}>
          <Collapsible title={`Favoritos (${favoritesTotal})`}>
        {favorites.map(fv => (
          <View key={fv.id} style={styles.itemRow}>
            <Text style={styles.itemTitle}>{fv.book?.title ?? fv.bookstore?.name ?? fv.secondhandStore?.name ?? `Listing ${fv.listing?.id ?? ''}`}</Text>
            <Text style={styles.itemSub}>{new Date(fv.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
        <Pagination total={favoritesTotal} page={favoritesPage} pageSize={favoritesPageSize} onPrev={() => setFavoritesPage(p => Math.max(1, p-1))} onNext={() => setFavoritesPage(p => p + 1)} />
          </Collapsible>
        </View>

        <View style={styles.sectionCard}>
          <Collapsible title={`Wishlist (${wishlistTotal})`}>
        {wishlist.map(w => (
          <View key={w.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{w.book?.title ?? w.title ?? `Item ${w.id}`}</Text>
              <Text style={styles.itemSub}>{[w.author, w.isbn].filter(Boolean).join(' • ')}</Text>
            </View>
            <Text style={styles.itemSub}>{new Date(w.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}
        <Pagination total={wishlistTotal} page={wishlistPage} pageSize={wishlistPageSize} onPrev={() => setWishlistPage(p => Math.max(1, p-1))} onNext={() => setWishlistPage(p => p + 1)} />
          </Collapsible>
        </View>

        <View style={styles.sectionCard}>
          <Collapsible title={`Amigos (${friendsTotal})`}>
        {friends.map(fr => (
          <View key={fr.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{fr.profile.name}</Text>
            </View>
            {fr.profile.avatar ? <Image source={{ uri: fr.profile.avatar }} style={styles.thumbRound} /> : null}
          </View>
        ))}
        <Pagination total={friendsTotal} page={friendsPage} pageSize={friendsPageSize} onPrev={() => setFriendsPage(p => Math.max(1, p-1))} onNext={() => setFriendsPage(p => p + 1)} />
          </Collapsible>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PadraoBookly.corSecundaria,
  },
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: paletasCores.cinza.texto,
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
  card: {
    backgroundColor: paletasCores.cinza.texto,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: paletasCores.principal.solido,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  avatarRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    gap: 6,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: paletasCores.cinza.texto,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: paletasCores.cinza.contorno,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#0d2f2c',
    borderColor: '#0d2f2c',
  },
  chipText: {
    color: '#333',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemSub: {
    fontSize: 12,
    color: '#666',
  },
  thumb: {
    width: 48,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  thumbRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
});

// Simple pagination component
function Pagination({ total, page, pageSize, onPrev, onNext }: { total: number; page: number; pageSize: number; onPrev: () => void; onNext: () => void }) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
      <Text style={{ color: '#666' }}>Total: {total}</Text>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <TouchableOpacity onPress={onPrev} disabled={page <= 1} style={[styles.button, styles.secondaryButton, { paddingVertical: 8, opacity: page <= 1 ? 0.5 : 1 }]}>
          <Text style={[styles.buttonText, { color: '#333' }]}>Anterior</Text>
        </TouchableOpacity>
        <Text style={{ color: '#666' }}>{page} / {maxPage}</Text>
        <TouchableOpacity onPress={onNext} disabled={page >= maxPage} style={[styles.button, styles.secondaryButton, { paddingVertical: 8, opacity: page >= maxPage ? 0.5 : 1 }]}>
          <Text style={[styles.buttonText, { color: '#333' }]}>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
