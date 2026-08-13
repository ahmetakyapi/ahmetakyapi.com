import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'tailwindcss-dark-tema-tasarimi',
  tag: 'Tasarım',
  tagColor: '#06b6d4',
  title: 'dark: Öneki Sizi Kandırıyor — Ve Tailwind Bunu Sessizce Yapıyor',
  excerpt:
    'Bu sitede aylarca fark etmediğim bir hata vardı: yazdığım bazı Tailwind sınıfları hiç CSS üretmiyordu. Dark tema, sessizce açık tema renklerine düşüyordu.',
  date: '2026-01-10',
  coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0f172a 100%)',
  content: [
    {
      type: 'lead',
      text: 'Hero bölümünün ortasında ince bir ayırıcı çizgi var. Dark temada aylarca parlak gri göründü ve ben bunu "biraz açık kalmış" diye geçtim. Meğer o sınıf hiç var olmuyormuş. Tailwind\'i kendi binary\'siyle derleyip çıktıyı okuyunca anladım.',
    },

    { type: 'h2', text: 'Hata: Olmayan Opaklık Değerleri' },
    {
      type: 'p',
      text: 'Tailwind\'in varsayılan opaklık ölçeği beşin katlarıdır: 0, 5, 10, 15, 20 … 95, 100. Yani `bg-white/10` üretilir, `bg-white/8` üretilmez.',
    },
    {
      type: 'p',
      text: 'Üretilmediğinde ne olur? Hata almazsınız. Uyarı da almazsınız. Sınıf HTML\'de durur, CSS\'te karşılığı yoktur ve tarayıcı onu yok sayar.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `// Bu satırdaki dark: sınıfı HİÇ CSS üretmiyordu
<div className="bg-gradient-to-r from-transparent dark:via-white/8 via-slate-200 to-transparent" />

// Sonuç: dark temada via rengi via-slate-200'e (#e2e8f0) düşüyor,
// yani neredeyse beyaz, tam opak bir çizgi çiziliyor.`,
    },
    {
      type: 'p',
      text: 'Sinsi kısmı şu: `dark:` öneki bir override\'dır, fallback değil. `dark:via-white/8` üretilmeyince dark temada boşluk kalmıyor — bir alttaki `via-slate-200` yürürlükte kalıyor. Yani karanlık tema, açık tema rengini kullanıyor.',
    },
    {
      type: 'p',
      text: 'Bunu doğrulamak için projenin kendi Tailwind sürümüyle sadece o sınıfları derledim:',
    },
    {
      type: 'code',
      lang: 'bash',
      text: `# Sadece test edilecek sınıfları içeren bir dosya oluştur, derle, çıktıya bak
echo '<div class="bg-white/8 bg-white/10 text-white/42 border-white/12"></div>' > /tmp/t.html
npx tailwindcss -i /tmp/in.css -o /tmp/out.css --content /tmp/t.html
grep -o 'bg-white\\\\/[0-9]*' /tmp/out.css
# çıktı: bg-white\\/10   ← sadece bu. /8, /42, /12 yok.`,
    },
    {
      type: 'p',
      text: 'Tüm projede taradım: `/8`, `/12`, `/14`, `/16`, `/18`, `/42`, `/48`, `/74`, `/88`. Sekiz dosyada, yirmiye yakın yerde. Bunlardan ikisi gerçekten görünür hataydı — blog sayfasındaki içindekiler paneli açık temada tamamen zeminsiz kalıyordu ve spot metin karanlıkta 2.4:1 kontrasta düşüyordu.',
    },

    { type: 'h3', text: 'İki Adımlı Düzeltme' },
    {
      type: 'p',
      text: 'Anlık çözüm köşeli parantez: `dark:via-white/[0.08]`. Bu her zaman üretilir çünkü keyfi değer olarak işleniyor.',
    },
    {
      type: 'p',
      text: 'Kalıcı çözüm ölçeği genişletmek. Kullandığım ara değerleri tanımladım, böylece hem `/8` çalışıyor hem de ileride sessizce kırılmıyor:',
    },
    {
      type: 'code',
      lang: 'ts',
      file: 'tailwind.config.ts',
      text: `theme: {
  extend: {
    opacity: {
      3: '0.03', 4: '0.04', 6: '0.06', 7: '0.07', 8: '0.08',
      12: '0.12', 14: '0.14', 16: '0.16', 18: '0.18',
      22: '0.22', 42: '0.42', 48: '0.48', 74: '0.74', 88: '0.88',
    },
  },
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      text: 'Bu sınıfa giren başka bir tuzak daha var: dinamik sınıf adı. `` className={`bg-${color}-500`} `` hiçbir zaman çalışmaz, çünkü Tailwind kaynak dosyalarını metin olarak tarıyor ve o birleştirmeyi çözemiyor. Renk değişkense `style` özniteliğini kullanın, sınıf üretmeye çalışmayın.',
    },

    { type: 'h2', text: 'Asıl Sorun Daha Derindeydi' },
    {
      type: 'p',
      text: 'Bu hata bir semptomdu. Gerçek sorun şuydu: sitede tanımlı bir yüzey ölçeği yoktu.',
    },
    {
      type: 'p',
      text: 'Kart renklerini tek tek saydım — bileşenlerin içine elle yazılmış 13 farklı koyu hex vardı. `#0c0b18`, `#0c0e17`, `#0a0a12`, `#07060f`, `#0a0814`, `#0e0c1a`, `#09101a`, `#0e1117`... Bunların çoğu aynı hiyerarşi seviyesindeki kartlardı ve gözle bakınca "birinde bir tuhaflık var" diyordunuz ama hangisinde olduğunu söyleyemiyordunuz.',
    },
    {
      type: 'p',
      text: 'Üstelik üç farklı sayfa zemini vardı: ana sayfa sıcak bej, blog soğuk mavi-gri, 404 başka bir mavi-gri. Ana sayfadan bir yazıya geçince zemin rengi değişiyordu.',
    },
    {
      type: 'p',
      text: 'Çözüm: dört kademeli tek bir yüzey ölçeği ve tek zemin.',
    },
    {
      type: 'code',
      lang: 'css',
      file: 'app/globals.css',
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
      text: 'Sonra bu değişkenleri Tailwind\'e renk olarak tanıttım. Böylece bileşenlerde `bg-card` yazabiliyorum ve `dark:` öneki hiç gerekmiyor — değişken zaten temaya göre değişiyor.',
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
},`,
    },
    {
      type: 'compare',
      label: 'Bir kartın zemin tanımı',
      before: { label: 'Önce', value: 'bg-white dark:bg-[#0c0e17]' },
      after: { label: 'Sonra', value: 'bg-card' },
      note: 'İki sınıf yerine bir sınıf; ve daha önemlisi, kart rengini değiştirmek istediğimde 13 dosyayı değil bir CSS değişkenini düzenliyorum.',
    },

    { type: 'h2', text: 'Açık Tema Neden Hep Üvey Evlat' },
    {
      type: 'p',
      text: 'Karanlık temayı tasarlarken saatler harcamıştım. Açık temayı ise "aynısının tersi" gibi düşünmüştüm. Kontrast ölçünce ortaya çıkan tablo şuydu:',
    },
    {
      type: 'table',
      head: ['Eleman', 'Ölçülen', 'Gereken (AA)'],
      rows: [
        ['Kart kenarlığı', '1.12 : 1', '3 : 1'],
        ['Künye metni (tarih, süre)', '2.2 : 1', '4.5 : 1'],
        ['İkincil buton kenarı', '1.4 : 1', '3 : 1'],
      ],
    },
    {
      type: 'p',
      text: 'Kartların kenarı yoktu. Bej zemin üstünde `rgba(180,170,150,0.2)` bir kenarlık, gözle bakınca "var gibi" ama gerçekte yok. Kenarlık renklerini koyulaştırdım ve künye metinlerini bir kademe koyulaştırdım.',
    },
    {
      type: 'quote',
      text: 'Karanlık temada yumuşak görünen bir gri, açık temada görünmez oluyor. Aynı opaklık değerini iki temada kullanmak, iki temayı da yarım yapmak demek.',
    },
    {
      type: 'p',
      text: 'Cam efekti (`backdrop-filter`) için de aynı şey geçerli. Koyu zeminde saydam beyaz bir yüzey doğal duruyor; açık zeminde aynı yüzey kayboluyor. Bu yüzden `.glass` sınıfının iki tema için iki ayrı tanımı var ve ikisinin ortak yanı sadece bulanıklık miktarı.',
    },

    { type: 'h2', text: 'Titremeyi Önlemek' },
    {
      type: 'p',
      text: 'Sunucu, kullanıcının hangi temada olduğunu bilmez. Bu yüzden ilk render ile istemci render\'ı uyuşmaz ve React uyarı verir.',
    },
    {
      type: 'p',
      text: '`next-themes` bunu `<html>` etiketine sınıf yazan küçük bir script ile çözüyor, ama React\'in uyuşmazlık uyarısını susturmak sizin işiniz:',
    },
    {
      type: 'code',
      lang: 'tsx',
      file: 'app/layout.tsx',
      text: `<html lang="tr" className={\`\${manrope.variable} \${mono.variable}\`} suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  </body>
</html>`,
    },
    {
      type: 'p',
      text: 'İkinci kısım daha önemli: tema durumunu OKUYAN her bileşenin monte olmayı beklemesi gerekiyor. Tema düğmesini `mounted` kontrolü olmadan render ederseniz, bir an yanlış ikon görünüp sonra değişiyor.',
    },
    {
      type: 'code',
      lang: 'tsx',
      text: `const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])

// Düğmeyi hiç render etmemek yerine yerini tutan bir kutu bırakın —
// aksi hâlde başlık çubuğu bir anlığına kayıyor.
if (!mounted) return <span className="block h-8 w-8" />`,
    },
    {
      type: 'callout',
      variant: 'warning',
      text: 'Bu bekleme yalnızca `resolvedTheme` değerini KULLANAN bileşenler için gerekli. `dark:` sınıflarıyla çalışan her şey CSS seviyesinde hallolduğu için beklemeye ihtiyaç duymaz. Her bileşene `mounted` guard\'ı koymak, sayfanın yarısını ilk boyamada boş bırakır.',
    },

    { type: 'h2', text: 'Regresyonu Nasıl Yakalarım' },
    {
      type: 'p',
      text: 'Bu hatayı bir kere temizledim ama yarın yine `/7` yazabilirim. Bu yüzden basit bir kontrol ekledim — ölçekte olmayan bir opaklık değeri görürse derlemeyi durduruyor.',
    },
    {
      type: 'code',
      lang: 'bash',
      text: `# scripts/check-opacity.sh
grep -roE '(bg|text|border|via|from|to|ring|divide)-[a-z]+(-[0-9]{2,3})?/[0-9]+' app components \\
  | grep -vE '/(0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100|3|4|6|7|8|12|14|16|18|22|42|48|74|88)$' \\
  && { echo 'Tailwind ölçeğinde olmayan opaklık değeri'; exit 1; } || exit 0`,
    },

    { type: 'h2', text: 'Çıkardığım Ders' },
    {
      type: 'p',
      text: 'Bir CSS aracının sessizce hiçbir şey üretmemesi, en zor fark edilen hata türü. Derleyici uyarmıyor, tarayıcı uyarmıyor, ekranda bir şey görünüyor — sadece yanlış şey görünüyor.',
    },
    {
      type: 'p',
      text: 'Bugün olsa iki şeyi baştan yapardım: yüzey ölçeğini ilk günden CSS değişkeni olarak tanımlar ve iki temanın kontrastını tasarım aşamasında ölçerdim. İkisi de bittikten sonra düzeltmesi, baştan yapmaktan uzun sürdü.',
    },
  ],
}

export default post
