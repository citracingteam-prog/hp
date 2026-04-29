import { CONTACT_INFO, NAV_ITEMS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-racing-black px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image.png"
              alt="CIT-Racing Team"
              className="h-14 w-auto invert contrast-[2]"
            />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-racing-gray">
              日本大学生産工学部 学生フォーミュラチーム。2002年結成。
              2026年大会に向けて、応援してくださる方を募集しています。
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-xs tracking-[0.2em] text-racing-white/70 hover:text-racing-red transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-display text-xs tracking-[0.25em] text-racing-gray">
              FOLLOW US
            </span>
            <div className="flex items-center gap-4">
              <a
                href={CONTACT_INFO.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-racing-white/70 transition-colors hover:text-racing-red"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M18.244 2H21l-6.53 7.46L22 22h-6.828l-4.77-6.237L4.8 22H2l7.03-8.03L2 2h6.914l4.318 5.71L18.244 2Zm-1.2 18.2h1.662L7.05 3.7H5.27l11.774 16.5Z" />
                </svg>
              </a>
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-racing-white/70 transition-colors hover:text-racing-red"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${CONTACT_INFO.email}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="text-racing-white/70 transition-colors hover:text-racing-red"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-racing-gray md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} CIT-Racing Team. All rights reserved.</span>
          <span className="font-display tracking-[0.25em]">PUSH THE LIMIT.</span>
        </div>
      </div>
    </footer>
  );
}
