GRANT SELECT ON public.universities TO anon;

CREATE POLICY "Public read catalogue"
ON public.universities
FOR SELECT
TO anon
USING (true);
