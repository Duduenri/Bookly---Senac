import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'

// Importação condicional do AsyncStorage apenas para plataformas nativas
let AsyncStorage: any
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AsyncStorage = require('@react-native-async-storage/async-storage').default
}

// Verificar se localStorage está disponível (não está disponível durante SSR)
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage !== undefined
  } catch {
    return false
  }
}

// Storage personalizado que funciona em web, nativo e SSR
const customStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key)
      }
      return null // Durante SSR, retorna null
    } else {
      return await AsyncStorage.getItem(key)
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value)
      }
      // Durante SSR, não faz nada
    } else {
      await AsyncStorage.setItem(key, value)
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key)
      }
      // Durante SSR, não faz nada
    } else {
      await AsyncStorage.removeItem(key)
    }
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Log para debug
console.log('[supabase] Cliente configurado com storage customizado:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  platform: Platform.OS,
  localStorageAvailable: isLocalStorageAvailable(),
});
