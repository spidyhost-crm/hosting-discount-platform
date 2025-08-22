"use client"

import { useEffect } from 'react'

export function AuthMonitorInit() {
  useEffect(() => {
    // Initialize auth monitoring in development
    if (process.env.NODE_ENV === 'development') {
      import('@/utils/auth-monitor').then(({ authMonitor }) => {
        console.log('🔐 Auth monitoring initialized')
        
        // Log initial session state
        const summary = authMonitor.getSessionSummary()
        console.log('📊 Initial auth state:', summary)
      })
    }
  }, [])

  // This component renders nothing
  return null
}