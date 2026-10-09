import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bsp-ile-prosedurel-zindan-uretmek',
  tag: 'Oyun',
  tagColor: '#a855f7',
  title: 'Dungeon Mates: Dört Kişilik Tarayıcı Zindanı',
  excerpt:
    "Dungeon Mates, oda koduyla dört kişi birlikte oynanan, her katı yeniden üretilen bir zindan oyunu. Oyunda ne var, sunucu neden her şeyi kendisi hesaplıyor ve haritaları hem rastgele hem oynanabilir yapmak için ne yaptım.",
  date: '2026-08-03',
  coverGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%)',
  content: [
    {
      type: 'lead',
      text: 'Dungeon Mates, tarayıcıda oynanan piksel grafikli bir zindan oyunu. Bir oda açıyorsun, dört haneli kodu arkadaşlarına veriyorsun, herkes sınıfını seçiyor ve birlikte on katlık bir zindana iniyorsunuz. Kurulum yok, indirme yok; tek başına da oynanabiliyor. Her kat o an üretiliyor, yani aynı zindanı iki kez görmüyorsun.',
    },
    {
      type: 'p',
      text: 'Arkadaşlarımla akşam bir saat oynayabileceğimiz, kimsenin bir şey kurmasını gerektirmeyen bir oyun istiyordum. Bir de merak ettiğim bir şey vardı: hiç hazır sprite ve ses dosyası kullanmadan, her şeyi kodla çizip kodla sentezleyerek bir oyun ne kadar iyi olabilir? Oyundaki bütün karakterler, canavarlar ve efektler piksel piksel Canvas ile çiziliyor; seslerin hiçbiri dosya değil, Web Audio ile o an üretiliyor.',
    },

    { type: 'h2', text: 'Oyunda Neler Var' },
    {
      type: 'steps',
      items: [
        {
          title: 'Dört Sınıf',
          text: 'Savaşçı yakın mesafede dayanıklı, Büyücü alan hasarı veriyor, Okçu uzaktan vuruyor, Şifacı takımı ayakta tutuyor. Her sınıfın kendi yeteneği ve kendi saldırı sesi var.',
        },
        {
          title: 'On Kat',
          text: 'Her kat bir öncekinden zor. Üçüncü, beşinci, yedinci ve sekizinci katlarda birer boss, onuncu katta Demon bekliyor. Kata göre değişen kurallar, güçlendirilmiş canavarlar, yetenek seçimi ve bir dükkân her turu bir öncekinden ayırıyor.',
        },
        {
          title: 'Dokuz Canavar',
          text: 'Fare sürüyle gelir, hayalet duvardan geçer, örümcek ağ atıp yavaşlatır, goblin canı azalınca kaçar. Her birinin kendi yapay zekâsı ve kendi davranışı var.',
        },
        {
          title: 'Birlikte Oynamak',
          text: 'Oda, sohbet, minimap ve sandıklar. Zorluk oyuncu sayısına göre ölçekleniyor; dört kişiyle canavarlar daha kalabalık ve daha dayanıklı, tek başına daha çok loot düşüyor.',
        },
      ],
    },
    {
      type: 'p',
      text: "Oyunun bir de hikâyesi var: yerin yedi kat altında kurulmuş Zephara şehri, kendi halkını kurtarmak isterken onu lanetleyen kral ve en altta onu bekleyen son savaş. Hikâye oyunun içinde satır satır anlatılmıyor; katlar, bosslar ve dükkândaki eşyalar ona göre adlandırılmış.",
    },

    { type: 'h2', text: 'Nasıl Çalışıyor' },
    {
      type: 'p',
      text: "Arayüz Next.js, oyun ise bir Node sunucusunda çalışıyor ve ikisi Socket.io ile konuşuyor. Bütün oyun mantığı sunucuda: canavarların yapay zekâsı, çarpışmalar, hasar, loot ve harita üretimi saniyede yirmi kez işleniyor. Tarayıcı yalnızca tuşları gönderiyor, gelen durumu Canvas'a çiziyor. Bu hem hileyi zorlaştırıyor hem de dört oyuncunun aynı dünyayı görmesini garanti ediyor.",
    },
    {
      type: 'p',
      text: 'Çizim tarafı mantıksal olarak 480×270 piksellik küçük bir ekrana yapılıyor ve sonra büyütülüyor; piksel grafiğin keskinliği oradan geliyor. Zemin, dekor, loot, canavarlar, mermiler, oyuncular, parçacıklar ve görüş sisi ayrı katmanlarda çiziliyor. Cihaz yavaş kalırsa oyun kare hızını izleyip kaliteyi kendisi düşürüyor. Telefonda ekranda bir joystick ve düğmeler var.',
    },
    {
      type: 'p',
      text: 'Bu yazının geri kalanı oyunun en çok uğraştıran parçası olan harita üretimine ayrılıyor; çünkü rastgele üretimin sorunu şu: çoğu zaman çalışıyor.',
    },

    { type: 'h2', text: 'Haritayı Nasıl Üretiyorum' },
    {
      type: 'p',
      text: 'Akla ilk gelen yol, rastgele yerlere rastgele boyutta odalar koyup sonra hepsini birbirine bağlamak. Bunun iki sorunu var. Odalar üst üste biner; çakışma kontrolü eklersen bu kez bazı odalar hiç yerleşemez. Odalar arasındaki bağlantılar da kopuk kalabilir: iki oda grubu oluşur ve birinden ötekine geçilemez.',
    },
    {
      type: 'p',
      text: 'Ben alanı ikiye bölerek ilerleyen yöntemi kullandım (BSP). Haritayı ikiye böl, her yarıyı yine ikiye böl, en alttaki parçalara birer oda koy. Odalar ayrı parçaların içinde olduğu için çakışamıyor. Bağlarken de ağacın kendisini izliyorsun: sol daldaki bir oda sağ daldaki bir odayla birleşiyor, köke çıkınca bütün harita bağlanmış oluyor. Her odaya ulaşılabilmesi yapının kendisinden geliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `if (depth > 5) return;

const canSplitH = node.height >= this.minBspSize * 2;
const canSplitV = node.width >= this.minBspSize * 2;
if (!canSplitH && !canSplitV) return;

// Uzun kenarı böl: yoksa içine oda sığmayan ince parçalar çıkıyor.
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
      text: 'Bir parçanın en küçük boyu, en büyük oda artı dört kare. Bir parçaya en büyük oda bile konsa kenarlarda koridorların geçebileceği ikişer karelik pay kalıyor; bu pay olmasa odalar parçanın kenarına yapışır ve koridorlar duvarların içinden geçmek zorunda kalırdı. Koridorlar L biçiminde ve iki kare genişliğinde; hangi kolun önce oyulacağına yazı tura karar veriyor, böylece aynı iki oda arasında iki farklı yol çıkabiliyor.',
    },

    { type: 'h2', text: 'Oyuncu Sayısı Haritayı Değiştiriyor' },
    {
      type: 'p',
      text: 'Tek kişi için büyük bir harita fazla; dakikalarca boş koridorda yürürsün. Dört kişi için küçük bir harita da fazla; herkes birbirinin üstüne düşer. Bu yüzden harita boyutu oyuncu sayısına bağlı.',
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
      text: 'Kat numarası ikinci bir ayar: yukarı çıktıkça oda sayısı, canavarların canı ve saldırı gücü artıyor. Bu iki ayarın birbirini ezebildiğini bir denge hatasıyla öğrendim. Oyuncu sayısına göre ölçekleyen fonksiyon kat ölçeğini siliyordu; dört kişilik oyunda canavarlar birinci kat seviyesinde kalmış, tek kişilik oyun ise iki kat zorlaşmıştı.',
    },

    { type: 'h2', text: 'Hiçbir Odaya Ait Olmayan Boşluklar' },
    {
      type: 'p',
      text: 'Bazı katlarda tuhaf bir şey oluyordu: üzerinde yürünebilen ama içinde canavar doğmayan, oraya basınca hiçbir şey tetiklenmeyen boşluklar. Harita üretilmişti, odalar vardı, oyun çalışıyordu. Sebep şuydu: ağaç bazen katın istediğinden fazla oda üretiyor ve ben fazla odaları listeden çıkarıyordum. Ama odalar listeye girmeden önce haritaya oyulmuştu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'server/dungeon/DungeonGenerator.ts',
      text: `// Fazla odaların zemini zaten oyulmuştu; geri duvara çevir.
// Yoksa hiçbir odaya ait olmayan, canavarsız boşluklar kalıyor.
if (this.rooms.length > targetMax) {
  for (let i = targetMax; i < this.rooms.length; i++) {
    this.uncarveRoom(this.rooms[i]);
  }
  this.rooms = this.rooms.slice(0, targetMax);
}`,
    },
    {
      type: 'p',
      text: 'Diziden silmek odayı oyunun mantığından çıkarıyordu ama zeminden çıkarmıyordu. Oyuncu oraya yürüyebiliyor, oyun ise orayı tanımıyordu. Açılan alanı yeniden duvara çeviren küçük bir fonksiyon yazmam gerekti.',
    },

    { type: 'h2', text: 'Haritayı Kim Görüyor' },
    {
      type: 'p',
      text: "Harita sunucuda üretiliyor, çünkü canavarlar ve dövüş zaten orada. Yalnızca bir tohum paylaşıp her tarayıcının aynı haritayı kendisinin üretmesi cazip görünüyor; ağ trafiği neredeyse sıfıra iner. Ama JavaScript'in rastgele sayı üreteci tohum almıyor ve iki tarafın birebir aynı davrandığından emin olmak ayrı bir iş.",
    },
    {
      type: 'p',
      text: "Burada bir itirafım var. Sunucu her katın başında haritanın tamamını her oyuncuya bir kez gönderiyor. Görüş sisi, yani görülmemiş, keşfedilmiş ve görünür ayrımı yalnızca çizimde uygulanıyor. Meraklı bir oyuncu tarayıcının ağ sekmesini açıp boss odasının nerede olduğunu görebilir. Co-op bir oyunda kandırılacak bir rakip yok; şimdilik sorun değil.",
    },
    {
      type: 'quote',
      text: 'Sunucu haritayı üretiyor ama oyuncudan saklamıyor. Keşfetme hissi tamamen çizimden geliyor.',
    },

    { type: 'h2', text: 'Geriye Dönüp Bakınca' },
    {
      type: 'p',
      text: 'Bugün başlasam üretimden hemen sonra bir kontrol adımı koyardım: her yürünebilir karenin bir odaya ya da koridora ait olduğunu ve her odadan merdivene ulaşılabildiğini kontrol eden basit bir dolaşma. Ağaç yapısı odaların bağlı olmasını garanti ediyor ama sahipsiz boşluklar bu garantinin kodun tamamını kapsamadığını gösterdi.',
    },
    {
      type: 'p',
      text: 'Emin olmadığım bir karar da harita boyutunun oyuncu sayısına bağlanması. Tek kişilik oyun ile dört kişilik oyun artık farklı haritalarda oynanıyor ve ikisinin aynı oyun olması gerekip gerekmediğini hâlâ bilmiyorum. Bir gün rekabetçi bir mod gelirse haritanın tamamını göndermeyi de yeniden düşünmem gerekecek.',
    },
  ],
}

export default post
