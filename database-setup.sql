-- Database setup for ECD-AI Document Management
-- Execute this SQL in your Supabase SQL Editor

-- 1. Create the documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('invoice', 'receipt', 'specification', 'purchase_order', 'contract')),
    size BIGINT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create storage bucket for documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Create storage policies for documents bucket
-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete own documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create RLS policies for documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY "Users can view own documents" ON documents
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents" ON documents
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own documents" ON documents
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON documents
FOR DELETE USING (auth.uid() = user_id);

-- 5. Create function to automatically create document records when files are uploaded
CREATE OR REPLACE FUNCTION create_document_record()
RETURNS TRIGGER AS $$
DECLARE
    file_name TEXT;
    file_size BIGINT;
    file_type TEXT;
    public_url TEXT;
    user_uuid UUID;
    original_name TEXT;
    path_parts TEXT[];
BEGIN
    -- Extract information from the uploaded file
    file_name := NEW.name;
    file_size := COALESCE((NEW.metadata->>'size')::BIGINT, 0);
    
    -- Split the path to extract user_id and document type
    -- Expected format: user_id/document_type/filename.ext
    path_parts := string_to_array(file_name, '/');
    
    -- Ensure we have the expected path structure
    IF array_length(path_parts, 1) >= 3 THEN
        user_uuid := path_parts[1]::UUID;
        file_type := path_parts[2];
        original_name := COALESCE(NEW.metadata->>'originalName', path_parts[array_length(path_parts, 1)]);
    ELSE
        -- Fallback: use owner and try to extract type from metadata
        user_uuid := NEW.owner;
        file_type := COALESCE(NEW.metadata->>'type', 'contract'); -- default to contract if no type
        original_name := COALESCE(NEW.metadata->>'originalName', file_name);
    END IF;
    
    -- Validate document type
    IF file_type NOT IN ('invoice', 'receipt', 'specification', 'purchase_order', 'contract') THEN
        file_type := 'contract'; -- default fallback
    END IF;
    
    -- Get the public URL for the file
    SELECT 
        CASE 
            WHEN current_setting('app.settings.supabase_url', true) IS NOT NULL 
            THEN 'https://' || current_setting('app.settings.supabase_url', true) || '/storage/v1/object/public/documents/' || file_name
            ELSE '/storage/v1/object/public/documents/' || file_name
        END INTO public_url;
    
    -- Insert record into documents table
    INSERT INTO documents (
        name,
        type,
        size,
        url,
        user_id
    ) VALUES (
        original_name,
        file_type,
        file_size,
        public_url,
        user_uuid
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the file upload
        RAISE WARNING 'Failed to create document record for %: %', file_name, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically create document records on file upload
CREATE TRIGGER on_file_upload
    AFTER INSERT ON storage.objects
    FOR EACH ROW
    WHEN (NEW.bucket_id = 'documents')
    EXECUTE FUNCTION create_document_record();

-- 7. Create function to clean up document records when files are deleted
CREATE OR REPLACE FUNCTION cleanup_document_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete the corresponding document record
    DELETE FROM documents 
    WHERE url LIKE '%' || OLD.name;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to clean up document records on file deletion
CREATE TRIGGER on_file_delete
    AFTER DELETE ON storage.objects
    FOR EACH ROW
    WHEN (OLD.bucket_id = 'documents')
    EXECUTE FUNCTION cleanup_document_record();

-- 9. Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger to update updated_at column
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- 12. Grant necessary permissions
GRANT ALL ON documents TO authenticated;
GRANT ALL ON documents TO service_role;