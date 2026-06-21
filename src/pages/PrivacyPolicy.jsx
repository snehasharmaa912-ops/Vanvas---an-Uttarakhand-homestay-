export default function PrivacyPolicy() {
  return (
    <div className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white min-h-screen">
      <div className="section-pad max-w-3xl">
        <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-2">Support</p>
        <h1 className="display-font text-4xl font-bold text-[#1c1c1c] dark:text-white mb-6">
          Privacy policy
        </h1>
        <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 space-y-4 text-sm text-[#555] dark:text-white/70 leading-relaxed">
          <p>
            VanaVas respects your privacy. This is a placeholder policy while the platform is in active development;
            a complete privacy policy will be published before account creation and payments go live.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Data we plan to collect:</strong> name, email, and booking details, used only to facilitate stays between travelers and hosts.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Data we will not do:</strong> sell your personal information to third parties or use it for unrelated advertising.
          </p>
          <p>
            <strong className="text-[#1c1c1c] dark:text-white">Contact:</strong> for any privacy questions, reach out via the Contact us section on the About page.
          </p>
        </div>
      </div>
    </div>
  )
}
