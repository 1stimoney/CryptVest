'use client'

import React from 'react'
import Container from './Container'
import { useRouter } from 'next/navigation'
import { ModeToggle } from './theme-toggle'
import NavItems from './NavItems'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

const Navbar = () => {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <div className='sticky top-0 border border-b-primary/10 bg-secondary'>
      <Container>
        <div className='flex justify-between items-center'>
          <div
            className='flex items-center gap-1 cursor-pointer'
            onClick={() => router.push('/')}
          >
            <div className='font-bold text-xl'>CryptVest</div>
          </div>

          <div>
            <NavItems />
          </div>

          <div className='flex gap-3 items-center'>
            <div>
              <ModeToggle />
            </div>
            <UserButton afterSignOutUrl='/' />
            {isLoaded && !isSignedIn && (
              <>
                <Button
                  onClick={() => router.push('/sign-in')}
                  variant={'outline'}
                  size={'sm'}
                >
                  Sign In
                </Button>
                <Button onClick={() => router.push('/sign-up')} size={'sm'}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Navbar
