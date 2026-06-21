const FAQ_ITEMS = [
  { q: 'How do I book a homestay?', a: 'Browse listings on the Explore page, click on a stay to see details, and use the Book Now button. Full booking and payment will be available once our backend launches in the coming weeks.' },
  { q: 'Are the homestays verified?', a: 'Yes. Every host on VanaVas goes through a verification call before their listing goes live, to confirm the property and host are genuine.' },
  { q: 'What does "Eco-certified" mean?', a: 'Eco-certified stays are rated on sustainability factors like waste management, energy use, and local sourcing of food and materials.' },
  { q: 'Do hosts pay any commission?', a: 'No. VanaVas charges zero commission for the first three months to help rural hosts get started without losing income to middlemen.' },
  { q: 'Can I list my own homestay?', a: 'Yes! Click List your stay in the navbar or footer to start the host signup process.' },
]

export default function FAQs() {
  return (
    <div className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white min-h-screen">
      <div className="section-pad max-w-3xl">
        <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">Support</p>
        <h1 className="display-font text-4xl font-bold text-[#1c1c1c] dark:text-white mb-8">
          Frequently asked questions
        </h1>

        <div className="space-y-4">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-5">
              <h3 className="font-semibold text-[#1c1c1c] dark:text-white text-sm mb-2">{q}</h3>
              <p className="text-sm text-[#666] dark:text-white/70 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
