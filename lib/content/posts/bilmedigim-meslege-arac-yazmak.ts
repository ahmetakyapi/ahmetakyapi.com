import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bilmedigim-meslege-arac-yazmak',
  tag: 'Ürün',
  tagColor: '#2b62f5',
  title: "Mimio: Seansı Kaydet, İlerlemeyi Gör",
  excerpt:
    'Mimio ergoterapistler için bir panel ve ben ergoterapiyi bilmiyordum. İlk dersim şu oldu: kendi kavramlarını uydurma, mesleğin zaten oturmuş bir dili var.',
  date: '2026-03-22',
  coverGradient: 'linear-gradient(135deg, #2b62f5 0%, #1d8ad4 55%, #17c2e0 100%)',
  content: [
    {
      type: 'lead',
      text: 'Mimio\'yu yazmaya başladığımda ergoterapinin ne olduğunu tam bilmiyordum. Fikir şuydu: terapistin seansta oynattığı oyunlar ölçülebilir veri üretsin, o veri danışanın dosyasına düşsün ve zamanla bir ilerleme çizgisi çıksın. Kulağa temiz geliyordu. Seans notunu tasarlarken ilk hatamı yaptım.',
    },
    {
      type: 'p',
      text: 'İlk sürümde seans notu tek bir serbest metin kutusuydu: bir tarih, bir `content` alanı, o kadar. Bana yeterli görünüyordu. Sonra bu mesleğin onlarca yıldır kullandığı bir not biçimi olduğunu öğrendim ve altı gün sonra panele girdi.',
    },

    { type: 'h2', text: 'Mesleğin Kendi Dili Vardı: SOAP' },
    {
      type: 'p',
      text: 'SOAP, sağlık alanında yaygın bir klinik not standardı. Dört harf, dört bölüm ve sıraları keyfi değil, bir düşünme sırası:',
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
      text: 'Bu sıra bir şey öğretiyor: önce ne duyduğunu yaz, sonra ne gördüğünü, ancak ondan sonra ne düşündüğünü. Yorumu gözlemden ayırıyor. Benim tek kutum bu ayrımı hiç yapmıyordu; gözlem ile yorum aynı paragrafta, aynı cümlede bile karışabiliyordu.',
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
      text: 'Bir mesleğe araç yazıyorsan, o meslek kavramlarını çoktan adlandırmıştır. Senin işin yeni bir sözlük icat etmek değil, var olan sözlüğü ekrana doğru yerleştirmek.',
    },
    {
      type: 'p',
      text: 'Serbest notu kaldırmadım; `NoteMode` iki seçenekli. Her seans dört bölümlük bir değerlendirmeyi hak etmiyor ve on dakikalık bir kontrol seansında SOAP yazmaya zorlanan biri büyük ihtimalle hiçbir şey yazmaz.',
    },

    { type: 'h2', text: 'Oyunlar Sadece Oyun Değil, Ölçüm' },
    {
      type: 'p',
      text: 'Panelde yedi terapi oyunu var ve hepsinin adı Türkçe: Sıra Hafızası, Kart Eşle, Mavi Nabız, Komut Rotası, Fark Avcısı, Hedef Tarama, Dizi Mantık. Her biri farklı bir beceriye bakıyor: çalışma belleği, görsel tarama, tepki kontrolü, sıralı komut takibi. Ama asıl mesele oyunun kendisi değil, arkasında bıraktığı kayıt.',
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
      text: '`best` ile `last` ayrımı küçük ama önemli. Yalnızca en iyiyi saklasan ilerleme hep yukarı gidiyor gibi görünür; yalnızca sonuncuyu saklasan kötü bir gün bütün tabloyu bozar. İkisi birlikte "iyi günü ne, bugünü ne" sorusunu cevaplıyor.',
    },

    { type: 'h2', text: 'Şema Her Hafta Değişti, Migration Yazmadım' },
    {
      type: 'p',
      text: 'Teknik tarafın en tartışmalı kararı buydu ve gerekçesi doğrudan yukarıdaki durumla ilgili.',
    },
    {
      type: 'p',
      text: 'Alanı bilmiyordum, dolayısıyla şema tahminlerim yanlıştı ve öğrendikçe değişiyordu. İlk haftanın sonunda danışan tablosuna zorluk düzeyi, arşivleme tarihi, etiketler ve doğum tarihi eklenmişti. Her değişiklikte migration üretip uygulamak, tek kişilik bir projede kazandırdığından fazlasını alıyordu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden şemayı idempotent ifadeler olarak tuttum. Liste Vercel\'de her derlemeden önce (`vercel-build` adımında) baştan sona koşuyor ve kaç kez çalıştırırsan çalıştır aynı sonuca varıyor.',
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
      text: 'Şu an 6 `CREATE TABLE` ve 12 `ALTER TABLE` var. ORM de yok. Sorgular `@neondatabase/serverless` üzerinden `sql.query` ile ve `$1`, `$2` yer tutucularıyla yazılıyor; parametreler ayrı gidiyor, işin içine metin birleştirme girmiyor.',
    },

    { type: 'h3', text: 'Bunun Bedeli Ne' },
    {
      type: 'p',
      text: 'Bedava değil. Dört şey kaybettim:',
    },
    {
      type: 'ul',
      items: [
        'Tip güvenliği. Satırların tipini elle yazıyorum; kolon adını yanlış yazarsam derleme değil, çalışma zamanı hatası alıyorum.',
        '`ADD COLUMN IF NOT EXISTS` kolonu ekler ama silmez, tipini değiştirmez. Geri dönmek için elle SQL yazmam gerekiyor.',
        'Yeniden adlandırma zahmetli. Editör yardım etmiyor, iş `grep`\'e kalıyor.',
        'Liste iki yerde duruyor: uygulamanın içinde ve derlemede koşan `scripts/db-bootstrap.mjs` dosyasında. İkisini elle eş tutmak zorundayım.',
      ],
    },
    {
      type: 'p',
      text: 'Altı tablolu, tek geliştiricili bir projede bu bedeli ödemeye değer buldum. Sonradan yazdığım Açılış Zili\'nde aynı kararı vermedim. Orada tablolar otuzu geçti ve aynı tabloyu birçok ekran okuyor. Drizzle\'ın orada verdiği şey ORM\'liğinden çok tip üretimi: şemaya kolon eklediğim an, onu eksik bırakan her yer derlemede kırmızıya dönüyor.',
    },
    {
      type: 'compare',
      label: 'Aynı Geliştirici, Aynı Veritabanı, İki Farklı Karar',
      before: { label: 'Mimio · 6 Tablo', value: 'Ham SQL' },
      after: { label: 'Açılış Zili · 30+ Tablo', value: 'Drizzle' },
      note: 'Belirleyici soru "hangisi daha iyi" değil, "aynı tabloyu kaç yerden okuyorum". Bir yerden okuyorsan tipi elle yazmak sorun değil; birçok yerden okuyorsan tipin şemadan türemesi seni kurtarıyor.',
    },

    { type: 'h2', text: 'Serverless\'ta pg Kullanılmaz' },
    {
      type: 'p',
      text: 'Bağlantı katmanı tercih değil, zorunluluktu. Vercel\'de her istek ayrı bir fonksiyonda çalışıyor ve yanıt döndükten sonra donuyor. Klasik bir bağlantı havuzu bu modelde işe yaramıyor: bağlantı açılıyor, fonksiyon donuyor, bağlantı açıkta kalıyor ve bir noktada Postgres "too many connections" diyor.',
    },
    {
      type: 'p',
      text: 'Neon\'un HTTP sürücüsünde kalıcı bağlantı yok, dolayısıyla sızdıracak bağlantı da yok. Görünmeyen bedeli şu: her sorgu ayrı bir HTTP gidiş-dönüşü. Yerelde gecikme o kadar küçük ki fark etmiyorsun; üretimde çok sayıda küçük sorgu atan bir sayfa birden yavaşlıyor.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu tuzağa Açılış Zili\'nde tam olarak düştüm: şirketler dizini her kotasyonu `Promise.all` ile ayrı bir `insert` olarak yazıyordu. Kod paralel olduğu için masum görünüyordu. Tek bir çok satırlı upsert\'e çevirince sayfa başına 513 istek 2\'ye indi.',
    },

    { type: 'h2', text: 'Klinik Veri Olduğunu Unutmamak' },
    {
      type: 'p',
      text: 'Panelde danışan adları, seans notları ve gelişim kayıtları var. Bu hobi projesi verisi değil.',
    },
    {
      type: 'p',
      text: 'Yaptıklarım mütevazı. Parolalar Postgres\'in pgcrypto eklentisiyle bcrypt olarak karılıyor (`crypt($5, gen_salt(\'bf\', 8))`); şema listesinin ilk satırındaki `CREATE EXTENSION` bu yüzden orada. Oturum, HMAC ile imzalanmış bir çerezde. Başlangıçtaki demo verisi ve tarayıcıda tutulan yerel profiller tamamen kaldırıldı, her şey veritabanından geliyor. En önemlisi de bir şeyi yapmamak oldu: hiçbir yere analitik, hata izleme ya da üçüncü taraf betiği koymadım. Bir seans notunun bir hata raporunun içinde başka bir sunucuya gitmesi, düşünmek bile istemediğim bir senaryo.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Bilmediğin bir alana araç yazarken en pahalı hata, alanı kendi kafandaki modele göre kurmak. SOAP\'ı altı gün sonra öğrendim ve ucuz atlattım; aynı şeyi altı ay sonra öğrenseydim elimde yapısız notlarla dolu bir veritabanı olurdu.',
    },
    {
      type: 'p',
      text: 'İkincisi: şema belirsizliği bir teknoloji tercihi doğuruyor. "ORM kullanmalı mıyım" sorusunun cevabı projeye değil, projenin hangi aşamasında olduğuna bağlı. Alanı öğrendiğim ve şema oturduğu gün Mimio\'yu Drizzle\'a taşımak mantıklı olabilir. O gün henüz gelmedi.',
    },
    {
      type: 'p',
      text: 'Başta skorları yorumlamayı bilerek yapmadım. "Gelişme var" ya da "gerileme var" diyen bir kutu, terapistin vereceği kararı onun yerine vermek gibi geldi. Sonra çizgiyi biraz geçtim: İlerleme Raporu\'ndaki oyun tablosu artık en az üç seans olduğunda ilk ve son skoru karşılaştırıyor; fark 4 puanı aşarsa "artıyor", -4\'ün altına inerse "düşüyor", arada kalırsa "stabil" yazıyor. Bu rapor aileye ya da kuruma gidiyor. 4 puanın kimin yargısı olduğu sorusunun cevabı da şimdilik bende.',
    },
  ],
}

export default post
