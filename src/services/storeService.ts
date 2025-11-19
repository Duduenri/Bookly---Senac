import { supabase } from './supabase';

export type StoreType = 'bookstore' | 'secondhand_store';

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  website?: string;
  type: StoreType;
  locations?: Array<{
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  }>;
}

export interface StoreListing {
  id: string;
  condition: string;
  price?: number;
  rentalPrice?: number;
  exchangeFor?: string;
  transactionType: string;
  status: string;
  book: {
    id: string;
    title: string;
    author: string;
    description?: string;
    coverImage?: string;
    publisher?: string;
    pages?: number;
    language?: string;
  };
  location: {
    city: string;
    state: string;
  };
}

/**
 * Busca informações de uma livraria
 */
export async function getBookstore(id: string): Promise<Store | null> {
  const { data, error } = await supabase
    .from('bookstores')
    .select(`
      *,
      locations (
        id,
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar livraria:', error);
    return null;
  }

  return {
    ...data,
    type: 'bookstore',
  };
}

/**
 * Busca informações de um sebo
 */
export async function getSecondhandStore(id: string): Promise<Store | null> {
  const { data, error } = await supabase
    .from('secondhand_stores')
    .select(`
      *,
      locations (
        id,
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar sebo:', error);
    return null;
  }

  return {
    ...data,
    type: 'secondhand_store',
  };
}

/**
 * Busca uma loja por ID e tipo
 */
export async function getStore(id: string, type: StoreType): Promise<Store | null> {
  if (type === 'bookstore') {
    return getBookstore(id);
  } else {
    return getSecondhandStore(id);
  }
}

/**
 * Busca todos os livros (listings) de uma livraria
 */
export async function getBookstoreListings(bookstoreId: string): Promise<StoreListing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      condition,
      price,
      rentalPrice,
      exchangeFor,
      transactionType,
      status,
      book:books (
        id,
        title,
        author,
        description,
        coverImage,
        publisher,
        pages,
        language
      ),
      location:locations (
        city,
        state
      )
    `)
    .eq('bookstoreId', bookstoreId)
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as StoreListing[];
}

/**
 * Busca todos os livros (listings) de um sebo
 */
export async function getSecondhandStoreListings(storeId: string): Promise<StoreListing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      condition,
      price,
      rentalPrice,
      exchangeFor,
      transactionType,
      status,
      book:books (
        id,
        title,
        author,
        description,
        coverImage,
        publisher,
        pages,
        language
      ),
      location:locations (
        city,
        state
      )
    `)
    .eq('secondhandStoreId', storeId)
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as StoreListing[];
}

/**
 * Busca listings de uma loja por ID e tipo
 */
export async function getStoreListings(id: string, type: StoreType): Promise<StoreListing[]> {
  if (type === 'bookstore') {
    return getBookstoreListings(id);
  } else {
    return getSecondhandStoreListings(id);
  }
}

/**
 * Lista todas as livrarias
 */
export async function listBookstores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('bookstores')
    .select(`
      *,
      locations (
        id,
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude
      )
    `)
    .order('name');

  if (error) {
    throw error;
  }

  return (data ?? []).map(store => ({ ...store, type: 'bookstore' as StoreType }));
}

/**
 * Lista todos os sebos
 */
export async function listSecondhandStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('secondhand_stores')
    .select(`
      *,
      locations (
        id,
        name,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude
      )
    `)
    .order('name');

  if (error) {
    throw error;
  }

  return (data ?? []).map(store => ({ ...store, type: 'secondhand_store' as StoreType }));
}

/**
 * Lista todas as lojas (livrarias e sebos)
 */
export async function listAllStores(): Promise<Store[]> {
  const [bookstores, secondhandStores] = await Promise.all([
    listBookstores(),
    listSecondhandStores(),
  ]);

  return [...bookstores, ...secondhandStores];
}

