export default function Cancellations() {
  return (
    <div className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white min-h-screen">
      <div className="section-pad max-w-3xl">
        <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">Support</p>
        <h1 className="display-font text-4xl font-bold text-[#1c1c1c] dark:text-white mb-6">
          Cancellations
        </h1>
        <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 space-y-4 text-sm text-[#555] dark:text-white/70 leading-relaxed">
          <p>
            We understand travel plans can change. Once booking is live on VanaVas, our cancellation policy will work as follows:
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Free cancellation:</strong> Cancel up to 48 hours before check-in for a full refund.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Late cancellation:</strong> Cancellations within 48 hours of check-in may be subject to a partial charge, set individually by the host.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Host cancellations:</strong> If a host cancels a confirmed booking, travelers receive a full refund and support in finding an alternative stay.
          </p>
          <p className="text-xs text-[#999] dark:text-white/40 pt-2">
            This page is a placeholder while VanaVas is in active development. The final policy will be published before booking goes live.
          </p>
        </div>
      </div>
    </div>
  )
}
