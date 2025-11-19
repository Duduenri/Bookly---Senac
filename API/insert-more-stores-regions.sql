-- Script para inserir mais lojas em diferentes regiões do Brasil

-- ========================================
-- 1. LIVRARIAS
-- ========================================

-- Rio de Janeiro
INSERT INTO bookstores (id, name, email, description, phone, website, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria da Travessa',
  'contato@travessa.com.br',
  'Livraria tradicional do Rio de Janeiro com amplo acervo',
  '(21) 3205-9002',
  'https://www.travessa.com.br',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria da Travessa');

-- Curitiba
INSERT INTO bookstores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Curitiba',
  'contato@livrariacuritiba.com.br',
  'Livraria especializada em literatura brasileira e estrangeira',
  '(41) 3223-4455',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Curitiba');

-- Porto Alegre
INSERT INTO bookstores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Bamboletras',
  'contato@bamboletras.com.br',
  'Livraria independente com foco em literatura nacional',
  '(51) 3024-2600',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Bamboletras');

-- Recife
INSERT INTO bookstores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Jaqueira',
  'contato@livrariajaqueira.com.br',
  'Livraria com foco em cultura nordestina e literatura regional',
  '(81) 3221-5566',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Jaqueira');

-- Brasília
INSERT INTO bookstores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Livraria Planalto',
  'contato@livrariaplanalto.com.br',
  'Livraria completa no coração de Brasília',
  '(61) 3321-7788',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookstores WHERE name = 'Livraria Planalto');

-- ========================================
-- 2. SEBOS
-- ========================================

-- Rio de Janeiro
INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Carioca',
  'contato@sebocarioca.com.br',
  'Sebo tradicional com livros raros e usados',
  '(21) 2224-3344',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Carioca');

-- Curitiba
INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo do Paraná',
  'contato@sebodoparana.com.br',
  'Livros usados e antiguidades literárias',
  '(41) 3232-5566',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo do Paraná');

-- Salvador
INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo da Bahia',
  'contato@sebodabahia.com.br',
  'Sebo especializado em literatura baiana e brasileira',
  '(71) 3321-8899',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo da Bahia');

-- Porto Alegre - Mais sebos
INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Poesia',
  'contato@sebopoesia.com.br',
  'Sebo com foco em poesia e literatura gaúcha',
  '(51) 3330-1122',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Poesia');

INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Recanto das Letras',
  'contato@recantodasletras.com.br',
  'Sebo aconchegante com café e livros usados',
  '(51) 3225-6677',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Recanto das Letras');

INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Bom Fim',
  'contato@sebebomfim.com.br',
  'Sebo tradicional do bairro Bom Fim',
  '(51) 3311-9988',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Bom Fim');

-- Pelotas - Sebos
INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo da Praça',
  'contato@sebodapraca.com.br',
  'Sebo no centro histórico de Pelotas',
  '(53) 3222-4455',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo da Praça');

INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo Cultural Pelotas',
  'contato@seboculturalpelotas.com.br',
  'Sebo com eventos culturais e livros raros',
  '(53) 3284-5566',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo Cultural Pelotas');

INSERT INTO secondhand_stores (id, name, email, description, phone, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sebo do Sul',
  'contato@sebodosul.com.br',
  'Sebo especializado em literatura do sul do Brasil',
  '(53) 3227-7788',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM secondhand_stores WHERE name = 'Sebo do Sul');

-- ========================================
-- 3. LOCALIZAÇÕES
-- ========================================

-- Livraria da Travessa - Ipanema, RJ
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria da Travessa - Ipanema',
  'Rua Visconde de Pirajá, 572',
  'Rio de Janeiro',
  'RJ',
  -22.984444,
  -43.198889,
  (SELECT id FROM bookstores WHERE name = 'Livraria da Travessa' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria da Travessa - Ipanema'
);

