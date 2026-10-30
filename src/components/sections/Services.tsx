import { services } from '../../data/site';
export default function Services() {
  return (
    <section id="services" className="services section-pad light-section">
      <div className="section-kicker">
        <span>04 / OUR CAPABILITIES</span>
        <span>THE DETAILS MAKE THE DIFFERENCE</span>
      </div>
      <div className="services-layout">
        <div className="services-title">
          <h2 className="section-heading reveal">
            EVERYTHING
            <br />
            YOUR
            <br />
            STOREFRONT
            <br />
            <span className="serif-word">needs.</span>
          </h2>
          <p>
            Thoughtful design. Practical technology.
            <br />
            One considered experience.
          </p>
          <a className="text-link" href="#contact">
            Let’s talk about your store <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="services-list">
          {services.map(([title, description], i) => (
            <details key={title} className="service-item" open={i === 0}>
              <summary>
                <span className="service-number">0{i + 1}</span>
                <h3>{title}</h3>
                <span className="service-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{description}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
