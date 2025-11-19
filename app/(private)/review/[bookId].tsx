import { useAuth } from '@/src/contexts/AuthContext';
import { createProfileForUser, getMyProfile } from '@/src/services/friends';
import { createBookReview, listReviewsByBook, type ReviewItem } from '@/src/services/reviews';
import { paletasCores } from '@/utils/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

export default function ReviewScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (!bookId) return;
        setLoading(true);
        const list = await listReviewsByBook(String(bookId));
        if (mounted) setReviews(list);
        if (user?.id) {
          const me = await getMyProfile(user.id);
          if (me) {
            if (mounted) setMyProfileId(me.id);
          } else if (user.email) {
            const created = await createProfileForUser({
              userId: user.id,
              email: user.email,
              name: user.name ?? undefined,
              avatar: user.avatar ?? null,
            });
            if (mounted) setMyProfileId(created.id);
          }
        }
      } catch (e: any) {
        Alert.alert('Erro', e?.message ?? 'Falha ao carregar avaliações');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [bookId, user?.id, user?.email, user?.name, user?.avatar]);

  const canSubmit = useMemo(() => !!bookId && rating >= 1 && rating <= 5, [bookId, rating]);

  const refreshList = useCallback(async () => {
    if (!bookId) return;
    const list = await listReviewsByBook(String(bookId));
    setReviews(list);
  }, [bookId]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!canSubmit) return;
      setSubmitting(true);
      let profileId = myProfileId;
      if (!profileId && user?.id) {
        const existing = await getMyProfile(user.id);
        if (existing) {
          profileId = existing.id;
        } else if (user.email) {
          const created = await createProfileForUser({
            userId: user.id,
            email: user.email,
            name: user.name ?? undefined,
            avatar: user.avatar ?? null,
          });
          profileId = created.id;
          setMyProfileId(profileId);
        }
      }
      if (!profileId) {
        Alert.alert('Erro', 'Faça login para enviar a avaliação.');
        return;
      }
      const created = await createBookReview({
        profileId,
        bookId: String(bookId!),
        rating,
        comment: comment.trim() || undefined,
      });
      const nowItem = created ? {
        id: created.id,
        rating,
        comment: comment.trim() || undefined,
        createdAt: created.createdAt,
        profileId,
        profile: myProfileId ? null : null,
      } : null;
      // tentar preencher profile localmente
      const localProfile = myProfileId ? reviews.find(r => r.profileId === myProfileId)?.profile : undefined;
      if (nowItem) {
        (nowItem as any).profile = localProfile ?? (user ? { id: profileId, name: user.name ?? (user.email ?? 'Você'), avatar: user.avatar ?? null } : null);
        setReviews((prev) => [nowItem as any, ...prev]);
      }
      setComment('');
      setRating(5);
      // atualizar em background
      refreshList();
      if (Platform.OS === 'android') {
        ToastAndroid.show('Avaliação enviada com sucesso!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      }
    } catch (e: any) {
      const msg = e?.message ?? 'Não foi possível enviar sua avaliação.';
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Erro: ${msg}`, ToastAndroid.LONG);
      } else {
        Alert.alert('Erro', msg);
      }
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, myProfileId, bookId, rating, comment, refreshList, reviews, user]);

  const renderItem = ({ item }: { item: ReviewItem }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={styles.reviewer}>{item.profile?.name ?? 'Usuário'}</Text>
        <Text style={styles.date}> • {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.stars}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
      {item.comment ? <Text style={styles.comment}>{item.comment}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>◀ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Avaliações do Livro</Text>
      </View>

      {/* Formulário movido para cima */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Avalie este livro</Text>
        <View style={styles.ratingRow}>
          {[1,2,3,4,5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setRating(n)}>
              <Text style={[styles.starPick, n <= rating ? styles.starOn : styles.starOff]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Escreva um comentário (opcional)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholderTextColor="#A0AEC0"
          selectionColor="#2B6CB0"
          cursorColor="#2B6CB0"
        />
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.btnDisabled]}
          disabled={submitting}
          onPress={handleSubmit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.submitText}>{submitting ? 'Enviando...' : 'Enviar Avaliação'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(r) => r.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Ainda não há avaliações.</Text>}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: paletasCores.principal.solido,
  },
  back: { color: '#fff', fontWeight: '600' },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  loading: { padding: 16 },
  empty: { padding: 16, color: '#718096' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  reviewer: { fontWeight: '600', color: '#2D3748' },
  date: { color: '#A0AEC0', marginLeft: 6 },
  stars: { color: '#E6B800', marginTop: 2, marginBottom: 6, fontSize: 16 },
  comment: { color: '#4A5568' },
  form: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#fafafa' },
  formTitle: { fontWeight: '700', color: '#2D3748', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  starPick: { fontSize: 28 },
  starOn: { color: '#E6B800' },
  starOff: { color: '#CBD5E0' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 10, minHeight: 70, textAlignVertical: 'top', color: '#2D3748', backgroundColor: '#FFFFFF' },
  submitBtn: { marginTop: 10, backgroundColor: paletasCores.principal.solido, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '700' },
});
