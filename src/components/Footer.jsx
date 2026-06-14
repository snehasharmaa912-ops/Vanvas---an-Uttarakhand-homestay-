import { Link } from 'react-router-dom'
const footerLinks = {
  Explore: [
    { label: 'All Homestays',    to: '/explore' },
    { label: 'Eco Stays',        to: '/explore' },
    { label: 'Farm Stays',       to: '/explore' },
    { label: 'Forest Retreats',  to: '/explore' },
  ],
  Company: [
    { label: 'About VanaVas', to: '/about' },
    { label: 'How it works',  to: '/about' },
    { label: 'For Hosts',     to: '/login'  },
    { label: 'Contact us',    to: '/about'  },
  ],
  Support: [
    { label: 'FAQs',            to: '/' },
    { label: 'Booking policy',  to: '/' },
    { label: 'Cancellations',   to: '/' },
    { label: 'Privacy policy',  to: '/' },
  ],
}

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a4a31] text-white mt-auto">

      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="section-pad py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="display-font text-xl font-bold mb-1">Own a homestay in Uttarakhand?</h3>
            <p className="text-white/60 text-sm">Join 120+ hosts earning directly from travelers. Zero commission for first 3 months.</p>
          </div>
          <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-[#1a4a31] flex-shrink-0">
            List your property →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-pad py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-sm">V</span>
              <span className="font-semibold text-lg">VanaVas</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Connecting travelers with real rural Uttarakhand — one homestay at a time.
            </p>
            <div className="flex gap-3">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-pad py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/40 text-xs">© 2025 VanaVas. Built with ♥ in Dehradun, Uttarakhand.</p>
          <p className="text-white/30 text-xs">TBI-GEU · AI-Assisted Full Stack Internship</p>
        </div>
      </div>
    </footer>
  )
}
