import { createClient } from '@/utils/supabase/client'

export interface AuthSession {
  isAuthenticated: boolean
  user: any
  sessionId?: string
  expiresAt?: number
  lastRefresh?: number
}

export interface AuthEvent {
  type: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'SESSION_ERROR'
  timestamp: number
  data?: any
  error?: string
}

class AuthMonitor {
  private events: AuthEvent[] = []
  private maxEvents = 50 // Keep last 50 events
  private session: AuthSession | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  private initializeMonitoring() {
    const supabase = createClient()

    // Listen to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.logEvent({
        type: this.mapSupabaseEvent(event),
        timestamp: Date.now(),
        data: {
          event,
          sessionId: session?.access_token?.slice(-8),
          userId: session?.user?.id,
          expiresAt: session?.expires_at,
        }
      })

      // Update session state
      if (session) {
        this.session = {
          isAuthenticated: true,
          user: session.user,
          sessionId: session.access_token?.slice(-8),
          expiresAt: session.expires_at ? session.expires_at * 1000 : undefined,
          lastRefresh: Date.now()
        }
      } else {
        this.session = {
          isAuthenticated: false,
          user: null
        }
      }

      // Log session update
      this.logSessionState()
    })
  }

  private mapSupabaseEvent(event: string): AuthEvent['type'] {
    switch (event) {
      case 'SIGNED_IN':
        return 'SIGNED_IN'
      case 'SIGNED_OUT':
        return 'SIGNED_OUT'
      case 'TOKEN_REFRESHED':
        return 'TOKEN_REFRESHED'
      case 'USER_UPDATED':
        return 'USER_UPDATED'
      default:
        return 'SESSION_ERROR'
    }
  }

  logEvent(event: AuthEvent) {
    this.events.push(event)
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Auth Event: ${event.type}`, {
        timestamp: new Date(event.timestamp).toISOString(),
        data: event.data,
        error: event.error
      })
    }
  }

  logSessionState() {
    if (process.env.NODE_ENV === 'development' && this.session) {
      console.log('📊 Auth Session State:', {
        isAuthenticated: this.session.isAuthenticated,
        userId: this.session.user?.id,
        sessionId: this.session.sessionId,
        expiresAt: this.session.expiresAt ? new Date(this.session.expiresAt).toISOString() : null,
        timeToExpiry: this.session.expiresAt ? Math.round((this.session.expiresAt - Date.now()) / 1000 / 60) + ' minutes' : null
      })
    }
  }

  getEvents(): AuthEvent[] {
    return [...this.events]
  }

  getCurrentSession(): AuthSession | null {
    return this.session
  }

  getSessionSummary() {
    const now = Date.now()
    const recentEvents = this.events.filter(e => now - e.timestamp < 5 * 60 * 1000) // Last 5 minutes

    return {
      currentSession: this.session,
      recentEventCount: recentEvents.length,
      lastEventTime: this.events.length > 0 ? new Date(this.events[this.events.length - 1].timestamp).toISOString() : null,
      healthCheck: {
        isAuthenticated: this.session?.isAuthenticated || false,
        sessionValid: this.session?.expiresAt ? this.session.expiresAt > now : false,
        recentActivity: recentEvents.length > 0
      }
    }
  }

  // Utility to check if session is about to expire (within 5 minutes)
  isSessionExpiringSoon(): boolean {
    if (!this.session?.expiresAt) return false
    const fiveMinutes = 5 * 60 * 1000
    return this.session.expiresAt - Date.now() < fiveMinutes
  }

  // Clear all events (useful for testing)
  clearEvents() {
    this.events = []
  }
}

// Export singleton instance
export const authMonitor = new AuthMonitor()

// Development helper to expose monitor globally
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authMonitor = authMonitor
}