import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'socket-io-ile-oda-tabanli-multiplayer',
    tag: 'Realtime',
    tagColor: '#22d3ee',
    title: 'Socket.IO ile Oda Tabanlı Bir Multiplayer Oyunu Kurmak',
    excerpt:
      'Karalama\'yı yazarken oda sistemi, state senkronu ve disconnect yönetimi üstüne kafa yorduğum notlar. Teoriden çok sahada öğrendiklerim.',
    date: '2026-04-10',
    readTime: '9 dk',
    coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
    content: [
      { type: 'p', text: 'Karalama\'yı yazmaya başlarken planım basitti: oda aç, link paylaş, çizime başla. Kağıt üstünde beş satır. Gerçek şu ki multiplayer yazarken hiçbir şey beş satır değil; ilk büyük kararım state\'in nerede duracağıydı ve onu yanlış verip geri adım atarak öğrendim.' },
      { type: 'p', text: 'Bu yazı bir Socket.IO öğrenme rehberi değil. Başlayan biri için tökezlediğim noktaları işaretleyen bir harita.' },
      { type: 'h2', text: 'Neden Oda Tabanlı Mimari' },
      { type: 'p', text: 'İlk refleksim her oyunu tek bir "games" objesinde tutmaktı. Server\'da bir Map, client\'ta Zustand store. Birkaç oda açıkken iyi görünüyor. Oda sayısı artınca her event herkese gidiyor, bir oyuncu yanlış odanın tahminini görüyor. Socket.IO rooms zaten bu sorun için var; ben önce kötü bir broadcast filtresi yazıp sonra doğru yolu bulanlardanım.' },
      { type: 'code', lang: 'ts', text: `// server/rooms.ts
import type { Server, Socket } from 'socket.io'

interface RoomState {
  id: string
  players: Map<string, Player>   // socket.id -> Player
  drawer: string | null
  word: string | null
  round: number
  status: 'lobby' | 'drawing' | 'reveal'
}

const rooms = new Map<string, RoomState>()

export function joinRoom(io: Server, socket: Socket, roomId: string, name: string) {
  let room = rooms.get(roomId)
  if (!room) {
    room = { id: roomId, players: new Map(), drawer: null, word: null, round: 0, status: 'lobby' }
    rooms.set(roomId, room)
  }
  room.players.set(socket.id, { id: socket.id, name, score: 0 })
  socket.join(roomId)                                // <-- kritik nokta
  socket.data.roomId = roomId                        // reverse lookup için
  io.to(roomId).emit('room:update', snapshot(room))  // sadece bu odaya
}` },
      { type: 'callout', variant: 'tip', text: 'socket.data objesi beklediğimden çok faydalı çıktı. Disconnect olurken socket\'i hangi odadan çıkaracağımı aramak yerine socket.data.roomId üstünden temizliyorum.' },
      { type: 'h2', text: 'State\'i Kim Tutar: Sunucu mu, Client mı' },
      { type: 'p', text: 'İlk versiyonda her client kendi state\'ini tutuyor, server sadece mesaj iletiyordu. Sorun şu: iki kişi aynı anda "doğru tahmin" sinyali gönderdiğinde puanlar uyuşmuyor. Sonra her şeyi server\'a taşıdım. Client sadece render eder, server tek doğruluk kaynağıdır.' },
      { type: 'p', text: 'Multiplayer\'da en önemli kararlardan biri bu. Çünkü hile açığını, yarış koşullarını ve bağlantı kopunca ne olacağını hep bu belirliyor.' },
      { type: 'code', lang: 'ts', text: `// Yanlış: client skorunu kendi günceller
socket.on('guess:correct', () => {
  set((s) => ({ score: s.score + 10 }))     // her client kendi kafasına
})

// Doğru: server hesaplar, broadcast eder
// client sadece dinler
socket.on('score:update', ({ playerId, score }) => {
  set((s) => ({
    players: s.players.map(p => p.id === playerId ? { ...p, score } : p),
  }))
})` },
      { type: 'h2', text: 'Disconnect En Acı Kısmı' },
      { type: 'p', text: '"Drawer oyunun ortasında bağlantısını kaybederse ne olur" sorusunu önceden yanıtlamazsanız üretimde bir yerde karşınıza çıkar. Benim cevabım: çizen kişi düşerse round iptal edilir, sıra bir sonraki oyuncuya geçer. Yeni oyuncu eklenmesi round sayacını değiştirmez.' },
      { type: 'code', lang: 'ts', text: `io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const roomId = socket.data.roomId
    if (!roomId) return

    const room = rooms.get(roomId)
    if (!room) return

    room.players.delete(socket.id)

    // Oda boşaldıysa tamamen sil
    if (room.players.size === 0) {
      rooms.delete(roomId)
      return
    }

    // Drawer düştüyse round'u bitir
    if (room.drawer === socket.id) {
      endRound(io, room, { reason: 'drawer_left' })
    } else {
      io.to(roomId).emit('room:update', snapshot(room))
    }
  })
})` },
      { type: 'callout', variant: 'warning', text: 'Geçici disconnect\'ler için bir grace period eklemek iyi fikir. Kullanıcı 5 saniye içinde geri bağlanırsa oyundan atmayın; mobilde ağ kopmaları beklediğinizden sık oluyor.' },
      { type: 'h2', text: 'Çizim Event\'lerini Boğmamak' },
      { type: 'p', text: 'Her pointermove event\'ini server\'a göndermek zor değil, ama saniyede 60-120 event\'e çıkıyor. Server üstünden 8 kişiye broadcast edince bir kişinin çizimi 800+ mesaja dönüyor. Throttle olmadan hızla pingler yükseliyor.' },
      { type: 'code', lang: 'ts', text: `// client/draw.ts
let buffer: Point[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function onPointerMove(p: Point) {
  buffer.push(p)
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    socket.emit('draw:segment', buffer)
    buffer = []
    flushTimer = null
  }, 40)                                   // ~25fps, yumuşak hissediyor
}` },
      { type: 'p', text: 'Server gelen segmenti broadcast etmeden önce saklıyor; sonradan katılan oyuncu o ana kadarki tuvali replay olarak alıyor.' },
      { type: 'h2', text: 'Monorepo ile Ortak Tipler' },
      { type: 'p', text: 'Client ve server ayrı deploy ediliyor ama event şemaları ortak. İki tarafta aynı interface\'i ayrı yazmak tutarsızlık kaynağı. npm workspaces ile paylaşılan bir paket açtım.' },
      { type: 'code', lang: 'ts', text: `// packages/shared/src/events.ts
export interface ServerToClientEvents {
  'room:update':  (state: RoomSnapshot) => void
  'round:start':  (payload: { drawerId: string; roundEndsAt: number }) => void
  'draw:segment': (points: Point[]) => void
  'score:update': (payload: { playerId: string; score: number }) => void
}

export interface ClientToServerEvents {
  'room:join':    (payload: { roomId: string; name: string }) => void
  'guess:submit': (text: string) => void
  'draw:segment': (points: Point[]) => void
}` },
      { type: 'code', lang: 'ts', text: `// Her iki tarafta:
import type { Server } from 'socket.io'
import type { ServerToClientEvents, ClientToServerEvents } from '@karalama/shared'

const io = new Server<ClientToServerEvents, ServerToClientEvents>()` },
      { type: 'callout', variant: 'tip', text: 'Tipli Socket.IO fark yaratır. Event adını yanlış yazdığınızda derleme anında yakalarsınız; production\'da debug etmekten çok iyidir.' },
      { type: 'h2', text: 'Kapanış' },
      { type: 'p', text: 'Socket.IO\'nun kendisi 20 dakikalık bir okumayla anlaşılıyor. Zor olan protokolün söz vermediklerini tasarlamak: bağlantının kopabileceği, mesajların sırayı kaybedebileceği, iki kullanıcının aynı anda aynı şeyi iddia edebileceği bir dünya.' },
      { type: 'p', text: 'Karalama\'nın kodu açık; özellikle round lifecycle kısmı, burada yazdıklarımın uygulamadaki halidir.' },
    ],
  }

export default post