-- Livraria da Travessa - Barra, RJ
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria da Travessa - Barra',
  'Av. das Américas, 4666',
  'Rio de Janeiro',
  'RJ',
  -23.006944,
  -43.365556,
  (SELECT id FROM bookstores WHERE name = 'Livraria da Travessa' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria da Travessa - Barra'
);

-- Livraria Curitiba - Centro
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Curitiba - Centro',
  'Rua XV de Novembro, 999',
  'Curitiba',
  'PR',
  -25.437778,
  -49.270833,
  (SELECT id FROM bookstores WHERE name = 'Livraria Curitiba' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Curitiba - Centro'
);

-- Livraria Bamboletras - Porto Alegre
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Bamboletras - Moinhos de Vento',
  'Rua dos Andradas, 1234',
  'Porto Alegre',
  'RS',
  -30.033056,
  -51.230000,
  (SELECT id FROM bookstores WHERE name = 'Livraria Bamboletras' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Bamboletras - Moinhos de Vento'
);

-- Livraria Jaqueira - Recife
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Jaqueira - Boa Viagem',
  'Av. Conselheiro Aguiar, 456',
  'Recife',
  'PE',
  -8.126667,
  -34.905000,
  (SELECT id FROM bookstores WHERE name = 'Livraria Jaqueira' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Jaqueira - Boa Viagem'
);

-- Livraria Planalto - Brasília
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "bookstoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Livraria Planalto - Asa Sul',
  'SCS Quadra 4, Bloco A',
  'Brasília',
  'DF',
  -15.794444,
  -47.888611,
  (SELECT id FROM bookstores WHERE name = 'Livraria Planalto' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Livraria Planalto - Asa Sul'
);

-- Sebo Carioca - Centro, RJ
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Carioca - Centro',
  'Rua da Carioca, 30',
  'Rio de Janeiro',
  'RJ',
  -22.910556,
  -43.178889,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Carioca' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Carioca - Centro'
);

-- Sebo do Paraná - Curitiba
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo do Paraná - Batel',
  'Rua Conselheiro Laurindo, 789',
  'Curitiba',
  'PR',
  -25.445278,
  -49.281111,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo do Paraná' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo do Paraná - Batel'
);

-- Sebo da Bahia - Salvador
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo da Bahia - Pelourinho',
  'Rua Gregório de Matos, 23',
  'Salvador',
  'BA',
  -12.973889,
  -38.510833,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo da Bahia' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo da Bahia - Pelourinho'
);

-- Sebo Poesia - Porto Alegre
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Poesia - Cidade Baixa',
  'Rua da República, 567',
  'Porto Alegre',
  'RS',
  -30.037222,
  -51.217778,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Poesia' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Poesia - Cidade Baixa'
);

-- Sebo Recanto das Letras - Porto Alegre
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Recanto das Letras - Centro',
  'Rua dos Andradas, 890',
  'Porto Alegre',
  'RS',
  -30.028889,
  -51.228333,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Recanto das Letras' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Recanto das Letras - Centro'
);

-- Sebo Bom Fim - Porto Alegre
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Bom Fim',
  'Rua José Bonifácio, 234',
  'Porto Alegre',
  'RS',
  -30.030556,
  -51.213889,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Bom Fim' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Bom Fim'
);

-- Sebo da Praça - Pelotas
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo da Praça - Centro',
  'Praça Coronel Pedro Osório, 15',
  'Pelotas',
  'RS',
  -31.766944,
  -52.341667,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo da Praça' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo da Praça - Centro'
);

-- Sebo Cultural Pelotas
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo Cultural Pelotas - Três Vendas',
  'Av. Bento Gonçalves, 2344',
  'Pelotas',
  'RS',
  -31.775556,
  -52.335000,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Cultural Pelotas' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo Cultural Pelotas - Três Vendas'
);

-- Sebo do Sul - Pelotas
INSERT INTO locations (
  id, name, address, city, state, latitude, longitude,
  "secondhandStoreId", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Sebo do Sul - Areal',
  'Rua Félix da Cunha, 678',
  'Pelotas',
  'RS',
  -31.770000,
  -52.337222,
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo do Sul' LIMIT 1),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM locations 
  WHERE name = 'Sebo do Sul - Areal'
);

