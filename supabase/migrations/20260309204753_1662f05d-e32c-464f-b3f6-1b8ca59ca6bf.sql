
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Users manage own pin" ON public.user_pins;

CREATE POLICY "Users manage own pin"
ON public.user_pins
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
