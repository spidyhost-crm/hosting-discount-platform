-- =====================================================
-- Hosting Discount Platform - Database Schema
-- User Role System: user, provider, admin
-- =====================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Role system: 'user', 'provider', 'admin'
  user_role TEXT DEFAULT 'user' CHECK (user_role IN ('user', 'provider', 'admin')),
  
  -- Security and status fields
  is_verified BOOLEAN DEFAULT FALSE,
  is_disabled BOOLEAN DEFAULT FALSE,
  login_attempts INTEGER DEFAULT 0,
  login_locked_until TIMESTAMPTZ,
  
  -- Profile fields
  country TEXT, -- ISO country code (e.g. 'US', 'CA', 'UK')
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider representatives table (for users with 'provider' role)
CREATE TABLE provider_representatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  provider_id UUID, -- Will reference providers table when created
  
  -- Representative details
  job_title TEXT,
  contact_email TEXT,
  
  -- Permissions
  is_active BOOLEAN DEFAULT TRUE,
  can_reply_reviews BOOLEAN DEFAULT TRUE,
  can_moderate_replies BOOLEAN DEFAULT FALSE,
  
  -- Administrative tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  
  -- Ensure unique user-provider combination
  UNIQUE(user_id, provider_id)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_representatives ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- Provider representatives policies
CREATE POLICY "Users can view own representative records" ON provider_representatives
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all representative records" ON provider_representatives
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes for common queries
CREATE INDEX idx_user_profiles_user_role ON user_profiles(user_role);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_is_disabled ON user_profiles(is_disabled);
CREATE INDEX idx_provider_representatives_user_id ON provider_representatives(user_id);
CREATE INDEX idx_provider_representatives_provider_id ON provider_representatives(provider_id);
CREATE INDEX idx_provider_representatives_is_active ON provider_representatives(is_active);

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================

-- Note: Initial admin user will be created after first signup
-- through application logic or manual database insertion