'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function CheckUsername() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const ran = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || ran.current) return
    ran.current = true
    ;(async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' })
        if (!res.ok) return // silent fail
        const data = await res.json()

        const username: string | null = data?.username ?? null
        const needsUsername = !username || username.startsWith('user_') // treat fallback as temporary

        if (needsUsername) router.push('/choose-username')
      } catch {
        // ignore
      }
    })()
  }, [isLoaded, isSignedIn, router])

  return null
}
