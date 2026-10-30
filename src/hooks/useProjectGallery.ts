import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function useProjectGallery(
  host: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!host.current) return;
    const media = gsap.matchMedia();
    media.add(
      '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
      () => {
        const track =
          host.current!.querySelector<HTMLElement>('.project-grid')!;
        const cards = track.querySelectorAll<HTMLElement>('.project');
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: host.current,
            start: 'top 110px',
            end: 'bottom bottom',
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });
        timeline.to(
          track,
          {
            x: () => -(track.scrollWidth - host.current!.clientWidth),
            ease: 'none',
            duration: 1,
          },
          0,
        );
        cards.forEach((card, i) => {
          timeline.fromTo(
            card,
            { rotateY: i === 0 ? 0 : -11, y: i === 0 ? 0 : 50 },
            {
              rotateY: i === 0 ? 9 : 0,
              y: i === 0 ? -20 : 0,
              duration: 1,
              ease: 'none',
            },
            0,
          );
        });
        const handleFocus = (event: FocusEvent) => {
          const target = event.target as HTMLElement;
          if (!target.matches('.project-visual:focus-visible')) return;
          const card = target.closest('.project');
          const index = Array.from(cards).indexOf(card as HTMLElement);
          if (index < 0) return;
          const top =
            host.current!.getBoundingClientRect().top + window.scrollY - 110;
          const distance =
            host.current!.offsetHeight - window.innerHeight + 110;
          window.scrollTo({ top: top + distance * index, behavior: 'smooth' });
        };
        host.current!.addEventListener('focusin', handleFocus);
        return () => host.current?.removeEventListener('focusin', handleFocus);
      },
      host.current,
    );
    return () => media.revert();
  }, [host]);
}
