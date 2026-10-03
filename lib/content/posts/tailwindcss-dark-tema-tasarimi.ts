import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'tailwindcss-dark-tema-tasarimi',
  tag: 'Tasarım',
  tagColor: '#06b6d4',
  title: "ahmetakyapi.com: Dark Tema Sessizce Bozulmuştu",
  excerpt:
    'Bu sitede uzun süre fark etmediğim bir hata vardı: yazdığım bazı Tailwind sınıfları hiç CSS üretmiyordu ve koyu tema sessizce açık temanın renklerine düşüyordu.',
  date: '2026-01-10',
  coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0f172a 100%)',
  content: [
    {
      type: 'lead',
      text: 'Ana sayfanın üst bölümünde ince bir ayırıcı çizgi var. Koyu temada uzun süre parlak gri göründü ve ben bunu "biraz açık kalmış" diye geçtim. Meğer o sınıf hiç var olmuyormuş. Tailwind\'i projenin kendi sürümüyle derleyip çıktıyı okuyunca anladım.',
    },

    { type: 'h2', text: 'Hata: Olmayan Opaklık Değerleri' },
    {
      type: 'p',
      text: 'Tailwind v3\'ün varsayılan opaklık ölçeği beşin katlarından oluşuyor: 0, 5, 10, 15, 20 ve böyle 100\'e kadar. Yani `bg-white/10` üretiliyor, `bg-white/8` üretilmiyor.',
    },
    {
      type: 'p',
      text: 'Üretilmeyince ne oluyor? Hata yok, uyarı da yok. Sınıf HTML\'de duruyor, CSS\'te karşılığı yok ve tarayıcı onu yok sayıyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `// Bu satırdaki dark: sınıfı HİÇ CSS üretmiyordu
<div className="bg-gradient-to-r from-transparent dark:via-white/8 via-slate-200 to-transparent" />

// Sonuç: koyu temada via rengi via-slate-200'e (#e2e8f0) düşüyor,
// yani neredeyse beyaz, tam opak bir çizgi çiziliyor.`,
    },
    {
      type: 'p',
      text: 'İşin sinsi yanı şu: `dark:` öneki bir geri dönüş değil, üzerine yazma. `dark:via-white/8` üretilmeyince koyu temada boşluk kalmıyor, bir alttaki `via-slate-200` yürürlükte kalıyor. Koyu tema, açık temanın rengini kullanıyor.',
    },
    {
      type: 'p',
      text: 'Doğrulamak için projenin kendi Tailwind sürümüyle yalnızca o sınıfları derledim:',
    },
    {
      type: 'code',
      lang: 'bash',
      text: `# Yalnızca test edilecek sınıfları içeren bir dosya oluştur, derle, çıktıya bak
echo '<div class="bg-white/8 bg-white/10 text-white/42 border-white/12"></div>' > /tmp/t.html
npx tailwindcss -i /tmp/in.css -o /tmp/out.css --content /tmp/t.html
grep -o 'bg-white\\\\/[0-9]*' /tmp/out.css
# çıktı: bg-white\\/10   ← sadece bu. /8, /42, /12 yok.`,
    },
    {
      type: 'p',
      text: 'Sonra bütün projeyi taradım. `/8`, `/12`, `/14`, `/16`, `/18`, `/42`, `/48`, `/74`, `/88` ve birkaç tane daha; hepsi bileşenlerin içine dağılmış, hepsi sessizce boş.',
    },

    { type: 'h3', text: 'İki Adımlı Düzeltme' },
    {
      type: 'p',
      text: 'Anlık çözüm köşeli parantez: `dark:via-white/[0.08]`. Keyfi değer olarak işlendiği için her zaman üretiliyor.',
    },
    {
      type: 'p',
      text: 'Kalıcı çözüm ölçeği genişletmek. Kullandığım ara değerleri yapılandırmaya tanımladım; böylece hem `/8` çalışıyor hem de yarın aynı değeri yazdığımda sessizce kırılmıyor:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'tailwind.config.ts',
      text: `theme: {
  extend: {
    opacity: {
      3: '0.03', 4: '0.04', 6: '0.06', 7: '0.07', 8: '0.08',
      12: '0.12', 14: '0.14', 16: '0.16', 18: '0.18', 22: '0.22',
      42: '0.42', 48: '0.48', 55: '0.55', 65: '0.65', 74: '0.74', 88: '0.88',
    },
  },
}`,
    },

    { type: 'h2', text: 'Asıl Sorun Daha Derindeydi' },
    {
      type: 'p',
      text: 'Opaklık hatası bir belirtiydi. Asıl sorun sitede tanımlı bir yüzey ölçeği olmamasıydı.',
    },
    {
      type: 'p',
      text: 'Kart renklerini tek tek saydım: bileşenlerin içine elle yazılmış 13 farklı koyu hex vardı. `#0c0b18`, `#0c0e17`, `#0a0a12`, `#07060f`, `#0a0814`, `#0e0c1a`, `#09101a`, `#0e1117`... Çoğu aynı hiyerarşi seviyesindeki kartlardı. Gözle bakınca "bir tanesinde tuhaflık var" diyordun ama hangisinde olduğunu söyleyemiyordun.',
    },
    {
      type: 'p',
      text: 'Sayfa zeminleri de birbirini tutmuyordu; blog ve 404 sayfası kendi zemin renklerini taşıyordu. Ana sayfadan bir yazıya geçince zemin değişiyordu.',
    },
    {
      type: 'p',
      text: 'Çözüm dört kademeli tek bir yüzey ölçeği ve tek bir zemin oldu:',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'globals.css',
      text: `:root {
  /* Kademe: page (zemin) → card (kart) → raised (kart üstü) → sunken (oyuk) */
  --surface-page:   #f3f1eb;
  --surface-card:   #fdfcf9;
  --surface-raised: #ffffff;
  --surface-sunken: #eceae3;
  --line:           rgba(120, 110, 90, 0.22);
  --line-strong:    rgba(120, 110, 90, 0.34);
}

html.dark {
  --surface-page:   #04070d;
  --surface-card:   #0b0e18;
  --surface-raised: #121726;
  --surface-sunken: #06090f;
  --line:           rgba(148, 163, 184, 0.13);
  --line-strong:    rgba(148, 163, 184, 0.22);
}`,
    },
    {
      type: 'p',
      text: 'Sonra bu değişkenleri Tailwind\'e renk olarak tanıttım. Bileşende `bg-card` yazıyorum ve `dark:` önekine hiç gerek kalmıyor, çünkü değişken zaten temaya göre değişiyor.',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'tailwind.config.ts',
      text: `colors: {
  page:   'var(--surface-page)',
  card:   'var(--surface-card)',
  raised: 'var(--surface-raised)',
  sunken: 'var(--surface-sunken)',
  hairline: 'var(--line)',
  'hairline-strong': 'var(--line-strong)',
},`,
    },
    {
      type: 'compare',
      label: 'Bir Kartın Zemin Tanımı',
      before: { label: 'Önce', value: 'bg-white dark:bg-[#0c0e17]' },
      after: { label: 'Sonra', value: 'bg-card' },
      note: 'İki sınıf yerine bir sınıf. Daha önemlisi, kart rengini değiştirmek istediğimde 13 dosyayı değil tek bir CSS değişkenini düzenliyorum.',
    },

    { type: 'h2', text: 'Açık Tema Neden Hep Üvey Evlat' },
    {
      type: 'p',
      text: 'Koyu temayı tasarlarken saatler harcamıştım; açık temayı "aynısının tersi" diye düşünmüştüm. Kontrastı ölçünce çıkan tablo bu oldu:',
    },
    {
      type: 'table',
      head: ['Eleman', 'Ölçülen', 'Gereken (AA)'],
      rows: [
        ['Kart Kenarlığı (Açık Tema)', '1,12 : 1', '3 : 1'],
        ['Altbilgi Sosyal İkonları (Açık Tema)', '~2,2 : 1', '3 : 1'],
      ],
    },
    {
      type: 'p',
      text: 'Kartların fiilen kenarı yoktu. Bej zeminin üstünde `rgba(180, 170, 150, 0.2)` bir kenarlık; gözle bakınca var gibi, ölçünce yok. Kenarlıkları koyulaştırdım, altbilgideki ikonları bir kademe koyu griye çektim.',
    },
    {
      type: 'quote',
      text: 'Koyu temada yumuşak duran bir gri, açık temada görünmez oluyor. Aynı opaklığı iki temada kullanmak, iki temayı da yarım yapmak demek.',
    },
    {
      type: 'p',
      text: 'Cam efekti (`backdrop-filter`) için de aynısı geçerli. Koyu zeminde yarı saydam beyaz bir yüzey doğal duruyor; açık zeminde aynı yüzey kayboluyor. `.glass` sınıfının bu yüzden iki tema için iki ayrı tanımı var ve ortak yanları yalnızca bulanıklık miktarı.',
    },

    { type: 'h2', text: 'Titremeyi Önlemek' },
    {
      type: 'p',
      text: 'Sunucu, okuyucunun hangi temada olduğunu bilmiyor. İlk çizim ile istemcideki çizim bu yüzden uyuşmuyor ve React uyarı veriyor.',
    },
    {
      type: 'p',
      text: '`next-themes` bunu `<html>` etiketine sınıf yazan küçük bir betikle çözüyor. React\'in uyuşmazlık uyarısını susturmak ise senin işin:',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'app/layout.tsx',
      text: `<html lang="tr" className={\`\${manrope.variable} \${ibmPlexMono.variable}\`} suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  </body>
</html>`,
    },
    {
      type: 'p',
      text: 'İkinci kısım daha önemli: temayı okuyan her bileşen, bileşen monte olana kadar beklemeli. Tema düğmesi `mounted` kontrolü olmadan çizilirse bir an yanlış ikon görünüp sonra değişiyor. Bu sitede düğme monte olana kadar hiç çizilmiyor (`mounted && …`). Doğrusu yerini tutan aynı boyda bir kutu bırakmaktı; düğme geldiğinde yanındaki öğelerin yeri oynamasın diye. Onu henüz yapmadım.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu bekleme yalnızca `resolvedTheme` değerini kullanan bileşenler için gerekli. `dark:` sınıflarıyla çalışan her şey CSS seviyesinde hallolduğu için beklemeye ihtiyaç duymaz. Her bileşene `mounted` koruması koymak, sayfanın yarısını ilk boyamada boş bırakır.',
    },

    { type: 'h2', text: 'Bu Hata Bir Daha Olur mu' },
    {
      type: 'p',
      text: 'Bu sitede olabilir. Ölçeği genişlettim ama yarın `/13` yazarsam yine sessizce hiçbir şey üretmeyecek ve bunu yakalayan bir kontrol yok.',
    },
    {
      type: 'p',
      text: 'Tailwind v4\'te ise bu hata sınıfı ortadan kalkıyor. Açılış Zili\'nde kurulu olan v4.3.3 ile aynı sınıfları derledim: `bg-white/8`, `bg-white/42`, hatta `text-white/13` bile üretiliyor. v4 opaklığı sabit bir ölçekten değil, yazdığın sayıdan `color-mix()` ile kuruyor.',
    },

    { type: 'h2', text: 'Çıkardığım Ders' },
    {
      type: 'p',
      text: 'Bir CSS aracının sessizce hiçbir şey üretmemesi, fark edilmesi en zor hata türü. Derleyici uyarmıyor, tarayıcı uyarmıyor, ekranda bir şey görünüyor; yalnızca yanlış şey görünüyor.',
    },
    {
      type: 'p',
      text: 'Bugün olsa iki şeyi baştan yapardım: yüzey ölçeğini ilk günden CSS değişkeni olarak tanımlar, iki temanın kontrastını tasarım aşamasında ölçerdim. İkisini de iş bittikten sonra düzeltmek, baştan yapmaktan uzun sürdü.',
    },
  ],
}

export default post
