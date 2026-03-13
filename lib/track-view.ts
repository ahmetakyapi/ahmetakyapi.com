export async function trackView(pathname: string) {
  if (typeof window === 'undefined') {
    return
  }

  const key = `aa:viewed:${pathname}`
  if (window.sessionStorage.getItem(key)) {
    return
  }

  window.sessionStorage.setItem(key, '1')

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pathname }),
      keepalive: true,
    })
  } catch {
    // Analytics should never block rendering.
  }
}
