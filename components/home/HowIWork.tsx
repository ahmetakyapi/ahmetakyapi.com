import type { CSSProperties } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Nasıl Çalışırım: tek paragraf, kart yok.
 *
 * Kaydırdıkça kelime kelime aydınlanır (home.css → "Kinetik paragraf").
 * Her kelime paragrafın görünüm zaman çizelgesinde kendi dilimini alır:
 * `--ws` başlangıç, `--we` bitiş, ikisi de `cover` aralığının yüzdesi.
 * Neden: okuma hızını kaydırmaya bağlıyor; uzun bir paragraf tek blok
 * olarak gözü korkutmuyor, okuyucu nerede olduğunu ışıktan izliyor.
 * Destek yoksa ya da hareket azaltılmışsa paragraf baştan tam parlak.
 *
 * Metin tek `<p>`; kelimeler `<span>`, aradaki boşluklar düz metin.
 * Ekran okuyucu tek cümle akışı okur.
 */
/* Dilimler `cover` aralığının yüzdesi. Son kelime %33'te tam parlak:
   o anda paragrafın üst kenarı görünümün ortasının hâlâ ALTINDA
   (1280×800'de ve 390×844'te ölçüldü). Eski değerlerle (16 + 40 + 7 = %63)
   paragraf ekranın üst yarısını geçip okunmuş olduktan sonra bile son
   satır sönüktü. İlk kelime paragraf ekrana girer girmez (%4) yanmaya
   başlar. */
const RANGE_START = 4
const RANGE_SPAN = 24
const WORD_SPAN = 5

export function HowIWork({ text }: { text: string }) {
  const words = text.split(' ')
  const last = Math.max(1, words.length - 1)

  return (
    <Container as="section" aria-labelledby="nasil-calisirim" className="py-24 sm:py-36">
      <SectionHeading id="nasil-calisirim" title="Nasıl Çalışırım" className="mb-8 sm:mb-10" />
      <p className="home-kinetic text-[clamp(1.625rem,3.4vw,2.75rem)] font-medium leading-[1.25] tracking-[-0.025em] text-strong">
        {words.map((word, i) => {
          const start = RANGE_START + (RANGE_SPAN * i) / last
          const style = { '--ws': `${start.toFixed(2)}%`, '--we': `${(start + WORD_SPAN).toFixed(2)}%` } as CSSProperties
          return (
            <span key={i}>
              <span className="home-word" style={style}>
                {word}
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          )
        })}
      </p>
    </Container>
  )
}
