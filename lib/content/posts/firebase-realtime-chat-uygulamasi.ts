import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'firebase-realtime-chat-uygulamasi',
  tag: 'Gerçek Zamanlı',
  tagColor: '#f59e0b',
  title: "İlk Sohbet Uygulamam: 2021'den Bugüne Ne Değişti",
  excerpt:
    "2021'de yazdığım ilk sohbet uygulamasının sunucusu on beş satırdı ve mesajın kimden geldiğini tarayıcı söylüyordu. Beş yıl sonra bir çizim oyununda aynı soruya bambaşka bir cevap verdim.",
  date: '2026-05-16',
  coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
  content: [
    {
      type: 'lead',
      text: "Haziran 2021'de ilk sohbet uygulamamı yazdım: React ile bir arayüz, Express ve Socket.io ile bir sunucu. Mesaj yazıyorsun, aynı sayfayı açmış herkes anında görüyor. Sunucu on beş satırdı ve tek bir iş yapıyordu: gelen her mesajı herkese geri yollamak. Mesajın kimden geldiğini ise tarayıcı söylüyordu. Beş yıl sonra Karalama'yı yazarken aynı soruya bambaşka bir cevap verdim ve bu yazı o iki cevabın karşılaştırması.",
    },
    {
      type: 'p',
      text: 'Eski kodu yeniden açmak biraz utandırıcı, biraz da öğretici. O dönem öğrenmek için yazdığım iki küçük projeye bugünkü gözle bakınca, aradaki farkın teknoloji değil tek bir soru olduğunu gördüm: kararı kim veriyor?',
    },

    { type: 'h2', text: 'Sunucu Yalnızca Yankı Yapıyordu' },
    {
      type: 'p',
      text: 'Sunucunun tamamı buydu:',
    },
    {
      type: 'code',
      lang: 'js',
      file: 'server.js',
      text: `io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
        io.emit("message", body)
    })
})`,
    },
    {
      type: 'p',
      text: 'Bağlanan her tarayıcıya kendi kimliğini söylüyor, sonra gelen mesajı olduğu gibi herkese yayıyor. Tarayıcı tarafı mesajı şöyle kuruyordu:',
    },
    {
      type: 'code',
      lang: 'js',
      file: 'client/src/App.js',
      text: `function sendMessage(e) {
  e.preventDefault();
  const messageObject = { body: message, id: yourID };
  setMessage("");
  socketRef.current.emit("send message", messageObject);
}`,
    },
    {
      type: 'p',
      text: 'Mesajın sahibini tarayıcı yazıyor. Sunucu gerçek kimliği zaten biliyordu, elinin altındaydı, ama kullanmıyordu. Mesajın ekranda sağa mı sola mı düşeceğine de yine tarayıcı karar veriyordu. Yani biri başkasının kimliğiyle mesaj atsaydı, o mesaj karşı tarafın ekranında sanki kendi yazmış gibi görünürdü. Uygulama yine de çalışıyordu; sohbette herkes kendi adıyla yazdığı sürece kimin haklı olduğuna karar verecek bir sunucuya gerek kalmıyor.',
    },

    { type: 'h2', text: 'Bir Ay Önce: Firebase' },
    {
      type: 'p',
      text: "Bundan bir ay önce de React, Tailwind ve Firebase ile bir Twitter klonu yazmıştım. Orada hiç sunucu kodu yoktu; tarayıcı doğrudan Firestore'a yazıyor, akışı da oradan dinliyordu.",
    },
    {
      type: 'code',
      lang: 'js',
      file: 'src/components/TweetBox.js',
      text: `db.collection('feed').add({
    displayName: "Ahmet Akyapı",
    username: "@Ahmetakyapi",
    content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
})`,
    },
    {
      type: 'p',
      text: "Burada da kim olduğunu tarayıcı söylüyor; adım ve kullanıcı adım koda gömülü. Kimin yazabileceğine karar verecek tek yer Firestore'un güvenlik kurallarıydı ve depoda kural dosyası yok. Sunucunun karar verdiği tek şey zamandı: zaman damgası sunucudan geldiği için sıralama tarayıcının saatine kalmıyordu.",
    },
    {
      type: 'quote',
      text: "2021'deki iki projemde sunucunun karar verdiği tek şey saatti. Birinde o bile değil.",
    },

    { type: 'h2', text: 'Beş Yıl Sonra: Karalama' },
    {
      type: 'p',
      text: 'Karalama arkadaşlarla oynanan bir çizim ve tahmin oyunu. Orada bu soru en baştan karşıma çıktı, çünkü oyunun kendisi üç karara dayanıyor: tahmin doğru mu, cevabı kim biliyor, puanı kim veriyor. Üçünün de cevabı sunucu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/game/Room.ts',
      text: `handleGuess(playerId: string, text: string) {
  if (this.phase !== 'DRAWING') return null;
  if (playerId === this.currentDrawerId) return null;

  const normalized = normalizeGuess(text);
  const answer = normalizeGuess(this.currentWord);

  if (normalized === answer) {
    const score = calculateGuesserScore({ /* ... */ });
    // ...
  }
}`,
    },
    {
      type: 'p',
      text: "Tahmin sohbetten düz metin olarak geliyor ve oyuncunun kimliği mesajın içinden değil, bağlantının kendisinden okunuyor. Kelime tahmin edenlere tur boyunca hiç gönderilmiyor; onlara yalnızca ipucu ve harf sayısı gidiyor. Puanı da sunucu hesaplıyor. 2021'de tarayıcının yazdığı kimlik alanının yerini burada bağlantının kimliği aldı.",
    },

    { type: 'h2', text: "Firebase'de Aynısı Nasıl Olurdu" },
    {
      type: 'p',
      text: 'Firebase\'de veritabanı veriyi tutar, karar vermez. Güvenlik kuralları "bu kullanıcı kendi adına mı yazıyor" sorusunu cevaplayabilir; Twitter klonunda eksik olan da buydu. "Bu tahmin doğru mu" sorusu başka. Doğru cevap okunabilir bir yerde duruyorsa tarayıcı onu okur. Okunamaz bir yere koyarsan, karşılaştırmayı yapacak bir sunucu fonksiyonu gerekir. Sonunda yine sunucu kodu yazıyorsun, sadece başka bir yerde.',
    },

    { type: 'h2', text: 'Bugün Hangisini Seçerdim' },
    {
      type: 'p',
      text: 'Artık tek bir soruya bakıyorum: sunucu, tarayıcının bilmemesi gereken bir şey tutuyor mu?',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Tutmuyorsa, Hazır Bir Gerçek Zamanlı Veritabanı',
          text: 'Sohbet, bildirim, canlı sayaç, ortak liste. Herkes her şeyi görebilir; kurallar yalnızca kimin neyi yazabileceğini sınırlar. Böyle bir işte kendi sunucunu yazmak boşa emek.',
        },
        {
          title: 'Tutuyorsa, Kendi Sunucun',
          text: 'Oyun mantığı, gizli kalması gereken bilgi, sunucuda işleyen zamanlayıcı, hileye karşı kontrol. Kararı veren kod senin elinde olmalı.',
        },
      ],
    },
    {
      type: 'p',
      text: "2021'deki iki projede bu soruya verilmiş bir cevap yok. İkisi de çalıştı, çünkü ikisinde de saklanacak bir şey yoktu. Karalama'da saklanması gereken ilk şey bir kelimeydi ve sunucu o kelimenin etrafında kuruldu. Bir sonraki projede saklanacak şeyin ne olacağını henüz bilmiyorum; bu kez onu kodun ilk gününde görmek istiyorum.",
    },
  ],
}

export default post
