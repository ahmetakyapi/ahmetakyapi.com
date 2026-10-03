import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bsp-ile-prosedurel-zindan-uretmek',
  tag: 'Oyun',
  tagColor: '#a855f7',
  title: "Dungeon Mates: Arkadaşlarla Oynanan, Her Seferinde Yeni Bir Zindan",
  excerpt:
    'Rastgele zindan üretmek kolay; zor olan, her katın oynanabilir çıkması. BSP ile nasıl kurduğumu ve hiçbir odaya ait olmayan boşlukları nasıl kapattığımı yazdım.',
  date: '2026-08-03',
  coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bazı katlarda hiçbir odaya ait olmayan boşluklar vardı. Üzerinde yürünebiliyordu ama içinde canavar doğmuyor, oraya basınca hiçbir şey tetiklenmiyordu. Harita üretilmişti, odalar vardı, oyun çalışıyordu. Rastgele üretimin sorunu da bu: çoğu zaman çalışıyor.',
    },
    {
      type: 'p',
      text: 'Dungeon Mates tarayıcıda oynanan, en fazla dört kişilik bir co-op zindan oyunu. Her kat baştan üretiliyor ve her seferinde hem farklı hem de oynanabilir olması gerekiyor.',
    },

    { type: 'h2', text: 'Neden Tamamen Rastgele Değil' },
    {
      type: 'p',
      text: 'Akla ilk gelen yol, rastgele yerlere rastgele boyutta dikdörtgenler koyup sonra hepsini birbirine bağlamak. Bunun iki sorunu var. Odalar üst üste biner; çakışma kontrolü eklersen bu kez bazı odalar hiç yerleşemez. Odalar arasındaki bağlantılar da kopuk kalabilir: iki oda grubu oluşur ve birinden ötekine hiç geçilemez.',
    },
    {
      type: 'p',
      text: 'BSP (binary space partitioning, alanı ikiye bölerek ilerleme) ikisini birden çözüyor. Alanı ikiye böl, her yarıyı yine ikiye böl, en alttaki parçalara birer oda koy. Odalar ayrı parçaların içinde olduğu için çakışamıyor. Bağlarken de ağacın kendisini izliyorsun, yani her odaya ulaşılabilmesi yapının kendisinden geliyor.',
    },

    { type: 'h2', text: 'Bölme Yönünü Kim Seçiyor' },
    {
      type: 'p',
      text: 'Yön tamamen rastgele seçilirse içine oda sığmayan ince, uzun parçalar çıkar. Çözüm basit: parçanın en ve boyuna bak, uzun kenarı böl.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `if (depth > 5) return;

const canSplitH = node.height >= this.minBspSize * 2;
const canSplitV = node.width >= this.minBspSize * 2;
if (!canSplitH && !canSplitV) return;

let splitHorizontally: boolean;
if (canSplitH && canSplitV) {
  splitHorizontally = node.height > node.width ? true
    : node.width > node.height ? false
    : Math.random() > 0.5;
} else {
  splitHorizontally = canSplitH;
}`,
    },
    {
      type: 'p',
      text: 'Ağaç en fazla beş seviye iniyor. Bir parçanın bir yönde bölünebilmesi için o kenarın en az iki `minBspSize` olması gerekiyor. O değer de şöyle tanımlı:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `this.roomMaxSize = sizeConfig.roomMax;
this.minBspSize = this.roomMaxSize + 4;`,
    },
    {
      type: 'p',
      text: 'En büyük oda artı dört. Bir parçaya en büyük oda bile konsa kenarlarda koridorların geçebileceği ikişer karelik pay kalıyor. Bu pay olmasa odalar parçanın kenarına yapışır ve koridorlar duvarların içinden geçmek zorunda kalırdı.',
    },

    { type: 'h2', text: 'Oyuncu Sayısı Haritayı Değiştiriyor' },
    {
      type: 'p',
      text: 'Tek kişi için 72×72\'lik bir harita fazla büyük; dakikalarca boş koridorda yürürsün. Dört kişi için 48×48 fazla küçük; herkes birbirinin üstüne düşer. Bu yüzden harita boyutu oyuncu sayısına bağlı.',
    },
    {
      type: 'table',
      head: ['Oyuncu', 'Harita', 'Oda Boyutu'],
      rows: [
        ['1', '48 × 48', '6-11'],
        ['2', '56 × 56', '7-12'],
        ['3', '64 × 64', '7-13'],
        ['4', '72 × 72', '8-14'],
      ],
    },
    {
      type: 'p',
      text: 'Kat numarası ikinci bir ayar. Yukarı çıktıkça oda sayısı, canavarların canı ve saldırı gücü artıyor; boss\'lar 3, 5, 7, 8 ve 10. katlarda. Bu iki ayarın birbirini ezebildiği 31 Temmuz\'da düzelttiğim bir denge hatasında ortaya çıktı: oyuncu sayısına göre ölçekleyen fonksiyon, kat ölçeğini siliyordu. Co-op oyunda canavarlar 1. kat seviyesinde kalmış, tek kişilik oyun ise iki kat zorlaşmıştı.',
    },

    { type: 'h2', text: 'Fazla Oda Üretince Ne Oluyor' },
    {
      type: 'p',
      text: 'Girişteki boşluklar buradan çıktı. BSP ağacı bazen katın istediğinden fazla oda üretiyor. Fazla odaları listeden çıkarmak yetmedi, çünkü odalar listeye girmeden önce haritaya oyulmuştu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `// Trim to max. The dropped rooms' tiles were already carved, so uncarve them —
// otherwise they stay as walkable floor belonging to no room: no monsters spawn
// there, the tile→room grid returns -1, and standing in them activates nothing.
if (this.rooms.length > targetMax) {
  for (let i = targetMax; i < this.rooms.length; i++) {
    this.uncarveRoom(this.rooms[i]);
  }
  this.rooms = this.rooms.slice(0, targetMax);
}`,
    },
    {
      type: 'p',
      text: 'Diziden silmek odayı oyunun mantığından çıkarıyordu ama zeminden çıkarmıyordu. Oyuncu oraya yürüyebiliyor, oyun ise orayı tanımıyordu. Açılan alanı yeniden duvara çeviren bir fonksiyon (`uncarveRoom`) yazmam gerekti.',
    },

    { type: 'h2', text: 'Koridorlar' },
    {
      type: 'p',
      text: 'Bağlama işi ağacın iç düğümlerinde yapılıyor: sol daldaki bir oda sağ daldaki bir odayla birleşiyor. Köke çıkıldığında bütün harita birbirine bağlanmış oluyor.',
    },
    {
      type: 'p',
      text: 'Koridorlar L biçiminde: önce yatay sonra dikey, ya da tersi. Hangi kolun önce oyulacağına yazı tura karar veriyor. Tek satırlık bir karar, ama aynı iki oda arasında iki farklı yol çıkabiliyor ve harita daha az kalıp gibi duruyor. Koridorlar iki kare genişliğinde; koddaki not gerekçeyi tek kelimeyle söylüyor: oynanabilirlik.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Koridorun odaya açıldığı yer de ayrı bir karar istedi. Lav havuzları oda kenarından en az iki kare içeride başlıyor. Yoksa koridordan çıkan oyuncu, havuzu görmeden doğrudan lavın içine basardı.',
    },

    { type: 'h2', text: 'Haritayı Kim Üretiyor, Kim Görüyor' },
    {
      type: 'p',
      text: 'Harita sunucuda üretiliyor. Canavarların yapay zekâsı, çarpışmalar ve dövüş zaten orada çalıştığı için haritanın da orada olması gerekiyordu.',
    },
    {
      type: 'p',
      text: 'Yalnızca bir seed paylaşıp her istemcinin aynı haritayı kendisinin üretmesi cazip görünüyor; ağ trafiği neredeyse sıfıra iner. Ama `Math.random()` seed almıyor. Bu yolu seçseydim seed alan bir rastgele sayı üreteci yazmam ve üretim kodunun iki tarafta birebir aynı davrandığından emin olmam gerekirdi.',
    },
    {
      type: 'p',
      text: 'Burada bir itirafım var. Sunucu her katın başında haritanın tamamını, bütün kareler ve odalarla birlikte, her istemciye bir kez gönderiyor. Görüş sisi (görülmemiş, keşfedilmiş, görünür) yalnızca çizimde uygulanıyor. Yani meraklı bir oyuncu tarayıcının ağ sekmesini açıp boss odasının nerede olduğunu görebilir.',
    },
    {
      type: 'quote',
      text: 'Sunucu haritayı üretiyor ama oyuncudan saklamıyor. Keşfetme hissi tamamen çizimden geliyor.',
    },

    { type: 'h2', text: 'Sayılarla' },
    {
      type: 'stats',
      label: 'Dungeon Mates · Harita Üretimi',
      items: [
        { value: '643', note: 'Satırlık Üretici' },
        { value: '5', note: 'En Fazla BSP Derinliği' },
        { value: '10', note: 'Kat, Her Biri Farklı Ayarlı' },
        { value: '5', note: 'Boss Katı' },
        { value: '4', note: 'Oyuncuya Kadar' },
      ],
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bugün başlasam üretimden hemen sonra bir kontrol adımı koyardım: her yürünebilir karenin bir odaya ya da koridora ait olduğunu ve her odadan merdivene ulaşılabildiğini kontrol eden basit bir dolaşma. Ağaç yapısı odaların birbirine bağlı olmasını garanti ediyor, ama sahipsiz boşluklar bu garantinin kodun tamamını kapsamadığını gösterdi.',
    },
    {
      type: 'p',
      text: 'Emin olmadığım iki şey var. Birincisi harita ve oda boyutlarının oyuncu sayısına bağlanması: tek kişilik oyun ile dört kişilik oyun artık farklı haritalarda oynanıyor ve ikisinin aynı oyun olması gerekip gerekmediğini bilmiyorum. İkincisi haritanın tamamını göndermek. Co-op bir oyunda kandırılacak bir rakip yok; belki sorun değil. Ama oyuna bir gün rekabetçi bir mod girerse bu kararı yeniden açmak gerekecek.',
    },
  ],
}

export default post
