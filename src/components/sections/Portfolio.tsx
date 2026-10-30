import { useRef } from 'react';
import { X } from 'lucide-react';
import { projects } from '../../data/site';
import Arrow from '../ui/Arrow';
import useProjectGallery from '../../hooks/useProjectGallery';
function Project({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  return (
    <article className={`project project-${project.color}`}>
      <button
        className="project-visual"
        onClick={() => modal.current?.showModal()}
        onPointerMove={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            '--pointer-x',
            `${event.clientX - bounds.left}px`,
          );
          event.currentTarget.style.setProperty(
            '--pointer-y',
            `${event.clientY - bounds.top}px`,
          );
        }}
        aria-label={`Explore the concept: ${project.title} details`}
      >
        <img
          src={project.image}
          alt={`${project.title} original concept storefront featuring ${index === 0 ? 'an olive hoodie and oversized editorial typography' : 'a sculptural neutral coat and understated typography'}`}
          loading="lazy"
          width="1000"
          height={index === 0 ? '740' : '1000'}
        />
        <span className="project-open">
          <Arrow />
        </span>
        <span className="project-overlay">Explore the concept</span>
      </button>
      <div className="project-info">
        <div>
          <h3>{project.title}</h3>
          <p>{project.category}</p>
        </div>
        <span className="concept-tag">CONCEPT PROJECT</span>
      </div>
      <dialog
        ref={modal}
        className="project-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) modal.current?.close();
        }}
      >
        <div className="dialog-content">
          <button
            className="close-dialog"
            onClick={() => modal.current?.close()}
            aria-label="Close project details"
          >
            <X />
          </button>
          <span className="eyebrow">Independent concept / Not client work</span>
          <h3>{project.title}</h3>
          <img
            src={project.image}
            alt={`${project.title} storefront concept`}
            width="1000"
            height={index === 0 ? '740' : '1000'}
          />
          <p>{project.description}</p>
          <p className="eyebrow">{project.detail}</p>
          <a
            className="text-link"
            href="#contact"
            onClick={() => modal.current?.close()}
          >
            Build something of your own <Arrow />
          </a>
        </div>
      </dialog>
    </article>
  );
}
export default function Portfolio() {
  const gallery = useRef<HTMLDivElement>(null);
  useProjectGallery(gallery);
  return (
    <section id="work" className="portfolio section-pad">
      <div className="section-kicker">
        <span>03 / SELECTED EXPLORATIONS</span>
        <span>AN INDEPENDENT POINT OF VIEW</span>
      </div>
      <div className="work-heading">
        <h2 className="section-heading reveal">
          BUILT FOR BRANDS
          <br />
          WITH <span className="serif-word">something</span>
          <br />
          TO SAY.
        </h2>
        <p>
          A glimpse of what’s possible.
          <br />
          Original storefront concepts,
          <br />
          made to stand apart.
        </p>
      </div>
      <div ref={gallery} className="work-showcase">
        <div className="work-gallery-stage">
          <div className="project-grid">
            {projects.map((project, i) => (
              <Project project={project} key={project.id} index={i} />
            ))}
          </div>
          <div className="gallery-scroll-caption">
            <span>SCROLL TO DISCOVER</span>
            <span>ORIGINAL CONCEPTS / 01 — 02</span>
          </div>
        </div>
      </div>
      <p className="portfolio-note">
        DESIGN EXPLORATIONS, NOT CLIENT COMMISSIONS. YOUR BRAND’S STORY WILL BE
        ITS OWN.
      </p>
    </section>
  );
}
