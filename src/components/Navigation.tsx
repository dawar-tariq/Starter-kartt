import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigation } from '../data/site';
import Arrow from './ui/Arrow';
export function Wordmark() {
  return (
    <a href="#home" className="wordmark" aria-label="Starterkart home">
      starterkart
      <span className="brand-star" aria-hidden="true">
        ✳
      </span>
    </a>
  );
}
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = Array.from(
          panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
        );
        const items: HTMLElement[] = [toggle.current!, ...links];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index === 0) {
          event.preventDefault();
          items.at(-1)?.focus();
        }
        if (!event.shiftKey && index === items.length - 1) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <header
      className={`navigation ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}
    >
      <Wordmark />
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>
      <a href="#contact" className="nav-cta">
        Start a project <Arrow />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <div ref={panel} id="mobile-navigation" className="mobile-nav">
          <nav aria-label="Mobile navigation">
            {navigation.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
              >
                <small>0{i + 1}</small>
                {item}
                <Arrow />
              </a>
            ))}
          </nav>
          <p>Independent thinking. Exceptional storefronts.</p>
        </div>
      )}
    </header>
  );
}
