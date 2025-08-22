"use client"

import { useEffect, useState } from 'react'
import { authMonitor, type AuthSession, type AuthEvent } from '@/utils/auth-monitor'

export function useAuthMonitor() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [events, setEvents] = useState<AuthEvent[]>([])

  useEffect(() => {
    // Initialize with current state
    setSession(authMonitor.getCurrentSession())
    setEvents(authMonitor.getEvents())

    // Update every 30 seconds
    const interval = setInterval(() => {
      setSession(authMonitor.getCurrentSession())
      setEvents(authMonitor.getEvents())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    session,
    events,
    summary: authMonitor.getSessionSummary(),
    isExpiringSoon: authMonitor.isSessionExpiringSoon(),
  }
}

export function useAuthDebug() {
  const monitor = useAuthMonitor()

  const debugInfo = {
    ...monitor,
    formatSession: () => {
      if (!monitor.session) return 'No session'
      
      return {
        authenticated: monitor.session.isAuthenticated,
        user: monitor.session.user?.email || 'Unknown',
        sessionId: monitor.session.sessionId,
        expiresIn: monitor.session.expiresAt 
          ? Math.round((monitor.session.expiresAt - Date.now()) / 1000 / 60) + ' minutes'
          : 'Unknown',
        lastRefresh: monitor.session.lastRefresh
          ? new Date(monitor.session.lastRefresh).toLocaleTimeString()
          : 'Unknown'
      }
    },
    recentEvents: () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      return monitor.events
        .filter(e => e.timestamp > fiveMinutesAgo)
        .map(e => ({
          type: e.type,
          time: new Date(e.timestamp).toLocaleTimeString(),
          data: e.data
        }))
    }
  }

  return debugInfo
}