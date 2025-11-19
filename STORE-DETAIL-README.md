# 🏪 Página de Detalhes de Livraria/Sebo - Bookly

Página criada com React Native Paper para exibir detalhes de uma livraria ou sebo e listar todos os livros que a loja possui.

## 🎯 Características

### Funcionalidades Implementadas

- ✅ **Informações da loja** - Nome, logo, descrição, contatos
- ✅ **Múltiplas localizações** - Endereços completos da loja
- ✅ **Contatos clicáveis** - Telefone, email e website
- ✅ **Lista de livros** - Todos os livros (listings) da loja
- ✅ **Detalhes dos livros** - Título, autor, condição, preço, tipo de transação
- ✅ **Pull-to-refresh** - Recarregar dados
- ✅ **Material Design** - UI moderna com React Native Paper
- ✅ **Loading states** - Feedback visual
- ✅ **Empty states** - Quando não há livros
- ✅ **Navegação** - Voltar e navegar para detalhes do livro

### Componentes React Native Paper Utilizados

- `Card`, `Surface`, `Title`, `Paragraph`
- `Avatar`, `Chip`, `Button`, `IconButton`
- `ActivityIndicator`, `Divider`

## 📁 Arquivos Criados

### 1. Serviço de Lojas
**Arquivo:** `src/services/storeService.ts`

**Tipos:**
```typescript
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
  locations?: Location[];
}

export interface StoreListing {
  id: string;
  condition: string;
  price?: number;
  rentalPrice?: number;
  exchangeFor?: string;
  transactionType: string;
  book: Book;
  location: Location;
}
```

**Funções:**
- `getStore(id, type)` - Busca loja por ID e tipo
- `getBookstore(id)` - Busca livraria
- `getSecondhandStore(id)` - Busca sebo
- `getStoreListings(id, type)` - Busca livros da loja
- `listAllStores()` - Lista todas as lojas

### 2. Página de Detalhes
**Arquivo:** `app/(private)/store/[storeId].tsx`

Rota dinâmica que recebe:
- `storeId` - ID da loja
- `type` - Tipo da loja ('bookstore' ou 'secondhand_store')

## 🗂️ Estrutura do Banco de Dados

### Tabela `bookstores`
```sql
id, name, description, logo, phone, email, website
```

### Tabela `secondhand_stores`
```sql
id, name, description, logo, phone, email, website
```

### Tabela `listings`
```sql
id, bookId, bookstoreId, secondhandStoreId, locationId,
condition, price, rentalPrice, exchangeFor, transactionType, status
```

### Relacionamentos
- **Bookstore** → **Listings** (1:N)
- **SecondhandStore** → **Listings** (1:N)
- **Listing** → **Book** (N:1)
- **Listing** → **Location** (N:1)

## 🔗 Navegação

### Para acessar a página da loja

#### De uma livraria
```typescript
router.push({
  pathname: '/(private)/store/[storeId]',
  params: { 
    storeId: 'clxxx...', // ID da livraria
    type: 'bookstore'
  },
});
```

#### De um sebo
```typescript
router.push({
  pathname: '/(private)/store/[storeId]',
  params: { 
    storeId: 'clyyy...', // ID do sebo
    type: 'secondhand_store'
  },
});
```

### Exemplo de uso no mapa

No componente LivrariasMap, ao clicar em um marcador:

```typescript
const handleMarkerPress = (store: Store) => {
  router.push({
    pathname: '/(private)/store/[storeId]',
    params: { 
      storeId: store.id,
      type: store.type
    },
  });
};
```

## 🎨 Layout da Página

### 1. Header
- Botão voltar
- Título (Livraria ou Sebo)

### 2. Informações da Loja
**Card principal com:**
- Logo ou ícone
- Nome da loja
- Chip indicando tipo (Livraria/Sebo)
- Descrição (se houver)
- Botões de contato (telefone, email, website)
- Lista de endereços

### 3. Lista de Livros
**Para cada livro:**
- Capa ou ícone
- Título e autor
- Chips de condição (Novo, Usado, etc.)
- Chip de tipo de transação (Venda, Troca, Aluguel)
- Preço (se venda)
- Preço de aluguel/dia (se aluguel)
- Descrição de troca (se troca)
- Descrição do livro
- Botões: Ver detalhes, Adicionar aos favoritos

## 🎨 Cores e Estilos

### Paleta de Cores
- Primary: `#6200ee` (Material Purple)
- Success: `#4caf50` (Verde)
- Info: `#2196f3` (Azul)
- Warning: `#ff9800` (Laranja)
- Error: `#f44336` (Vermelho)
- Background: `#f5f5f5`

