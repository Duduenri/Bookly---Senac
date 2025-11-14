import { supabase } from './supabase';
import type { Book } from '@/components/Genericos/BookList';

// Busca livros diretamente do Supabase a partir das listagens ativas,
// incluindo dados do livro, localização e vendedor (profile)
export async function getBooksFromSupabase(): Promise<Book[]> {
  // Campos que precisamos mapear para o componente Book
  // Book = { id, title, author, description?, coverImage?, price?, condition, transactionType, location, sellerName, sellerAvatar? }

  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      condition,
      price,
      transactionType,
      status,
      book:books (
        id,
        title,
        author,
        description,
        coverImage
      ),
      location:locations (
        city,
        state
      ),
      profile:profiles (
        name,
        avatar
      )
    `)
    .eq('status', 'ACTIVE')
    .limit(100);

  if (error) {
    throw error;
  }

  // Mapeia o resultado do Supabase para o formato esperado em BookList
  const books: Book[] = (data ?? [])
    .filter((row: any) => row.book) // garantir que tenha o livro relacionado
    .map((row: any) => {
      const location = row.location
        ? `${row.location.city ?? ''}${row.location.state ? `, ${row.location.state}` : ''}`.trim()
        : '';

      return {
        id: row.book.id ?? row.id,
        title: row.book.title,
        author: row.book.author,
        description: row.book.description ?? undefined,
        coverImage: row.book.coverImage ?? undefined,
        price: row.price ?? undefined,
        condition: row.condition,
        transactionType: row.transactionType,
        location,
        sellerName: row.profile?.name ?? 'Vendedor',
        sellerAvatar: row.profile?.avatar ?? undefined,
      } as Book;
    });

  return books;
}
