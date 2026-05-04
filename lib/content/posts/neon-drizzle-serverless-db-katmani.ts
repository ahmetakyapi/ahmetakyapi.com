import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'neon-drizzle-serverless-db-katmani',
  tag: 'Database',
  tagColor: '#10b981',
  title: "Mimio: Prisma'dan Drizzle'a Geçiş Notları",
  excerpt:
    'Serverless yapıda Prisma ile büyüyen ilk açılış maliyetini, Neon ve Drizzle ile daha hafif hale getirirken fark ettiğim pratik artılar.',
  date: '2026-03-22',
  readTime: '7 dk',
  coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
  content: [
    {
      type: 'p',
      text: 'Mimio’nun ilk günlerinde Prisma kullanıyordum. Geliştirici tarafı rahattı, şema düzenliydi ve ilk aşamada karar vermeyi kolaylaştırıyordu. Ama proje serverless düzende büyüdükçe build süresi ve ilk açılış bekleme süresi göze batmaya başladı.',
    },
    {
      type: 'p',
      text: 'Kullanıcı bunu milisaniye olarak ölçmüyor olabilir ama ilk tıklamada hissediyor. Drizzle ve Neon’a geçiş benim için teknoloji değiştirmekten çok, sistemi biraz daha hafifletme kararıydı.',
    },
    { type: 'h2', text: 'Prisma Neden Ağırlaşabiliyor?' },
    {
      type: 'p',
      text: 'Prisma güçlü bir araç ama serverless tarafta kendi yükünü de getiriyor. Başlangıç maliyeti, bağlantı davranışı ve çalışma şekli birleşince ilk isteğin süresi uzayabiliyor. Özellikle panel gibi ilk etkileşimin önemli olduğu yerlerde bu fark daha net hissediliyor.',
    },
    { type: 'h2', text: 'Kurulum ve Şema Tarafı' },
    {
      type: 'code',
      lang: 'bash',
      text: `npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit`,
    },
    {
      type: 'code',
      lang: 'ts',
      text: `export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ageGroup: text('age_group', { enum: ['pediatric', 'adult'] }).notNull(),
  primaryGoal: text('primary_goal').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
})`,
    },
    {
      type: 'callout',
      variant: 'info',
      text: '`$inferSelect` ve `$inferInsert` kullanımı, şema ile tiplerin aynı yerden gelmesini sağlıyor. Küçük gibi görünen bu şey, proje büyüyünce bayağı rahatlatıyor.',
    },
    { type: 'h2', text: 'Bağlantı Katmanı' },
    {
      type: 'p',
      text: 'Serverless tarafta uzun ömürlü bağlantılar çoğu zaman baş ağrıtıyor. Neon’un HTTP tabanlı yapısı burada bana daha uyumlu geldi. Özellikle Vercel üzerinde gereksiz bağlantı karmaşası yaşamadan daha hafif bir veri katmanı kurabildim.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })`,
    },
    { type: 'h2', text: 'Sorgu Yazarken His' },
    {
      type: 'p',
      text: 'Drizzle’da en sevdiğim şey, SQL’e daha yakın hissettirmesi. Ne yazdığını ve bunun arkada neye döneceğini daha rahat tahmin ediyorsun. Özellikle performans tarafına bakarken bu daha kontrollü hissettiriyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      text: `return db
  .select({
    id: clients.id,
    name: clients.name,
    ageGroup: clients.ageGroup,
    lastSessionAt: sessions.startedAt,
  })
  .from(clients)
  .leftJoin(sessions, eq(sessions.clientId, clients.id))
  .where(eq(clients.createdBy, therapistId))`,
    },
    { type: 'h2', text: 'Migration Konusunda Disiplin' },
    {
      type: 'p',
      text: 'Geliştirme ortamında `push` komutu rahat. Ama canlı tarafta daha kontrollü bir migration akışı çok daha güvenli. Özellikle sağlık ya da danışan verisi gibi hassas alanlarda bu konu hafife alınmamalı.',
    },
    {
      type: 'code',
      lang: 'bash',
      text: `npx drizzle-kit generate
npx drizzle-kit migrate`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Geliştirme kolaylığı ile canlı sistem güvenliğini aynı komutta çözmeye çalışmak riskli. Production veritabanında kontrollü ilerlemek daha doğru.',
    },
  ],
}

export default post
