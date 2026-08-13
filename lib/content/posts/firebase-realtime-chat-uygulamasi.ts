import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'firebase-realtime-chat-uygulamasi',
  tag: 'Realtime',
  tagColor: '#f59e0b',
  title: 'Firebase ile Başlayıp Socket.io ile Bitirdim: Gerçek Zamanlı Neyi Gerektiriyor?',
  excerpt:
    'İlk gerçek zamanlı uygulamamı Firebase ile yazdım, yıllar sonra aynı problemi kendi sunucumla çözdüm. İkisi arasındaki farkı en net gösteren şey, kimin karar verdiği sorusu.',
  date: '2026-01-05',
  coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
  content: [
    {
      type: 'lead',
      text: 'İlk sohbet uygulamamı yazdığımda backend diye bir şey yazmamıştım. Firebase\'e bir referans açtım, `onValue` dinledim, mesaj `push` ettim ve iki tarayıcıda aynı anda mesajlaşmayı gördüm. O an gerçekten büyülü geldi. Yıllar sonra Karalama\'yı yazarken aynı problemi kendi sunucumla çözdüm ve o günkü büyünün neyi sakladığını anladım.',
    },

    { type: 'h2', text: 'Firebase Neyi Doğru Yapıyor' },
    {
      type: 'p',
      text: 'Realtime Database\'in modeli tek cümleyle şu: veritabanı bir JSON ağacı, sen bir düğümü dinliyorsun, o düğüm değiştiğinde sana haber geliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `import { getDatabase, ref, push, onChildAdded, serverTimestamp } from 'firebase/database'

const db = getDatabase(app)
const messagesRef = ref(db, \`rooms/\${roomId}/messages\`)

// Gönderme
await push(messagesRef, {
  text,
  uid: auth.currentUser!.uid,
  // İstemcinin saatine güvenmiyoruz — sunucu damgası
  createdAt: serverTimestamp(),
})

// Dinleme: onValue değil onChildAdded.
// onValue her değişimde TÜM listeyi yeniden gönderir; 500 mesajlık bir
// odada her yeni mesaj 500 kayıt indirmek demektir.
onChildAdded(messagesRef, (snap) => {
  setMessages((prev) => [...prev, { id: snap.key!, ...snap.val() }])
})`,
    },
    {
      type: 'p',
      text: 'O `onValue` / `onChildAdded` ayrımı ilk sürümde yaptığım hataydı. Uygulama çalışıyordu ama sohbet uzadıkça telefonda ısınma başlıyordu. Ağ sekmesine bakınca sebep açıktı: her mesajda bütün geçmiş yeniden iniyordu.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Sorguya sınır koymak da şart: `query(messagesRef, limitToLast(50))`. Odaya ilk giren biri, kurulduğu günden beri yazılmış her mesajı indirmemeli. Bunu eklemeden önce bir odanın ilk yüklemesi 2 MB\'a çıkmıştı.',
    },

    { type: 'h2', text: 'Asıl Mesele: Güvenlik Kuralları' },
    {
      type: 'p',
      text: 'Firebase\'in "backend yazmıyorsun" vaadinin bedeli burada ödeniyor. Backend yazmıyorsun ama yetkilendirmeyi yazmak zorundasın — ve bunu tanıdık bir dilde değil, kendi kural dilinde yazıyorsun.',
    },
    {
      type: 'code',
      lang: 'json',
      file: 'database.rules.json',
      text: `{
  "rules": {
    "rooms": {
      "$roomId": {
        "messages": {
          ".read": "auth != null",
          "$msgId": {
            // Yalnızca kendi adına yazabilirsin
            ".write": "auth != null && !data.exists() && newData.child('uid').val() === auth.uid",
            ".validate": "newData.hasChildren(['text','uid','createdAt']) && newData.child('text').isString() && newData.child('text').val().length <= 500"
          }
        }
      }
    }
  }
}`,
    },
    {
      type: 'p',
      text: '`!data.exists()` kısmı önemli: mesajın sonradan düzenlenmesini engelliyor. `.validate` ise şema doğrulaması — bunu yazmadan uygulamamı yayına aldığımda biri konsoldan 3 MB\'lık bir string gönderebilirdi.',
    },
    {
      type: 'quote',
      text: 'Firebase\'de "sunucu kodu yok" demek "sunucu mantığı yok" demek değil. Mantık var, sadece JSON içine yazılmış bir kural dilinde yaşıyor ve testi zor.',
    },
    {
      type: 'p',
      text: 'Kural dosyasının en can sıkıcı yanı hata ayıklaması. Bir yazma reddedildiğinde istemci sadece "permission denied" görüyor; hangi kuralın hangi satırda reddettiğini konsoldan anlamıyorsunuz. Firebase\'in kural simülatörü var ama gerçek veriyle çalışmıyor.',
    },

    { type: 'h2', text: 'Nerede Duvara Çarptım' },
    {
      type: 'p',
      text: 'Sohbet için Firebase gayet iyiydi. Duvara, sohbetin üstüne oyun mantığı koymaya çalıştığımda çarptım.',
    },
    {
      type: 'p',
      text: 'Basit bir soru: bir tahmin doğru mu? Cevabı bilen taraf kim? Firebase modelinde veritabanı bir depo, karar verici değil. Doğru cevap veritabanında yazıyorsa istemci onu okuyabilir; okuyamasın diye gizlerseniz karşılaştırmayı kim yapacak?',
    },
    {
      type: 'table',
      head: ['Soru', 'Firebase RTDB', 'Kendi sunucun'],
      rows: [
        ['Kim karar verir', 'Kural dili + istemci', 'Sunucu kodu'],
        ['Gizli durum tutulabilir mi', 'Zor — okuma izni ya var ya yok', 'Doğal, istemci hiç görmez'],
        ['Zamanlayıcı (tur süresi)', 'Cloud Functions gerekir', 'setTimeout, aynı süreçte'],
        ['Ölçekleme', 'Kendiliğinden', 'Sen ilgilenirsin'],
        ['İlk çalışan sürüm', 'Bir akşam', 'Birkaç gün'],
      ],
    },
    {
      type: 'p',
      text: 'Firebase\'in cevabı Cloud Functions. Yani sonuçta backend yazıyorsunuz — ama parçalanmış hâlde, farklı bir çalışma ortamında ve soğuk başlama gecikmesiyle. Bir tur zamanlayıcısını Cloud Functions ile kurmayı denedim; iş çalışıyordu ama tur bitişi bazen üç saniye gecikiyordu.',
    },

    { type: 'h2', text: 'Aynı Problem, İkinci Deneme' },
    {
      type: 'p',
      text: 'Karalama\'da aynı soruya farklı cevap verdim: odalar sunucunun belleğinde bir `Map` içinde, kararları sunucu veriyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/game/Room.ts',
      text: `handleGuess(playerId: string, text: string) {
  // Çizen kişi tahmin edemez, zaten bilenler tekrar puan alamaz
  if (playerId === this.drawerId) return null
  if (this.guessedPlayerIds.has(playerId)) return null

  const normalized = normalizeGuess(text)
  const answer = normalizeGuess(this.currentWord)   // ← istemciye hiç gitmedi

  if (normalized === answer) {
    this.guessedPlayerIds.add(playerId)
    const score = calculateGuesserScore({ /* ... */ })
    // ...
  }
}`,
    },
    {
      type: 'p',
      text: 'Buradaki `this.currentWord` istemciye hiçbir zaman gönderilmiyor. Firebase\'de bunu yapmanın yolu kelimeyi okuma izni olmayan bir düğümde tutup karşılaştırmayı bir Cloud Function\'a yaptırmak olurdu — yani her tahminde bir fonksiyon çağrısı.',
    },

    { type: 'h2', text: 'Bugün Hangisini Seçerdim' },
    {
      type: 'p',
      text: 'Cevap tek soruya bakıyor: sunucunun istemcinin bilmediği bir şeyi bilmesi gerekiyor mu?',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Gerekmiyorsa Firebase (ya da Supabase Realtime)',
          text: 'Sohbet, bildirim, canlı beğeni sayacı, işbirlikli liste. Herkes her şeyi görebilir, kurallar sadece kimin yazabileceğini sınırlar. Bu senaryoda kendi sunucunu yazmak boşa emek.',
        },
        {
          title: 'Gerekiyorsa kendi sunucun',
          text: 'Oyun mantığı, gizli durum, sunucu tarafı zamanlayıcı, hile karşıtı kontrol. Karar veren tarafın kodu senin elinde olmalı.',
        },
        {
          title: 'Arada kalmışsan',
          text: 'Postgres + SSE ya da WebSocket ile başla. Firebase\'in kural dilini öğrenmek, basit bir sunucu yazmaktan daha uzun sürüyor — ve öğrendiğin şey taşınabilir değil.',
        },
      ],
    },
    {
      type: 'p',
      text: 'Son maddeyi biraz açayım. Firebase kural dili öğrendiğim ve bir daha hiç kullanmadığım bir bilgi oldu. Socket.io ile öğrendiğim şeyler — olay tabanlı mimari, oda kavramı, sunucu otoritesi, yeniden bağlanma — her gerçek zamanlı sistemde geçerli.',
    },

    { type: 'h2', text: 'Firebase\'i Hâlâ Sevdiğim Yer' },
    {
      type: 'p',
      text: 'Bu yazı Firebase eleştirisi gibi okunuyorsa dengeleyeyim: bugün bir hafta sonu projesi yazacak olsam ve gerçek zamanlı bir sohbete ihtiyacım olsa, yine Firebase ile başlardım.',
    },
    {
      type: 'ul',
      items: [
        'Bağlantı yönetimini tamamen unutuyorsunuz. Ağ koptu, geri geldi, uygulama arka plandaydı — hepsi hallediliyor.',
        'Çevrimdışı desteği bedava geliyor. Kullanıcı tünelde mesaj yazıyor, sinyal gelince gönderiliyor.',
        '`serverTimestamp()` küçük ama önemli: istemci saatleri güvenilmez ve sıralamayı ona bağlarsanız mesajlar karışıyor.',
        'Kimlik doğrulama aynı ekosistemde. Anonim oturum tek satır ve `auth.uid` doğrudan kurallarda kullanılabiliyor.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Anonim oturum açmayı unutmayın. Kurallarda `auth != null` yazıp uygulamada `signInAnonymously()` çağırmazsanız her yazma reddedilir ve hata mesajı bunu söylemez. İlk sürümde tam bir akşamımı bu aldı.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bu iki projeden çıkardığım şey teknoloji tercihi değil, bir soru: "bu sistemde kim otorite?" Cevabı baştan verirseniz, geri kalan kararlar kendiliğinden geliyor.',
    },
    {
      type: 'p',
      text: 'O ilk sohbet uygulamasında bu soruyu hiç sormamıştım. Çalıştı, çünkü sohbette otoriteye ihtiyaç yok. Oyuna geçince aynı yaklaşım kırıldı ve neden kırıldığını anlamak bana bir sürü şey öğretti.',
    },
  ],
}

export default post
