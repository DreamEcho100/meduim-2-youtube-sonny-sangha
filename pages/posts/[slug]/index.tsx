import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Refractor from 'react-refractor'

import js from 'refractor/lang/javascript'
import sql from 'refractor/lang/sql'
import csharp from 'refractor/lang/csharp'

Refractor.registerLanguage(js)
Refractor.registerLanguage(sql)
Refractor.registerLanguage(csharp)
// import PortableText from 'react-portable-text'
import { PortableText } from '@portabletext/react'
import CustomNextImage from '../../../components/common/dependent/CustomNextImage'
import Header from '../../../components/core/Header'
import { getImageDimensions } from '@sanity/asset-utils'
import {
  sanityClient,
  urlFor,
  // urlFor
} from '../../../libs/sanity'
import { IPost } from '../../../libs/ts'
import { AnchorHTMLAttributes } from 'react'

// https://www.sanity.io/docs/portable-text-to-react
// https://www.sanity.io/plugins/code-input
// https://github.com/react-syntax-highlighter/react-syntax-highlighter

interface Props {
  post: IPost
}

const Post: NextPage<Props> = ({ post }) => {
  return (
    <>
      <Header />
      {post && (
        <main>
          <CustomNextImage
            className="mx-auto h-60 w-full max-w-screen-2xl object-cover md:h-72 lg:h-96"
            src={urlFor(post.mainImage).url()}
            alt={post.mainImageAlt}
            priority
          />

          <article className="mx-auto flex max-w-3xl flex-col p-5">
            <h1 className="mt-1 mb-3 text-3xl">{post.title}</h1>
            <h2 className="mb-2 text-xl font-light text-gray-500">
              {post.description}
            </h2>

            <div className="flex items-center space-x-2">
              <CustomNextImage
                className="h-10 w-10 rounded-full"
                src={urlFor(post.author.image).url()}
                alt={`${post.author.name} profile picture`}
              />
              <p className=" text-sm font-extralight">
                Blog post by{' '}
                <span className="text-green-600">{post.author.name}</span> -
                Published at {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col">
              <PortableText
                value={post.body} // className="flex flex-col"
                // dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                // projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                // content={post.body}
                // serializers={PortableTextSerializers}
                components={{
                  types: {
                    image: ({ value }) => {
                      const src = urlFor(value).url()
                      const { width, height, aspectRatio } =
                        getImageDimensions(src)

                      return (
                        <CustomNextImage
                          src={src}
                          alt={value.alt || ' '}
                          loading="lazy"
                          wrapperProps={{
                            style: {
                              // Display alongside text if image appears inside a block text span
                              // display: isInline ? 'inline-block' : 'block',
                              maxWidth: width / 10 + 'rem',
                              maxHeight: height / 10 + 'rem',
                              width: '100%',
                              height: '100%',
                              // Avoid jumping around with aspect-ratio CSS property
                              aspectRatio,
                              margin: '0 auto',
                            },
                          }}
                        />
                      )
                    },

                    code: ({ value, isInline }) => {
                      if (isInline)
                        return (
                          <pre
                          // data-language={props.node.language}
                          >
                            <code>{JSON.stringify(value.code, null, 2)}</code>
                          </pre>
                        )

                      return (
                        <Refractor
                          // In this example, `props` is the value of a `code` field
                          language={value?.language || ''}
                          value={value.code}
                          markers={value?.highlightedLines}
                          className="codeBlock"
                        />
                      )
                    },
                  },
                  block: {
                    h1: ({ children }) => (
                      <h1 className="my-5 text-7xl font-bold">{children} </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="my-5 text-5xl font-bold">{children} </h2>
                    ),
                    h3: ({ children }) => (
                      <h2 className="my-5 text-4xl font-bold">{children} </h2>
                    ),
                    h4: ({ children }) => (
                      <h2 className="my-4 text-3xl font-bold">{children} </h2>
                    ),
                    h5: ({ children }) => (
                      <h2 className="my-3 text-2xl font-bold">{children} </h2>
                    ),
                    h6: ({ children }) => (
                      <h2 className="my-2 text-xl font-bold">{children} </h2>
                    ),
                  },
                  list: {
                    // Ex. 1: customizing common list types
                    bullet: ({ children }) => (
                      <ul className="m-5 list-disc">{children}</ul>
                    ),
                    number: ({ children }) => (
                      <ol className="m-5 list-decimal">{children}</ol>
                    ),

                    // // Ex. 2: rendering custom lists
                    // checkmarks: ({children}) => <ol className="m-auto text-lg">{children}</ol>,
                  },
                  marks: {
                    link: ({ children, value }: any) => {
                      const anchorAttributes: AnchorHTMLAttributes<HTMLAnchorElement> =
                        {
                          href: value.href,
                          className: 'text-blue-500 hover:underline',
                        }

                      if (!value.href.startsWith('/'))
                        anchorAttributes.rel = 'noreferrer noopener'
                      if (anchorAttributes.rel)
                        anchorAttributes.target = '_blank'

                      return <a {...anchorAttributes}>{children}</a>
                    },
                  },
                }}
              />
            </div>
          </article>
        </main>
      )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug
  }`

  const posts: {
    _id: IPost['_id']
    slug: IPost['slug']
  }[] = await sanityClient.fetch(query)

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    mainImageAlt,
    mainImage,
    publishedAt,
    body,
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

  const post: IPost = await sanityClient.fetch(query, {
    slug: params!.slug,
  })

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}

export default Post
