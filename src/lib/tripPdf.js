import jsPDF from 'jspdf'

export function generateTripPDF({ description, budget, travelers, picks, itineraryText }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const marginX = 48
  let y = 56
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - marginX * 2

  const addWrapped = (text, fontSize = 11, lineHeight = 16, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach(line => {
      if (y > 780) { doc.addPage(); y = 56 }
      doc.text(line, marginX, y)
      y += lineHeight
    })
    y += 4
  }

  addWrapped('VanaVas — Your AI-Planned Trip', 18, 24, true)
  addWrapped(`"${description}"`, 11, 16)
  if (budget || travelers) {
    addWrapped(
      [budget && `Budget: up to ₹${budget}/night`, travelers && `Travelers: ${travelers}`]
        .filter(Boolean).join('   •   '),
      10, 14
    )
  }

  addWrapped('Top Matches', 14, 20, true)
  picks.forEach((p, i) => {
    addWrapped(`${i + 1}. ${p.title} — ${p.location} — ₹${p.price}/night`, 11, 15, true)
    if (p.reason) addWrapped(p.reason, 10, 14)
  })

  addWrapped('Itinerary', 14, 20, true)
  addWrapped(itineraryText, 11, 15)
  doc.save('vanavas-trip-plan.pdf')
}