### Condições dos Livros
- **NEW**: Verde escuro (#4caf50)
- **LIKE_NEW**: Verde claro (#8bc34a)
- **GOOD**: Azul (#2196f3)
- **ACCEPTABLE**: Laranja (#ff9800)
- **POOR**: Vermelho (#f44336)

## 📱 Funcionalidades Interativas

### Contatos
- **Telefone**: Abre o discador
- **Email**: Abre o app de email
- **Website**: Abre no navegador

### Ações nos Livros
- **Ver detalhes**: Navega para página de review
- **Favoritar**: Alert (funcionalidade futura)
- **Card completo**: Navega para detalhes

### Atualização
- **Pull-to-refresh**: Recarrega dados da loja e livros

## 🔍 Queries do Supabase

### Buscar Livraria com Localizações
```typescript
const { data } = await supabase
  .from('bookstores')
  .select(`
    *,
    locations (
      id, name, address, city, state, 
      zipCode, latitude, longitude
    )
  `)
  .eq('id', bookstoreId)
  .single();
```

### Buscar Livros da Livraria
```typescript
const { data } = await supabase
  .from('listings')
  .select(`
    id, condition, price, rentalPrice, 
    exchangeFor, transactionType, status,
    book:books (
      id, title, author, description, 
      coverImage, publisher, pages, language
    ),
    location:locations (
      city, state
    )
  `)
  .eq('bookstoreId', bookstoreId)
  .eq('status', 'ACTIVE')
  .order('createdAt', { ascending: false });
```

## 🚀 Como Testar

### 1. Criar Dados de Teste

No Supabase SQL Editor:

```sql
-- Criar uma livraria
INSERT INTO bookstores (id, name, description, phone, email)
VALUES (
  'test-bookstore-1',
  'Livraria Exemplo',
  'Uma livraria de teste',
  '(11) 98765-4321',
  'contato@livraria.com'
);

-- Criar localização
INSERT INTO locations (id, name, address, city, state, bookstoreId)
VALUES (
  'test-location-1',
  'Loja Principal',
  'Rua Exemplo, 123',
  'São Paulo',
  'SP',
  'test-bookstore-1'
);

-- Criar listing vinculado
INSERT INTO listings (
  id, bookId, bookstoreId, locationId,
  condition, price, transactionType, status
)
VALUES (
  'test-listing-1',
  'existing-book-id',
  'test-bookstore-1',
  'test-location-1',
  'NEW',
  50.00,
  'SALE',
  'ACTIVE'
);
```

### 2. Navegar para a Página

```typescript
router.push({
  pathname: '/(private)/store/[storeId]',
  params: { 
    storeId: 'test-bookstore-1',
    type: 'bookstore'
  },
});
```

### 3. Verificar

- ✅ Informações da loja carregam
- ✅ Endereços aparecem
- ✅ Livros são listados
- ✅ Contatos são clicáveis
- ✅ Pull-to-refresh funciona
- ✅ Navegação para livro funciona

## 🐛 Troubleshooting

### Erro: "Loja não encontrada"
- Verifique se o `storeId` está correto
- Verifique se o `type` está correto ('bookstore' ou 'secondhand_store')
- Confirme que a loja existe no Supabase

### Erro: "Nenhum livro disponível"
- Verifique se há listings vinculados à loja
- Confirme que o status dos listings é 'ACTIVE'
- Verifique o campo `bookstoreId` ou `secondhandStoreId` nos listings

### Erro ao carregar
- Verifique as RLS policies no Supabase
- Confirme que as relações estão corretas no Prisma
- Verifique os logs do console

## 📚 Exemplos de Uso

### Exemplo 1: Listar todas as lojas

```typescript
import { listAllStores } from '@/src/services/storeService';

const stores = await listAllStores();
// Retorna array com livrarias e sebos
```

### Exemplo 2: Card de loja clicável

```typescript
<Card
  onPress={() => {
    router.push({
      pathname: '/(private)/store/[storeId]',
      params: { 
        storeId: store.id,
        type: store.type
      },
    });
  }}
>
  <Card.Content>
    <Title>{store.name}</Title>
    <Paragraph>{store.description}</Paragraph>
  </Card.Content>
</Card>
```

### Exemplo 3: Integração com mapa

```typescript
const handleStorePress = useCallback((storeId: string, storeType: StoreType) => {
  router.push({
    pathname: '/(private)/store/[storeId]',
    params: { 
      storeId,
      type: storeType
    },
  });
}, [router]);

<LivrariasMap 
  stores={stores}
  onStorePress={handleStorePress}
/>
```

## 🔄 Próximas Melhorias

- [ ] Sistema de avaliações da loja
- [ ] Galeria de fotos
- [ ] Horário de funcionamento
- [ ] Redes sociais
- [ ] Compartilhar loja
- [ ] Adicionar aos favoritos
- [ ] Filtrar livros da loja
- [ ] Buscar dentro dos livros da loja
- [ ] Ver no mapa (direto da página)
- [ ] Calcular rota até a loja

## 📖 Referências

- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Router - Dynamic Routes](https://docs.expo.dev/router/create-pages/#dynamic-routes)
- [Supabase - Relations](https://supabase.com/docs/guides/database/joins-and-nesting)

