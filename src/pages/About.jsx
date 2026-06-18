import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TEAM = [
  { 
    name: 'Sneha Sharma', 
    role: 'Developer · Designer · Builder', 
    initials: 'SS', 
    color: 'bg-[#e8f5ee] text-[#2d7a4f]',
    instagram: 'https://www.instagram.com/_snehasharma_._?igsh=bGF6eGoxcGUxMmV',
    linkedin: 'https://www.linkedin.com/in/snehasharmaa2006'
  },
]
const STEPS = [
  { number: '01', title: 'Search & discover', desc: 'Browse verified rural homestays by district, budget, and eco-rating.' },
  { number: '02', title: 'Connect directly', desc: 'Message the host directly — no agents, no commission, no middlemen.' },
  { number: '03', title: 'Book & stay', desc: 'Confirm your stay and experience genuine Uttarakhand hospitality.' },
  { number: '04', title: 'Share feedback', desc: 'Rate your experience to help other travelers and support the host.' },
]
export default function About() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      }
    }
  }, [hash])
  return (
    <div className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white min-h-screen">
      <div className="section-pad max-w-4xl">

        {/* Hero */}
        <div id="about" className="mb-14">
          <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">About VanaVas</p>
          <h1 className="display-font text-4xl font-bold text-[#1c1c1c] dark:text-white mb-5 leading-tight">
            Built for the hills.<br />Built for the people in them.
          </h1>
          <p className="text-[#555] text-lg leading-relaxed max-w-2xl">
            VanaVas started with a simple observation — Uttarakhand has hundreds of incredible rural homestays
            that travelers never find because the hosts have no digital presence. We're changing that.
            This platform gives rural families a direct channel to eco-conscious travelers, cutting out
            middlemen and keeping earnings local.
          </p>
        </div>

        {/* Problem + Solution */}
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          <div className="bg-white dark:bg-[#1a4a31] rounded-2xl border border-[#e8dfc8] dark:border-[#2d7a4f]/30 p-6">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-semibold text-[#1c1c1c] text-lg mb-2">The problem</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              Rural homestay owners in Uttarakhand rely on word-of-mouth or pay 30–40% commissions to
              travel agents. Most have no smartphone presence. Travelers miss authentic experiences
              and end up in overpriced hotels.
            </p>
          </div>
          <div className="bg-[#e8f5ee] rounded-2xl border border-[#2d7a4f]/20 p-6">
            <div className="text-2xl mb-3">✨</div>
            <h3 className="font-semibold text-[#1c1c1c] text-lg mb-2">My solution</h3>
            <p className="text-sm text-[#444] leading-relaxed">
              A simple, bilingual (Hindi + English) platform where hosts list their stay in minutes
              with AI-assisted description writing — and travelers find, compare, and book directly.
              Zero commission for the first three months.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mb-14 pt-4">
          <h2 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-6">How it works</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {STEPS.map(({ number, title, desc }) => (
              <div key={number} className="flex gap-4 bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-5">
                <span className="text-2xl font-bold text-[#2d7a4f]/30 display-font">{number}</span>
                <div>
                  <h3 className="font-semibold text-[#1c1c1c] dark:text-white text-sm mb-1">{title}</h3>
                  <p className="text-xs text-[#777] dark:text-white/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact us */}
        <div id="contact" className="mb-14 pt-4">
          <h2 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-6">Contact us</h2>
          <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 justify-between">
            <div>
              <p className="text-sm text-[#666] dark:text-white/70 leading-relaxed mb-3">
                Have a question, partnership idea, or want to list your homestay? Reach out — I'd love to hear from you.
              </p>
              <p className="text-sm text-[#1c1c1c] dark:text-white font-medium">📧 sharmasnehaa08@gmail.com</p>
              <p className="text-sm text-[#1c1c1c] dark:text-white font-medium">📍 Dehradun, Uttarakhand</p>
            </div>
          
              href="mailto:sharmasnehaa08@gmail.com"
              className="btn-primary self-start sm:self-center whitespace-nowrap"
            >
              Email us →
            </a>
          </div>
        </div>
        {/* Team */}
        <div>
          <h2 className="display-font text-2xl font-bold text-[#1c1c1c] dark:text-white mb-6">Built by</h2>
          <div className="flex flex-wrap gap-4">
            {TEAM.map(({ name, role, initials, color, instagram, linkedin }) => (
              <div key={name} className="flex items-center gap-3 bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl px-5 py-4">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1c1c1c] text-sm">{name}</p>
                  <p className="text-xs text-[#888]">{role}</p>
                  {instagram && linkedin && (
                    <div className="flex gap-3 mt-1.5">
                      <a href={instagram} target="_blank" rel="noreferrer" className="text-xs text-[#a96f2b] hover:underline">Instagram</a>
                      <a href={linkedin} target="_blank" rel="noreferrer" className="text-xs text-[#2d7a4f] hover:underline">LinkedIn</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
