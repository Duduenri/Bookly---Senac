-- Script para popular o banco de dados diretamente no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- ========================================
-- 1. CATEGORIAS
-- ========================================
-- Limpar categorias existentes (opcional - comente se não quiser limpar)
-- DELETE FROM categories;

INSERT INTO categories (id, name, description, "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'Ficção', 'Livros de ficção e literatura', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Ficção');

INSERT INTO categories (id, name, description, "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'Não-Ficção', 'Livros informativos e educativos', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Não-Ficção');

INSERT INTO categories (id, name, description, "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'Tecnologia', 'Livros sobre tecnologia e programação', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tecnologia');

INSERT INTO categories (id, name, description, "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'Biografia', 'Biografias e memórias', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Biografia');

INSERT INTO categories (id, name, description, "createdAt", "updatedAt") 
SELECT gen_random_uuid(), 'História', 'Livros de história e geografia', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'História');

-- ========================================
-- 2. PROFILES (Usuários)
-- ========================================
INSERT INTO profiles (id, "userId", email, name, phone, avatar, bio, "accountType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'auth-user-1', 'joao.silva@email.com', 'João Silva', '(11) 99999-1111', 
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
   'Apaixonado por livros de ficção e tecnologia. Sempre em busca de novas histórias para ler.',
   'USER', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'joao.silva@email.com');

INSERT INTO profiles (id, "userId", email, name, phone, avatar, bio, "accountType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'auth-user-2', 'maria.santos@livraria.com', 'Maria Santos', '(11) 88888-2222',
   'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
   'Proprietária da Livraria Santos há 15 anos. Especializada em livros técnicos e acadêmicos.',
   'BOOKSTORE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'maria.santos@livraria.com');

INSERT INTO profiles (id, "userId", email, name, phone, avatar, bio, "accountType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'auth-user-3', 'pedro.costa@sebo.com', 'Pedro Costa', '(11) 77777-3333',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
   'Proprietário do Sebo Costa. Especializado em livros raros, usados e edições antigas.',
   'SECONDHAND_STORE', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'pedro.costa@sebo.com');

-- ========================================
-- 3. BOOKSTORES (Livrarias)
-- ========================================
INSERT INTO bookstores (id, name, description, email, phone, website, logo, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Livraria Santos', 'Livraria com foco em livros técnicos e acadêmicos',
   'contato@livrariasantos.com.br', '(11) 4002-8922', 'https://livrariasantos.com.br',
   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop',
   NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Santos');

INSERT INTO bookstores (id, name, description, email, phone, website, logo, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Livraria Cultura', 'Rede de livrarias com amplo catálogo',
   'contato@cultura.com.br', '(11) 3170-4033', 'https://www.livrariacultura.com.br',
   'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=300&fit=crop',
   NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Cultura');

-- ========================================
-- 4. SECONDHAND_STORES (Sebos)
-- ========================================
INSERT INTO secondhand_stores (id, name, description, email, phone, website, logo, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Sebo Costa', 'Sebo especializado em livros raros e usados',
   'atendimento@sebocosta.com.br', '(11) 3003-1234', 'https://sebocosta.com.br',
   'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=300&fit=crop',
   NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Costa');

INSERT INTO secondhand_stores (id, name, description, email, phone, website, logo, "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Sebo Paulista', 'Sebo tradicional no centro de São Paulo',
   'contato@sebopaulista.com.br', '(11) 3256-7890', 'https://sebopaulista.com.br',
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
   NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Paulista');

-- ========================================
-- 5. BOOKS (Livros)
-- ========================================
INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "categoryId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'O Senhor dos Anéis',
  'J.R.R. Tolkien',
  '9788535902775',
  'Martins Fontes',
  '2000-01-01',
  1216,
  'Português',
  'Uma das maiores obras de fantasia da literatura mundial.',
  (SELECT id FROM categories WHERE name = 'Ficção' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '9788535902775');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "categoryId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Clean Code',
  'Robert C. Martin',
  '9788573025639',
  'Alta Books',
  '2009-01-01',
  425,
  'Português',
  'Um guia para escrever código limpo e legível.',
  (SELECT id FROM categories WHERE name = 'Tecnologia' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '9788573025639');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "categoryId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '1984',
  'George Orwell',
  '9788535909552',
  'Companhia das Letras',
  '2009-01-01',
  416,
  'Português',
  'Um clássico da literatura distópica.',
  (SELECT id FROM categories WHERE name = 'Ficção' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '9788535909552');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "categoryId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'O Hobbit',
  'J.R.R. Tolkien',
  '9788533613379',
  'Martins Fontes',
  '2012-01-01',
  336,
  'Português',
  'A jornada de Bilbo Bolseiro na Terra Média.',
  (SELECT id FROM categories WHERE name = 'Ficção' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '9788533613379');

-- ========================================
-- 6. LOCATIONS (Localizações)
-- ========================================
-- Localização da Livraria Santos
INSERT INTO locations (id, name, address, city, state, "zipCode", latitude, longitude, notes, "bookstoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Santos - Centro',
  'Rua das Flores, 123 - Centro, São Paulo - SP',
  'São Paulo',
  'SP',
  '01001-000',
  -23.5505,
  -46.6333,
  'Livraria no centro da cidade',
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Santos');

-- Localização da Livraria Cultura
INSERT INTO locations (id, name, address, city, state, "zipCode", latitude, longitude, notes, "bookstoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Cultura - Paulista',
  'Av. Paulista, 2073 - Bela Vista, São Paulo - SP',
  'São Paulo',
  'SP',
  '01310-300',
  -23.5617,
  -46.6560,
  'Livraria na Av. Paulista',
  (SELECT id FROM bookstores WHERE name = 'Livraria Cultura' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Cultura');

-- Localização do Sebo Costa
INSERT INTO locations (id, name, address, city, state, "zipCode", latitude, longitude, notes, "secondhandStoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Costa - Vila Madalena',
  'Rua Harmonia, 456 - Vila Madalena, São Paulo - SP',
  'São Paulo',
  'SP',
  '05435-000',
  -23.5671,
  -46.6919,
  'Sebo especializado em livros raros',
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Costa');

-- Localização do Sebo Paulista
INSERT INTO locations (id, name, address, city, state, "zipCode", latitude, longitude, notes, "secondhandStoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Paulista - Centro',
  'Av. Paulista, 900 - Bela Vista, São Paulo - SP',
  'São Paulo',
  'SP',
  '01310-100',
  -23.5631,
  -46.6544,
  'Sebo tradicional no centro',
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Paulista' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Paulista');

-- ========================================
-- 7. LISTINGS (Anúncios de Livros)
-- ========================================
-- Listagem da Livraria Santos
INSERT INTO listings (id, condition, price, "rentalPrice", "transactionType", status, "profileId", "bookId", "locationId", "bookstoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'NEW',
  89.90,
  NULL,
  'SALE',
  'ACTIVE',
  (SELECT id FROM profiles WHERE email = 'maria.santos@livraria.com' LIMIT 1),
  (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Santos - Centro' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM books WHERE title = 'Clean Code');

-- Listagem da Livraria Cultura
INSERT INTO listings (id, condition, price, "rentalPrice", "transactionType", status, "profileId", "bookId", "locationId", "bookstoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'NEW',
  65.90,
  NULL,
  'SALE',
  'ACTIVE',
  (SELECT id FROM profiles WHERE email = 'maria.santos@livraria.com' LIMIT 1),
  (SELECT id FROM books WHERE title = 'O Hobbit' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Cultura - Paulista' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Cultura' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM books WHERE title = 'O Hobbit');

-- Listagem do Sebo Costa
INSERT INTO listings (id, condition, price, "rentalPrice", "transactionType", status, "profileId", "bookId", "locationId", "secondhandStoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'GOOD',
  35.00,
  NULL,
  'SALE',
  'ACTIVE',
  (SELECT id FROM profiles WHERE email = 'pedro.costa@sebo.com' LIMIT 1),
  (SELECT id FROM books WHERE title = '1984' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Costa - Vila Madalena' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM books WHERE title = '1984');

-- Listagem do Sebo Paulista
INSERT INTO listings (id, condition, price, "rentalPrice", "transactionType", status, "profileId", "bookId", "locationId", "secondhandStoreId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'LIKE_NEW',
  45.00,
  NULL,
  'SALE',
  'ACTIVE',
  (SELECT id FROM profiles WHERE email = 'pedro.costa@sebo.com' LIMIT 1),
  (SELECT id FROM books WHERE title = 'O Senhor dos Anéis' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Paulista - Centro' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Paulista' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM books WHERE title = 'O Senhor dos Anéis');

-- ========================================
-- 8. LISTING IMAGES (Imagens dos Anúncios)
-- ========================================
-- Nota: listing_images não tem coluna updatedAt, apenas createdAt
INSERT INTO listing_images (id, "listingId", url, alt, "order", "createdAt")
SELECT 
  gen_random_uuid(),
  l.id,
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
  'Clean Code - capa',
  0,
  NOW()
FROM listings l
INNER JOIN books b ON l."bookId" = b.id
WHERE b.title = 'Clean Code'
AND NOT EXISTS (SELECT 1 FROM listing_images WHERE "listingId" = l.id);

INSERT INTO listing_images (id, "listingId", url, alt, "order", "createdAt")
SELECT 
  gen_random_uuid(),
  l.id,
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
  '1984 - capa',
  0,
  NOW()
FROM listings l
INNER JOIN books b ON l."bookId" = b.id
WHERE b.title = '1984'
AND NOT EXISTS (SELECT 1 FROM listing_images WHERE "listingId" = l.id);

INSERT INTO listing_images (id, "listingId", url, alt, "order", "createdAt")
SELECT 
  gen_random_uuid(),
  l.id,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
  'O Senhor dos Anéis - capa',
  0,
  NOW()
FROM listings l
INNER JOIN books b ON l."bookId" = b.id
WHERE b.title = 'O Senhor dos Anéis'
AND NOT EXISTS (SELECT 1 FROM listing_images WHERE "listingId" = l.id);

-- ========================================
-- 9. REVIEWS (Avaliações)
-- ========================================
INSERT INTO reviews (id, rating, comment, "profileId", "listingId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  5,
  'Excelente atendimento! O livro chegou em perfeito estado.',
  (SELECT id FROM profiles WHERE email = 'joao.silva@email.com' LIMIT 1),
  (SELECT l.id FROM listings l 
   INNER JOIN books b ON l."bookId" = b.id 
   WHERE b.title = 'Clean Code' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'joao.silva@email.com');

INSERT INTO reviews (id, rating, comment, "profileId", "listingId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  4,
  'Sebo muito organizado, encontrei livros raros que procurava há tempo.',
  (SELECT id FROM profiles WHERE email = 'maria.santos@livraria.com' LIMIT 1),
  (SELECT l.id FROM listings l 
   INNER JOIN books b ON l."bookId" = b.id 
   WHERE b.title = '1984' LIMIT 1),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'maria.santos@livraria.com');

-- ========================================
-- CONSULTAS PARA VERIFICAR OS DADOS
-- ========================================
-- Execute estas queries separadamente para verificar:

-- SELECT * FROM categories;
-- SELECT * FROM profiles;
-- SELECT * FROM bookstores;
-- SELECT * FROM secondhand_stores;
-- SELECT * FROM books;
-- SELECT * FROM locations;
-- SELECT * FROM listings;
-- SELECT * FROM listing_images;
-- SELECT * FROM reviews;

-- Consulta completa para ver livrarias com localizações:
-- SELECT 
--   b.name as bookstore_name,
--   b.description,
--   l.city,
--   l.state,
--   COUNT(DISTINCT li.id) as total_listings
-- FROM bookstores b
-- LEFT JOIN locations l ON l."bookstoreId" = b.id
-- LEFT JOIN listings li ON li."bookstoreId" = b.id
-- GROUP BY b.id, b.name, b.description, l.city, l.state;

-- Consulta completa para ver sebos com localizações:
-- SELECT 
--   s.name as sebo_name,
--   s.description,
--   l.city,
--   l.state,
--   COUNT(DISTINCT li.id) as total_listings
-- FROM secondhand_stores s
-- LEFT JOIN locations l ON l."secondhandStoreId" = s.id
-- LEFT JOIN listings li ON li."secondhandStoreId" = s.id
-- GROUP BY s.id, s.name, s.description, l.city, l.state;

