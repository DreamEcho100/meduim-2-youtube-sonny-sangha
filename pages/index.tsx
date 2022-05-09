import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/core/Header'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Medium 2 Blog</title>
      </Head>

      <Header />
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1>This Medium 2.0</h1>
      </main>
    </div>
  )
}

export default Home
