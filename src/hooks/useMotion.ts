import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function useMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-content > *', {
        y: 25,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
      });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) =>
        gsap.from(element, {
          y: 35,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          clearProps: 'transform',
        }),
      );
      gsap.to('.large-asterisk', {
        rotation: 135,
        ease: 'none',
        scrollTrigger: {
          trigger: '.intro',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      gsap.utils
        .toArray<HTMLElement>('.about-art .arch')
        .forEach((arch, index) =>
          gsap.fromTo(
            arch,
            { y: 70 + index * 35, rotation: -8 },
            {
              y: -index * 10,
              rotation: -23,
              ease: 'none',
              scrollTrigger: {
                trigger: '.about-art',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            },
          ),
        );
      const steps = gsap.utils.toArray<HTMLElement>('.process-step');
      ScrollTrigger.create({
        trigger: '.process',
        start: 'top 55%',
        end: 'bottom 40%',
        onUpdate: (self) => {
          const current = Math.min(3, Math.floor(self.progress * 4));
          steps.forEach((step, index) =>
            step.classList.toggle('active', index === current),
          );
        },
      });
    });
    return () => media.revert();
  }, []);
}
