import Link from 'next/link'
import React from 'react'

const NavItems = () => {
  return (
    <div className='justify-center'>
      <nav className='flex items-start gap-6 font-bold'>
        <Link href={'/'}>Home</Link>
        <Link href={'/about'}>About</Link>
        <Link href={'/service'}>Service</Link>
        <Link href={'/invest-now'}>Invest Now</Link>
        <Link href={'/my-account'}>My Account</Link>
      </nav>
    </div>
  )
}

export default NavItems
