import axios from 'axios';
import { supabase } from './supabase';

// Serviço para gerenciar livros usando Supabase
export interface BookFormData {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publishedAt?: string;
  pages?: number;
  language?: string;
  coverImage?: string;
  categoryId?: string;
}

export interface BookListingData {
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'ACCEPTABLE' | 'POOR';
  price?: number;
  rentalPrice?: number;
  exchangeFor?: string;
  transactionType: 'SALE' | 'EXCHANGE' | 'RENTAL';
  locationId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

class BookService {
  // Criar um novo livro
  async createBook(bookData: BookFormData): Promise<{ id: string }> {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([{
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          isbn: bookData.isbn,
          publisher: bookData.publisher,
          publishedAt: bookData.publishedAt ? new Date(bookData.publishedAt) : null,
          pages: bookData.pages,
          language: bookData.language,
          coverImage: bookData.coverImage,
          categoryId: bookData.categoryId,
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Erro ao criar livro:', error);
        throw new Error(`Erro ao criar livro: ${error.message}`);
      }

      return { id: data.id };
    } catch (error) {
      console.error('Erro no createBook:', error);
      throw error;
    }
  }

  // Criar um anúncio para o livro
  async createListing(bookId: string, listingData: BookListingData): Promise<{ id: string }> {
    try {
      // Primeiro, precisamos obter o profileId do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('userId', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Perfil do usuário não encontrado');
      }

      const { data, error } = await supabase
        .from('listings')
        .insert([{
          bookId: bookId,
          condition: listingData.condition,
          price: listingData.price,
          rentalPrice: listingData.rentalPrice,
          exchangeFor: listingData.exchangeFor,
          transactionType: listingData.transactionType,
          locationId: listingData.locationId,
          profileId: profile.id,
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Erro ao criar anúncio:', error);
        throw new Error(`Erro ao criar anúncio: ${error.message}`);
      }

      return { id: data.id };
    } catch (error) {
      console.error('Erro no createListing:', error);
      throw error;
    }
  }

  // Buscar categorias disponíveis
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw new Error(`Erro ao buscar categorias: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro no getCategories:', error);
      throw error;
    }
  }

  // Buscar localizações do usuário
  async getUserLocations(): Promise<Location[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o profile do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('userId', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Perfil do usuário não encontrado');
      }

      // Buscar localizações do usuário (assumindo que há uma relação entre profile e locations)
      // Como não há relação direta no schema, vamos buscar todas as localizações por enquanto
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar localizações:', error);
        throw new Error(`Erro ao buscar localizações: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro no getUserLocations:', error);
      throw error;
    }
  }

  // Criar uma nova localização
  async createLocation(locationData: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
  }): Promise<{ id: string }> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          name: locationData.name,
          address: locationData.address,
          city: locationData.city,
          state: locationData.state,
          zipCode: locationData.zipCode,
          country: locationData.country || 'Brasil',
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Erro ao criar localização:', error);
        throw new Error(`Erro ao criar localização: ${error.message}`);
      }

      return { id: data.id };
    } catch (error) {
      console.error('Erro no createLocation:', error);
      throw error;
    }
  }

  // Upload de imagem para Supabase Storage
  async uploadImage(imageUri: string, fileName: string): Promise<{ url: string }> {
    try {
      // Converter URI para blob usando axios
      const { data: blob } = await axios.get<Blob>(imageUri, { responseType: 'blob' });

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(`${Date.now()}-${fileName}`, blob, {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw new Error(`Erro ao fazer upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(data.path);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erro no uploadImage:', error);
      throw error;
    }
  }
}

export const bookService = new BookService();
