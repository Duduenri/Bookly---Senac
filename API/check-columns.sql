-- Verificar estrutura da tabela listings
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings'
ORDER BY ordinal_position;

