"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { createClient } from "@/utils/supabase/client"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [passwordsMatch, setPasswordsMatch] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Check password matching in real-time
    if (field === 'password' || field === 'confirmPassword') {
      const password = field === 'password' ? value : newFormData.password
      const confirmPassword = field === 'confirmPassword' ? value : newFormData.confirmPassword
      
      if (confirmPassword.length > 0) {
        const match = password === confirmPassword
        setPasswordsMatch(match)
      } else {
        setPasswordsMatch(true)
      }
    }
  }

  const isFormValid = formData.name.length > 0 && 
                      formData.email.length > 0 && 
                      formData.password.length >= 6 && 
                      formData.confirmPassword.length > 0 && 
                      passwordsMatch

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_to_check: email.toLowerCase().trim()
      })
      
      if (error) {
        console.error('Error checking email:', error)
        return false
      }
      
      return data === true
    } catch (error) {
      console.error('Error in checkEmailExists:', error)
      return false
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)

    try {
      // First check if email already exists (verified only)
      const emailExists = await checkEmailExists(formData.email)
      
      if (emailExists) {
        toast.error('Account already exists with this email. Redirecting to login...')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.name.toLowerCase().replace(/\s+/g, '_')
          }
        }
      })

      if (error) {
        toast.error(error.message)
      } else if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          toast.success('Verification email sent! Please check your inbox and spam folder.')
        } else {
          toast.success('Account created successfully!')
          setTimeout(() => {
            router.push('/')
          }, 1500)
        }
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
      } else {
        toast.success('Redirecting to sign up...')
      }
      // Don't set loading to false here as user will be redirected
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  variant="social" 
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleSocialLogin('github')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="signup-social-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9B99FE" />
                        <stop offset="100%" stopColor="#2BC8B7" />
                      </linearGradient>
                    </defs>
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="url(#signup-social-gradient-1)"/>
                  </svg>
                  {isLoading ? 'Signing up...' : 'Sign up with GitHub'}
                </Button>
                <Button 
                  variant="social" 
                  type="button"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleSocialLogin('google')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="signup-social-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9B99FE" />
                        <stop offset="100%" stopColor="#2BC8B7" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="url(#signup-social-gradient-2)"
                    />
                  </svg>
                  {isLoading ? 'Signing up...' : 'Sign up with Google'}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="ring-foreground/15 border-transparent ring-1"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="ring-foreground/15 border-transparent ring-1"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="ring-foreground/15 border-transparent ring-1"
                    placeholder="Minimum 6 characters"
                  />
                  {formData.password.length > 0 && formData.password.length < 6 && (
                    <p className="text-sm text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className={cn(
                      "ring-1 border-transparent",
                      formData.confirmPassword.length === 0 ? "ring-foreground/15" :
                      passwordsMatch ? "ring-green-500 border-green-500" :
                      "ring-red-500 border-red-500"
                    )}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}