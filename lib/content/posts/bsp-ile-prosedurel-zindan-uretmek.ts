import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bsp-ile-prosedurel-zindan-uretmek',
  tag: 'Oyun',
  tagColor: '#a855f7',
  title: 'Dungeon Mates: Her Seferinde Farklı Ama Bozuk Olmayan Harita',
  excerpt:
    'Prosedürel zindan üretmek kolay. Zor olan, üretilen zindanın gezilebilir olduğundan emin olmak. BSP ile nasıl çözdüğüme ve yol boyunca neyi patlattığıma dair notlar.',
  date: '2026-02-14',
  coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
  content: [
    {
      type: 'lead',
      text: 'İlk çalışan sürümde arkadaşımla oyuna girdik ve iki dakika boyunca bir koridorda dönüp durduk. Harita üretilmişti, odalar vardı, canavarlar vardı — ama merdivenin bulunduğu odaya giden hiçbir yol yoktu. Rastgeleliğin sorunu tam olarak bu: çoğu zaman çalışıyor.',
    },
    {
      type: 'p',
      text: 'Dungeon Mates tarayıcıda çalışan, 2-4 kişilik kooperatif bir zindan oyunu. Her kat yeniden üretiliyor. Bu yazı, "her seferinde farklı" ile "her seferinde oynanabilir" arasındaki gerilimi nasıl çözdüğüme dair.',
    },

    { type: 'h2', text: 'Neden Tamamen Rastgele Olmuyor' },
    {
      type: 'p',
      text: 'İlk yaklaşımım şuydu: rastgele yerlere rastgele boyutta dikdörtgenler koy, sonra hepsini birbirine bağla. İki sorun çıktı.',
    },
    {
      type: 'ul',
      items: [
        'Odalar üst üste biniyordu. Çakışma kontrolü ekledim; bu sefer 40 denemede yerleştirilemeyen odalar oldu ve harita boş kaldı.',
        'Bağlantı grafiği garanti bağlı değildi. İki oda kümesi oluşup birbirine hiç bağlanmayabiliyordu — yukarıdaki koridor hikâyesi tam olarak buydu.',
      ],
    },
    {
      type: 'p',
      text: 'BSP bu iki sorunu birden çözüyor. Alanı ikiye böl, her yarıyı yine ikiye böl, en alttaki parçalara birer oda koy. Odalar aynı parçanın içinde olduğu için asla çakışmıyor. Ve bağlarken ağacın kendisini takip ediyorsun, yani bağlılık yapıdan geliyor.',
    },

    { type: 'h2', text: 'Bölme Yönünü Kim Seçiyor' },
    {
      type: 'p',
      text: 'Yönü tamamen rastgele seçince haritada 4×60 boyutunda koridor gibi parçalar çıkıyor. İçine oda sığmıyor. Çözüm basit: parçanın oranına bak, uzun kenarı böl.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `private splitNode(node: BSPNode, depth: number): void {
  if (depth > 5) return

  const canSplitH = node.height >= this.minBspSize * 2
  const canSplitV = node.width  >= this.minBspSize * 2
  if (!canSplitH && !canSplitV) return

  let splitHorizontally: boolean
  if (canSplitH && canSplitV) {
    // Kare değilse uzun kenarı böl; kareyse yazı tura.
    splitHorizontally =
      node.height > node.width ? true
      : node.width > node.height ? false
      : Math.random() > 0.5
  } else {
    splitHorizontally = canSplitH
  }
  // ...
}`,
    },
    {
      type: 'p',
      text: 'Buradaki `depth > 5` sınırı deneme yanılmayla oturdu. 7\'de harita hücre gibi görünüyordu — çok fazla küçük oda, hepsi birbirinin aynı. 4\'te ise oda sayısı yetersizdi. 5 iyi bir denge verdi.',
    },
    {
      type: 'p',
      text: 'Bir de `minBspSize` var ve tanımı ilginç:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `// Oda maksimum boyutu + 4: bir parçaya oda konduğunda kenarlarda
// koridorların geçebileceği en az 2'şer birim boşluk kalsın.
this.minBspSize = this.roomMaxSize + 4`,
    },
    {
      type: 'p',
      text: 'Bu satır olmadan odalar parçanın kenarına yapışıyordu ve koridorlar duvarların içinden geçmek zorunda kalıyordu. Zindan "yanlış" görünüyordu ama nedenini uzun süre bulamadım.',
    },

    { type: 'h2', text: 'Oyuncu Sayısı Haritayı Değiştiriyor' },
    {
      type: 'p',
      text: 'Tek kişilik oyunda 72×72\'lik bir harita çok büyük — dakikalarca boş koridorda yürüyorsun. Dört kişide 48×48 çok küçük, herkes birbirinin üstünde. Bu yüzden harita boyutu oyuncu sayısına bağlı.',
    },
    {
      type: 'table',
      head: ['Oyuncu', 'Harita', 'Oda boyutu'],
      rows: [
        ['1', '48 × 48', '6 – 11'],
        ['2', '56 × 56', '7 – 12'],
        ['3', '64 × 64', '7 – 13'],
        ['4', '72 × 72', '8 – 14'],
      ],
    },
    {
      type: 'p',
      text: 'Kat numarası da ayrı bir katman: yukarı çıktıkça oda sayısı, canavar canı ve saldırı gücü artıyor. Patronlar 3, 5, 7, 8 ve 10. katlarda. Bu sayıları bir tabloya yazdım ve oynadıkça birkaç kere değiştirdim — özellikle 4. kat uzun süre kolaydı.',
    },

    { type: 'h2', text: 'Fazla Oda Üretince Ne Oluyor' },
    {
      type: 'p',
      text: 'Bu bölüm koddaki en sinsi hatanın hikâyesi. BSP ağacı bazen hedeflenenden fazla oda üretiyor. Fazlalıkları listeden çıkarmak yetmedi.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `// Fazla odaları listeden çıkarmak YETMİYOR: tile'lar zaten açılmıştı.
// Sadece diziden silince haritada sahipsiz boşluklar kalıyor —
// oyuncu oraya girebiliyor ama orası hiçbir odanın parçası değil.
for (let i = this.rooms.length - 1; i >= targetMax; i--) {
  this.uncarveRoom(this.rooms[i])
}`,
    },
    {
      type: 'p',
      text: 'Semptom şuydu: bazı oyunlarda haritada canavarsız, eşyasız, çıkışsız bir boşluk oluyordu. Oyuncular oraya düşünce "burası bug mı" diye soruyordu. Evet, bug\'dı. Açılan alanı geri kapatan bir fonksiyon yazmak zorunda kaldım.',
    },

    { type: 'h2', text: 'Koridorlar' },
    {
      type: 'p',
      text: 'Bağlama işi ağacın iç düğümlerinde yapılıyor: sol alt ağacın bir odasıyla sağ alt ağacın bir odasını birleştir. Kök düğüme kadar çıkınca bütün harita bağlanmış oluyor.',
    },
    {
      type: 'p',
      text: 'Koridorların şekli L biçimli — önce yatay, sonra dikey (ya da tersi). Diagonal denedim, çok daha hoş görünüyordu ama çarpışma kontrolü ve görüş hattı hesabı iki katına çıktı. Geri aldım.',
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'L biçimli koridorda hangi kolun önce çizildiğini rastgele seçmek, tek satırlık bir değişiklik ama haritanın karakterini belirgin şekilde çeşitlendiriyor. Aynı oda çiftini bağlayan iki farklı yol çıkıyor.',
    },

    { type: 'h2', text: 'Haritayı Kim Üretiyor' },
    {
      type: 'p',
      text: 'Bu, çok oyunculu tarafta pazarlık edilemez bir karar. Harita sunucuda üretiliyor ve herkese aynı sonuç gönderiliyor.',
    },
    {
      type: 'p',
      text: 'Sadece seed\'i paylaşıp herkesin kendi haritasını üretmesi cazip geliyor — ağ trafiği neredeyse sıfır. Ama `Math.random()` uygulamaları arasında fark yaratabiliyor ve daha kötüsü, istemcinin elinde tüm haritanın olması demek: nerede patron var, nerede sandık var, hepsi belli.',
    },
    {
      type: 'quote',
      text: 'Sunucu haritayı üretir, oyuncular yalnızca gördükleri kadarını bilir. Bu kural olmadan keşif diye bir şey kalmıyor.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'Dungeon Mates · harita üretimi',
      items: [
        { value: '643', note: 'satırlık üretici' },
        { value: '5', note: 'maksimum BSP derinliği' },
        { value: '10', note: 'kat, her biri farklı ayarlı' },
        { value: '5', note: 'patron katı' },
        { value: '4', note: 'oyuncuya kadar' },
      ],
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'BSP\'yi seçtiğim için memnunum. Ama bugün başlasam üretimden hemen sonra bir doğrulama adımı koyardım: her odadan merdivene ulaşılabiliyor mu diye basit bir dolaşma. Ağaç yapısı bunu garanti ediyor teorik olarak, ama "uncarve" hatasında gördüğüm gibi teori kodun tamamını kapsamıyor.',
    },
    {
      type: 'p',
      text: 'Hâlâ emin olmadığım şey oda boyutlarının oyuncu sayısına bağlanması. Mantıklı geliyor ama tek kişilik oyun ile dört kişilik oyun artık farklı hissettiriyor — aynı oyun olmalı mıydı, bilmiyorum.',
    },
  ],
}

export default post
