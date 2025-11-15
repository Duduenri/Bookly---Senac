import { supabase } from './supabase';

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  profileId: string;
  profile: {
    id: string;
    name: string;
    avatar?: string | null;
  } | null;
}

export async function listReviewsByBook(bookId: string): Promise<ReviewItem[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      createdAt,
      profileId
    `)
    .eq('bookId', bookId)
    .order('createdAt', { ascending: false })
    .limit(100);
  if (error) throw error;
  let rows = (data ?? []) as any[];
  if (rows.length === 0) {
    const { data: dataSnake } = await supabase
      .from('reviews')
      .select('id, rating, comment, createdAt, created_at, profileId')
      .eq('book_id', bookId)
      .order('createdAt', { ascending: false })
      .limit(100);
    rows = (dataSnake ?? []) as any[];
  }

  // Também buscar reviews ligados a listings do mesmo livro
  const { data: listings, error: listErr } = await supabase
    .from('listings')
    .select('id')
    .eq('bookId', bookId)
    .limit(200);
  if (!listErr && listings && listings.length > 0) {
    const listingIds = listings.map((l: any) => l.id);
    const { data: listReviews } = await supabase
      .from('reviews')
      .select('id, rating, comment, createdAt, profileId')
      .in('listingId', listingIds)
      .order('createdAt', { ascending: false })
      .limit(200);
    if (listReviews && listReviews.length > 0) {
      const map = new Map<string, any>();
      [...rows, ...listReviews].forEach((r: any) => map.set(r.id, r));
      rows = Array.from(map.values());
    }
  }

  // Hidratar perfis
  const profileIds = Array.from(new Set(rows.map((r) => r.profileId).filter(Boolean)));
  const profilesMap = await getProfilesByIds(profileIds);
  const withProfiles: ReviewItem[] = rows.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt ?? r.created_at,
    profileId: r.profileId,
    profile: profilesMap[r.profileId] ? { ...profilesMap[r.profileId] } : null,
  }));

  return withProfiles;
}

export async function createBookReview(params: {
  profileId: string;
  bookId: string;
  rating: number;
  comment?: string;
}): Promise<{ id: string; createdAt: string } | null> {
  const { data, error } = await supabase.from('reviews').insert({
    profileId: params.profileId,
    bookId: params.bookId,
    rating: params.rating,
    comment: params.comment ?? null,
  }).select('id, createdAt').single();
  if (error) throw error;
  return data as any;
}

export interface ProfileLite { id: string; name: string; avatar?: string | null; }
export async function getProfilesByIds(ids: string[]): Promise<Record<string, ProfileLite>> {
  if (ids.length === 0) return {};
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar')
    .in('id', ids);
  if (error) throw error;
  const map: Record<string, ProfileLite> = {};
  for (const p of data ?? []) {
    map[p.id] = p as ProfileLite;
  }
  return map;
}

export interface LatestReviewItem extends ReviewItem {
  book?: { id: string; title: string; author: string } | null;
}

export async function listLatestReviews(limit = 5): Promise<LatestReviewItem[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, createdAt, profileId, bookId')
    .order('createdAt', { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = (data ?? []) as any[];
  const profileIds = Array.from(new Set(rows.map(r => r.profileId).filter(Boolean)));
  const profilesMap = await getProfilesByIds(profileIds);

  // buscar livros
  const bookIds = Array.from(new Set(rows.map(r => r.bookId).filter(Boolean)));
  let booksMap: Record<string, { id: string; title: string; author: string }> = {};
  if (bookIds.length) {
    const { data: books } = await supabase
      .from('books')
      .select('id, title, author')
      .in('id', bookIds);
    for (const b of books ?? []) {
      booksMap[b.id] = b as any;
    }
  }

  return rows.map(r => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    profileId: r.profileId,
    profile: profilesMap[r.profileId] ? { ...profilesMap[r.profileId] } : null,
    book: booksMap[r.bookId] ?? null,
  }));
}
