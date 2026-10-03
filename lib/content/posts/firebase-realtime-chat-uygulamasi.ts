import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'firebase-realtime-chat-uygulamasi',
  tag: 'Realtime',
  tagColor: '#f59e0b',
  title: "İlk Sohbet Uygulamam: Gerçek Zamanlıda Otorite Kimde?",
  excerpt:
    '2021\'deki ilk sohbet uygulamamın sunucusu on beş satırdı; mesajın kimden geldiğini istemci söylüyordu. Beş yıl sonra bir çizim oyununda kararı sunucuya bıraktım.',
  date: '2026-05-16',
  coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
  content: [
    {
      type: 'lead',
      text: 'Haziran 2021\'de ilk sohbet uygulamamı yazdım: React istemcisi, Express ve Socket.io sunucusu. Sunucu on beş satırdı ve tek iş yapıyordu: gelen her mesajı herkese geri yollamak. Mesajın kimden geldiğini ise istemci söylüyordu. Beş yıl sonra Karalama\'yı yazarken aynı soruya bambaşka bir cevap verdim.',
    },

    { type: 'h2', text: 'Sunucu Yalnızca Yankı Yapıyordu' },
    {
      type: 'p',
      text: 'Kodun tamamı bu:',
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
      text: 'Bağlanan her istemciye kendi kimliğini söylüyor, sonra gelen mesajı olduğu gibi herkese yayıyor. İstemci mesajı şöyle kuruyordu:',
    },
    {
      type: 'code',
      lang: 'js',
      file: 'client/src/App.js',
      text: `function sendMessage(e) {
  e.preventDefault();
  const messageObject = {
    body: message,
    id: yourID,
  };
  setMessage("");
  socketRef.current.emit("send message", messageObject);
}`,
    },
    {
      type: 'p',
      text: 'Mesajın sahibini istemci yazıyor: `id: yourID`. Sunucu gerçek kimliği zaten biliyordu, `socket.id` elinin altındaydı, ama kullanmıyordu. Gelen `id` alanına bakmadan mesajı herkese iletiyordu. Mesajın ekranda sağa mı sola mı düşeceğine de `message.id === yourID` karar veriyordu. Yani biri başkasının kimliğiyle mesaj atsaydı, o mesaj karşı tarafın ekranında sanki kendi yazmış gibi sağda görünürdü.',
    },
    {
      type: 'p',
      text: 'Kodda buna karşı tek bir kontrol yok. Uygulama yine de çalışıyordu: sohbette herkes kendi adıyla yazdığı sürece kimin haklı olduğuna karar verecek bir sunucuya gerek kalmıyor. İstemci kodunda hâlâ bir `console.log("here")` duruyor; o dönem hata ayıklamayı böyle yapıyordum.',
    },

    { type: 'h2', text: 'Bir Ay Önce: Firebase' },
    {
      type: 'p',
      text: 'Bundan bir ay önce, Mayıs 2021\'de React, Tailwind ve Firebase ile bir Twitter klonu yazmıştım. Orada hiç sunucu kodu yoktu. İstemci doğrudan Firestore\'a yazıyor, akışı da oradan dinliyordu:',
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
    image: "",
    avatar: "...",
})`,
    },
    {
      type: 'code',
      lang: 'js',
      file: 'src/Layout/Content.js',
      text: `db.collection('feed')
  .orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => setTweets(snapshot.docs.map(doc => doc.data())))`,
    },
    {
      type: 'p',
      text: 'Burada da kim olduğunu istemci söylüyor; adım ve kullanıcı adım koda gömülü. Kimin yazabileceğine karar verecek tek yer Firestore\'un güvenlik kurallarıydı ve depoda kural dosyası yok. Sunucunun karar verdiği tek şey zamandı: `serverTimestamp()` sıralamayı istemcinin saatine bırakmıyor.',
    },
    {
      type: 'quote',
      text: '2021\'deki iki projemde sunucunun karar verdiği tek şey saatti. Birinde o bile değil.',
    },

    { type: 'h2', text: 'Beş Yıl Sonra: Karalama' },
    {
      type: 'p',
      text: 'Karalama bir çizim-tahmin oyunu. Orada bu soru en baştan karşıma çıktı, çünkü oyunun kendisi üç karara dayanıyor: tahmin doğru mu, cevabı kim biliyor, puanı kim veriyor.',
    },
    {
      type: 'p',
      text: 'Üçünün de cevabı sunucu. Tahmin sohbetten düz metin olarak geliyor ve oyuncunun kimliği mesajın içinden değil, bağlantının kendisinden okunuyor:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/socket/handlers.ts',
      text: `if (room.phase === 'DRAWING') {
  const msg = room.handleGuess(socket.id, trimmed);
  // ...
}`,
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'apps/server/src/game/Room.ts',
      text: `handleGuess(playerId: string, text: string) {
  if (this.phase !== 'DRAWING') return null;
  if (!this.currentWord) return null;
  if (playerId === this.currentDrawerId) return null;
  // ...
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
      text: '`this.currentWord` tahmin edenlere tur boyunca hiç gönderilmiyor. Onlara yalnızca ipucu ve harf sayısı gidiyor; kelime çizen kişide duruyor ve tur bitince herkese açıklanıyor. Puanı da sunucu hesaplıyor. 2021\'de istemcinin yazdığı `id` alanının yerini burada `socket.id` aldı: kimin konuştuğunu artık bağlantı söylüyor.',
    },

    { type: 'h2', text: 'Firebase\'de Aynısı Nasıl Olurdu' },
    {
      type: 'p',
      text: 'Firebase\'te veritabanı veriyi tutar, karar vermez. Güvenlik kuralları "bu kullanıcı kendi adına mı yazıyor" sorusunu cevaplayabiliyor; Twitter klonunda eksik olan da buydu. "Bu tahmin doğru mu" sorusu başka. Doğru cevap okunabilir bir yerde duruyorsa istemci onu okur. Okunamaz bir yere koyarsan, karşılaştırmayı yapacak bir sunucu fonksiyonu gerekir. Sonunda yine sunucu kodu yazıyorsun, sadece başka bir yerde.',
    },

    { type: 'h2', text: 'Bugün Hangisini Seçerdim' },
    {
      type: 'p',
      text: 'Ben şu soruya bakıyorum: sunucu, istemcinin bilmemesi gereken bir şey tutuyor mu?',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Gerekmiyorsa Barındırılan Bir Gerçek Zamanlı Veritabanı',
          text: 'Sohbet, bildirim, canlı sayaç, ortak liste. Herkes her şeyi görebilir; kurallar yalnızca kimin neyi yazabileceğini sınırlar. Böyle bir işte kendi sunucunu yazmak boşa emek.',
        },
        {
          title: 'Gerekiyorsa Kendi Sunucun',
          text: 'Oyun mantığı, gizli kalması gereken bilgi, sunucuda işleyen zamanlayıcı, hileye karşı kontrol. Kararı veren kod senin elinde olmalı.',
        },
      ],
    },
    {
      type: 'p',
      text: '2021\'deki iki projenin kodunda bu soruya verilmiş bir cevap yok. İkisi de çalıştı, çünkü ikisinde de saklanacak bir şey yoktu. Karalama\'da saklanması gereken ilk şey bir kelimeydi ve sunucu o kelimenin etrafında kuruldu. Bir sonraki projede saklanacak şeyin ne olacağını henüz bilmiyorum; bu kez onu kodun ilk gününde görmek istiyorum.',
    },
  ],
}

export default post
