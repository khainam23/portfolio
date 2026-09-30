import { useEffect, useState } from 'react'
import type { Profile } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  useEffect(() => {
    fetch('/profile.json').then(r => r.json()).then(setProfile).catch(() => {})
  }, [])
  return profile
}
