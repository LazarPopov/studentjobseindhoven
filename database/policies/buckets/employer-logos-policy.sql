-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('employer-logos', 'employer-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anonymous (public) users to INSERT files
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'employer-logos');

-- Allow anonymous (public) users to SELECT/read files
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'employer-logos');

-- Allow authenticated users to DELETE files (for admin cleanup)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'employer-logos');

-- Allow authenticated users to UPDATE files (for admin management)
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'employer-logos')
WITH CHECK (bucket_id = 'employer-logos');