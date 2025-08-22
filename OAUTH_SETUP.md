# OAuth Provider Setup Guide

To enable GitHub and Google authentication, you need to configure OAuth providers in your Supabase dashboard.

## 🔧 **Setup Instructions**

### **1. GitHub OAuth Setup**

1. **Create GitHub OAuth App**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Set **Application name**: `Hosting Discount Platform`
   - Set **Homepage URL**: `http://localhost:3000` (for development)
   - Set **Authorization callback URL**: `https://igpgpifvzbqflaftbcyo.supabase.co/auth/v1/callback`
   - Click "Register Application"

2. **Copy Credentials**:
   - Copy your **Client ID**
   - Generate and copy your **Client Secret**

3. **Configure in Supabase**:
   - Go to [Supabase Dashboard > Authentication > Providers](https://supabase.com/dashboard/project/igpgpifvzbqflaftbcyo/auth/providers)
   - Find **GitHub** in the provider list
   - Toggle **GitHub Enabled** to ON
   - Enter your **Client ID** and **Client Secret**
   - Click **Save**

### **2. Google OAuth Setup**

1. **Create Google OAuth App**:
   - Go to [Google Cloud Console](https://console.developers.google.com/apis/credentials)
   - Create a new project or select existing
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Set **Application type**: `Web application`
   - Set **Name**: `Hosting Discount Platform`
   - Add **Authorized redirect URIs**: `https://igpgpifvzbqflaftbcyo.supabase.co/auth/v1/callback`

2. **Copy Credentials**:
   - Copy your **Client ID**
   - Copy your **Client Secret**

3. **Configure in Supabase**:
   - Go to [Supabase Dashboard > Authentication > Providers](https://supabase.com/dashboard/project/igpgpifvzbqflaftbcyo/auth/providers)
   - Find **Google** in the provider list
   - Toggle **Google Enabled** to ON
   - Enter your **Client ID** and **Client Secret**
   - Click **Save**

## 📋 **Callback URLs**

- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://yourdomain.com/auth/callback`
- **Supabase Callback**: `https://igpgpifvzbqflaftbcyo.supabase.co/auth/v1/callback`

## ✅ **Verification**

After setup:
1. Test GitHub login on `/login` page
2. Test Google login on `/login` page  
3. Test email signup on `/signup` page
4. Verify user profiles are automatically created in `user_profiles` table
5. Check user role defaults to `user`

## 🔒 **Security Notes**

- OAuth redirect URLs must be exact matches
- Keep Client Secrets secure and never commit to version control
- Test thoroughly in development before production deployment
- Monitor authentication logs in Supabase dashboard