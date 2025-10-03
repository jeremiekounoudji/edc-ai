-- Fix for duplicate document records
-- Execute this SQL in your Supabase SQL Editor

-- 1. First, let's clean up any existing duplicate triggers
DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;
DROP TRIGGER IF EXISTS on_file_delete ON storage.objects;

-- 2. Remove duplicate document records (keep the latest one for each file)
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY url ORDER BY created_at DESC) as rn
  FROM documents
)
DELETE FROM documents 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 3. Create improved function with duplicate prevention
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
    existing_count INTEGER;
BEGIN
    -- Extract information from the uploaded file
    file_name := NEW.name;
    file_size := COALESCE((NEW.metadata->>'size')::BIGINT, 0);
    
    -- Create the public URL first
    public_url := '/storage/v1/object/public/documents/' || file_name;
    
    -- Check if a document record already exists for this file
    SELECT COUNT(*) INTO existing_count 
    FROM documents 
    WHERE url = public_url OR url LIKE '%' || file_name;
    
    -- If record already exists, skip creation
    IF existing_count > 0 THEN
        RAISE NOTICE 'Document record already exists for file: %', file_name;
        RETURN NEW;
    END IF;
    
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
    
    -- Insert record into documents table with additional safety check
    BEGIN
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
        
        RAISE NOTICE 'Created document record for file: %', file_name;
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'Document record already exists (unique violation): %', file_name;
        WHEN OTHERS THEN
            RAISE WARNING 'Failed to create document record for %: %', file_name, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create improved cleanup function
CREATE OR REPLACE FUNCTION cleanup_document_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete the corresponding document record
    DELETE FROM documents 
    WHERE url LIKE '%' || OLD.name;
    
    RAISE NOTICE 'Cleaned up document record for file: %', OLD.name;
    RETURN OLD;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to cleanup document record for %: %', OLD.name, SQLERRM;
        RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the triggers with proper conditions
CREATE TRIGGER on_file_upload
    AFTER INSERT ON storage.objects
    FOR EACH ROW
    WHEN (NEW.bucket_id = 'documents')
    EXECUTE FUNCTION create_document_record();

CREATE TRIGGER on_file_delete
    AFTER DELETE ON storage.objects
    FOR EACH ROW
    WHEN (OLD.bucket_id = 'documents')
    EXECUTE FUNCTION cleanup_document_record();

-- 6. Add a unique constraint to prevent duplicate URLs (optional but recommended)
-- This will prevent duplicate records at the database level
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_url_unique ON documents(url);

-- 7. Check current trigger status
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table = 'objects'
AND trigger_name LIKE '%file%';

-- 8. Verify no duplicate documents exist
SELECT 
    url, 
    COUNT(*) as count,
    array_agg(id) as document_ids
FROM documents 
GROUP BY url 
HAVING COUNT(*) > 1;