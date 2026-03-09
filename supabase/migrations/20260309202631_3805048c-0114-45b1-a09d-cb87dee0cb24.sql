
-- Fix card_number default to generate proper 16-digit number
ALTER TABLE public.profiles 
  ALTER COLUMN card_number SET DEFAULT lpad(floor(random() * 10000000000000000)::bigint::text, 16, '0');

-- Fix account_number default to generate proper 10-digit number  
ALTER TABLE public.profiles 
  ALTER COLUMN account_number SET DEFAULT lpad(floor(random() * 10000000000)::bigint::text, 10, '0');

-- Fix existing records with bad card numbers
UPDATE public.profiles 
SET card_number = lpad(floor(random() * 10000000000000000)::bigint::text, 16, '0'),
    account_number = lpad(floor(random() * 10000000000)::bigint::text, 10, '0')
WHERE length(card_number) < 16 OR card_number LIKE '%.%' OR length(account_number) < 10;
