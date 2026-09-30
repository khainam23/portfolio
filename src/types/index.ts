export interface Stat { value: string; label: string }
export interface Experience {
  title: string; company: string; period: string; current?: boolean
  summary: string; highlights: string[]; tags: string[]
}
export interface Project {
  name: string; description: string; highlights: string[]; tags: string[]; url?: string
  role?: string; status?: string; featured?: boolean
}
export interface Publication { title: string; venue: string; rank: string; year: string; doi?: string }
export interface SkillGroup { group: string; items: string[] }
export interface Profile {
  name: string; role: string; tagline: string; summary: string; focus: string[]
  status: string; location: string
  contact: { email: string; phone: string; github: string }
  cv: string; stats: Stat[]; experience: Experience[]; projects: Project[]
  publications: Publication[]
  education: { degree: string; school: string; gpa: string }
  skills: SkillGroup[]
}
