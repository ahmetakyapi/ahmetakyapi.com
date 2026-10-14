import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bilmedigim-meslege-arac-yazmak',
  tag: 'Ürün',
  tagColor: '#2b62f5',
  title: 'Mimio: Ergoterapistler İçin Seans ve Oyun Paneli',
  excerpt:
    "Mimio, ergoterapistlerin danışanlarını, seanslarını ve terapi oyunlarını tek panelde yönettiği bir uygulama. Başladığımda mesleği bilmiyordum; panelde ne var, nasıl kurdum ve bilmediğim bir alana araç yazarken ne öğrendim.",
  date: '2026-08-06',
  coverGradient: 'linear-gradient(135deg, #2b62f5 0%, #1d8ad4 55%, #17c2e0 100%)',
  content: [
    {
      type: 'lead',
      text: "Mimio, çocuklar ve yetişkinlerle çalışan ergoterapistler için yaptığım bir klinik panel. Terapist danışanlarının profilini açıyor, haftalık program kuruyor, seansta tarayıcıdan açılan küçük terapi oyunlarını oynatıyor ve oyunun bıraktığı skor doğrudan danışanın dosyasına düşüyor. Zamanla o dosyadan bir ilerleme çizgisi çıkıyor; terapist aileye ya da kuruma rapor verirken o çizgiye bakıyor.",
    },
    {
      type: 'p',
      text: "Fikir bir ergoterapistle sohbetten çıktı: seanslarda oynatılan oyunlar ölçülebilir veri üretsin, veri elle not defterine değil danışanın dosyasına gitsin. Mimio'yu yazmaya başladığımda ergoterapinin ne olduğunu tam bilmiyordum. Bu yazı o yüzden biraz da bilmediğin bir mesleğe araç yazmanın hikâyesi.",
    },

    { type: 'h2', text: 'Panelde Neler Var' },
    {
      type: 'steps',
      items: [
        {
          title: 'Danışanlar',
          text: 'Her danışanın profili: yaş grubu, birincil hedef, bağımsızlık düzeyi, etiketler. Bağımsızlık beş kademeli bir ölçek; tam bağımlıdan bağımsıza kadar.',
        },
        {
          title: 'Haftalık Plan',
          text: 'Danışan bazında bir terapi programı. Hangi gün hangi aktivite, hangi oyun; terapist sürükleyip yerleştiriyor.',
        },
        {
          title: 'Terapi Oyunları',
          text: 'Yedi oyun, her biri başka bir beceriye bakıyor. Oyun bitince skor, süre ve hata sayısı danışanın dosyasına yazılıyor.',
        },
        {
          title: 'Seans Notları',
          text: 'Oyun sonrası ya da bağımsız seans gözlemi. Serbest metin ya da mesleğin kendi biçimi olan SOAP notu.',
        },
        {
          title: 'İlerleme Raporu',
          text: 'Oyun skorları ve seans verileri üzerinden danışanın gelişimi; en iyi ve son skor yan yana, grafiklerle.',
        },
      ],
    },
    {
      type: 'table',
      head: ['Oyun', 'Baktığı Beceri'],
      rows: [
        ['Sıra Hafızası', 'Görsel-uzamsal çalışma belleği'],
        ['Kart Eşle', 'Görsel bellek ve sistematik arama'],
        ['Mavi Nabız', 'Motor beceri, hız ve isabet dengesi'],
        ['Komut Rotası', 'Yürütücü işlev, komut takibi ve kendini durdurabilme'],
        ['Fark Avcısı', 'Görsel algı, figür ile zemini ayırma'],
        ['Hedef Tarama', 'Seçici dikkat'],
        ['Dizi Mantık', 'Örüntü tamamlama ve akıl yürütme'],
      ],
    },
    {
      type: 'p',
      text: "Oyunların her biri ergoterapi literatüründe karşılığı olan bir paradigmaya dayanıyor; mesela Sıra Hafızası klasik Corsi blok testinin oyunlaştırılmış hâli. Bunu ben uydurmadım, mesleğin zaten kullandığı ölçekleri ekrana taşıdım. Panelde ayrıca yedi uzmanlık alanı için (pediatri, nörolojik rehabilitasyon, geriatri gibi) kanıta dayalı aktivite önerileri var.",
    },

    { type: 'h2', text: 'Nasıl Kurdum' },
    {
      type: 'p',
      text: "Next.js 15 ve TypeScript, stil Tailwind v4, hareket Framer Motion. Veritabanı Neon üzerinde Postgres ve HTTP sürücüsüyle konuşuyorum; Vercel'de her istek ayrı bir fonksiyonda çalıştığı için klasik bağlantı havuzu burada iş görmüyor. Parolalar Postgres'in kendi eklentisiyle bcrypt olarak hash'leniyor, oturum imzalı bir çerezde.",
    },
    {
      type: 'p',
      text: 'Panelde danışan adları, seans notları ve gelişim kayıtları duruyor. Bu bir hobi projesinin verisi gibi ele alınamaz. O yüzden bir şeyi bilerek yapmadım: hiçbir yere analitik, hata izleme ya da üçüncü taraf script koymadım. Bir hata raporu, içinde bir seans notuyla başka bir şirketin sunucusuna gidebilirdi.',
    },

    { type: 'h2', text: 'Mesleğin Kendi Dili Vardı: SOAP' },
    {
      type: 'p',
      text: 'İlk hatamı seans notunda yaptım. İlk sürümde not tek bir serbest metin kutusuydu; oyun kaydının yanında bir metin sütunu, o kadar. Oysa bu mesleğin onlarca yıldır kullandığı bir not biçimi var ve ben onu ilk haftanın sonunda öğrendim.',
    },
    {
      type: 'table',
      head: ['Harf', 'Ne Yazılır', 'Kim Söylüyor'],
      rows: [
        ['S · Subjektif', 'Danışanın ya da ailesinin anlattığı', 'Danışan'],
        ['O · Objektif', 'Seansta gözlenen, ölçülen', 'Terapist'],
        ['A · Assessment', 'Bu ikisinden çıkan değerlendirme', 'Terapist'],
        ['P · Plan', 'Bir sonraki adım', 'Terapist'],
      ],
    },
    {
      type: 'p',
      text: 'Sıra bir düşünme sırası: önce ne duyduğunu yaz, sonra ne gördüğünü, en son ne düşündüğünü. Yorum gözlemden ayrı duruyor. Benim tek kutumda bu ayrım yoktu; gözlem ile yorum aynı cümlede karışabiliyordu. SOAP panele girdi ama serbest notu da kaldırmadım. On dakikalık bir kontrol seansında dört bölümlük not yazmaya zorlanan biri büyük ihtimalle hiçbir şey yazmaz.',
    },
    {
      type: 'quote',
      text: 'Bir mesleğe araç yazıyorsan, o meslek kendi kavramlarına çoktan ad vermiştir. Yeni bir sözlük icat etmene gerek yok; var olanı ekrana doğru yerleştirmen yeter.',
    },

    { type: 'h2', text: 'Her Oyun Bir Kayıt Bırakıyor' },
    {
      type: 'p',
      text: 'Terapist için işe yarayan kısım oyunun kendisi değil, oyun bitince geride kalan kayıt. Her oyun için en iyi skor, son skor, kaç kez oynandığı ve en son ne zaman oynandığı tutuluyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/platform-data.ts',
      text: `export interface RemoteScoreSummary {
  label: string;
  best: number;
  last: number;
  sessions: number;
  lastPlayedAt: string | null;
}`,
    },
    {
      type: 'p',
      text: 'En iyi ile son skorun ayrı tutulması küçük bir ayrıntı gibi duruyor. Yalnızca en iyiyi saklasan ilerleme hep yukarı gidiyor gibi görünür; yalnızca sonuncuyu saklasan kötü bir gün bütün tabloyu bozar. İkisi birlikte "iyi gününde ne yapıyor, bugün ne yaptı" sorusunu cevaplıyor.',
    },
    {
      type: 'p',
      text: 'Skorları yorumlayan tek bir yer var: ilerleme raporundaki oyun tablosu, en az üç seans varsa ilk ve son skoru karşılaştırıyor ve "artıyor", "düşüyor" ya da "stabil" yazıyor. Bunun eşiği dört puan. O dört puanı bir terapist değil, ben seçtim ve bu rapor aileye gidiyor. Bu, projede hâlâ en az rahat olduğum karar.',
    },

    { type: 'h2', text: 'Şema Her Hafta Değişti, Migration Yazmadım' },
    {
      type: 'p',
      text: 'Teknik tarafta en çok itiraz alacak karar bu. Alanı bilmediğim için şemayla ilgili tahminlerim tutmuyordu ve öğrendikçe değişiyordu. İlk haftanın sonunda danışan tablosuna zorluk düzeyi, arşivleme tarihi, etiketler ve doğum tarihi eklenmişti. Tek kişilik bir projede her değişiklikte migration üretip uygulamak, kazandırdığından fazlasını götürüyordu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden şemayı, kaç kez çalışırsa çalışsın aynı sonucu veren SQL cümleleri olarak tuttum. Liste her yayından önce baştan sona çalışıyor: tablo varsa atlıyor, kolon yoksa ekliyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/server/platform-db.ts',
      text: `const SCHEMA_QUERIES = [
  "CREATE EXTENSION IF NOT EXISTS pgcrypto",
  \`CREATE TABLE IF NOT EXISTS therapist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL UNIQUE,
    clinic_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )\`,
  // Tablo zaten varsa CREATE atlanır, kolon eklemesi yine de çalışır.
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS specialty TEXT",
  // ...
]`,
    },
    {
      type: 'p',
      text: 'ORM de yok; sorgular yer tutucularla düz SQL. Bunun karşılığında bazı şeylerden vazgeçtim: satırların tipini elle yazıyorum ve kolon adını yanlış yazarsam bunu derleme değil çalışma zamanı söylüyor. Kolon silmek ya da tip değiştirmek elle SQL demek. Altı tablolu, tek geliştiricili bir projede bu bedeli ödemeye razıyım.',
    },
    {
      type: 'compare',
      label: 'Aynı Geliştirici, Aynı Veritabanı, İki Farklı Karar',
      before: { label: 'Mimio · 6 Tablo', value: 'Düz SQL' },
      after: { label: 'Açılış Zili · 13+ Tablo', value: 'Drizzle' },
      note: 'Kararı veren soru şuydu: aynı tabloyu kaç yerden okuyorum? Bir yerden okuyorsan tipi elle yazmak sorun değil. Birçok yerden okuyorsan tipin şemadan türemesi hatayı derlemede yakalıyor.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Bilmediğin bir alana araç yazarken en pahalı hata, alanı kendi kafandaki modele göre kurmak. SOAP altı gün sonra panele girdi ve ucuz atlattım. Aynı şey altı ay sonra olsaydı elimde düzensiz notlarla dolu bir veritabanı olurdu.',
    },
    {
      type: 'p',
      text: 'Şemanın belirsiz olması teknoloji seçimini de değiştirdi. "ORM kullanmalı mıyım" sorusunun cevabı projenin hangi aşamada olduğuna bağlıymış. Alanı öğrenip şema oturduğunda Mimio\'yu Drizzle\'a taşımak mantıklı olabilir. O gün henüz gelmedi.',
    },
  ],
}

export default post
