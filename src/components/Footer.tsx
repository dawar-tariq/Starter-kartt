import { useRef } from 'react';
import { X } from 'lucide-react';
import { contact, navigation } from '../data/site';
import { Wordmark } from './Navigation';
export default function Footer() {
  const privacy = useRef<HTMLDialogElement>(null);
  return (
    <footer className="footer section-pad">
      <div className="footer-top">
        <div>
          <Wordmark />
          <p>
            Independent thinking.
            <br />
            Exceptional storefronts.
          </p>
        </div>
        <div className="footer-links">
          <span className="eyebrow">Explore</span>
          {navigation.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </div>
        <div className="footer-links">
          <span className="eyebrow">What we do</span>
          <a href="#services">Shopify development</a>
          <a href="#services">Storefront design</a>
          <a href="#services">Commerce integrations</a>
          <a href="#services">Store support</a>
        </div>
        <div className="footer-links">
          <span className="eyebrow">Say hello</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp ↗
          </a>
          <a href={contact.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Starterkart</span>
        <span>MADE WITH INTENTION. BUILT FOR WHAT’S NEXT.</span>
        <button onClick={() => privacy.current?.showModal()}>
          Privacy notice
        </button>
        <a href="#home">Back to top ↑</a>
      </div>
      <dialog ref={privacy} className="privacy-dialog">
        <button
          className="close-dialog"
          aria-label="Close privacy notice"
          onClick={() => privacy.current?.close()}
        >
          <X />
        </button>
        <h2>Privacy notice</h2>
        <p>
          Your project details are used to discuss your inquiry. In WhatsApp
          mode, the website does not store your form details; they are passed to
          WhatsApp only when you choose to continue. WhatsApp and Instagram
          operate under their own privacy policies.
        </p>
        <p>
          If direct submission is configured, your inquiry is sent to the
          studio’s configured service. Do not share sensitive information. To
          request access to or deletion of inquiry information, email{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
        <p>
          This website does not use advertising trackers or analytics cookies.
        </p>
      </dialog>
    </footer>
  );
}
