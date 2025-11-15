import { supabase } from './supabase';

export interface Profile {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string | null;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

// Retorna o profile do usuário logado (via userId do Supabase Auth)
export async function getMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, userId, email, name, avatar')
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

// Lista todos os perfis (exceto o próprio)
export async function listProfiles(excludeUserId?: string): Promise<Profile[]> {
  let query = supabase
    .from('profiles')
    .select('id, userId, email, name, avatar')
    .order('name', { ascending: true })
    .limit(100);

  if (excludeUserId) {
    query = query.neq('userId', excludeUserId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Profile[];
}

// Envia uma solicitação de amizade (friend_requests)
export async function sendFriendRequest(senderProfileId: string, receiverProfileId: string) {
  const { error } = await supabase.from('friend_requests').insert({
    senderId: senderProfileId,
    receiverId: receiverProfileId,
    status: 'PENDING',
  });
  if (error) throw error;
}

// Cria um profile mínimo para um usuário autenticado do Supabase
export async function createProfileForUser(params: { userId: string; email: string; name?: string; avatar?: string | null; }): Promise<Profile> {
  // 1) Se já existe profile com este email, retorna ele
  const existingByEmail = await supabase
    .from('profiles')
    .select('id, userId, email, name, avatar')
    .eq('email', params.email)
    .maybeSingle();
  if (!existingByEmail.error && existingByEmail.data) {
    return existingByEmail.data as Profile;
  }

  // 2) Caso contrário, cria novo profile vinculado ao userId do Auth
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: params.userId,
      userId: params.userId,
      email: params.email,
      name: params.name ?? params.email.split('@')[0],
      avatar: params.avatar ?? null,
      accountType: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select('id, userId, email, name, avatar')
    .single();
  if (error) throw error;
  return data as Profile;
}
