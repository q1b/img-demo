import { $, component$ } from '@builder.io/qwik';
import {
  Image,
  type ImageTransformerProps,
  useImageProvider,
} from 'qwik-image';
import { parse, generate } from './helper';

export default component$((props: {
  width:number;
  height:number;
  src:string;
  layout?: 'fixed' | 'fullWidth' | 'constrained';
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down" | "inherit" | "initial"
  alt?:string
}) => {
  const imageTransformer$ = $(
    ({ src, width, height }: ImageTransformerProps): string => {
      // Here is not one-to-one url yet, something similar
      // <!-- https://res.cloudinary.com/dj26aw1kl/image/upload/v1698478457/h_300,w_300/src.jpg -->
      const cloudName = "dj26aw1kl"
      const version = "v1698478457"
      const cdnurl = `https://res.cloudinary.com/${cloudName}/image/upload/${version}/${src}`;
      const parsed = parse(cdnurl);
      return generate({
        ...parsed,
        width,
        height: height || 400,
        transformations: {
          // q: 'auto'
        }
      })
    }
  );

  // Global Provider (required)
  useImageProvider({
    // You can set this prop to overwrite default values [3840, 1920, 1280, 960, 640]
    resolutions: [640],
    imageTransformer$,
  });
  return (
    <Image
      layout={props.layout || 'fixed'}
      objectFit={props.objectFit || 'fill'}
      width={props.width}
      height={props.height}
      alt={props.alt || 'paradise'}
      placeholder="#e6e6e6"
      src={props.src || 'f38ifyhnrwwy6489aboe'}
    />
  );
});