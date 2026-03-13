import { blogPosts as defaultBlogPosts, projects as defaultProjects } from '@/lib/data'
import type { BlogPost, Project } from '@/lib/data'

export interface HomeValueProp {
  icon: string
  title: string
  description: string
  color: string
  glow: string
}

export interface HomeContent {
  roleLabel: string
  firstName: string
  lastName: string
  introPrimary: string
  introSecondary: string
  expertise: string[]
  valueProps: HomeValueProp[]
}

export interface SiteContent {
  home: HomeContent
  projects: Project[]
  blogPosts: BlogPost[]
}

export const defaultHomeContent: HomeContent = {
  roleLabel: 'Fullstack Developer',
  firstName: 'Ahmet',
  lastName: 'Akyapı',
  introPrimary: 'Angular, React ve TypeScript ile sade, hızlı ve detay kalitesi yüksek arayüzler geliştiriyorum.',
  introSecondary: 'Benim için iyi bir ürün deneyimi; yalnızca çalışması değil, doğru kurgu içermesi ve görsel olarak dengeli olmasıdır.',
  expertise: ['UI Systems', 'Design', 'Performance', 'Web'],
  valueProps: [
    {
      icon: '⚡',
      title: 'Hız ve Akış',
      description:
        'Arayüz deneyiminin akıcı, tutarlı ve gecikmesiz hissedilmesi; yalnızca görünen katmanın değil, veri akışının ve sistem kurgusunun da doğru tasarlanmasına bağlıdır. API yapısından UI render sürecine kadar her katmanda performans, sadelik ve kullanıcı ritmi ön planda tutulur.',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.18)',
    },
    {
      icon: '◈',
      title: 'Sistem Düşüncesi',
      description:
        'Ölçeklenebilir arayüzler; bileşen sınırlarının, veri yapılarının ve tip güvenliğinin en baştan net kurulmasıyla güç kazanır. Framework bağımsız bir bakışla, kod tabanının büyüdükçe karmaşıklaşmayan; aksine daha okunabilir, sürdürülebilir ve yönetilebilir bir yapıda kalması hedeflenir.',
      color: '#8b5cf6',
      glow: 'rgba(139,92,246,0.18)',
    },
    {
      icon: '✦',
      title: 'Detay ve Hareket',
      description:
        'Mikro etkileşimler, geçişler, yüklenme durumları ve boş ekranlar; ürün kalitesini görünür kılan ince katmandır. Hareket dili ve görsel ritim, yalnızca estetik bir tercih değil; algıyı güçlendiren ve deneyimi rafine eden bir tasarım unsuru olarak ele alınır.',
      color: '#22d3ee',
      glow: 'rgba(34,211,238,0.18)',
    },
  ],
}

export const defaultSiteContent: SiteContent = {
  home: defaultHomeContent,
  projects: defaultProjects,
  blogPosts: defaultBlogPosts,
}

export function normalizeSiteContent(input?: Partial<SiteContent> | null): SiteContent {
  return {
    home: {
      ...defaultHomeContent,
      ...(input?.home ?? {}),
      expertise: Array.isArray(input?.home?.expertise) ? input?.home?.expertise.filter(Boolean) : defaultHomeContent.expertise,
      valueProps: Array.isArray(input?.home?.valueProps) && input.home.valueProps.length > 0
        ? input.home.valueProps
        : defaultHomeContent.valueProps,
    },
    projects: Array.isArray(input?.projects) && input.projects.length > 0 ? input.projects : defaultProjects,
    blogPosts: Array.isArray(input?.blogPosts) && input.blogPosts.length > 0 ? input.blogPosts : defaultBlogPosts,
  }
}

export function getOrderedProjects(projects: Project[]) {
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  return [...featured, ...rest]
}
