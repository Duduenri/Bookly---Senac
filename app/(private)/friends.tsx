import React, { useEffect, useState, useCallback } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { getMyProfile, listProfiles, sendFriendRequest, type Profile } from '@/src/services/friends';
import { paletasCores } from '@/utils/colors';

export default function FriendsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          Alert.alert('Atenção', 'Você precisa estar logado para ver os amigos.');
          return;
        }
        // Buscar meu profile (tabela profiles) pelo userId do Auth
        const me = await getMyProfile(user.id);
        if (mounted) setMyProfileId(me?.id ?? null);
        // Listar demais perfis
        const items = await listProfiles(user.id);
        if (mounted) setProfiles(items);
      } catch (e: any) {
        console.error('Erro ao carregar perfis:', e);
        Alert.alert('Erro', e?.message ?? 'Falha ao carregar perfis');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [user?.id]);

  const handleAddFriend = useCallback(async (receiverProfileId: string) => {
    try {
      if (!myProfileId) {
        Alert.alert('Erro', 'Não foi possível identificar seu perfil.');
        return;
      }
      await sendFriendRequest(myProfileId, receiverProfileId);
      Alert.alert('Solicitação enviada', 'Aguarde a aceitação do usuário.');
    } catch (e: any) {
      console.error('Erro ao enviar solicitação:', e);
      Alert.alert('Erro', e?.message ?? 'Não foi possível enviar a solicitação.');
    }
  }, [myProfileId]);

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={styles.card}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase() ?? 'U'}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleAddFriend(item.id)}>
        <Text style={styles.addBtnText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>◀ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Amigos</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: paletasCores.principal.solido,
  },
  back: { color: '#fff', fontWeight: '600' },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  loading: { padding: 16 },
  empty: { padding: 16, color: '#718096' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: '#4A5568' },
  name: { fontWeight: '600', color: '#2D3748' },
  email: { color: '#718096', fontSize: 12 },
  addBtn: {
    backgroundColor: paletasCores.principal.solido, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
});
