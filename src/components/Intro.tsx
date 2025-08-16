'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

const Intro = () => {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  return (
    <div className='flex justify-between items-stretch mt-28 h-[90vh]'>
      <div className='w-1/3 items-start pl-12 pt-10'>
        <h1 className='text-5xl font-extrabold'>
          Invest In Cryptocurrency And Secure Your Future
        </h1>

        <p className='mt-10 text-[16px] font-semibold font-serif'>
          CryptVest is your trusted partner for cryptocurrency investment. We
          help clients maximize their returns through our guidance and tailored
          investment packages
        </p>

        <div className='flex gap-4 mt-10 justify-start items-center'>
          <Button
            variant='outline'
            size={'lg'}
            onClick={() => router.push('/about')}
          >
            Learn More
          </Button>
          {isLoaded && !isSignedIn && (
            <Button size={'lg'} onClick={() => router.push('/sign-in')}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      <div className='w-1/2'></div>
    </div>
  )
}

export default Intro
