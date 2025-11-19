-- Verificar valores do enum TransactionType
SELECT e.enumlabel as value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'TransactionType'
ORDER BY e.enumsortorder;

-- Verificar valores do enum BookCondition
SELECT e.enumlabel as value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'BookCondition'
ORDER BY e.enumsortorder;

-- Verificar valores do enum ListingStatus
SELECT e.enumlabel as value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'ListingStatus'
ORDER BY e.enumsortorder;

