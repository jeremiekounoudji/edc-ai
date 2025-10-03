-- Suppliers Database Setup for ECD-AI
-- Execute this SQL in your Supabase SQL Editor

-- 1. Create the suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    sector TEXT NOT NULL,
    domain TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 100),
    avatar TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_whatsapp TEXT,
    address JSONB,
    website TEXT,
    established_year INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create RLS policies for suppliers table
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Users can only see their own suppliers
CREATE POLICY "Users can view own suppliers" ON suppliers
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own suppliers
CREATE POLICY "Users can insert own suppliers" ON suppliers
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own suppliers
CREATE POLICY "Users can update own suppliers" ON suppliers
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own suppliers
CREATE POLICY "Users can delete own suppliers" ON suppliers
FOR DELETE USING (auth.uid() = user_id);

-- 3. Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to update updated_at column
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_sector ON suppliers(sector);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_name ON suppliers(company_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at DESC);

-- 6. Create full-text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_suppliers_search ON suppliers 
USING gin(to_tsvector('english', company_name || ' ' || description || ' ' || sector || ' ' || domain));

-- 7. Grant necessary permissions
GRANT ALL ON suppliers TO authenticated;
GRANT ALL ON suppliers TO service_role;

-- 8. Insert some sample data (optional - remove if you don't want sample data)
INSERT INTO suppliers (
    company_name,
    description,
    sector,
    domain,
    rating,
    contact_email,
    contact_phone,
    contact_whatsapp,
    address,
    website,
    established_year,
    user_id
) VALUES 
(
    'TechFlow Solutions',
    'Leading provider of enterprise software solutions and digital transformation services.',
    'Technology',
    'techflow.com',
    92,
    'contact@techflow.com',
    '+1-555-0123',
    '+1-555-0123',
    '{"street": "123 Tech Street", "city": "San Francisco", "country": "USA", "postalCode": "94105"}',
    'https://techflow.com',
    2015,
    auth.uid()
),
(
    'GreenBuild Materials',
    'Sustainable construction materials and eco-friendly building solutions.',
    'Construction',
    'greenbuild.com',
    88,
    'info@greenbuild.com',
    '+1-555-0456',
    '+1-555-0456',
    '{"street": "456 Green Ave", "city": "Portland", "country": "USA", "postalCode": "97201"}',
    'https://greenbuild.com',
    2010,
    auth.uid()
),
(
    'MedSupply Pro',
    'Medical equipment and pharmaceutical supply chain management.',
    'Healthcare',
    'medsupply.com',
    95,
    'orders@medsupply.com',
    '+1-555-0789',
    '+1-555-0789',
    '{"street": "789 Medical Blvd", "city": "Boston", "country": "USA", "postalCode": "02101"}',
    'https://medsupply.com',
    2008,
    auth.uid()
)
ON CONFLICT DO NOTHING;

-- 9. Create a view for supplier statistics (optional)
CREATE OR REPLACE VIEW supplier_stats AS
SELECT 
    sector,
    COUNT(*) as supplier_count,
    AVG(rating) as avg_rating,
    MIN(rating) as min_rating,
    MAX(rating) as max_rating
FROM suppliers 
GROUP BY sector;

-- Grant access to the view
GRANT SELECT ON supplier_stats TO authenticated;