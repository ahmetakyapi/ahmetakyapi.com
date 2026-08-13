import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'neon-drizzle-serverless-db-katmani',
  tag: 'Veritabanı',
  tagColor: '#10b981',
  title: 'Bir Projede ORM Kullanmadım, Diğerinde Kullandım — Farkı Ne Yaptı?',
  excerpt:
    'Mimio ham SQL ile yazıldı, Açılış Zili Drizzle ile. İkisi de Neon üzerinde çalışıyor. Hangi noktada ORM\'in maliyeti faydasını geçiyor, hangi noktada tersine dönüyor?',
  date: '2026-03-22',
  coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
  content: [
    {
      type: 'lead',
      text: 'Mimio\'yu yazmaya başladığımda refleksle Drizzle kurdum. Üç gün sonra kaldırdım ve `neon()` ile ham SQL yazmaya döndüm. Altı ay sonra Açılış Zili\'ne başlarken yine refleksle ham SQL yazdım, iki hafta sonra Drizzle\'a geçtim. İkisinde de doğru kararı verdiğimi düşünüyorum.',
    },
    {
      type: 'p',
      text: 'Bu yazı ORM savunması ya da ORM eleştirisi değil. İki gerçek projede aynı veritabanıyla (Neon Postgres) iki farklı yol seçtim; hangi sinyallerin beni hangi tarafa ittiğini yazıyorum.',
    },

    { type: 'h2', text: 'Önce Ortak Nokta: Neden pg Değil' },
    {
      type: 'p',
      text: 'İkisinde de bağlantı katmanı aynı: `@neondatabase/serverless`. Bu bir tercih değil, zorunluluk.',
    },
    {
      type: 'p',
      text: 'Vercel\'de her istek ayrı bir serverless fonksiyonda çalışıyor ve fonksiyon yanıtı döndürdükten sonra donduruluyor. Klasik `pg` havuzu bu modelde işe yaramıyor: bağlantı açıyorsun, fonksiyon donuyor, bağlantı açıkta kalıyor. Birkaç yüz istek sonra Postgres "too many connections" veriyor.',
    },
    {
      type: 'p',
      text: 'Neon\'un HTTP sürücüsü her sorguyu ayrı bir HTTP isteği olarak gönderiyor. Kalıcı bağlantı yok, dolayısıyla sızdıracak bağlantı da yok.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bunun görünmeyen bir bedeli var ve Açılış Zili\'nde canımı yaktı: her sorgu bir HTTP round-trip demek. `Promise.all` ile 500 tane insert atmak, 500 tane HTTP isteği demek. Yerelde fark etmiyorsun çünkü gecikme 1 ms; üretimde 20 ms oluyor ve sayfa 10 saniye açılıyor.',
    },

    { type: 'h2', text: 'Mimio: Neden ORM\'siz' },
    {
      type: 'p',
      text: 'Mimio ergoterapistler için bir klinik panel. Altı tablo var: terapist profili, danışan profili, seans kaydı, seans notu, haftalık plan, danışan hedefleri.',
    },
    {
      type: 'p',
      text: 'Bu projede sorgular karmaşık değil ama şema sürekli değişti. İlk ay içinde "destek düzeyi" alanı ekledim, sonra kullanıcı adı ve parola alanları geldi, sonra uzmanlık alanı. Her seferinde migration üretip uygulamak, tek kişilik bir projede kazandırdığından fazla vakit alıyordu.',
    },
    {
      type: 'p',
      text: 'Bu yüzden şemayı kodun içinde, idempotent ifadeler olarak tuttum:',
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

  // Sonradan eklenen alanlar ayrı ifadeler olarak duruyor: tablo zaten
  // varsa CREATE atlanır, kolon eklemesi yine de çalışır.
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS specialty TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS username TEXT",
  "ALTER TABLE therapist_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT",
]`,
    },
    {
      type: 'p',
      text: 'Şu an 6 `CREATE TABLE` ve 12 `ALTER TABLE` var. Hepsi `IF NOT EXISTS` ile yazıldığı için istediğin kadar çalıştırabiliyorsun. Boş bir veritabanına da uyguluyor, dolu bir veritabanına da.',
    },
    {
      type: 'p',
      text: 'Sorgular da ham. `neon()` etiketli şablon döndürüyor, yani parametreler otomatik olarak bağlanıyor — string birleştirme yok, SQL injection riski yok.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'src/lib/server/platform-db.ts',
      text: `const rows = await sql\`
  SELECT c.id, c.display_name, c.age_group,
         MAX(s.created_at) AS last_session_at
  FROM client_profiles c
  LEFT JOIN session_runs s ON s.client_id = c.id
  WHERE c.therapist_id = \${therapistId}
  GROUP BY c.id
  ORDER BY last_session_at DESC NULLS LAST
\`
// \${therapistId} metne gömülmüyor; sürücü $1 parametresine çeviriyor.`,
    },

    { type: 'h3', text: 'Bu Yaklaşımın Bedeli' },
    {
      type: 'p',
      text: 'Dürüst olayım, ücretsiz değil. Üç şeyi kaybediyorsun:',
    },
    {
      type: 'ul',
      items: [
        'Tip güvenliği. `rows` bir `Record<string, unknown>[]` olarak geliyor; kolon adını yanlış yazarsan derleme değil, çalışma zamanı hatası alıyorsun. Bunu elle yazdığım dönüştürme fonksiyonlarıyla kapattım ama iş bende.',
        'Şema geçmişi. `ALTER TABLE ADD COLUMN IF NOT EXISTS` bir kolonu ekler ama silmez, tip değiştirmez. Geriye dönmek isteyince elle SQL yazmak zorundasın.',
        'Yeniden adlandırma. Bir kolonu yeniden adlandırmak isteyince kodda kaç yerde geçtiğini grep ile aramak zorundasın; editör yardım etmiyor.',
      ],
    },
    {
      type: 'quote',
      text: 'Altı tablolu, tek geliştiricili, sorguları basit bir projede bu bedel ucuz. Onbeş tablolu, ilişkileri iç içe geçmiş bir projede aynı bedel pahalı.',
    },

    { type: 'h2', text: 'Açılış Zili: Neden Drizzle' },
    {
      type: 'p',
      text: 'Açılış Zili\'nde 15 tablo var: semboller, fiyat cache\'i, mum cache\'i, bilanço takvimi, ekonomik olaylar, tatiller, makro seriler, haberler, bültenler, analizler, kullanıcılar, takip listeleri…',
    },
    {
      type: 'p',
      text: 'İlk iki hafta ham SQL yazdım. Kırılma noktası şuydu: `quotes_cache` tablosuna bir kolon ekledim ve üç ayrı yerde `SELECT *` yazdığım için üçünde de dönüştürme fonksiyonunu güncellemem gerekti. İkisini güncelledim, üçüncüyü unuttum, ekranda `undefined` gördüm.',
    },
    {
      type: 'p',
      text: 'Drizzle\'ın burada verdiği şey ORM\'liğinden çok tip üretimi. Şemayı bir kez yazıyorsun, tipler oradan çıkıyor:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/schema.ts',
      text: `export const quotesCache = pgTable("quotes_cache", {
  symbol:     text("symbol").primaryKey(),
  price:      doublePrecision("price"),
  changePct:  doublePrecision("change_pct"),
  tradedAt:   timestamp("traded_at", { withTimezone: true }),
  updatedAt:  timestamp("updated_at", { withTimezone: true }).notNull(),
})

// Tipleri elle yazmıyorum, şemadan türüyor.
export type Quote = typeof quotesCache.$inferSelect
export type NewQuote = typeof quotesCache.$inferInsert`,
    },
    {
      type: 'p',
      text: 'Kolon eklediğim an `Quote` tipi değişiyor ve eksik alan bırakan her yer derlemede kırmızı oluyor. Aradığım şey tam olarak buydu.',
    },

    { type: 'h3', text: 'Drizzle SQL\'i Saklamıyor — Asıl Sebep Bu' },
    {
      type: 'p',
      text: 'Drizzle\'ı tercih etmemin ikinci nedeni, yazdığım şeyin ne SQL\'e döneceğini tahmin edebilmem. Neon\'un HTTP sürücüsünde her sorgu bir istek olduğu için, "bu satır kaç sorgu üretiyor" sorusunu cevaplayabilmek zorundayım.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'lib/providers/index.ts',
      text: `// 500'erlik gruplar hâlinde tek upsert.
// 11 kolon × 500 = 5500 parametre — Postgres'in 65535 sınırının altında.
await db
  .insert(quotesCache)
  .values(batch)
  .onConflictDoUpdate({
    target: quotesCache.symbol,
    set: { price: sql\`excluded.price\`, updatedAt: sql\`excluded.updated_at\` },
  })`,
    },
    {
      type: 'compare',
      label: '513 sembollük dizin sayfası · tek görüntüleme',
      before: { label: 'Satır başına insert', value: '513 istek' },
      after: { label: 'Gruplu tek upsert', value: '2 istek' },
      note: 'Aynı hatayı ham SQL ile de yapabilirdim. Fark şu: Drizzle\'da `.values(batch)` yazınca tek ifade ürettiğinden emin oluyorum; ham SQL\'de 500 satırlık VALUES listesini elle kurmak gerekiyordu.',
    },
    {
      type: 'p',
      text: 'Bir de `await` meselesi vardı. Bu yazma işlemi `void` ile bırakılmıştı, yani beklenmiyordu. Serverless fonksiyon yanıtı döndürdükten sonra donduğu için yazma yarıda kesilebiliyordu. Tek round-tripn maliyeti ~20 ms; bu belirsizliğe değmez.',
    },

    { type: 'h2', text: 'Migration Disiplini' },
    {
      type: 'p',
      text: 'Açılış Zili\'nde 13 migration dosyası var ve hiçbirini geriye dönüp düzenlemedim. Bu bir kural: yanlış olan bir migration\'ı düzeltmenin yolu yenisini eklemek.',
    },
    {
      type: 'p',
      text: 'Sebebi basit. Migration dosyaları hangi veritabanına ne zaman uygulandığının kaydı. Uygulanmış bir dosyayı değiştirirsen, senin makinende şema bir hâlde, üretimde başka hâlde olur ve `drizzle-kit` bunu fark etmez.',
    },
    {
      type: 'code',
      lang: 'bash',
      file: 'package.json scripts',
      text: `npm run db:generate   # şema değişti → yeni migration dosyası üret
npm run db:migrate    # bekleyen migration'ları uygula
npm run db:push       # SADECE yerelde: şemayı doğrudan bas, dosya üretme`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: '`db:push` üretimde çalıştırılmamalı. Şemayı doğrudan hedefe uyduruyor ve bunu yaparken kolon düşürebiliyor. Yerelde denemek için harika, canlı veritabanında geri dönüşü yok.',
    },

    { type: 'h2', text: 'Karar Tablosu' },
    {
      type: 'p',
      text: 'İki projeden çıkardığım pratik özet:',
    },
    {
      type: 'table',
      head: ['Sinyal', 'Ham SQL', 'Drizzle'],
      rows: [
        ['Tablo sayısı', '10\'un altında', '10\'un üstünde'],
        ['Şema oturmuş mu', 'Hayır, her hafta değişiyor', 'Evet, migration mantıklı'],
        ['Sorgular', 'Basit CRUD', 'İç içe join, koşullu filtre'],
        ['Ekip', 'Tek kişi', 'Birden fazla kişi'],
        ['Aynı tabloyu okuyan yer', '1-2', '5+'],
      ],
    },
    {
      type: 'p',
      text: 'En belirleyici satır sonuncusu. Bir tabloyu tek yerden okuyorsan tipi elle yazmak sorun değil. Beş yerden okuyorsan, tipin şemadan türemesi seni kurtarıyor.',
    },

    { type: 'h2', text: 'Bugün Ne Yapardım' },
    {
      type: 'p',
      text: 'Mimio\'yu bugün baştan yazsam yine ham SQL ile başlardım, ama dönüştürme fonksiyonlarını `zod` ile yazardım. Şu an elle yazılmış `mapRow` fonksiyonları var ve bir kolon adını yanlış yazdığımda sessizce `undefined` dönüyorlar.',
    },
    {
      type: 'p',
      text: 'Açılış Zili için pişmanlığım yok. Belki tek şey: Drizzle\'a iki hafta sonra değil, dördüncü tabloda geçerdim. O iki haftanın kodunu taşımak, baştan yazmaktan uzun sürdü.',
    },
  ],
}

export default post
