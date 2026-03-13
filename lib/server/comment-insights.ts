import type { BlogPost } from '@/lib/data'

interface GitHubDiscussionNode {
  title: string
  url: string
  comments: {
    totalCount: number
    nodes: Array<{
      author: { login: string } | null
    }>
  }
}

export interface CommentInsight {
  slug: string
  title: string
  totalComments: number
  commenters: string[]
  discussionUrl: string
}

export interface CommentInsightsResult {
  configured: boolean
  reason?: string
  items: CommentInsight[]
}

function getRepoParts() {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? ''
  const [owner, name] = repo.split('/')

  if (!owner || !name) {
    return null
  }

  return { owner, name }
}

function extractSlugFromDiscussionTitle(title: string) {
  const match = title.match(/\/blog\/([^/?#]+)/)
  return match?.[1] ?? null
}

export async function getCommentInsights(posts: BlogPost[]): Promise<CommentInsightsResult> {
  const repo = getRepoParts()
  const token = process.env.GITHUB_TOKEN

  if (!repo || !token) {
    return {
      configured: false,
      reason: 'GitHub Discussions yorum içgörüleri için NEXT_PUBLIC_GISCUS_REPO ve GITHUB_TOKEN gerekli.',
      items: [],
    }
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query DiscussionInsights($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              discussions(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes {
                  title
                  url
                  comments(first: 50) {
                    totalCount
                    nodes {
                      author {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: repo,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`)
    }

    const payload = (await response.json()) as {
      data?: {
        repository?: {
          discussions?: {
            nodes?: GitHubDiscussionNode[]
          }
        }
      }
    }

    const discussions = payload.data?.repository?.discussions?.nodes ?? []

    const items = posts.flatMap((post) => {
      const discussion = discussions.find((node) => extractSlugFromDiscussionTitle(node.title) === post.slug)

      if (!discussion || discussion.comments.totalCount === 0) {
        return []
      }

      const commenters = Array.from(
        new Set(
          discussion.comments.nodes
            .map((node) => node.author?.login)
            .filter((login): login is string => Boolean(login)),
        ),
      )

      return [{
        slug: post.slug,
        title: post.title,
        totalComments: discussion.comments.totalCount,
        commenters,
        discussionUrl: discussion.url,
      }]
    })

    return {
      configured: true,
      items,
    }
  } catch (error) {
    return {
      configured: false,
      reason: error instanceof Error ? error.message : 'GitHub yorum verisi alınamadı.',
      items: [],
    }
  }
}
