interface ISanityImage {
  asset: {
    _ref: string
    _type: string
  }
  _type: string
}

export interface IPost {
  author: {
    image: ISanityImage
    name: string
    _id: string
  }
  body: {
    children: {
      marks: string[]
      text: string
      _key: string
      _type: string
    }[]
    markDefs: string[]
    style: string
    _key: string
    _type: string
  }[]
  description: string
  mainImageAlt: string
  mainImage: ISanityImage
  publishedAt: null
  slug: {
    current: string
    _type: string
  }
  title: string
  _id: string
  createdAt: string
  // _id: string
  // title: string
  // slug: string
  // description: string
  // mainImage: string
  // publishedAt: string
  // body: string
  // author: {
  //   _id: string
  //   name: string
  //   image: string
  // }
}

export type TPostWithNoBody = Omit<IPost, 'body'>

export type TPosts = IPost[]
