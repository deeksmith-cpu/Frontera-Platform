'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { useUser, useOrganization } from '@clerk/nextjs'

function PostHogUserIdentifier() {
  const { user, isSignedIn } = useUser()
  const { organization } = useOrganization()
  const posthogClient = usePostHog()

  useEffect(() => {
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
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <PostHogUserIdentifier />
      {children}
    </PHProvider>
  )
}
