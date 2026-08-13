import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'bilmedigim-meslege-arac-yazmak',
  tag: 'Ürün',
  tagColor: '#2b62f5',
  title: "Mimio: Seansı Kaydet, İlerlemeyi Gör",
  excerpt:
    'Mimio ergoterapistler için bir panel. Ergoterapi hakkında hiçbir şey bilmiyordum ve öğrendiğim ilk şey şu oldu: kendi kavramlarını uydurma, mesleğin zaten bir dili var.',
  date: '2026-03-22',
  coverGradient: 'linear-gradient(135deg, #2b62f5 0%, #1d8ad4 55%, #17c2e0 100%)',
  content: [
    {
      type: 'lead',
      text: 'Mimio\'yu yazmaya başladığımda ergoterapinin ne olduğunu tam olarak bilmiyordum. Ürün fikri şuydu: terapistin seansta oynattığı oyunlar ölçülebilir veri üretsin, o veri danışanın dosyasına düşsün ve zamanla bir ilerleme çizgisi çıksın. Kulağa temiz geliyordu. İlk yaptığım şey yanlıştı.',
    },
    {
      type: 'p',
      text: 'Yanlış olan şuydu: seans notu için kendi alanlarımı tasarladım. "Gözlemler", "Sonuç", "Notlar" diye üç kutu koydum. Gayet mantıklı görünüyordu — bana. Meğer bu mesleğin zaten bir not formatı varmış ve onlarca yıldır kullanılıyormuş.',
    },

    { type: 'h2', text: 'Mesleğin Kendi Dili Vardı: SOAP' },
    {
      type: 'p',
      text: 'SOAP, sağlık alanında yaygın bir klinik not standardı. Dört harf, dört bölüm — ve bu bölümler keyfi değil, bir düşünme sırası:',
    },
    {
      type: 'table',
      head: ['Harf', 'Ne yazılır', 'Kim söylüyor'],
      rows: [
        ['S · Subjektif', 'Danışanın ya da ailesinin anlattığı', 'Danışan'],
        ['O · Objektif', 'Seansta gözlenen, ölçülen', 'Terapist'],
        ['A · Assessment', 'Bu ikisinden çıkan değerlendirme', 'Terapist'],
        ['P · Plan', 'Bir sonraki adım', 'Terapist'],
      ],
    },
    {
      type: 'p',
      text: 'Bu sıra bir şey öğretiyor: önce ne duyduğunu yaz, sonra ne gördüğünü, ancak ondan sonra ne düşündüğünü. Yorumu gözlemden ayırıyor. Benim "Gözlemler / Sonuç / Notlar" üçlüm bu ayrımı hiç yapmıyordu.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/platform-data.ts',
      text: `export interface SoapNoteContent {
  s: string  // Subjektif — danışanın anlattığı
  o: string  // Objektif  — gözlenen, ölçülen
  a: string  // Assessment — değerlendirme
  p: string  // Plan       — bir sonraki adım
}

/* Serbest not da duruyor: her seans SOAP yazmayı hak etmiyor ve
   birini zorla forma sokmak, formu boş bırakmasına yol açıyor. */
export type NoteMode = 'free' | 'soap'`,
    },
    {
      type: 'quote',
      text: 'Bir mesleğe araç yazıyorsan, o meslek kavramlarını çoktan adlandırmıştır. Senin işin yeni bir sözlük icat etmek değil, mevcut sözlüğü ekrana doğru yerleştirmek.',
    },
    {
      type: 'p',
      text: 'Serbest not seçeneğini bırakmam da bilinçli. Her seans dört bölümlük bir değerlendirmeyi hak etmiyor; on dakikalık bir kontrol seansına SOAP yazmaya zorlanan biri hiçbir şey yazmıyor.',
    },

    { type: 'h2', text: 'Oyunlar Sadece Oyun Değil, Ölçüm' },
    {
      type: 'p',
      text: 'Panelde yedi terapi oyunu var ve hepsinin adı Türkçe: Sıra Hafızası, Kart Eşle, Mavi Nabız, Komut Rotası, Fark Avcısı, Hedef Tarama, Dizi Mantık.',
    },
    {
      type: 'p',
      text: 'Her biri farklı bir beceriye bakıyor — çalışma belleği, görsel tarama, tepki kontrolü, sıralı komut takibi. Ama asıl mesele oyunun kendisi değil, arkasında bıraktığı kayıt.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/platform-data.ts',
      text: `export interface RemoteScoreSummary {
  label: string
  best: number
  last: number
  sessions: number
  lastPlayedAt: string | null
}`,
    },
    {
      type: 'p',
      text: 'Burada `best` ile `last` ayrımı küçük ama önemli. Sadece en iyiyi saklasan ilerleme hep yukarı gidiyor gibi görünür; sadece sonuncuyu saklasan kötü bir gün bütün tabloyu bozar. İkisi birlikte "iyi günü ne, bugünü ne" sorusunu cevaplıyor.',
    },
    {
      type: 'callout',
      variant: 'info',
      text: 'Bir şeyi bilerek yapmadım: skorları otomatik yorumlamak. "Gelişme var" ya da "gerileme var" yazan bir kutu koymayı düşündüm ve vazgeçtim. Bu yargıyı verecek kişi terapist; sistemin işi veriyi düzgün göstermek, onun yerine karar vermek değil.',
    },

    { type: 'h2', text: 'Şema Her Hafta Değişti, Migration Yazmadım' },
    {
      type: 'p',
      text: 'Şimdi teknik tarafın en tartışmalı kararına geliyorum ve gerekçesi doğrudan yukarıdaki durumla ilgili.',
    },
    {
      type: 'p',
      text: 'Alanı bilmiyordum. Bu şu demek: şema tahminlerim yanlıştı ve her konuşmadan sonra değişiyordu. İlk ay içinde "destek düzeyi" alanı eklendi, sonra kullanıcı adı ve parola, sonra uzmanlık alanı. Her seferinde migration üretip uygulamak, tek kişilik bir projede kazandırdığından fazla vakit alıyordu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden şemayı kodun içinde, idempotent ifadeler olarak tuttum. Uygulama açılırken çalışıyor ve istediğin kadar çalıştırabiliyorsun.',
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

  // Sonradan eklenenler ayrı ifadeler: tablo zaten varsa CREATE
  // atlanır, kolon eklemesi yine de çalışır.
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS specialty TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS username TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT",
]`,
    },
    {
      type: 'p',
      text: 'Şu an 6 `CREATE TABLE` ve 12 `ALTER TABLE` var. ORM de yok — sorgular `@neondatabase/serverless`\'in etiketli şablonuyla yazılıyor, yani parametreler otomatik bağlanıyor ve string birleştirme hiç girmiyor işin içine.',
    },

    { type: 'h3', text: 'Bunun Bedeli Ne' },
    {
      type: 'p',
      text: 'Ücretsiz değil, üç şey kaybediyorsun:',
    },
    {
      type: 'ul',
      items: [
        'Tip güvenliği. Satırlar `Record<string, unknown>` olarak geliyor; kolon adını yanlış yazarsan derleme değil, çalışma zamanı hatası alıyorsun.',
        '`ADD COLUMN IF NOT EXISTS` kolonu ekler ama silmez, tip değiştirmez. Geriye dönmek isteyince elle SQL yazman gerekiyor.',
        'Yeniden adlandırma acı verici — editör yardım etmiyor, grep\'e kalıyorsun.',
      ],
    },
    {
      type: 'p',
      text: 'Bu bedeli altı tablolu ve tek geliştiricili bir projede ödemeye değer buldum. Açılış Zili\'nde aynı kararı vermedim: orada 15 tablo var, ilişkiler iç içe ve aynı tabloyu okuyan beş ayrı yer bulunuyor. Orada Drizzle\'ın verdiği şey ORM\'liğinden çok tip üretimiydi — şemaya kolon eklediğim an eksik alan bırakan her yer derlemede kırmızı oluyor.',
    },
    {
      type: 'compare',
      label: 'Aynı geliştirici, aynı veritabanı, iki farklı karar',
      before: { label: 'Mimio · 6 tablo', value: 'Ham SQL' },
      after: { label: 'Açılış Zili · 15 tablo', value: 'Drizzle' },
      note: 'Belirleyici soru "hangisi daha iyi" değil, "aynı tabloyu kaç yerden okuyorum". Bir yerden okuyorsan tipi elle yazmak sorun değil; beş yerden okuyorsan şemadan türemesi seni kurtarıyor.',
    },

    { type: 'h2', text: 'Serverless\'ta pg Kullanılmaz' },
    {
      type: 'p',
      text: 'Bağlantı katmanı tercihi değil zorunluluktu. Vercel\'de her istek ayrı bir fonksiyonda çalışıyor ve yanıt döndükten sonra donuyor. Klasik bir bağlantı havuzu bu modelde işe yaramıyor: bağlantı açılıyor, fonksiyon donuyor, bağlantı açıkta kalıyor. Birkaç yüz istek sonra Postgres "too many connections" veriyor.',
    },
    {
      type: 'p',
      text: 'Neon\'un HTTP sürücüsünde kalıcı bağlantı yok, dolayısıyla sızdıracak bağlantı da yok. Görünmeyen bedeli ise şu: her sorgu bir HTTP round-trip. Yerelde fark etmiyorsun çünkü gecikme 1 ms; üretimde 20 ms oluyor ve toplu iş yapan bir sayfa aniden saniyeler sürüyor.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu tuzağa başka bir projede tam olarak düştüm: 500 kayıt için `Promise.all` ile 500 ayrı insert. Masum görünüyor, çünkü kod paralel. Tek bir çok satırlı upsert\'e çevirince 513 istek 2\'ye indi.',
    },

    { type: 'h2', text: 'Klinik Veri Olduğunu Unutmamak' },
    {
      type: 'p',
      text: 'Panelde danışan adları, seans notları ve gelişim kayıtları var. Bu hobi projesi verisi değil.',
    },
    {
      type: 'p',
      text: 'Pratikte yaptıklarım mütevazı: parola karması `bcrypt` ile, oturum kilidi tek kullanıcı için, uydurma demo verisi üretimde yok. Ama en önemlisi bir şeyi yapmamak oldu — hiçbir yere analitik, hata izleme ya da üçüncü taraf betiği koymadım. Seans notunun bir hata raporunun içinde başka bir sunucuya gitmesi, düşünmek bile istemediğim bir senaryo.',
    },

    { type: 'h2', text: 'Ne Öğrendim' },
    {
      type: 'p',
      text: 'Bilmediğin bir alana araç yazarken en pahalı hata, alanı kendi kafandaki modele göre tasarlamak. SOAP\'ı sonradan öğrenip geçiş yapmak, baştan sorup öğrenmekten çok daha uzun sürdü.',
    },
    {
      type: 'p',
      text: 'İkincisi: şema belirsizliği bir teknoloji tercihi doğuruyor. "ORM kullanmalı mıyım" sorusunun cevabı projeye değil, projenin hangi aşamasında olduğuna bağlı. Alanı öğrendiğim ve şema oturduğu gün Mimio\'yu Drizzle\'a taşımak mantıklı olabilir — henüz o gün gelmedi.',
    },
    {
      type: 'p',
      text: 'Hâlâ emin olmadığım bir şey var: skorları yorumlamamak doğru karar mıydı? Terapistin işini kolaylaştırmak ile onun yerine karar vermek arasındaki çizgi göründüğünden ince ve ben şu an çizginin epey gerisinde duruyorum.',
    },
  ],
}

export default post
