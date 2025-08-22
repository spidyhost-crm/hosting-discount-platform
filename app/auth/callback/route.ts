import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/dashboard'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Revalidate the layout to ensure fresh auth state
      revalidatePath('/', 'layout')
      
      // Create HTML that handles sessionStorage redirect properly
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting...</title>
          <meta http-equiv="refresh" content="0;url=/dashboard">
        </head>
        <body>
          <script>
            try {
              // Check if there's a redirect stored in sessionStorage
              const storedRedirect = sessionStorage.getItem('auth_redirect_to');
              if (storedRedirect) {
                sessionStorage.removeItem('auth_redirect_to');
                window.location.replace(storedRedirect);
              } else {
                window.location.replace('/dashboard');
              }
            } catch (e) {
              // Fallback if sessionStorage fails
              window.location.replace('/dashboard');
            }
          </script>
          <p>Redirecting...</p>
        </body>
        </html>
      `
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}