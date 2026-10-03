import { renderBrandIcon } from '@/lib/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Ana ekran ikonu: Logo'nun işareti, signature marka degradesi. */
export default function AppleIcon() {
  return renderBrandIcon(size.width)
}
