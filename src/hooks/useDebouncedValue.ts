import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(setDebouncedValue, delay, value)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}
