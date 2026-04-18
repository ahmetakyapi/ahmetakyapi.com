import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'firebase-realtime-chat-uygulamasi',
    tag: 'Architecture',
    tagColor: '#f59e0b',
    title: 'Firebase ile Realtime Chat Uygulaması',
    excerpt:
      'React ve Firebase Realtime Database kullanarak anlık mesajlaşma uygulaması geliştirme — auth, listeners ve optimize render.',
    date: '2023-12-05',
    readTime: '10 dk',
    coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    content: [
      { type: 'p', text: 'Firebase Realtime Database, WebSocket\'i yönetmeye gerek kalmadan anlık veri senkronizasyonu sağlar. Bu yazıda React ile sıfırdan çalışan bir chat uygulaması kuruyoruz — auth, mesaj akışı ve performans optimizasyonuyla.' },
      { type: 'h2', text: 'Proje Yapısı ve Firebase Kurulumu' },
      { type: 'code', lang: 'bash', text: `npm create vite@latest chat-app -- --template react-ts
cd chat-app
npm install firebase` },
      { type: 'code', lang: 'ts', text: `// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const app = initializeApp({
  apiKey:            process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  databaseURL:       process.env.NEXT_PUBLIC_FB_DB_URL,
  projectId:         process.env.NEXT_PUBLIC_FB_PROJECT_ID,
})

export const auth = getAuth(app)
export const db   = getDatabase(app)` },
      { type: 'h2', text: 'Anonim Auth ile Hızlı Başlangıç' },
      { type: 'code', lang: 'tsx', text: `import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

function useAuth() {
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid)
      else signInAnonymously(auth)
    })
    return unsub
  }, [])

  return uid
}` },
      { type: 'h2', text: 'Mesajları Dinlemek ve Göndermek' },
      { type: 'code', lang: 'tsx', text: `import { ref, push, onValue, query, limitToLast } from 'firebase/database'
import { db } from '@/lib/firebase'

interface Message {
  uid: string; text: string; timestamp: number
}

function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const q = query(ref(db, \`rooms/\${roomId}/messages\`), limitToLast(50))
    const unsub = onValue(q, (snap) => {
      const data = snap.val() ?? {}
      setMessages(Object.values(data))
    })
    return unsub
  }, [roomId])

  return messages
}

async function sendMessage(roomId: string, uid: string, text: string) {
  await push(ref(db, \`rooms/\${roomId}/messages\`), {
    uid, text, timestamp: Date.now(),
  })
}` },
      { type: 'callout', variant: 'warning', text: 'limitToLast(50) olmadan oda büyüdükçe tüm mesaj geçmişini her bağlantıda indirirsiniz. Büyük uygulamalar için cursor tabanlı pagination kurun.' },
      { type: 'h2', text: 'Re-render Optimizasyonu' },
      { type: 'p', text: 'Her mesaj geldiğinde tüm listeyi yeniden render etmemek için React.memo ve sabit referanslar kullanın.' },
      { type: 'code', lang: 'tsx', text: `const MessageItem = React.memo(({ msg }: { msg: Message }) => (
  <div className="flex gap-2 p-2">
    <span className="font-mono text-xs text-indigo-400">{msg.uid.slice(0,6)}</span>
    <p>{msg.text}</p>
  </div>
))
MessageItem.displayName = 'MessageItem'

// Liste:
<div ref={bottomRef}>
  {messages.map((m) => (
    <MessageItem key={m.timestamp} msg={m} />
  ))}
</div>` },
      { type: 'h2', text: 'Otomatik Scroll' },
      { type: 'code', lang: 'tsx', text: `const bottomRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])` },
      { type: 'callout', variant: 'tip', text: 'Kullanıcı yukarı scroll etmişse otomatik aşağı kaydırma can sıkıcı olur. Intersection Observer ile "en altta mı?" kontrolü yapın ve sadece öyleyse scroll edin.' },
    ],
  }

export default post
