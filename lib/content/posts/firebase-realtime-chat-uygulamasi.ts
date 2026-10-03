import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'firebase-realtime-chat-uygulamasi',
  tag: 'Realtime',
  tagColor: '#f59e0b',
  title: "İlk Sohbet Uygulamam: Gerçek Zamanlıda Otorite Kimde?",
  excerpt:
    '2021\'de yazdığım ilk sohbet uygulamasının sunucusu on beş satırdı ve hiçbir şeye karar vermiyordu. Beş yıl sonra aynı soruyu bir oyunda bambaşka cevapladım.',
  date: '2026-01-05',
  coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
  content: [
    {
      type: 'lead',
      text: 'Haziran 2021\'de ilk sohbet uygulamamı yazdım: React istemcisi, Express ve Socket.io sunucusu. Sunucu on beş satırdı ve tek bir iş yapıyordu: gelen her mesajı herkese geri yollamak. İki tarayıcı penceresinde mesajların karşılıklı aktığını görmek o gün büyülü gelmişti. Bu büyünün neyi sakladığını beş yıl sonra, Karalama\'yı yazarken anladım.',
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
      text: 'Bağlanan her istemciye kendi kimliğini söylüyor, sonra gelen her mesajı olduğu gibi herkese yayıyor. İstemci tarafında mesaj şöyle kuruluyordu:',
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
      text: 'Mesajın kimden geldiğini istemci söylüyor: `id: yourID`. Sunucu gerçek kimliği zaten biliyordu, `socket.id` elinin altındaydı, ama kullanmıyordu. Gelen `id` alanını kontrol etmeden herkese iletiyordu. Ekranda mesajı sağa mı sola mı koyacağına da `message.id === yourID` karşılaştırması karar veriyordu. Yani biri başkasının kimliğiyle mesaj gönderseydi, o mesaj karşı tarafın ekranında onun kendi mesajı gibi, sağ tarafta görünürdü.',
    },
    {
      type: 'p',
      text: 'O gün bunu hiç düşünmedim. Uygulama çalışıyordu, çünkü sohbette herkes dürüst olduğu sürece otoriteye ihtiyaç yok. İstemci kodunda hâlâ bir `console.log("here")` duruyor; o dönemki hata ayıklama yöntemimin de özeti.',
    },

    { type: 'h2', text: 'Bir Ay Önce: Firebase' },
    {
      type: 'p',
      text: 'Ondan bir ay önce, Mayıs 2021\'de React, Tailwind ve Firebase ile bir Twitter klonu yazmıştım. Orada sunucu kodu hiç yoktu. İstemci doğrudan Firestore\'a yazıyor, akışı da doğrudan oradan dinliyordu:',
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
      text: 'Burada da kim olduğunu istemci söylüyor; adım ve kullanıcı adım koda gömülü. Kimin yazabileceğine karar verecek tek yer Firestore\'un güvenlik kurallarıydı ve depoda bir kural dosyası yok. Sunucunun gerçekten karar verdiği tek şey zamandı: `serverTimestamp()` sıralamayı istemcinin saatine bırakmıyor.',
    },
    {
      type: 'quote',
      text: '2021\'deki iki projemde sunucunun karar verdiği tek şey saatti. Birinde o bile değil.',
    },

    { type: 'h2', text: 'Beş Yıl Sonra: Karalama' },
    {
      type: 'p',
      text: 'Karalama bir çizim-tahmin oyunu ve orada aynı soruyu sormadan tek satır yazamazdım. Bir tahmin doğru mu? Cevabı kim biliyor? Puanı kim veriyor?',
    },
    {
      type: 'p',
      text: 'Cevapların hepsi sunucu. Tahmin sohbet kanalından düz metin olarak geliyor ve oyuncunun kimliği mesajın içinden değil, bağlantının kendisinden okunuyor:',
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
      text: '`this.currentWord` tahmin edenlere tur boyunca hiç gönderilmiyor. Onlara giden tek şey ipucu ve harf sayısı; kelimenin kendisi yalnızca çizen kişide ve tur bittiğinde herkese açıklanıyor. Puanı da sunucu hesaplıyor. 2021\'deki sunucunun ilettiği `id` alanının yerini burada `socket.id` almış durumda: kimin konuştuğunu artık istemci değil, bağlantı söylüyor.',
    },

    { type: 'h2', text: 'Firebase\'de Aynısı Nasıl Olurdu' },
    {
      type: 'p',
      text: 'Firebase\'in modelinde veritabanı bir depo, karar verici değil. Güvenlik kuralları "bu kullanıcı kendi adına mı yazıyor" sorusunu cevaplayabiliyor; Twitter klonunda eksik olan da buydu. Ama "bu tahmin doğru mu" sorusu başka. Doğru cevap okunabilir bir yerde duruyorsa istemci onu okur. Okunamaz bir yere koyarsan, karşılaştırmayı yapacak bir sunucu fonksiyonuna ihtiyacın var. Yani sonunda yine sunucu kodu yazıyorsun, yalnızca başka bir yerde.',
    },

    { type: 'h2', text: 'Bugün Hangisini Seçerdim' },
    {
      type: 'p',
      text: 'Cevap tek bir soruya bakıyor: sunucunun, istemcinin bilmediği bir şeyi bilmesi gerekiyor mu?',
    },
    {
      type: 'steps',
      items: [
        {
          title: 'Gerekmiyorsa Barındırılan Bir Gerçek Zamanlı Veritabanı',
          text: 'Sohbet, bildirim, canlı sayaç, ortak liste. Herkes her şeyi görebilir; kurallar yalnızca kimin neyi yazabileceğini sınırlar. Bu senaryoda kendi sunucunu yazmak boşa emek.',
        },
        {
          title: 'Gerekiyorsa Kendi Sunucun',
          text: 'Oyun mantığı, gizli durum, sunucuda işleyen zamanlayıcı, hileye karşı kontrol. Karar veren tarafın kodu senin elinde olmalı.',
        },
      ],
    },
    {
      type: 'p',
      text: '2021\'deki iki projede bu soruyu hiç sormamıştım ve ikisi de çalıştı, çünkü ikisinde de saklanacak bir şey yoktu. Karalama\'da ilk saklanması gereken şey bir kelimeydi ve bütün mimari o kelimenin etrafında şekillendi. Merak ettiğim, bir sonraki projede ilk saklanması gereken şeyin ne olacağı ve onu bu kez baştan görüp göremeyeceğim.',
    },
  ],
}

export default post
