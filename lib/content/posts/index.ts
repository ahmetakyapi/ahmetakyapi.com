import { typeset } from '@/lib/typeset'
import type { BlogPost } from '../types'

import acilisZili from './acilis-zili-nasil-yapildi'
import acilisZiliYuzde from './acilis-zili-ucretsiz-veri-guvenilir-ekran'
import spoilerWiki from './spoiler-vermeyen-wiki'
import socketIo from './socket-io-ile-oda-tabanli-multiplayer'
import mimio from './bilmedigim-meslege-arac-yazmak'
import bsp from './bsp-ile-prosedurel-zindan-uretmek'
import olculenHiz from './olculen-hiz-hissedilen-hiz'
import typescript from './typescript-ile-daha-iyi-react-bilesenleri'
import tailwind from './tailwindcss-dark-tema-tasarimi'
import firebase from './firebase-realtime-chat-uygulamasi'

/**
 * Yazılar YENİDEN ESKİYE, tarihe göre. Sıra eskiden bu dizinin elle
 * yazılmış sırasıydı ve tarihle tutarsızdı; ana sayfa ile /blog farklı
 * "son yazılar" gösteriyordu. Artık tek kaynak bu sıralama.
 *
 * Başlık ve özet gövdeyle aynı tipografiden geçer (lib/typeset.ts):
 * gövdede "Spoiler’a" tipografik kesmeyle yazılırken başlıkta, kartta,
 * RSS'te ve OG görselinde düz kesmeyle duruyordu. Metin dosyaları
 * değişmez, dönüşüm burada bir kez yapılır.
 */
export const blogPosts: BlogPost[] = [
  acilisZiliYuzde,
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
  .map((post) => ({ ...post, title: typeset(post.title), excerpt: typeset(post.excerpt) }))
  .sort((a, b) => b.date.localeCompare(a.date))
