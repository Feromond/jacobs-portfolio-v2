import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

const TTL = 6 * 60 * 60 * 1000

type Stars = Record<string, number>

const readCache = (key: string): Stars | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, stars } = JSON.parse(raw)
    return Date.now() - at < TTL ? stars : null
  } catch {
    return null
  }
}

const writeCache = (key: string, stars: Stars) => {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), stars }))
  } catch {
    // In-memory counts still work.
  }
}

export function useGithubStars(user: string, trigger?: RefObject<Element>) {
  const key = `gh-stars:${user}`
  const [stars, setStars] = useState<Stars>(() => readCache(key) ?? {})

  useEffect(() => {
    if (readCache(key)) return
    const controller = new AbortController()

    type Repo = { name: string; stargazers_count: number; fork: boolean }

    const load = async () => {
      try {
        const repos: Repo[] = []
        for (let page = 1; page <= 10; page++) {
          const res = await fetch(
            `https://api.github.com/users/${user}/repos?per_page=100&type=owner&page=${page}`,
            { signal: controller.signal }
          )
          if (!res.ok) return
          const batch: Repo[] = await res.json()
          repos.push(...batch)
          if (batch.length < 100) break
        }
        const next = Object.fromEntries(
          repos
            .filter((r) => !r.fork)
            .map((r) => [r.name.toLowerCase(), r.stargazers_count])
        )
        writeCache(key, next)
        setStars(next)
      } catch {
        // Star counts are optional.
      }
    }

    const target = trigger?.current
    if (!target) {
      load()
      return () => controller.abort()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        load()
      },
      { rootMargin: '800px 0px' }
    )
    io.observe(target)

    return () => {
      io.disconnect()
      controller.abort()
    }
  }, [key, user, trigger])

  const lookup = useCallback(
    (repo?: string) =>
      repo === undefined ? undefined : stars[repo.toLowerCase()],
    [stars]
  )
  const total = useMemo(() => {
    const values = Object.values(stars)
    return values.length ? values.reduce((a, b) => a + b, 0) : undefined
  }, [stars])

  return { stars: lookup, total }
}
