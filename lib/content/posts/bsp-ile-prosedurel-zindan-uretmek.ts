import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bsp-ile-prosedurel-zindan-uretmek',
  tag: 'Oyun',
  tagColor: '#a855f7',
  title: "Dungeon Mates: Her Kat Farklı, Hiçbiri Bozuk Değil",
  excerpt:
    'Prosedürel zindan üretmek kolay; zor olan, çıkan zindanın gezilebilir olması. BSP ile nasıl kurduğumu ve sahipsiz boşlukları nasıl kapattığımı yazdım.',
  date: '2026-02-14',
  coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
  content: [
    {
      type: 'lead',
      text: 'Bazı katlarda kimseye ait olmayan boşluklar vardı. Yürünebiliyordu ama hiçbir odanın parçası değildi: içinde canavar doğmuyor, sandık çıkmıyor, oraya basınca hiçbir şey tetiklenmiyordu. Harita üretilmişti, odalar vardı, oyun çalışıyordu. Rastgeleliğin sorunu tam olarak bu: çoğu zaman çalışıyor.',
    },
    {
      type: 'p',
      text: 'Dungeon Mates tarayıcıda çalışan, en fazla dört kişilik kooperatif bir zindan oyunu. Her kat yeniden üretiliyor. Bu yazı "her seferinde farklı" ile "her seferinde oynanabilir" arasındaki gerilimle ilgili.',
    },

    { type: 'h2', text: 'Neden Tamamen Rastgele Değil' },
    {
      type: 'p',
      text: 'Akla ilk gelen yol, rastgele yerlere rastgele boyutta dikdörtgenler koyup sonra hepsini birbirine bağlamak. İki sorunu var. Odalar üst üste biner; çakışma kontrolü eklersen bu kez bazı odalar hiç yerleşemez. Bağlantı grafiği de bağlı olmayabilir: iki oda kümesi oluşur ve birbirine hiç ulaşmaz.',
    },
    {
      type: 'p',
      text: 'BSP (ikili alan bölümleme) ikisini birden çözüyor. Alanı ikiye böl, her yarıyı yine ikiye böl, en alttaki parçalara birer oda koy. Odalar ayrı parçaların içinde olduğu için çakışamıyor. Bağlarken de ağacın kendisini izliyorsun, yani bağlılık yapıdan geliyor.',
    },

    { type: 'h2', text: 'Bölme Yönünü Kim Seçiyor' },
    {
      type: 'p',
      text: 'Yön tamamen rastgele seçilirse içine oda sığmayan ince, uzun parçalar çıkar. Çözüm basit: parçanın oranına bak, uzun kenarı böl.',
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
      text: 'Ağaç en fazla beş seviye iniyor. Bir parçanın bölünebilmesi için en kısa kenarının iki `minBspSize` kadar olması gerekiyor ve o değer de şöyle tanımlı:',
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
      text: 'En büyük oda artı dört. Her parçaya en büyük oda bile konsa kenarlarda koridorların geçebileceği ikişer birimlik pay kalıyor. Bu pay olmasa odalar parçanın kenarına yapışır ve koridorlar duvarların içinden geçmek zorunda kalırdı.',
    },

    { type: 'h2', text: 'Oyuncu Sayısı Haritayı Değiştiriyor' },
    {
      type: 'p',
      text: 'Tek kişi için 72×72\'lik bir harita fazla büyük; dakikalarca boş koridorda yürürsün. Dört kişi için 48×48 fazla küçük; herkes birbirinin üstünde olur. Harita boyutu bu yüzden oyuncu sayısına bağlı.',
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
      text: 'Kat numarası ayrı bir katman. Yukarı çıktıkça oda sayısı, canavar canı ve saldırı gücü artıyor; patronlar 3, 5, 7, 8 ve 10. katlarda. Bu iki katmanın birbirini ezebildiğini bir denge hatasında gördüm: oyuncu sayısına göre ölçekleme yapan fonksiyon, kat ölçeğini siliyordu. Kooperatif oyunda canavarlar 1. kat seviyesinde donup kalmış, tek kişilik oyun ise iki kat sert olmuştu.',
    },

    { type: 'h2', text: 'Fazla Oda Üretince Ne Oluyor' },
    {
      type: 'p',
      text: 'Girişteki boşlukların hikâyesi burada. BSP ağacı bazen katın istediğinden fazla oda üretiyor. Fazlalıkları listeden çıkarmak yetmedi, çünkü odalar listeye girmeden önce haritaya oyulmuştu.',
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
      text: 'Diziden silmek odayı oyunun mantığından çıkarıyordu ama zeminden çıkarmıyordu. Oyuncu oraya yürüyebiliyor, oyun ise orayı tanımıyordu. Açılan alanı geri kapatan bir fonksiyon yazmak zorunda kaldım.',
    },

    { type: 'h2', text: 'Koridorlar' },
    {
      type: 'p',
      text: 'Bağlama işi ağacın iç düğümlerinde yapılıyor: sol alt ağacın bir odası sağ alt ağacın bir odasıyla birleşiyor. Kök düğüme çıkıldığında bütün harita bağlanmış oluyor.',
    },
    {
      type: 'p',
      text: 'Koridorlar L biçimli: önce yatay sonra dikey, ya da tersi. Hangi kolun önce oyulacağı yazı turayla seçiliyor. Tek satırlık bir karar, ama aynı oda çiftini bağlayan iki farklı yol çıkıyor ve harita daha az kalıp gibi duruyor. Koridorlar iki kare genişliğinde; koddaki not bunun gerekçesini tek kelimeyle söylüyor: oynanabilirlik.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Koridorun odaya açıldığı yer de ayrı bir karar istedi. Lav havuzları oda kenarından en az iki kare içeride başlıyor. Yoksa koridordan çıkan oyuncu, havuzu görme şansı bulmadan doğrudan lavın içine basardı.',
    },

    { type: 'h2', text: 'Haritayı Kim Üretiyor, Kim Görüyor' },
    {
      type: 'p',
      text: 'Harita sunucuda üretiliyor. Canavarların yapay zekâsı, çarpışmalar ve dövüş zaten orada koştuğu için haritanın da orada olması gerekiyordu.',
    },
    {
      type: 'p',
      text: 'Yalnızca bir tohum (seed) paylaşıp her istemcinin aynı haritayı kendisinin üretmesi cazip görünüyor, ağ trafiği neredeyse sıfıra iniyor. Ama `Math.random()` tohum almıyor. Bu yolu seçseydim tohumlu bir rastgele sayı üreteci yazmam ve üretim kodunun iki tarafta bit bit aynı davrandığından emin olmam gerekirdi.',
    },
    {
      type: 'p',
      text: 'Burada bir itirafım var. Sunucu her katın başında haritanın tamamını, bütün kareler ve odalarla birlikte, her istemciye bir kez gönderiyor. Sis (görülmemiş, keşfedilmiş, görünür) yalnızca çizimde uygulanıyor. Yani meraklı bir oyuncu ağ sekmesini açıp patron odasının nerede olduğunu görebilir.',
    },
    {
      type: 'quote',
      text: 'Sunucu haritayı üretiyor ama saklamıyor. Keşif hissini veri değil, çizim taşıyor.',
    },

    { type: 'h2', text: 'Rakamlarla' },
    {
      type: 'stats',
      label: 'Dungeon Mates · Harita Üretimi',
      items: [
        { value: '643', note: 'Satırlık Üretici' },
        { value: '5', note: 'Maksimum BSP Derinliği' },
        { value: '10', note: 'Kat, Her Biri Farklı Ayarlı' },
        { value: '5', note: 'Patron Katı' },
        { value: '4', note: 'Oyuncuya Kadar' },
      ],
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'BSP\'yi seçtiğime memnunum. Ama bugün başlasam üretimden hemen sonra bir doğrulama adımı koyardım: her yürünebilir karenin bir odaya ya da koridora ait olduğunu ve her odadan merdivene ulaşılabildiğini kontrol eden basit bir dolaşma. Ağaç yapısı bağlılığı garanti ediyor, ama sahipsiz boşluklar bana garantinin kodun tamamını kapsamadığını gösterdi.',
    },
    {
      type: 'p',
      text: 'Emin olmadığım iki şey var. Birincisi oda boyutlarının oyuncu sayısına bağlanması: mantıklı geliyor ama tek kişilik oyun ile dört kişilik oyun artık farklı hissettiriyor ve aynı oyun olmalı mıydı, bilmiyorum. İkincisi haritanın tamamını göndermek. Kooperatif bir oyunda kandırılacak bir rakip yok; belki sorun değil. Ama oyuna bir gün rekabetçi bir mod girerse bu kararı yeniden açmak gerekecek.',
    },
  ],
}

export default post
