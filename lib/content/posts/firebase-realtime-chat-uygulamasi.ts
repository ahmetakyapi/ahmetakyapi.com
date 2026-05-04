import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'firebase-realtime-chat-uygulamasi',
  tag: 'Architecture',
  tagColor: '#f59e0b',
  title: 'Firebase ile Realtime Chat Uygulaması',
  excerpt:
    'React ve Firebase Realtime Database ile anlık çalışan bir sohbet ekranı kurarken işime yarayan sade yöntemler: giriş, mesaj akışı ve performans tarafındaki kritik detaylar.',
  date: '2023-12-05',
  readTime: '10 dk',
  coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  content: [
    {
      type: 'p',
      text: 'Canlı çalışan bir chat uygulamasında ilk dikkat çeken şey, mesajın anında ekrana düşmesidir. Ama işin zor kısmı orada başlamıyor. Kullanıcıyı içeri almak, mesajları düzenli biçimde toplamak ve mesaj sayısı arttıkça ekranın hantallaşmamasını sağlamak asıl mesele.',
    },
    {
      type: 'p',
      text: 'Firebase Realtime Database bu iş için hızlı bir başlangıç veriyor. WebSocket ayrıntısıyla tek tek uğraşmadan çalışan bir yapı kurabiliyorsun. Bu yazıda da React tarafında basit ama gerçek hayatta iş görecek bir chat düzenini adım adım toparlıyorum.',
    },
    { type: 'h2', text: 'Proje Yapısı ve Firebase Kurulumu' },
    {
      type: 'code',
      lang: 'bash',
      text: `npm create vite@latest chat-app -- --template react-ts
cd chat-app
npm install firebase`,
    },
    {
      type: 'code',
      lang: 'ts',
      text: `// lib/firebase.ts
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
export const db   = getDatabase(app)`,
    },
    {
      type: 'p',
      text: 'Kurulumu baştan sade bırakmak gerçekten rahatlatıyor. Auth ve database erişimini tek yerde topladığında, sonradan oda mantığı, kullanıcı bilgileri ya da güvenlik kuralları eklemek çok daha derli toplu ilerliyor.',
    },
    { type: 'h2', text: 'Anonim Giriş ile Hızlı Başlangıç' },
    {
      type: 'code',
      lang: 'tsx',
      text: `import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
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
}`,
    },
    {
      type: 'p',
      text: 'Anonim giriş özellikle prototipte çok iş görüyor. Kullanıcıyı ilk ekranda form doldurmaya zorlamadan uygulamayı ayağa kaldırabiliyorsun. Böylece daha en başta akışı test etmeye başlayıp gereksiz ayrıntılara takılmıyorsun.',
    },
    { type: 'h2', text: 'Mesajları Dinlemek ve Göndermek' },
    {
      type: 'code',
      lang: 'tsx',
      text: `import { ref, push, onValue, query, limitToLast } from 'firebase/database'
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
}`,
    },
    {
      type: 'p',
      text: 'Burada önemli nokta sadece yeni mesajı kaydetmek değil, geçmişi de düzgün okuyabilmek. Oda bazlı dinleyiciyi tek bir hook içine almak hem kodu toparlıyor hem de ileride sayfalama ya da farklı mesaj tipleri eklemeyi kolaylaştırıyor.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Mesaj sayısını sınırlamazsanız oda büyüdükçe her yeni bağlantıda bütün geçmiş yeniden iner. Başta sorun çıkarmaz ama gerçek kullanımda gereksiz veri yüküne dönüşür.',
    },
    { type: 'h2', text: 'Re-render Meselesi' },
    {
      type: 'p',
      text: 'Canlı çalışan ekranlarda performans sorunu genelde bir anda patlamaz. Önce hafif hafif ağırlaşma hissi verir. Her yeni mesaj geldiğinde bütün listeyi yeniden çizmek küçük listelerde idare eder ama iş büyüdükçe akıcılık kaybolur. Bu yüzden mesaj öğelerini mümkün olduğunca ayrı tutmak iyi fikir.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `const MessageItem = React.memo(({ msg }: { msg: Message }) => (
  <div className="flex gap-2 p-2">
    <span className="font-mono text-xs text-indigo-400">{msg.uid.slice(0,6)}</span>
    <p>{msg.text}</p>
  </div>
))
MessageItem.displayName = 'MessageItem'

<div ref={bottomRef}>
  {messages.map((m) => (
    <MessageItem key={m.timestamp} msg={m} />
  ))}
</div>`,
    },
    { type: 'h2', text: 'Otomatik Kaydırma' },
    {
      type: 'code',
      lang: 'tsx',
      text: `const bottomRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])`,
    },
    {
      type: 'p',
      text: 'Chat ekranında küçük görünen ama hissi çok değiştiren şeylerden biri de kaydırma davranışı. Yeni mesaj gelince ekranın alta inmesi beklenir. Ama kullanıcı eski mesajları okuyorsa aynı hareket can sıkıcı olur. Yani burada biraz denge kurmak gerekiyor.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Kullanıcı yukarı çıkmışsa onu zorla alta götürmeyin. Önce gerçekten listenin sonuna yakın mı diye bakın. Yoksa uygulama akıcı değil, inatçı hissettirir.',
    },
  ],
}

export default post
