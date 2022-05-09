import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="mx-auto flex w-full max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <a>
            <Image
              width={200}
              height={28}
              // layout="fill"
              priority
              src="/Medium2Logo.png"
              alt="Website Logo"
              className="w-44 cursor-pointer object-cover"
            />
          </a>
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-4 py-1 text-white">
            follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border-green-600 px-4 py-1">Get Started</h3>
      </div>
    </header>
  )
}

export default Header
