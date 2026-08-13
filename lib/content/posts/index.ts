import type { BlogPost } from '../types'

import acilisZili from './acilis-zili-nasil-yapildi'
import spoilerWiki from './spoiler-vermeyen-wiki'
import socketIo from './socket-io-ile-oda-tabanli-multiplayer'
import mimio from './bilmedigim-meslege-arac-yazmak'
import bsp from './bsp-ile-prosedurel-zindan-uretmek'
import olculenHiz from './olculen-hiz-hissedilen-hiz'
import typescript from './typescript-ile-daha-iyi-react-bilesenleri'
import tailwind from './tailwindcss-dark-tema-tasarimi'
import firebase from './firebase-realtime-chat-uygulamasi'

/** Sıra ekranda da geçerli: ilk yazı blog sayfasında öne çıkan karta düşer. */
export const blogPosts: BlogPost[] = [
  acilisZili,
  spoilerWiki,
  socketIo,
  mimio,
  bsp,
  olculenHiz,
  typescript,
  tailwind,
  firebase,
]
