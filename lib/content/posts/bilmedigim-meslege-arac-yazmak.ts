import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bilmedigim-meslege-arac-yazmak',
  tag: 'Ürün',
  tagColor: '#2b62f5',
  title: "Mimio: Ergoterapide Seans Takibi",
  excerpt:
    'Mimio ergoterapistler için bir panel; başladığımda ergoterapiyi bilmiyordum. Seans notunu kafama göre kurdum, mesleğin oturmuş not biçimi altı gün sonra geldi.',
  date: '2026-08-06',
  coverGradient: 'linear-gradient(135deg, #2b62f5 0%, #1d8ad4 55%, #17c2e0 100%)',
  content: [
    {
      type: 'lead',
      text: 'Mimio\'yu yazmaya başladığımda ergoterapinin ne olduğunu tam bilmiyordum. Fikir şuydu: terapistin seansta oynattığı oyunlar ölçülebilir veri üretsin, bu veri danışanın dosyasına düşsün ve zamanla bir ilerleme çizgisi çıksın. İlk hatayı seans notunda yaptım.',
    },
    {
      type: 'p',
      text: 'İlk sürümde seans notu tek bir serbest metin alanıydı: oyun kaydının yanında `session_note TEXT` sütunu, o kadar. Oysa bu mesleğin onlarca yıldır kullandığı bir not biçimi var. 14 Mart\'taki ilk commit\'ten altı gün sonra o biçim panele girdi.',
    },

    { type: 'h2', text: 'Mesleğin Kendi Dili Vardı: SOAP' },
    {
      type: 'p',
      text: 'SOAP, sağlıkta yaygın kullanılan bir klinik not biçimi. Dört harf, dört bölüm. Sıraları da bir düşünme sırasını izliyor:',
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
      text: 'Sıra şunu söylüyor: önce ne duyduğunu yaz, sonra ne gördüğünü, en son ne düşündüğünü. Yorum gözlemden ayrı duruyor. Benim tek kutumda bu ayrım yoktu; gözlem ile yorum aynı paragrafta, hatta aynı cümlede karışabiliyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/platform-data.ts',
      text: `export type NoteMode = "free" | "soap";

export interface SoapNoteContent {
  s: string; // Subjektif
  o: string; // Objektif
  a: string; // Assessment
  p: string; // Plan
}`,
    },
    {
      type: 'quote',
      text: 'Bir mesleğe araç yazıyorsan, o meslek kendi kavramlarına çoktan ad vermiştir. Yeni bir sözlük icat etmene gerek yok; var olanı ekrana doğru yerleştirmen yeter.',
    },
    {
      type: 'p',
      text: 'Serbest notu kaldırmadım; `NoteMode` iki seçenekli. Her seans dört bölümlük bir not gerektirmiyor. On dakikalık bir kontrol seansında SOAP yazmaya zorlanan biri büyük ihtimalle hiçbir şey yazmaz.',
    },

    { type: 'h2', text: 'Her Oyun Bir Kayıt Bırakıyor' },
    {
      type: 'p',
      text: 'Panelde yedi terapi oyunu var ve hepsinin adı Türkçe: Sıra Hafızası, Kart Eşle, Mavi Nabız, Komut Rotası, Fark Avcısı, Hedef Tarama, Dizi Mantık. Her biri başka bir beceriye bakıyor: çalışma belleği, görsel tarama, tepki kontrolü, sıralı komut takibi. Terapist için işe yarayan kısım, oyun bitince geride kalan kayıt.',
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
      text: '`best` ile `last` ayrımı küçük bir ayrıntı gibi duruyor. Yalnızca en iyiyi saklasan ilerleme hep yukarı gidiyor gibi görünür; yalnızca sonuncuyu saklasan kötü bir gün bütün tabloyu bozar. İkisi birlikte "iyi gününde ne yapıyor, bugün ne yaptı" sorusunu cevaplıyor.',
    },

    { type: 'h2', text: 'Şema Her Hafta Değişti, Migration Yazmadım' },
    {
      type: 'p',
      text: 'Teknik tarafta en çok itiraz alacak karar bu. Gerekçesi yukarıdaki durum.',
    },
    {
      type: 'p',
      text: 'Alanı bilmediğim için şemayla ilgili tahminlerim tutmuyordu ve öğrendikçe değişiyordu. İlk haftanın sonunda danışan tablosuna zorluk düzeyi, arşivleme tarihi, etiketler ve doğum tarihi eklenmişti. Tek kişilik bir projede her değişiklikte migration üretip uygulamak, kazandırdığından fazlasını götürüyordu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden şemayı, kaç kez çalışırsa çalışsın aynı sonucu veren (idempotent) SQL cümleleri olarak tuttum. Liste Vercel\'de her build\'den önce (`vercel-build` adımında) baştan sona çalışıyor.',
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
    specialty TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )\`,
  // Tablo zaten varsa CREATE atlanır, kolon eklemesi yine de çalışır.
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS specialty TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS username TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT",
  // ...
]`,
    },
    {
      type: 'p',
      text: 'Şu an 6 `CREATE TABLE` ve 12 `ALTER TABLE` var. ORM de yok. Sorgular `@neondatabase/serverless` üzerinden `sql.query` ile, `$1`, `$2` yer tutucularıyla yazılıyor; parametreler ayrı gidiyor, SQL metni string birleştirerek kurulmuyor.',
    },

    { type: 'h3', text: 'Bunun Bedeli Ne' },
    {
      type: 'p',
      text: 'Bunun karşılığında dört şeyden vazgeçtim:',
    },
    {
      type: 'ul',
      items: [
        'Tip güvenliği. Satırların tipini elle yazıyorum; kolon adını yanlış yazarsam derleme değil, çalışma zamanı hatası alıyorum.',
        '`ADD COLUMN IF NOT EXISTS` kolonu ekler ama silmez, tipini değiştirmez. Geri dönmek için elle SQL yazmam gerekiyor.',
        'Bir kolonun adını değiştirmek zahmetli. Editör yardım etmiyor, iş `grep`\'e kalıyor.',
        'Liste iki yerde duruyor: uygulamanın içinde ve build sırasında çalışan `scripts/db-bootstrap.mjs` dosyasında. İkisini elle aynı tutmam gerekiyor.',
      ],
    },
    {
      type: 'p',
      text: 'Altı tablolu, tek geliştiricili bir projede bu bedeli ödemeye razıyım. Sonra yazdığım Açılış Zili\'nde aynı kararı vermedim. Orada ilk hafta içinde tablo sayısı 13\'e çıktı ve aynı tabloyu birçok ekran okuyor. Drizzle\'ın orada işime yarayan yanı ORM olması değil, tipleri şemadan üretmesi: şemaya kolon eklediğim an, onu eksik bırakan her yer build\'de hata veriyor.',
    },
    {
      type: 'compare',
      label: 'Aynı Geliştirici, Aynı Veritabanı, İki Farklı Karar',
      before: { label: 'Mimio · 6 Tablo', value: 'Ham SQL' },
      after: { label: 'Açılış Zili · 13 Tablo', value: 'Drizzle' },
      note: 'Kararı veren soru şuydu: aynı tabloyu kaç yerden okuyorum? Bir yerden okuyorsan tipi elle yazmak sorun değil. Birçok yerden okuyorsan tipin şemadan türemesi hatayı build\'de yakalıyor.',
    },

    { type: 'h2', text: 'Serverless\'ta pg Kullanılmaz' },
    {
      type: 'p',
      text: 'Bağlantı katmanında seçme şansım yoktu. Vercel\'de her istek ayrı bir fonksiyonda çalışıyor ve yanıt döndükten sonra donuyor. Klasik bir bağlantı havuzu burada işe yaramıyor: bağlantı açılıyor, fonksiyon donuyor, bağlantı açıkta kalıyor ve bir noktada Postgres "too many connections" diyor.',
    },
    {
      type: 'p',
      text: 'Neon\'un HTTP sürücüsünde kalıcı bağlantı yok, bu yüzden açıkta kalan bağlantı da yok. Bedeli ilk bakışta görünmüyor: her sorgu ayrı bir HTTP gidiş-dönüşü. Yerelde gecikme o kadar küçük ki fark etmiyorsun; canlıda çok sayıda küçük sorgu atan bir sayfa birden yavaşlıyor.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu tuzağa Açılış Zili\'nde düştüm: şirketler dizini her kotasyonu `Promise.all` ile ayrı bir `insert` olarak yazıyordu. Kod paralel çalıştığı için zararsız görünüyordu. Tek bir çok satırlı upsert\'e çevirince sayfa başına 513 istek 2\'ye indi.',
    },

    { type: 'h2', text: 'Klinik Veri Olduğunu Unutmamak' },
    {
      type: 'p',
      text: 'Panelde danışan adları, seans notları ve gelişim kayıtları duruyor. Bu, bir hobi projesinin verisi gibi ele alınamaz.',
    },
    {
      type: 'p',
      text: 'Yaptıklarım az ama yerinde. Parolalar Postgres\'in pgcrypto eklentisiyle bcrypt olarak hash\'leniyor (`crypt($5, gen_salt(\'bf\', 8))`); şema listesinin ilk satırındaki `CREATE EXTENSION` bu yüzden orada. Oturum, HMAC ile imzalanmış bir çerezde tutuluyor. Başlangıçtaki demo verisi ve tarayıcıda saklanan yerel profiller kaldırıldı; her şey veritabanından geliyor. Bir şeyi de bilerek yapmadım: hiçbir yere analitik, hata izleme ya da üçüncü taraf script koymadım. Bir hata raporu, içinde bir seans notuyla başka bir şirketin sunucusuna gidebilirdi.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Bilmediğin bir alana araç yazarken en pahalı hata, alanı kendi kafandaki modele göre kurmak. SOAP altı gün sonra panele girdi ve ucuz atlattım. Aynı şey altı ay sonra olsaydı elimde düzensiz notlarla dolu bir veritabanı olurdu.',
    },
    {
      type: 'p',
      text: 'Şemanın belirsiz olması teknoloji seçimini de değiştirdi. "ORM kullanmalı mıyım" sorusunun cevabı, projenin hangi aşamada olduğuna bağlı. Alanı öğrenip şema oturduğunda Mimio\'yu Drizzle\'a taşımak mantıklı olabilir. O gün henüz gelmedi.',
    },
    {
      type: 'p',
      text: 'Skorları yorumlayan tek bir yer var. İlerleme Raporu\'ndaki oyun tablosu, 2 Ağustos\'tan beri en az üç seans varsa ilk ve son skoru karşılaştırıyor; fark 4 puanı aşarsa "artıyor", -4\'ün altına inerse "düşüyor", arada kalırsa "stabil" yazıyor. Bu rapor aileye ya da kuruma gidiyor ve o 4 puanlık eşiği bir terapist değil, ben seçtim.',
    },
  ],
}

export default post
