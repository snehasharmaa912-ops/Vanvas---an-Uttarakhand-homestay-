const TEAM = [
  { name: 'Sneha Sharma ',   role: 'Full Stack Developer', initials: 'SS', color: 'bg-[#e8f5ee] text-[#2d7a4f]' },
  { name: 'TBI GEU',     role: 'Mentors & Incubator',  initials: 'TG', color: 'bg-[#faeeda] text-[#a96f2b]' },
  { name: 'Graphic Era', role: 'University Partner',   initials: 'GE', color: 'bg-[#e6f1fb] text-[#185fa5]' },
]
const MILESTONES = [
  { week: 'Week 1',  label: 'Project setup & planning',        done: true  },
  { week: 'Week 2',  label: 'Frontend skeleton with React',    done: true  },
  { week: 'Week 3',  label: 'UI/UX & component design',        done: false },
  { week: 'Week 4',  label: 'Backend API with Node + Express', done: false },
  { week: 'Week 5',  label: 'Database design with MongoDB',    done: false },
  { week: 'Week 6',  label: 'Authentication & security',       done: false },
  { week: 'Week 7',  label: 'AI API integration',              done: false },
  { week: 'Week 8',  label: 'Frontend integration & polish',   done: false },
  { week: 'Week 9',  label: 'Deployment & go-live',            done: false },
  { week: 'Week 10', label: 'Capstone & portfolio',            done: false },
]

export default function About() {
  return (
    <div className="py-16 bg-[#fdf8f2] min-h-screen">
      <div className="section-pad max-w-4xl">

        {/* Hero */}
        <div className="mb-14">
          <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">About VanaVas</p>
          <h1 className="display-font text-4xl font-bold text-[#1c1c1c] mb-5 leading-tight">
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
          <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6">
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
            <h3 className="font-semibold text-[#1c1c1c] text-lg mb-2">Our solution</h3>
            <p className="text-sm text-[#444] leading-relaxed">
              A simple, bilingual (Hindi + English) platform where hosts list their stay in minutes
              with AI-assisted description writing — and travelers find, compare, and book directly.
              Zero commission for the first three months.
            </p>
          </div>
        </div>

        {/* Build timeline */}
        <div className="mb-14">
          <h2 className="display-font text-2xl font-bold text-[#1c1c1c] mb-6">10-week build roadmap</h2>
          <div className="space-y-3">
            {MILESTONES.map(({ week, label, done }) => (
              <div
                key={week}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors
                  ${done
                    ? 'bg-[#e8f5ee] border-[#2d7a4f]/20'
                    : 'bg-white border-[#e8dfc8]'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                  ${done ? 'bg-[#2d7a4f] text-white' : 'bg-[#f0e8d8] text-[#a96f2b]'}`}>
                  {done ? '✓' : '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#888] mr-2">{week}</span>
                  <span className={`text-sm ${done ? 'text-[#2d7a4f] font-medium' : 'text-[#555]'}`}>{label}</span>
                </div>
                {done && <span className="text-xs bg-[#2d7a4f] text-white px-2 py-0.5 rounded-full flex-shrink-0">Done</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="display-font text-2xl font-bold text-[#1c1c1c] mb-6">Built by</h2>
          <div className="flex flex-wrap gap-4">
            {TEAM.map(({ name, role, initials, color }) => (
              <div key={name} className="flex items-center gap-3 bg-white border border-[#e8dfc8] rounded-2xl px-5 py-4">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1c1c1c] text-sm">{name}</p>
                  <p className="text-xs text-[#888]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
