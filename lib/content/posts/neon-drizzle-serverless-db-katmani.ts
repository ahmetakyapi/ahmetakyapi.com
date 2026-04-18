import type { BlogPost } from '../types'

export const post: BlogPost = {
    slug: 'neon-drizzle-serverless-db-katmani',
    tag: 'Database',
    tagColor: '#10b981',
    title: 'Mimio — Prisma\'dan Drizzle\'a, Cold Start\'ı Saniyenin Altına İndirmek',
    excerpt:
      'Vercel\'da Prisma cold start\'ı 900ms\'yi buluyordu. Neon serverless driver + Drizzle ile ilk isteği 100ms bandına çekmenin üretim notları.',
    date: '2026-03-22',
    readTime: '7 dk',
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    content: [
      { type: 'p', text: 'Mimio ilk günlerinde Prisma kullanıyordu. Schema güzel, migration\'lar temiz, autocomplete iyi. Derken Vercel build süreleri 3 dakikayı bulmaya başladı ve cold start\'lar saniyenin altına inmedi. Drizzle\'a geçiş sonrası build yarıya indi, kullanıcı tarafında ilk istek fark edilir şekilde hızlandı.' },
      { type: 'h2', text: 'Prisma Neden Serverless\'ta Ağır' },
      { type: 'p', text: 'Prisma bir query builder değil; kendi query engine\'i olan bir araç. Rust binary\'si bundle\'a dahil oluyor, ilk istekte binary yükleniyor, sonra connection kuruluyor. Neon ile kullanınca WebSocket upgrade dahil cold start çoğu istekte 900ms\'i buluyordu. Kullanıcı tarafında bu ilk tıklamada beyaz ekran demek.' },
      { type: 'p', text: 'Drizzle saf TypeScript. Bundle\'a bir şey eklemiyor, runtime\'da init adımı yok. Neon serverless driver HTTP üstünden konuşuyor, WebSocket yok. İlk istek 80-120ms bandına düştü.' },
      { type: 'h2', text: 'Kurulum ve Schema' },
      { type: 'code', lang: 'bash', text: `npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit` },
      { type: 'code', lang: 'ts', text: `// lib/db/schema.ts
import { pgTable, uuid, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core'

export const clients = pgTable('clients', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  ageGroup:    text('age_group', { enum: ['pediatric', 'adult'] }).notNull(),
  primaryGoal: text('primary_goal').notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  createdBy:   uuid('created_by').notNull(),
}, (t) => ({
  createdByIdx: index('clients_created_by_idx').on(t.createdBy),
}))

export const sessions = pgTable('sessions', {
  id:        uuid('id').primaryKey().defaultRandom(),
  clientId:  uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt:   timestamp('ended_at'),
  notes:     text('notes'),
  gameLog:   jsonb('game_log').$type<GameLogEntry[]>().default([]).notNull(),
})

export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert` },
      { type: 'callout', variant: 'info', text: '$inferSelect ve $inferInsert kullanışlı bir ayrıntı. Tip tanımını elle yazmanıza gerek yok; schema değiştiğinde tip otomatik güncelleniyor.' },
      { type: 'h2', text: 'Connection: pg Değil, Neon Serverless' },
      { type: 'p', text: 'Vercel\'da pg kütüphanesini kullanamazsınız. Denerseniz ya hang kalır ya timeout olur, çünkü long-lived connection serverless fonksiyon döngüsüne aykırı. Neon serverless driver bu noktayı çözüyor — her istek için yeni bir HTTP connection açıyor.' },
      { type: 'code', lang: 'ts', text: `// lib/db/client.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })` },
      { type: 'p', text: 'Üç satır. Pool yapılandırması yok, global instance tuzağı yok. Next.js dev server\'da hot reload sırasında çakılmıyor, Vercel\'da cold start\'ı da yemiyor.' },
      { type: 'h2', text: 'Query Yazmak: SQL\'e Yakın, Tip Güvenli' },
      { type: 'code', lang: 'ts', text: `import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { clients, sessions } from '@/lib/db/schema'

export async function getTherapistClients(therapistId: string) {
  return db
    .select({
      id:            clients.id,
      name:          clients.name,
      ageGroup:      clients.ageGroup,
      lastSessionAt: sessions.startedAt,
    })
    .from(clients)
    .leftJoin(sessions, eq(sessions.clientId, clients.id))
    .where(eq(clients.createdBy, therapistId))
    .orderBy(desc(sessions.startedAt))
}` },
      { type: 'p', text: 'Prisma\'da bu sorgu için ya include ile ekstra round-trip ya da $queryRaw yazmak gerekiyordu. Drizzle bunu tek bir SQL\'e derliyor; üretilen SQL\'i drizzle-kit ile görebiliyorsunuz.' },
      { type: 'h2', text: 'Migration: drizzle-kit generate ve push' },
      { type: 'code', lang: 'ts', text: `// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out:    './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})` },
      { type: 'code', lang: 'bash', text: `# Development
npx drizzle-kit push      # schema'yı direkt DB'ye yansıt, migration dosyası üretme

# Production flow
npx drizzle-kit generate  # SQL migration dosyası üret
npx drizzle-kit migrate   # migration'ları uygula` },
      { type: 'callout', variant: 'warning', text: 'Push komutunu production DB\'sine asla çalıştırmayın. İsim değiştirirken tablo drop/recreate yapabiliyor. Migration üretin, CI\'da gözden geçirin, öyle uygulayın.' },
      { type: 'h2', text: 'Transaction ve Edge Uyumluluğu' },
      { type: 'p', text: 'Neon HTTP driver transaction\'ı destekliyor ama WebSocket\'ten farklı olarak açıp-bırakamıyorsunuz; tek bir batch olarak gidiyor. Çoğu senaryoda yeterli.' },
      { type: 'code', lang: 'ts', text: `await db.transaction(async (tx) => {
  const [client] = await tx.insert(clients).values({
    name:        'Ada',
    ageGroup:    'pediatric',
    primaryGoal: 'İnce motor becerileri',
    createdBy:   userId,
  }).returning()

  await tx.insert(sessions).values({
    clientId:  client.id,
    startedAt: new Date(),
  })
})` },
      { type: 'h2', text: 'Prisma\'dan Geçerken Dikkat Ettiğim Şeyler' },
      { type: 'ul', items: [
        'enum\'ları pgEnum yerine text + { enum: [...] } ile tanımlıyorum; migration\'lar çok daha az sorun çıkarıyor.',
        'Relational queries (db.query.x.findMany) iyi ama karmaşık join\'lerde select()\'i tercih ediyorum — üretilen SQL daha öngörülebilir.',
        'Zod şemasını Drizzle\'dan üretmek için drizzle-zod paketi var; API katmanındaki formlarda ciddi iş görüyor.',
        'Neon\'un branching özelliği (her PR\'a ayrı DB) Vercel preview\'larıyla eşleşince test akışı belirgin şekilde rahatladı.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Drizzle\'ın tüm SQL dokümantasyonunu baştan okumaya gerek yok. Önce basit bir CRUD, sonra bir join, sonra transaction yazmak yeterli; API bu sırayla doğal şekilde oturuyor.' },
      { type: 'h2', text: 'Kapanış' },
      { type: 'p', text: 'Her ORM bir abstraction; her abstraction bir bedel. Prisma\'nın bedeli cold start, Drizzle\'ın bedeli biraz daha SQL düşünmek. Serverless bağlamında ikinci bedel çok daha ucuz geldi.' },
    ],
  }

export default post
