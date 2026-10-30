import { process } from '../../data/site';
export default function Process() {
  return (
    <section id="process" className="process section-pad">
      <div className="section-kicker">
        <span>05 / THE PROCESS</span>
        <span>COLLABORATIVE BY DESIGN</span>
      </div>
      <div className="process-heading">
        <h2 className="section-heading reveal">
          FROM IDEA
          <br />
          TO <span className="serif-word">storefront.</span>
        </h2>
        <p>
          A clear path, with room for your ambition.
          <br />
          Every project is shaped around its own needs.
        </p>
      </div>
      <div className="process-timeline">
        {process.map(([title, subtitle, description], i) => (
          <article className="process-step" key={title}>
            <div className="process-track">
              <span>0{i + 1}</span>
              <i />
            </div>
            <h3>{title}</h3>
            <h4>{subtitle}</h4>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