-- ========================================
-- 4. ADICIONAR ALGUNS LIVROS NOVOS
-- ========================================

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Dom Casmurro',
  'Machado de Assis',
  '9788544001691',
  'Penguin',
  '1899-01-01'::date,
  256,
  'pt-BR',
  'Clássico da literatura brasileira',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Dom Casmurro' AND author = 'Machado de Assis');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Grande Sertão: Veredas',
  'Guimarães Rosa',
  '9788535911664',
  'Companhia das Letras',
  '1956-01-01'::date,
  624,
  'pt-BR',
  'Obra-prima do regionalismo brasileiro',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Grande Sertão: Veredas');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Capitães da Areia',
  'Jorge Amado',
  '9788535914845',
  'Companhia das Letras',
  '1937-01-01'::date,
  280,
  'pt-BR',
  'Romance sobre meninos de rua em Salvador',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Capitães da Areia');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'A Hora da Estrela',
  'Clarice Lispector',
  '9788520937297',
  'Rocco',
  '1977-01-01'::date,
  88,
  'pt-BR',
  'Último romance de Clarice Lispector',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'A Hora da Estrela');

INSERT INTO books (id, title, author, isbn, publisher, "publishedAt", pages, language, description, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'O Cortiço',
  'Aluísio Azevedo',
  '9788508119707',
  'Ática',
  '1890-01-01'::date,
  232,
  'pt-BR',
  'Romance naturalista brasileiro',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'O Cortiço');

-- ========================================
-- 5. CRIAR LISTINGS PARA AS NOVAS LOJAS
-- ========================================

-- Dom Casmurro - Livraria da Travessa
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Dom Casmurro' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria da Travessa - Ipanema' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria da Travessa' LIMIT 1),
  'NEW',
  42.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'Dom Casmurro'
  AND bs.name = 'Livraria da Travessa'
);

-- Grande Sertão: Veredas - Livraria Curitiba
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Grande Sertão: Veredas' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Curitiba - Centro' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Curitiba' LIMIT 1),
  'NEW',
  79.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'Grande Sertão: Veredas'
  AND bs.name = 'Livraria Curitiba'
);

-- Capitães da Areia - Sebo da Bahia
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Capitães da Areia' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo da Bahia - Pelourinho' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo da Bahia' LIMIT 1),
  'GOOD',
  28.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Capitães da Areia'
  AND ss.name = 'Sebo da Bahia'
);

-- A Hora da Estrela - Livraria Bamboletras
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'A Hora da Estrela' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Bamboletras - Moinhos de Vento' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Bamboletras' LIMIT 1),
  'NEW',
  35.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'A Hora da Estrela'
  AND bs.name = 'Livraria Bamboletras'
);

-- O Cortiço - Sebo Carioca
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Cortiço' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Carioca - Centro' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Carioca' LIMIT 1),
  'LIKE_NEW',
  25.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'O Cortiço'
  AND ss.name = 'Sebo Carioca'
);

-- Clean Code - Livraria Jaqueira (Recife)
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Jaqueira - Boa Viagem' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Jaqueira' LIMIT 1),
  'NEW',
  89.90,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN bookstores bs ON l."bookstoreId" = bs.id
  WHERE b.title = 'Clean Code'
  AND bs.name = 'Livraria Jaqueira'
);

-- Sapiens - Livraria Planalto (Brasília)
INSERT INTO listings (
  id, "bookId", "locationId", "bookstoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Sapiens: Uma Breve História da Humanidade' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Livraria Planalto - Asa Sul' LIMIT 1),
  (SELECT id FROM bookstores WHERE name = 'Livraria Planalto' LIMIT 1),
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
  AND bs.name = 'Livraria Planalto'
);

-- 1984 - Sebo do Paraná
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = '1984' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo do Paraná - Batel' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo do Paraná' LIMIT 1),
  'GOOD',
  30.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = '1984'
  AND ss.name = 'Sebo do Paraná'
);

