export default function Introduction() {
  return (
    <>
      <div className="discipline-strip" aria-label="Studio disciplines">
        <span>FASHION-FOCUSED.</span>
        <span className="strip-star">✳</span>
        <span>DESIGN-LED.</span>
        <span className="strip-star">✳</span>
        <span>COMMERCE-READY.</span>
        <span className="strip-star">✳</span>
        <span>BUILT DIFFERENT.</span>
      </div>
      <section id="intro" className="intro section-pad light-section">
        <div className="section-kicker">
          <span>01 / THE POINT OF VIEW</span>
          <span>MORE THAN A STOREFRONT</span>
        </div>
        <h2 className="intro-heading reveal">
          GOOD PRODUCTS
          <br />
          DESERVE <span className="serif-word">better</span>
          <br />
          STOREFRONTS<span className="pink-period">.</span>
        </h2>
        <div className="intro-bottom">
          <span className="large-asterisk" aria-hidden="true">
            ✳
          </span>
          <div>
            <p>
              Your online store is more than a place to display products. It is
              where your brand identity, customer experience, and commerce come
              together.
            </p>
            <p className="muted">We bring all three into focus.</p>
          </div>
        </div>
      </section>
    </>
  );
}
