import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'tailwindcss-dark-tema-tasarimi',
  tag: 'Tasarım',
  tagColor: '#06b6d4',
  title: "ahmetakyapi.com: Açık ve Koyu Tema",
  excerpt:
    'Bu sitede yazdığım bazı Tailwind sınıfları hiç CSS üretmiyordu. Ne hata çıkıyordu ne de bir uyarı; koyu tema yer yer açık temanın renkleriyle çiziliyordu.',
  date: '2026-08-17',
  coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0f172a 100%)',
  content: [
    {
      type: 'lead',
      text: 'Ana sayfanın üst bölümünde ince bir ayırıcı çizgi var. Koyu temada neredeyse beyaz, tam opak bir çizgi olarak çiziliyordu. Sebebi koyu tema için yazdığım sınıfın CSS\'te hiç karşılığı olmamasıydı.',
    },

    { type: 'h2', text: 'Hata: Olmayan Opaklık Değerleri' },
    {
      type: 'p',
      text: 'Tailwind v3\'ün varsayılan opaklık ölçeği beşin katlarından oluşuyor: 0, 5, 10, 15, 20 diye 100\'e kadar gidiyor. Yani `bg-white/10` üretiliyor, `bg-white/8` üretilmiyor.',
    },
    {
      type: 'p',
      text: 'Üretilmeyen sınıf için hata da uyarı da çıkmıyor. Sınıf HTML\'de duruyor, CSS\'te karşılığı yok ve tarayıcı onu görmezden geliyor.',
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
      text: 'İşin kötü yanı şu: `dark:` öneki açık temadaki değerin üzerine yazar. `dark:via-white/8` üretilmeyince üzerine yazılacak bir şey kalmıyor ve alttaki `via-slate-200` geçerli oluyor. Yani koyu tema, açık temanın rengiyle çiziliyor.',
    },
    {
      type: 'p',
      text: 'Bunu görmenin en kısa yolu, projenin kendi Tailwind sürümüyle yalnızca o sınıfları derleyip çıktıya bakmak:',
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
      text: 'Bütün projeyi taradığımda liste uzadı: `/8`, `/12`, `/14`, `/16`, `/18`, `/42`, `/48`, `/74`, `/88` ve birkaç tane daha. Hepsi bileşenlerin içine dağılmıştı ve hiçbiri CSS üretmiyordu.',
    },

    { type: 'h3', text: 'İki Adımlı Düzeltme' },
    {
      type: 'p',
      text: 'Hızlı çözüm köşeli parantez: `dark:via-white/[0.08]`. Tailwind bunu serbest değer (arbitrary value) olarak işlediği için her zaman üretiyor.',
    },
    {
      type: 'p',
      text: 'Kalıcı çözüm ölçeği genişletmek. Kullandığım ara değerleri config\'e ekledim; böylece `/8` çalışıyor ve yarın aynı değeri yazdığımda da çalışmaya devam ediyor:',
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
      text: 'Opaklık hatası işin görünen kısmıydı. Asıl sorun, sitede zemin ve kart renkleri için tanımlı bir sıra olmamasıydı.',
    },
    {
      type: 'p',
      text: 'Kart renklerini tek tek saydım: bileşenlerin içine elle yazılmış 13 farklı koyu hex vardı. `#0c0b18`, `#0c0e17`, `#0a0a12`, `#07060f`, `#0a0814`, `#0e0c1a`, `#09101a`, `#0e1117`... Çoğu aynı seviyedeki kartlardı. Yan yana bakınca bir tanesinin farklı durduğu seziliyor, ama hangisi olduğu söylenemiyordu.',
    },
    {
      type: 'p',
      text: 'Sayfa zeminleri de birbirini tutmuyordu; blog ve 404 sayfasının kendi zemin rengi vardı. Ana sayfadan bir yazıya geçince zemin değişiyordu.',
    },
    {
      type: 'p',
      text: 'Çözüm dört kademeli tek bir renk sırası ve tek bir zemin oldu: sayfa zemini, kart, kartın üstündeki katman ve içe gömülü alan.',
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
      text: 'Sonra bu değişkenleri Tailwind\'e renk olarak tanıttım. Bileşende `bg-card` yazıyorum ve `dark:` önekine gerek kalmıyor, çünkü değişkenin kendisi temaya göre değişiyor.',
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
      note: 'İki sınıf yerine bir sınıf. Kart rengini değiştirmek istediğimde de 13 dosyayı değil, tek bir CSS değişkenini düzenliyorum.',
    },

    { type: 'h2', text: 'Açık Temada Kenarlar Kaybolmuştu' },
    {
      type: 'p',
      text: 'Aynı turda açık temanın kontrastını da ölçtüm. İki yer AA eşiğinin altındaydı:',
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
      text: 'Kartların kenarı pratikte görünmüyordu. Bej zeminin üstünde `rgba(180, 170, 150, 0.2)` bir kenarlık vardı; 1,12:1 kontrastla ekranda neredeyse yok. Kenarlıkları koyulaştırdım. Altbilgideki sosyal ikonlar da `text-gray-400`\'ten `slate-500`\'e geçti.',
    },
    {
      type: 'quote',
      text: 'Koyu temada yumuşak duran bir gri, açık temada görünmez oluyor. Aynı opaklığı iki temada kullanmak, iki temayı da yarım yapmak demek.',
    },
    {
      type: 'p',
      text: 'Cam efekti (`backdrop-filter`) için de aynısı geçerli. Koyu zeminde yarı saydam beyaz bir katman doğal duruyor; açık zeminde aynı katman kayboluyor. Bu yüzden `.glass` sınıfının iki tema için iki ayrı tanımı var ve ikisinde ortak olan tek şey bulanıklık miktarı.',
    },

    { type: 'h2', text: 'Titremeyi Önlemek' },
    {
      type: 'p',
      text: 'Sunucu, okuyucunun hangi temayı seçtiğini bilmiyor. Bu yüzden sunucudaki ilk çizim ile tarayıcıdaki çizim tutmuyor ve React hydration uyarısı veriyor.',
    },
    {
      type: 'p',
      text: '`next-themes` bunu sayfa çizilmeden önce `<html>` etiketine sınıf yazan küçük bir script ile çözüyor. React\'in uyarısını susturmak ise sana kalıyor:',
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
      text: 'İkinci kısım: temayı okuyan her bileşen, tarayıcıda mount olana kadar beklemeli. Tema düğmesi `mounted` kontrolü olmadan çizilirse bir an yanlış ikon görünüp sonra değişiyor. Bu sitede düğme mount olana kadar hiç çizilmiyor (`mounted && …`). Doğrusu, yerine aynı boyda boş bir kutu bırakmaktı; düğme geldiğinde yanındaki öğeler kaymasın diye. Onu henüz yapmadım.',
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu bekleme yalnızca `resolvedTheme` değerini okuyan bileşenler için gerekli. `dark:` sınıflarıyla çalışan her şey CSS\'te çözülüyor, beklemesine gerek yok. Her bileşene `mounted` kontrolü koyarsan sayfanın yarısı ilk çizimde boş gelir.',
    },

    { type: 'h2', text: 'Bu Hata Bir Daha Olur mu' },
    {
      type: 'p',
      text: 'Bu sitede olabilir. Ölçeği genişlettim ama yarın `/13` yazarsam yine hiçbir şey üretilmeyecek ve bunu yakalayan bir kontrol yok.',
    },
    {
      type: 'p',
      text: 'Tailwind v4\'te bu hata türü yok. Açılış Zili\'nde kurulu olan v4.3.3 ile aynı sınıfları derledim: `bg-white/8`, `bg-white/42`, hatta `text-white/13` bile üretiliyor. v4 opaklığı sabit bir ölçekten almıyor, yazdığın sayıyı `color-mix()` içine koyuyor.',
    },

    { type: 'h2', text: 'Baştan Yapsam' },
    {
      type: 'p',
      text: 'Bir CSS aracının hiçbir şey üretmemesini fark etmek zor. Build uyarmıyor, tarayıcı uyarmıyor ve ekranda yine bir renk görünüyor; sadece yanlış renk.',
    },
    {
      type: 'p',
      text: 'Bugün başlasam iki şeyi ilk gün yapardım: zemin ve kart renklerini CSS değişkeni olarak tanımlar, iki temanın kontrastını tasarım sırasında ölçerdim. Bu sitede ikisi de ancak Ağustos\'taki temizlikte yapıldı. Hâlâ açık kalan soru şu: bir sınıfın hiç CSS üretmediğini build sırasında yakalayan bir kontrolü nasıl kurarım?',
    },
  ],
}

export default post
