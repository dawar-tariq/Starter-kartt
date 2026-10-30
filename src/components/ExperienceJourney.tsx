import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Pause, Play, ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';
import type { JourneyState } from './scene3d/journey';
import Arrow from './ui/Arrow';
import { chapters } from '../data/journey';
import SceneBoundary from './ui/SceneBoundary';
gsap.registerPlugin(ScrollTrigger);
const Scene = lazy(() => import('./scene3d/CommerceScene'));
function ChapterTitle({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) =>
        index === lines.length - 1 ? (
          <em key={line}>{line}</em>
        ) : (
          <span key={line} className="journey-title-line">
            {line}
          </span>
        ),
      )}
    </>
  );
}
export default function ExperienceJourney() {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const state = useRef<JourneyState>({
    progress: 0,
    paused: false,
    reduced: false,
  });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const staticMode = reduced || failed;
  state.current.paused = paused;
  state.current.reduced = reduced;
  useEffect(() => {
    const timer = setTimeout(() => setEnabled(true), 180);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (staticMode || !host.current || !stage.current) return;
    const panels = Array.from(
      stage.current.querySelectorAll<HTMLElement>('.journey-panel'),
    );
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: host.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            state.current.progress = self.progress;
            state.current.invalidate?.();
            const next = Math.min(4, Math.floor(self.progress * 4 + 0.5));
            setActive((current) => (current === next ? current : next));
            stage.current?.style.setProperty(
              '--journey-progress',
              String(self.progress),
            );
            if (stage.current)
              stage.current.dataset.progress = self.progress.toFixed(3);
          },
        },
      });
      // Every chapter occupies a readable hold, followed by a short reversible transition.
      panels.forEach((panel, index) => {
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 22,
        });
        if (index > 0)
          timeline.to(
            panel,
            { autoAlpha: 1, y: 0, duration: 0.09, ease: 'power2.out' },
            index / 4 - 0.12,
          );
        if (index < 4)
          timeline.to(
            panel,
            { autoAlpha: 0, y: -18, duration: 0.065, ease: 'power1.in' },
            index / 4 + 0.09,
          );
      });
      timeline.to({}, { duration: 0.04 }, 0.96);
    }, host);
    return () => ctx.revert();
  }, [staticMode]);
  function goToChapter(index: number) {
    if (!host.current) return;
    const top = host.current.getBoundingClientRect().top + window.scrollY;
    const distance = host.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (distance * index) / 4,
      behavior: staticMode ? 'instant' : 'smooth',
    });
  }
  return (
    <section
      ref={host}
      id="home"
      className={`experience-journey ${staticMode ? 'static-journey' : ''} ${ready && !failed ? 'world-ready' : ''}`}
      aria-label="The Starterkart experience"
    >
      <div
        ref={stage}
        className="journey-stage"
        data-chapter={active}
        data-progress="0"
      >
        <div className="journey-atmosphere" />
        <div className="journey-topline">
          <span>
            <i /> THE STARTERKART DIMENSION
          </span>
          <a href="#intro">
            Skip the experience <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="journey-body">
          <div className="journey-scene scene-wrap" aria-hidden="true">
            <img
              className="journey-fallback bag-fallback"
              src="/images/bag.svg"
              alt=""
            />
            {enabled && !failed && (
              <SceneBoundary
                onFailure={() => {
                  setFailed(true);
                  setReady(false);
                }}
              >
                <Suspense fallback={null}>
                  <Scene
                    state={state}
                    onReady={() => setReady(true)}
                    onFailure={() => {
                      setFailed(true);
                      setReady(false);
                    }}
                  />
                </Suspense>
              </SceneBoundary>
            )}
          </div>
          <div className="journey-panels">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.label}
                className={`journey-panel ${index === 0 ? 'journey-opening' : ''}`}
                aria-hidden={!staticMode && active !== index}
                inert={!staticMode && active !== index}
              >
                <p className="journey-eyebrow">
                  <span />
                  {chapter.eyebrow}
                </p>
                {index === 0 ? (
                  <h1 id="hero-heading">
                    <ChapterTitle lines={chapter.title} />
                  </h1>
                ) : (
                  <h2>
                    <ChapterTitle lines={chapter.title} />
                  </h2>
                )}
                <p className="journey-copy">{chapter.copy}</p>
                {index === 0 ? (
                  <div className="hero-actions">
                    <a className="button button-pink" href="#contact">
                      Build your store <Arrow />
                    </a>
                    <a className="text-link" href="#work">
                      Explore our work <span aria-hidden="true">↘</span>
                    </a>
                  </div>
                ) : index === 4 ? (
                  <a
                    className="button button-pink journey-work-cta"
                    href="#work"
                  >
                    Discover what’s possible <Arrow />
                  </a>
                ) : (
                  <p className="journey-detail">{chapter.detail}</p>
                )}
              </article>
            ))}
          </div>
        </div>
        <div className="world-annotation" aria-hidden="true">
          <span className="annotation-cross">+</span>
          <span>
            {
              [
                'OBJECT 001 / THE SHOPPING SCULPTURE',
                'STUDY 002 / A WORLD OF YOUR OWN',
                'FORM 003 / THE DIGITAL FLAGSHIP',
                'SYSTEM 004 / CONNECTED COMMERCE',
                'CHAPTER 005 / OPEN TO POSSIBILITY',
              ][active]
            }
            <small>ORIGINAL EXPLORATION · STARTERKART</small>
          </span>
        </div>
        <div className="journey-side-index" aria-hidden="true">
          <span>0{active + 1}</span>
          <i />
          <span>05</span>
        </div>
        <div className="journey-bottom">
          <a
            className="journey-scroll"
            href={staticMode || active === 4 ? '#intro' : '#journey-chapters'}
            onClick={(event) => {
              if (!staticMode && active < 4) {
                event.preventDefault();
                goToChapter(Math.min(4, active + 1));
              }
            }}
          >
            <ArrowDown size={15} />
            <span>
              {active === 4
                ? 'THE NEXT CHAPTER IS YOURS'
                : 'SCROLL TO CHANGE PERSPECTIVE'}
            </span>
          </a>
          <nav
            id="journey-chapters"
            className="chapter-nav"
            aria-label="Experience chapters"
          >
            {chapters.map((chapter, index) => (
              <button
                key={chapter.label}
                type="button"
                onClick={() => goToChapter(index)}
                aria-current={active === index ? 'step' : undefined}
                aria-label={`0${index + 1} ${chapter.label}`}
              >
                <span className="chapter-index">0{index + 1}</span>{' '}
                <span className="chapter-label">{chapter.label}</span>
                <i />
              </button>
            ))}
          </nav>
          <button
            className="motion-toggle"
            onClick={() => setPaused(!paused)}
            aria-label={
              paused ? 'Resume ambient animation' : 'Pause ambient animation'
            }
            aria-pressed={paused}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
            <span>{paused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>
        <div className="journey-progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
