export default function BookingPolicy() {
  return (
    <div className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white min-h-screen">
      <div className="section-pad max-w-3xl">
        <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">Support</p>
        <h1 className="display-font text-4xl font-bold text-[#1c1c1c] dark:text-white mb-6">
          Booking policy
        </h1>
        <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 space-y-4 text-sm text-[#555] dark:text-white/70 leading-relaxed">
          <p>
            VanaVas connects travelers directly with rural homestay hosts across Uttarakhand. Once full booking
            functionality launches, the following policy will apply:
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Confirmation:</strong> Bookings are confirmed only after the host accepts your request. You will receive a confirmation through the platform.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Payment:</strong> Payments are made directly to the host, with no commission deducted for the first three months of the platform's launch.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Check-in and check-out:</strong> Timings are set individually by each host and shown on their listing page.
          </p>
          <p className="text-xs text-[#999] dark:text-white/40 pt-2">
            This page is a placeholder while VanaVas is in active development. The final policy will be published before booking goes live.
          </p>
        </div>
      </div>
    </div>
  )
}
