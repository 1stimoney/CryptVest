'use client'

import { Bitcoin, Handshake, Landmark } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const About = () => {
  const router = useRouter()
  return (
    <div className='flex justify-between h-[80vh]'>
      <div className='w-1/2 justify-center items-center pl-24'>
        <Image
          src={'/about.webp'}
          alt='about'
          width={500}
          height={500}
          className='w-[80vh] h-[60vh] border rounded-md'
        />
      </div>

      <div className='w-1/2 items-start mt-28'>
        <h1 className='text-3xl font-bold pb-8'>
          Invest with CryptVest for high returns and expert advice on
          cryptocurrency investments.
        </h1>
        <p className='text-[18px] font-serif pb-6'>
          At CryptVest, we offer trusted brokerage services and help clients
          achieve their financial goals through cryptocurrency investments.
        </p>

        <div className='flex items-center gap-6 pb-4'>
          <div>
            <Landmark size={20} />
          </div>
          <div>
            <span className='semi-bold'>High Return on Investment</span>
          </div>
        </div>

        <div className='flex items-center gap-6 pb-4'>
          <div>
            <Handshake size={20} />
          </div>
          <div>
            <span className='semi-bold'>Trusted Brokerage Services</span>
          </div>
        </div>

        <div className='flex items-center gap-6 pb-4'>
          <div>
            <Bitcoin size={20} />
          </div>
          <div>
            <span className='semi-bold'>Expert Advice on Cryptocurrency</span>
          </div>
        </div>
        <Button
          size={'lg'}
          onClick={() => router.push('/about')}
          className='mt-4 font-bold'
        >
          Learn More
        </Button>
      </div>
    </div>
  )
}

export default About
