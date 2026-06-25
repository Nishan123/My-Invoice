import { Link } from "react-router-dom";
import {
  Zap,
  LayoutTemplate,
  ShieldCheck,
  BarChart3,
  Clock,
  Globe,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Automation",
    description: "Automate recurring invoices, reminders, and late-fee nudges so you get paid on time.",
    accent: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful Templates",
    description: "Polished, brandable templates that make every invoice look professional.",
    accent: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description: "Your financial data is encrypted in transit and at rest, with audited access controls.",
    accent: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track revenue, outstanding balances, and cash flow with a live dashboard.",
    accent: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: Clock,
    title: "Get Paid Faster",
    description: "One-click payment links and status tracking shorten your collection cycle.",
    accent: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Bill clients anywhere with automatic currency and tax handling.",
    accent: "bg-sky-500/10 text-sky-400",
  },
];

const stats = [
  { value: "10k+", label: "Businesses" },
  { value: "2M+", label: "Invoices sent" },
  { value: "$500M+", label: "Processed" },
  { value: "99.9%", label: "Uptime" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-white">
            <span className="text-blue-500">My</span>-Invoice
          </h1>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-24 -right-16 w-[26rem] h-[26rem] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
           
            <h2 className="font-display text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
              Modern invoicing for the{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                digital age
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-400 max-w-xl">
              Transform your billing with intelligent invoicing — create, send, and track
              invoices in seconds. Built for modern businesses, designed for efficiency.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
              >
                Get started free
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/15 text-white font-semibold hover:bg-white/5 transition-colors"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              Trusted by 10,000+ businesses
            </div>
          </div>

          {/* Product preview mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-2xl rounded-[2rem]" />
            <div className="relative rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-xl p-5">
              <div className="flex items-center gap-1.5 mb-5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { l: "Revenue", v: "$48.2k", c: "text-blue-400" },
                  { l: "Paid", v: "312", c: "text-emerald-400" },
                  { l: "Pending", v: "27", c: "text-amber-400" },
                ].map((t) => (
                  <div key={t.l} className="rounded-xl border border-white/10 bg-black/30 p-3">
                    <p className="text-xs text-gray-500">{t.l}</p>
                    <p className={`text-lg font-bold ${t.c}`}>{t.v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Revenue</span>
                  <span className="text-xs text-emerald-400">▲ 12.4%</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-blue-600/40 to-blue-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { n: "Acme Co.", a: "$226.00", s: "Paid", sc: "bg-emerald-500/15 text-emerald-400" },
                  { n: "Globex Inc.", a: "$90.40", s: "Pending", sc: "bg-amber-500/15 text-amber-400" },
                ].map((r) => (
                  <div
                    key={r.n}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500/15 flex items-center justify-center text-xs font-semibold text-blue-300">
                      {r.n[0]}
                    </div>
                    <span className="text-sm text-gray-200 flex-1 truncate">{r.n}</span>
                    <span className="text-sm font-semibold text-white">{r.a}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.sc}`}>{r.s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-xl border border-white/10 bg-gray-900/90 backdrop-blur px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Check className="text-emerald-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Invoice paid</p>
                <p className="text-sm font-semibold text-white">+$226.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="font-display text-4xl font-bold text-white">
            Everything you need to manage invoices
          </h3>
          <p className="mt-4 text-gray-400 text-lg">
            Powerful features wrapped in a clean, intuitive interface.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-gray-900/50 p-7 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:bg-gray-900"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${f.accent}`}>
                  <Icon size={22} />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="relative">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
              Ready to transform your invoicing?
            </h3>
            <p className="mt-4 text-blue-100 text-lg max-w-xl mx-auto">
              Join thousands of businesses that trust My-Invoice. Free to start, no credit
              card required.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
            >
              Get started free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
              <h2 className="text-2xl font-display font-bold text-white">
                <span className="text-blue-500">My</span>-Invoice
              </h2>
              <p className="mt-4 text-gray-400">
                Simplifying invoicing for modern businesses. Get started today and
                experience the difference.
              </p>
              <div className="flex gap-4 mt-6">
                {[
                  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                ].map((d, i) => (
                  <a
                    key={i}
                    href="#"
                    className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              {[
                { h: "Product", links: ["Features", "Pricing", "API"] },
                { h: "Company", links: ["About", "Blog", "Careers"] },
                { h: "Support", links: ["Help Center", "Contact", "Privacy"] },
              ].map((col) => (
                <div key={col.h}>
                  <h3 className="font-semibold text-white mb-4">{col.h}</h3>
                  <ul className="space-y-3">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} My-Invoice. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Terms", "Privacy", "Cookies"].map((l) => (
                <a key={l} href="#" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
