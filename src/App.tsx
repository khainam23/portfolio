import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import { useProfile } from './hooks/useProfile'
import { useReveal } from './hooks/useReveal'
import About from './sections/About'
import Contact from './sections/Contact'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

export default function App() {
  const p = useProfile()
  useReveal(p)

  if (!p) return <div className="grid min-h-screen place-items-center font-mono text-sm text-faint">loading profile…</div>

  return (
    <>
      <div id="scroll-progress" />
      <Navbar cv={p.cv} />
      <main>
        <Hero p={p} />
        <About p={p} />
        <Experience items={p.experience} />
        <Projects items={p.projects} />
        <Skills groups={p.skills} />
        <Contact p={p} />
      </main>
      <Footer name={p.name} github={p.contact.github} />
    </>
  )
}