-- Dom Casmurro - Sebo Poesia
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Dom Casmurro' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Poesia - Cidade Baixa' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Poesia' LIMIT 1),
  'LIKE_NEW',
  22.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Dom Casmurro'
  AND ss.name = 'Sebo Poesia'
);

-- A Hora da Estrela - Sebo Recanto das Letras
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'A Hora da Estrela' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Recanto das Letras - Centro' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Recanto das Letras' LIMIT 1),
  'GOOD',
  18.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'A Hora da Estrela'
  AND ss.name = 'Sebo Recanto das Letras'
);

-- Grande Sertão: Veredas - Sebo Bom Fim
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Grande Sertão: Veredas' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Bom Fim' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Bom Fim' LIMIT 1),
  'GOOD',
  45.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Grande Sertão: Veredas'
  AND ss.name = 'Sebo Bom Fim'
);

-- O Cortiço - Sebo da Praça (Pelotas)
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Cortiço' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo da Praça - Centro' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo da Praça' LIMIT 1),
  'LIKE_NEW',
  20.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'O Cortiço'
  AND ss.name = 'Sebo da Praça'
);

-- Capitães da Areia - Sebo Cultural Pelotas
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Capitães da Areia' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Cultural Pelotas - Três Vendas' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Cultural Pelotas' LIMIT 1),
  'GOOD',
  25.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Capitães da Areia'
  AND ss.name = 'Sebo Cultural Pelotas'
);

-- O Hobbit - Sebo do Sul (Pelotas)
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Hobbit' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo do Sul - Areal' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo do Sul' LIMIT 1),
  'ACCEPTABLE',
  32.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'O Hobbit'
  AND ss.name = 'Sebo do Sul'
);

-- O Senhor dos Anéis - Sebo Poesia (Porto Alegre)
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'O Senhor dos Anéis' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Poesia - Cidade Baixa' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Poesia' LIMIT 1),
  'GOOD',
  55.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'O Senhor dos Anéis'
  AND ss.name = 'Sebo Poesia'
);

-- Clean Code - Sebo Bom Fim (usado)
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Clean Code' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Bom Fim' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Bom Fim' LIMIT 1),
  'ACCEPTABLE',
  40.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Clean Code'
  AND ss.name = 'Sebo Bom Fim'
);

-- Sapiens - Sebo Cultural Pelotas
INSERT INTO listings (
  id, "bookId", "locationId", "secondhandStoreId",
  condition, price, "transactionType", status,
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM books WHERE title = 'Sapiens: Uma Breve História da Humanidade' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Sebo Cultural Pelotas - Três Vendas' LIMIT 1),
  (SELECT id FROM secondhand_stores WHERE name = 'Sebo Cultural Pelotas' LIMIT 1),
  'LIKE_NEW',
  52.00,
  'SALE',
  'ACTIVE',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM listings l
  INNER JOIN books b ON l."bookId" = b.id
  INNER JOIN secondhand_stores ss ON l."secondhandStoreId" = ss.id
  WHERE b.title = 'Sapiens: Uma Breve História da Humanidade'
  AND ss.name = 'Sebo Cultural Pelotas'
);

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
SELECT 'Resumo da inserção:' as info;
SELECT 'Total de Livrarias' as tipo, COUNT(*) as total FROM bookstores
UNION ALL
SELECT 'Total de Sebos', COUNT(*) FROM secondhand_stores
UNION ALL
SELECT 'Total de Localizações', COUNT(*) FROM locations
UNION ALL
SELECT 'Total de Livros', COUNT(*) FROM books
UNION ALL
SELECT 'Total de Listings Ativos', COUNT(*) FROM listings WHERE status = 'ACTIVE';

-- Mostrar distribuição por cidade
SELECT 
  city as cidade, 
  state as estado,
  COUNT(*) as total_locais
FROM locations
GROUP BY city, state
ORDER BY COUNT(*) DESC;

