import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { contact } from '../../data/site';
import useReducedMotion from '../../hooks/useReducedMotion';
import Arrow from '../ui/Arrow';
import SceneBoundary from '../ui/SceneBoundary';
const ClosingScene = lazy(() => import('../scene3d/FinaleScene'));
export default function Finale() {
  const section = useRef<HTMLElement>(null),
    progress = useRef(0);
  const [load, setLoad] = useState(false),
    [visible, setVisible] = useState(false),
    [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoad(true);
      },
      { rootMargin: '180px' },
    );
    if (section.current) observer.observe(section.current);
    const scroll = () => {
      if (section.current) {
        const box = section.current.getBoundingClientRect();
        progress.current = Math.max(
          0,
          Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)),
        );
      }
    };
    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
    };
  }, []);
  return (
    <section
      ref={section}
      className={`finale section-pad ${ready ? 'finale-ready' : ''}`}
    >
      <div className="section-kicker">
        <span>07 / WHAT COMES NEXT</span>
        <span>LET’S MAKE IT YOURS</span>
      </div>
      <div className="finale-content">
        <div className="finale-scene" aria-hidden="true">
          <img
            className="finale-bag"
            src="/images/bag.svg"
            alt=""
            loading="lazy"
            width="700"
            height="800"
          />
          {load && (
            <SceneBoundary onFailure={() => setReady(false)}>
              <Suspense fallback={null}>
                <ClosingScene
                  visible={visible}
                  reduced={reduced}
                  progress={progress}
                  onReady={() => setReady(true)}
                  onFailure={() => setReady(false)}
                />
              </Suspense>
            </SceneBoundary>
          )}
        </div>
        <h2 className="reveal">
          LET’S BUILD
          <br />
          YOUR NEXT
          <br />
          <span>STOREFRONT.</span>
        </h2>
        <p>
          Tell us about your brand, your products,
          <br />
          and what you want to build.
        </p>
        <div className="hero-actions">
          <a className="button button-pink" href="#contact">
            Start your project <Arrow />
          </a>
          <a
            className="text-link"
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
