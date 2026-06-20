-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to the resumes bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

-- 3. Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'resumes');

-- 4. Allow users to update their own files (path format: userId/fileName)
CREATE POLICY "Users can update their own files" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Allow users to delete their own files
CREATE POLICY "Users can delete their own files" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
