import Image from 'next/image'
import { ImageProps } from 'next/dist/client/image.d'

import classes from './index.module.css'

interface ICustomNextImageProps extends ImageProps {
  className?: string
  placeholder?: 'blur' | 'empty'
  role?: string
  wrapperProps?: { [key: string]: any }
}

const CustomNextImage = ({
  className = '',
  unoptimized = true,
  layout = 'fill',
  src,
  alt = '',
  placeholder = 'empty',
  blurDataURL,
  wrapperProps = {},
  ...props
}: ICustomNextImageProps) => {
  const cWrapperProps = {
    className: `${className} ${classes['img-container']} ${classes['layout-fill']}`,
    ...wrapperProps,
  }
  const handleImageProps = () => {
    const imageProps: Omit<ICustomNextImageProps, 'wrapperProps'> = {
      unoptimized,
      layout,
      src,
      placeholder,
      ...props,
    }

    if (placeholder !== 'empty') {
      if (blurDataURL) imageProps.blurDataURL = blurDataURL
      else if (src && typeof src === 'string') imageProps.blurDataURL = src
    }

    return imageProps
  }

  return (
    <span
      style={{
        display: 'block',
      }}
      {...cWrapperProps}
    >
      <Image alt={alt} {...handleImageProps()} />
    </span>
  )
}

export default CustomNextImage
