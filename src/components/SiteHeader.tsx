"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ListenButton } from "@/components/player";
import { SearchModal } from "@/components/SearchModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav, site, socials } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenu(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-500 ${
          scrolled || menu
            ? "border-b border-bone/12 bg-ink/92 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link href="/" className="group flex items-center gap-3" aria-label="Accueil">
            <span className="relative flex h-7 w-7 items-center justify-center bg-gold text-ink">
              <span className="display-xl text-sm">C&D</span>
            </span>
            <span className="display-xl text-[15px] leading-none tracking-tight sm:text-lg">
              CONEX <span className="text-gold">&</span> DON
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Navigation principale">
            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname === item.href ? "true" : "false"}
                className={`link-underline text-[10px] font-medium uppercase tracking-[0.24em] transition-colors ${
                  pathname === item.href ? "text-gold" : "text-bone/65 hover:text-bone"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ListenButton className="hidden sm:flex" />
            <ThemeToggle />
            <SearchModal />
            <button
              type="button"
              onClick={() => setMenu((value) => !value)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] border border-bone/25 xl:hidden"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menu}
            >
              <span
                className={`block h-[1.5px] w-4 bg-bone transition-transform duration-300 ${
                  menu ? "translate-y-[3.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-4 bg-bone transition-transform duration-300 ${
                  menu ? "-translate-y-[3.25px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        className={`fixed inset-0 z-[59] flex flex-col bg-ink transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${
          menu ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ clipPath: menu ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        aria-hidden={!menu}
      >
        <div className="weave absolute inset-0 opacity-70" aria-hidden="true" />
        <nav className="relative mt-24 flex flex-1 flex-col justify-center px-5 sm:px-8">
          {nav.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline justify-between border-b border-bone/10 py-4"
              style={{
                transitionDelay: `${index * 40}ms`,
              }}
            >
              <span
                className="display-xl text-4xl transition-transform duration-500 group-hover:translate-x-2 group-hover:text-gold sm:text-5xl"
                style={{
                  transform: menu ? "none" : "translateY(18px)",
                  opacity: menu ? 1 : 0,
                  transition: "transform .7s cubic-bezier(.16,1,.3,1), opacity .7s",
                }}
              >
                {item.label}
              </span>
              <span className="text-[10px] tabular-nums text-bone/35">
                0{index + 1}
              </span>
            </Link>
          ))}
        </nav>
        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-bone/10 px-5 py-5 sm:px-8">
          {socials.slice(0, 6).map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-bone/55 hover:text-gold"
            >
              {social.label}
            </a>
          ))}
          <a
            href={`mailto:${site.contact.bookingEmail}`}
            className="ml-auto text-[10px] uppercase tracking-[0.2em] text-gold"
          >
            Booking
          </a>
        </div>
      </div>
    </>
  );
}