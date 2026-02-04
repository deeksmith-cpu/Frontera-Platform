'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { useUser, useOrganization } from '@clerk/nextjs'

function PostHogUserIdentifier() {
  const { user, isSignedIn } = useUser()
  const { organization } = useOrganization()
  const posthogClient = usePostHog()

  useEffect(() => {
    // Only run if PostHog is loaded
    if (!(posthog as unknown as { __loaded?: boolean }).__loaded) return

    if (isSignedIn && user) {
      // Identify user in PostHog
      posthogClient.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
      })

      // Set organization as group if available
      if (organization) {
        posthogClient.group('organization', organization.id, {
          name: organization.name,
          slug: organization.slug,
        })
      }
    } else {
      // Reset identification when signed out
      posthogClient.reset()
    }
  }, [isSignedIn, user, organization, posthogClient])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    // Only initialize once, after component mounts (non-blocking)
    if (initialized.current) return
    initialized.current = true

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

    if (key && !(posthog as unknown as { __loaded?: boolean }).__loaded) {
      posthog.init(key, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: false,
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: { password: true },
        },
      })
    }

    // Register service worker (non-blocking)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed silently
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      <PostHogUserIdentifier />
      {children}
    </PHProvider>
  )
}
