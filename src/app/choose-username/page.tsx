/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ChooseUsernamePage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) router.replace('/sign-in')
  }, [isLoaded, isSignedIn, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/set-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to set username')
      }

      router.push('/') // success
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm'
      >
        <h1 className='text-2xl font-semibold'>Choose a username</h1>
        <p className='text-sm text-muted-foreground'>
          Use 3–20 letters, numbers, or underscore.
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full rounded-md border px-3 py-2 outline-none'
          placeholder='e.g. sheriff_dev'
          required
        />

        {error && <p className='text-sm text-red-600'>{error}</p>}

        <button
          type='submit'
          disabled={saving}
          className='rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-60'
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
