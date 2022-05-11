import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { sanityClient, urlFor } from '../libs/sanity'
import { TPostWithNoBody } from '../libs/ts'

import CustomNextImage from '../components/common/dependent/CustomNextImage'
import Header from '../components/core/Header'
interface IProps {
  posts: TPostWithNoBody[]
}

const HomePage: NextPage<IProps> = ({ posts }) => {
  console.log('posts', posts)

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Medium 2 Blog</title>
      </Head>

      <Header />
      <main className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-0">
          <div className="space-y-5 px-10">
            <h1 className="max-w-xl font-serif text-6xl">
              <span className="underline decoration-black decoration-4">
                Medium
              </span>{' '}
              is a place to write, read, and connect
            </h1>
            <h2>
              It's easy and free to post what your thinking on any topic and
              connect with millions of readers
            </h2>
          </div>
          <Image
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            width={800}
            height={800}
          />
        </div>

        <section className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/posts/${post.slug.current}`}>
              <article className="group cursor-pointer overflow-hidden rounded-lg border">
                <CustomNextImage
                  className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={urlFor(post.mainImage).url()!}
                  alt={post.mainImageAlt}
                />
                <div className="flex justify-between bg-white p-5">
                  <div
                    style={{
                      width: 'calc(100% - 3rem)',
                    }}
                  >
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">{post.description}</p>
                  </div>

                  <CustomNextImage
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt={`${post.author.name} profile picture`}
                  />
                </div>
              </article>
            </Link>
          ))}
        </section>
      </main>
    </>
  )
}

export default HomePage

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    description,
    mainImageAlt,
    mainImage,
    publishedAt,
    // body,
    // 'comments': *[
    //   _type == 'comment' &&
    //   post.ref == ^._id &&
    //   approved == true
    // ]
    author -> {
      _id,
      name,
      image
    }
  }`

  const posts: TPostWithNoBody[] = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
