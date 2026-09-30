import { useCallback, useRef, useState } from 'react'

export function useLog(max = 5) {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([])
  const id = useRef(0)
  const push = useCallback((text: string) => {
    const ts = new Date().toLocaleTimeString('en-GB')
    setLines(l => [...l, { id: id.current++, text: `${ts} ${text}` }].slice(-max))
  }, [max])
  return [lines, push] as const
}
