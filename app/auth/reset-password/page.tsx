"use client"

import * as React from "react"
import Link from "next/link"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { LogoIcon } from "@/components/tailark/logo"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { createClient } from "@/utils/supabase/client"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  
  const passwordsMatch = password === confirmPassword
  const isFormValid = password.length >= 6 && confirmPassword.length > 0 && passwordsMatch

  React.useEffect(() => {
    // Handle the reset password link callback
    const handleResetPassword = async () => {
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (error) {
          toast.error('Invalid or expired reset link. Please request a new one.')
        }
      }
    }
    
    handleResetPassword()
  }, [searchParams, supabase.auth])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password updated successfully! Redirecting to login...')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#9B99FE]/20 via-background via-70% to-[#2BC8B7]/20 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <LogoIcon className="size-6" />
          Hosting Discount
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="ring-foreground/15 border-transparent ring-1"
                  />
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-sm text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={`ring-foreground/15 border-transparent ring-1 ${
                      confirmPassword.length > 0 && !passwordsMatch 
                        ? 'ring-destructive border-destructive' 
                        : ''
                    }`}
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-sm text-destructive">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword.length > 0 && passwordsMatch && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Passwords match ✓
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}