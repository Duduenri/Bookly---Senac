import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuração da API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000'; // URL da API (pode ser definida via env)

// Tipos da API
export interface ApiBook {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  price?: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  transactionType: 'SALE' | 'EXCHANGE' | 'RENTAL';
  location: string;
  sellerName: string;
  sellerAvatar?: string;
}

// Cliente da API
class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>({
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers ?? {}),
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 'desconhecido';
        const statusText = error.response?.statusText ?? '';
        const responseData = error.response?.data as { message?: string } | undefined;

        console.error(`API request failed: ${status} ${statusText}`.trim(), responseData ?? error);

        const message = responseData?.message ?? `HTTP error! status: ${status}`;
        throw new Error(message);
      }

      console.error('API request failed:', error);
      throw error;
    }
  }

  // Buscar todos os livros disponíveis
  async getBooks(): Promise<ApiBook[]> {
    return this.request<ApiBook[]>({ url: '/api/books' });
  }

  // Buscar livros por categoria
  async getBooksByCategory(categoryId: string): Promise<ApiBook[]> {
    return this.request<ApiBook[]>({
      url: '/api/books',
      params: { category: categoryId },
    });
  }

  // Buscar livros por busca
  async searchBooks(query: string): Promise<ApiBook[]> {
    return this.request<ApiBook[]>({
      url: '/api/books/search',
      params: { q: query },
    });
  }

  // Buscar livro por ID
  async getBookById(id: string): Promise<ApiBook> {
    return this.request<ApiBook>({ url: `/api/books/${id}` });
  }

  // Adicionar livro aos favoritos
  async addToFavorites(bookId: string, userId: string): Promise<void> {
    return this.request<void>({
      url: '/api/favorites',
      method: 'POST',
      data: { bookId, userId },
    });
  }

  // Adicionar livro à wishlist
  async addToWishlist(bookId: string, userId: string): Promise<void> {
    return this.request<void>({
      url: '/api/wishlist',
      method: 'POST',
      data: { bookId, userId },
    });
  }
}

// Instância global da API
export const apiClient = new ApiClient(API_BASE_URL);

// Hook personalizado para usar a API
export const useApi = () => {
  return {
    getBooks: apiClient.getBooks.bind(apiClient),
    getBooksByCategory: apiClient.getBooksByCategory.bind(apiClient),
    searchBooks: apiClient.searchBooks.bind(apiClient),
    getBookById: apiClient.getBookById.bind(apiClient),
    addToFavorites: apiClient.addToFavorites.bind(apiClient),
    addToWishlist: apiClient.addToWishlist.bind(apiClient),
  };
};
