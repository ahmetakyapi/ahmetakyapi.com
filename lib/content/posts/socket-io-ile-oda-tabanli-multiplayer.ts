import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'socket-io-ile-oda-tabanli-multiplayer',
  tag: 'Realtime',
  tagColor: '#22d3ee',
  title: 'Karalama: Multiplayer Çizim Oyunu Kurmak',
  excerpt:
    'Oda mantığı, sunucu tarafı kontrolü ve bağlantı kopmaları gibi konularda çok oyunculu bir oyunu ayakta tutan kararların kısa ama gerçekçi özeti.',
  date: '2026-04-10',
  readTime: '9 dk',
  coverGradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #6366f1 100%)',
  content: [
    {
      type: 'p',
      text: 'Karalama’yı yazarken her şey kâğıt üstünde kolay görünüyordu: oda aç, linki paylaş, biri çizsin diğerleri bilsin. Ama çok oyunculu tarafta asıl zorluk çizim değil, düzeni korumak. İlk bağlantı kopunca ya da iki kişi aynı anda bir şey yapınca her şeyin ne kadar hızlı karışabildiğini görüyorsun.',
    },
    {
      type: 'p',
      text: 'Bu yazı Socket.IO ders notu değil. Daha çok, gerçek kullanımda hangi kararların dönüp sorun çıkardığını ve hangilerinin sistemi sakin tuttuğunu toparlayan kısa bir deneyim özeti.',
    },
    { type: 'h2', text: 'Neden Oda Mantığı Kullandım?' },
    {
      type: 'p',
      text: 'İlk fikir, bütün oyunu tek büyük state içinde toplamak oldu. Ama birkaç oda aynı anda açılınca event’lerin yanlış oyunculara gitmesi çok kolaylaşıyor. Socket.IO rooms yapısı zaten bu iş için var. O yüzden odaları baştan temel bir kavram olarak ele almak daha temiz oldu.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `const rooms = new Map<string, RoomState>()

export function joinRoom(io: Server, socket: Socket, roomId: string, name: string) {
  let room = rooms.get(roomId)
  if (!room) {
    room = { id: roomId, players: new Map(), drawer: null, word: null, round: 0, status: 'lobby' }
    rooms.set(roomId, room)
  }
  room.players.set(socket.id, { id: socket.id, name, score: 0 })
  socket.join(roomId)
  socket.data.roomId = roomId
  io.to(roomId).emit('room:update', snapshot(room))
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: '`socket.data` burada çok hayat kurtarıyor. Bağlantı kopunca oyuncunun hangi odada olduğunu tekrar aramak zorunda kalmıyorsun.',
    },
    { type: 'h2', text: 'State Kimin Elinde?' },
    {
      type: 'p',
      text: 'Çok oyunculu oyunda en kritik kararlardan biri bu. Client kendi skorunu kendi artırıyorsa bir yerde mutlaka tutarsızlık çıkıyor. Benim için doğru yol şuydu: client gösterir, server karar verir. Özellikle puan, round ve kelime gibi şeylerde bu yaklaşım daha güvenli.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `socket.on('score:update', ({ playerId, score }) => {
  set((s) => ({
    players: s.players.map(p => p.id === playerId ? { ...p, score } : p),
  }))
})`,
    },
    { type: 'h2', text: 'Bağlantı Kopunca Ne Olacak?' },
    {
      type: 'p',
      text: 'Çizen kişi tam turun ortasında oyundan düşerse ne olacağına önceden karar vermezsen sistem askıda kalıyor. Ben burada round’u iptal edip sırayı bir sonraki oyuncuya vermeyi seçtim. Küçük kural gibi görünse de oyunun güven duygusunu doğrudan etkiliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `socket.on('disconnect', () => {
  const roomId = socket.data.roomId
  if (!roomId) return

  const room = rooms.get(roomId)
  if (!room) return

  room.players.delete(socket.id)

  if (room.players.size === 0) {
    rooms.delete(roomId)
    return
  }

  if (room.drawer === socket.id) {
    endRound(io, room, { reason: 'drawer_left' })
  } else {
    io.to(roomId).emit('room:update', snapshot(room))
  }
})`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Kısa süreli kopmalar için küçük bir tolerans süresi vermek iyi fikir. Mobilde ağ geçişleri masaüstüne göre daha sık yaşanıyor.',
    },
    { type: 'h2', text: 'Çizim Olaylarını Yığmamak' },
    {
      type: 'p',
      text: 'Her fare hareketini sunucuya göndermek kolay ama gürültülü. Çizimi küçük paketler halinde toplamak hem ağ yükünü azaltıyor hem de beklediğimden daha pürüzsüz bir his veriyor. Burada amaç en yüksek sayı değil, düzgün akan bir deneyim.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `let buffer: Point[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function onPointerMove(p: Point) {
  buffer.push(p)
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    socket.emit('draw:segment', buffer)
    buffer = []
    flushTimer = null
  }, 40)
}`,
    },
    { type: 'h2', text: 'Ortak Tiplerin Rahatlığı' },
    {
      type: 'p',
      text: 'Client ve server ayrı yerlerde duruyor olsa da event tanımlarını tek yerden beslemek ciddi rahatlık sağlıyor. Aynı event adını iki dosyada elle yazmak başta hızlı, sonra yorucu hale geliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `export interface ServerToClientEvents {
  'room:update':  (state: RoomSnapshot) => void
  'round:start':  (payload: { drawerId: string; roundEndsAt: number }) => void
  'draw:segment': (points: Point[]) => void
  'score:update': (payload: { playerId: string; score: number }) => void
}`,
    },
  ],
}

export default post
