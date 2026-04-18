import type { BlogPost } from '../types'

import forceDirected from './force-directed-karakter-grafi-cizmek'
import socketIo from './socket-io-ile-oda-tabanli-multiplayer'
import neonDrizzle from './neon-drizzle-serverless-db-katmani'
import bsp from './bsp-ile-prosedurel-zindan-uretmek'
import framerMotion from './framer-motion-sayfa-gecis-animasyonlari'
import typescript from './typescript-ile-daha-iyi-react-bilesenleri'
import tailwind from './tailwindcss-dark-tema-tasarimi'
import firebase from './firebase-realtime-chat-uygulamasi'

export const blogPosts: BlogPost[] = [
  forceDirected,
  socketIo,
  neonDrizzle,
  bsp,
  framerMotion,
  typescript,
  tailwind,
  firebase,
]
