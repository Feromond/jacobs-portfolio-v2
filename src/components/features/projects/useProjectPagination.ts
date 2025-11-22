import { useState, useEffect, useMemo } from 'react'

interface PaginationItem {
  title: string
  [key: string]: any
}

interface UseProjectPaginationArgs {
  items: PaginationItem[]
  itemsPerPage: number
  breakpoint: string
}

interface UseProjectPaginationReturn {
  visibleItems: PaginationItem[]
  currentPage: number
  totalPages: number
  isPaginated: boolean
  goToNextPage: () => void
  goToPrevPage: () => void
  goToPage: (pageIndex: number) => void
}

export const useProjectPagination = ({
  items,
  itemsPerPage,
  breakpoint,
}: UseProjectPaginationArgs): UseProjectPaginationReturn => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaginated, setIsPaginated] = useState(
    window.matchMedia(breakpoint).matches
  )

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoint)
    const handleResize = () => {
      const shouldPaginate = mediaQuery.matches
      if (!shouldPaginate && isPaginated) {
        setCurrentPage(0)
      }
      setIsPaginated(shouldPaginate)
    }

    mediaQuery.addEventListener('change', handleResize)
    handleResize()

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [breakpoint, isPaginated])

  const visibleItems = useMemo(() => {
    if (!isPaginated) {
      return items
    }
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [currentPage, isPaginated, items, itemsPerPage])

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : prev))
  }

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex)
    }
  }

  return {
    visibleItems,
    currentPage,
    totalPages,
    isPaginated,
    goToNextPage,
    goToPrevPage,
    goToPage,
  }
}
