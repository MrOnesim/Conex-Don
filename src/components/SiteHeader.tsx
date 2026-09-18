"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { motionEase } from "@/components/motion";
import { ListenButton } from "@/components/player";
import { SearchModal } from "@/components/SearchModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav, site, socials } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion() ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuOpenRef = useRef(menu);
  const closeMenu = useCallback(() => setMenu(false), []);

  useFocusTrap({ active: menu, containerRef: menuRef, onEscape: closeMenu });

  useEffect(() => {
    menuOpenRef.current = menu;
  }, [menu]);

  useEffect(() => {
    if (!menuOpenRef.current) return;
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, closeMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menu]);

  return (
    <>
      <header
        className="site-header fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8"
        data-scrolled={scrolled ? "true" : "false"}
        data-menu-open={menu ? "true" : "false"}
      >
        <div className="site-header__inner px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5">
          <Link
            href="/"
            className="site-logo group flex items-center gap-2.5"
            aria-label="Conex & Don — accueil"
          >
            <span className="site-logo-mark h-7 w-7 text-[0.58rem] sm:h-8 sm:w-8 sm:text-[0.64rem]">
              C&amp;D
            </span>
            <span className="display-xl text-[0.98rem] leading-none tracking-tight sm:text-lg">
              CONEX <span className="text-gold">&amp;</span> DON
            </span>
          </Link>

          <nav
            className="hidden items-center gap-5 xl:flex"
            aria-label="Navigation principale"
          >
            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={
                  isActivePath(pathname, item.href) ? "true" : "false"
                }
                className="site-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden lg:flex">
              <ListenButton />
            </span>
            <ThemeToggle />
            <SearchModal onOpen={closeMenu} />
            <button
              type="button"
              onClick={() => setMenu((open) => !open)}
              className="icon-control xl:hidden"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menu}
              aria-controls="main-mobile-menu"
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span
                  className={`absolute left-0 top-[5px] h-px w-4 bg-current transition-transform duration-200 ${
                    menu ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[11px] h-px w-4 bg-current transition-transform duration-200 ${
                    menu ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu ? (
          <motion.div
            key="mobile-navigation"
            id="main-mobile-menu"
            ref={menuRef}
            className="fixed inset-0 z-[59] flex flex-col overflow-y-auto bg-ink px-5 pb-5 pt-24 sm:px-8 sm:pt-28 xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation principale"
            tabIndex={-1}
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: motionEase }
            }
          >
            <div
              className="weave pointer-events-none absolute inset-0 opacity-45"
              aria-hidden="true"
            />
            <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
              <p className="eyebrow mb-5 text-gold">Explorer l&apos;univers</p>
              <nav aria-label="Navigation mobile">
                <ol className="border-t border-bone/12">
                  {nav.map((item, index) => {
                    const active = isActivePath(pathname, item.href);
                    return (
                      <motion.li
                        key={item.href}
                        initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.32,
                                delay: 0.045 * index,
                                ease: motionEase,
                              }
                        }
                        className="border-b border-bone/12"
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="group flex items-center justify-between py-4 sm:py-5"
                          aria-current={active ? "page" : undefined}
                        >
                          <span
                            className={`display-xl text-4xl transition-colors duration-200 group-hover:text-gold sm:text-5xl ${
                              active ? "text-gold" : "text-bone"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="flex items-center gap-3 text-[0.62rem] font-semibold tabular-nums tracking-[0.18em] text-bone/40">
                            {String(index + 1).padStart(2, "0")}
                            <span className="text-gold transition-transform duration-200 group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ol>
              </nav>
            </div>
            <div className="relative mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-3 border-t border-bone/12 pt-5">
              {socials.slice(0, 5).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.63rem] font-semibold uppercase tracking-[0.15em] text-bone/55 transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              ))}
              <a
                href={`mailto:${site.contact.bookingEmail}`}
                className="ml-auto text-[0.63rem] font-semibold uppercase tracking-[0.15em] text-gold"
              >
                Booking ↗
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
