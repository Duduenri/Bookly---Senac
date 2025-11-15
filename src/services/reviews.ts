import { supabase } from './supabase';

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
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
      createdAt: createdAt,
      profile:profiles ( id, name, avatar )
    `)
    .eq('bookId', bookId)
    .order('createdAt', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as any;
}

export async function createBookReview(params: {
  profileId: string;
  bookId: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const { error } = await supabase.from('reviews').insert({
    profileId: params.profileId,
    bookId: params.bookId,
    rating: params.rating,
    comment: params.comment ?? null,
  });
  if (error) throw error;
}
