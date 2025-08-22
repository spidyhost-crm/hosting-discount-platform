"use client"

import { createClient } from '@/utils/supabase/client'
import { Button } from '../shadcn/ui/button'

export function SimpleOAuthTest() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      // Simplest possible Google OAuth implementation per Supabase docs
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      })

      if (error) {
        console.error('OAuth error:', error)
        alert('Error: ' + error.message)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Unexpected error occurred')
    }
  }

  return (
    <div className="p-4">
      <h3 className="mb-4">Simple OAuth Test</h3>
      <Button onClick={handleGoogleLogin}>
        Test Google Login (Simple)
      </Button>
    </div>
  )
}