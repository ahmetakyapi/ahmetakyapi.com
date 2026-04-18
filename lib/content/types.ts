export interface Project {
  id: number
  category: string
  title: string
  description: string
  tags: string[]
  link: string
  github?: string
  accent: string
  gradient: string
  badge: 'Canlı' | 'GitHub'
  featured: boolean
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'info' | 'warning'; text: string }

export interface BlogPost {
  slug: string
  tag: string
  tagColor: string
  title: string
  excerpt: string
  date: string
  readTime: string
  coverGradient: string
  content: Block[]
}

export interface TechStackItem {
  name: string
  tagline: string
  color: string
  bg: string
  border: string
}
