"use client"

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/shadcn/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card'

interface AuthErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log authentication errors for debugging
    if (this.isAuthError(error)) {
      console.error('Authentication Error:', error)
      console.error('Error Info:', errorInfo)
    }
  }

  isAuthError = (error: Error): boolean => {
    const authErrorMessages = [
      'invalid_request',
      'unauthorized',
      'invalid_grant',
      'invalid_token',
      'session_not_found',
      'user_not_found',
      'Invalid login credentials',
      'Email not confirmed',
      'signup_disabled',
    ]

    return authErrorMessages.some(msg => 
      error.message?.toLowerCase().includes(msg.toLowerCase()) ||
      error.name?.toLowerCase().includes('auth')
    )
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.handleReset} />
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Authentication Error</CardTitle>
              <CardDescription>
                {this.isAuthError(this.state.error!)
                  ? 'There was a problem with your authentication. Please try signing in again.'
                  : 'Something went wrong. Please try again.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/login'}
                  className="flex-1"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple auth error fallback component
export function SimpleAuthErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-center">
        <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
        <div>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Authentication Error
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {error.message || 'Please try signing in again.'}
          </p>
          <button
            onClick={resetError}
            className="mt-2 text-sm text-red-800 underline hover:text-red-600 dark:text-red-200 dark:hover:text-red-100"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}