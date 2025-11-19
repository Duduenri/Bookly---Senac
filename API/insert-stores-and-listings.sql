-- Script para inserir lojas e listings baseado nos dados fornecidos

-- 1. Inserir Livrarias
INSERT INTO bookstores (id, name, email, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Santos',
  'contato@livrariasantos.com.br',
  'Livraria com foco em livros técnicos e acadêmicos',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Santos');

INSERT INTO bookstores (id, name, email, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Cultura',
  'contato@cultura.com.br',
  'Grande variedade de livros e produtos culturais',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Cultura');

INSERT INTO bookstores (id, name, email, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Ler e Viver',
  'contato@lereviver.com.br',
  'Livraria especializada em literatura',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Ler e Viver');

-- 2. Inserir Sebos
INSERT INTO secondhand_stores (id, name, email, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Costa',
  'atendimento@sebocosta.com.br',
  'Sebo com livros usados de qualidade',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Costa');

INSERT INTO secondhand_stores (id, name, email, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Paulista',
  'contato@sebopaulista.com.br',
  'Sebo tradicional do centro de São Paulo',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Paulista');

-- 3. Inserir Localizações
-- Livraria Santos - Centro
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Santos - Centro',
  'Rua das Flores, 123',
  'São Paulo',
  'SP',
  -23.550520,
  -46.633308,
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Santos - Centro'
);

-- Livraria Santos (outra localização)
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Santos',
  'Rua das Palmeiras, 456',
  'São Paulo',
  'SP',
  -23.551520,
  -46.634308,
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Santos' 
  AND city = 'São Paulo'
  AND address = 'Rua das Palmeiras, 456'
);

-- Livraria Cultura - Paulista
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Cultura - Paulista',
  'Av. Paulista, 2073',
  'São Paulo',
  'SP',
  -23.561414,
  -46.656180,
  (SELECT id FROM bookstores WHERE name = 'Livraria Cultura' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Cultura - Paulista'
);

-- Livraria Ler e Viver - Belo Horizonte
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Ler e Viver - Belo Horizonte',
  'Av. Afonso Pena, 1500',
  'Belo Horizonte',
  'MG',
  -19.916681,
  -43.940037,
  (SELECT id FROM bookstores WHERE name = 'Livraria Ler e Viver' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Ler e Viver - Belo Horizonte'
);

-- Sebo Costa - Vila Madalena
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Costa - Vila Madalena',
  'Rua Harmonia, 789',
  'São Paulo',
  'SP',
  -23.546389,
  -46.691111,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Costa - Vila Madalena'
);

-- Sebo Costa (outra localização)
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Costa',
  'Rua Augusta, 321',
  'São Paulo',
  'SP',
  -23.547389,
  -46.692111,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Costa'
  AND city = 'São Paulo'
  AND address = 'Rua Augusta, 321'
);

-- Sebo Paulista - Centro
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Paulista - Centro',
  'Rua Direita, 654',
  'São Paulo',
  'SP',
  -23.548520,
  -46.635308,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Paulista' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Paulista - Centro'
);

-- 4. Inserir Livros (se não existirem)
INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Clean Code',
  'Robert C. Martin',
  '9780132350884',
  'Alta Books',
  '2008-08-01'::date,
  464,
  'pt-BR',
  'Um guia para desenvolver código limpo e sustentável',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Clean Code' AND author = 'Robert C. Martin');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'O Hobbit',
  'J.R.R. Tolkien',
  '9788595084742',
  'HarperCollins',
  '1937-09-21'::date,
  336,
  'pt-BR',
  'A clássica aventura de Bilbo Bolseiro',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'O Hobbit' AND author = 'J.R.R. Tolkien');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sapiens: Uma Breve História da Humanidade',
  'Yuval Noah Harari',
  '9788525432629',
  'L&PM',
  '2015-01-01'::date,
  464,
  'pt-BR',
  'Uma análise sobre a história da humanidade',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Sapiens: Uma Breve História da Humanidade');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '1984',
  'George Orwell',
  '9788535914849',
  'Companhia das Letras',
  '1949-06-08'::date,
  416,
  'pt-BR',
  'O clássico distópico sobre totalitarismo',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '1984' AND author = 'George Orwell');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'O Senhor dos Anéis',
  'J.R.R. Tolkien',
  '9788595084759',
  'HarperCollins',
  '1954-07-29'::date,
  1178,
  'pt-BR',
  'A épica trilogia fantástica',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'O Senhor dos Anéis');

-- 5. Criar Listings
-- Clean Code - Livraria Santos - VENDA
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Santos - Centro' AND city = 'São Paulo' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  'NEW',
  89.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN locations loc ON l."locationId" = loc.id
  WHERE b.title = 'Clean Code'
  AND loc.name = 'Livraria Santos - Centro'
  AND l."transactionType" = 'SALE'
  AND l.price = 89.90
);

-- Clean Code - Livraria Santos - ALUGUEL
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, "rentalPrice", "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Santos - Centro' AND city = 'São Paulo' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Santos' LIMIT 1),
  'NEW',
  15.00,
  'RENTAL',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN locations loc ON l."locationId" = loc.id
  WHERE b.title = 'Clean Code'
  AND loc.name = 'Livraria Santos - Centro'
  AND l."transactionType" = 'RENTAL'
);

-- O Hobbit - Livraria Cultura
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Hobbit' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Cultura - Paulista' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Cultura' LIMIT 1),
  'NEW',
  65.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'O Hobbit'
  AND bs.name = 'Livraria Cultura'
);

-- Sapiens - Livraria Ler e Viver
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Sapiens: Uma Breve História da Humanidade' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Ler e Viver - Belo Horizonte' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Ler e Viver' LIMIT 1),
  'NEW',
  99.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'Sapiens: Uma Breve História da Humanidade'
  AND bs.name = 'Livraria Ler e Viver'
);

-- 1984 - Sebo Costa - VENDA
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = '1984' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Costa - Vila Madalena' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  'GOOD',
  35.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = '1984'
  AND ss.name = 'Sebo Costa'
  AND l.price = 35.00
);

-- 1984 - Sebo Costa - TROCA (preço 0)
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status, "exchangeFor",
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = '1984' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Costa - Vila Madalena' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Costa' LIMIT 1),
  'GOOD',
  0,
  'EXCHANGE',
  'ACTIVE',
  'Livros de ficção científica',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = '1984'
  AND ss.name = 'Sebo Costa'
  AND l."transactionType" = 'EXCHANGE'
);

-- O Senhor dos Anéis - Sebo Paulista
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Senhor dos Anéis' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Paulista - Centro' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Paulista' LIMIT 1),
  'LIKE_NEW',
  45.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'O Senhor dos Anéis'
  AND ss.name = 'Sebo Paulista'
);

-- Verificação: Contar lojas e listings
SELECT 'Total de Livrarias' as tipo, COUNT(*) as total FROM bookstores
UNION ALL
SELECT 'Total de Sebos', COUNT(*) FROM secondhand_stores
UNION ALL
SELECT 'Total de Localizações', COUNT(*) FROM locations
UNION ALL
SELECT 'Total de Livros', COUNT(*) FROM books
UNION ALL
SELECT 'Total de Listings Ativos', COUNT(*) FROM listings WHERE status = 'ACTIVE';

