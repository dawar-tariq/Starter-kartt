import { useRef, useState, type FormEvent } from 'react';
import { contact, services } from '../../data/site';
import {
  submitInquiry,
  validateInquiry,
  type Inquiry,
  type InquiryResult,
} from '../../lib/inquiries';
import Arrow from '../ui/Arrow';
export default function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [failure, setFailure] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const backend = !!import.meta.env.VITE_INQUIRY_ENDPOINT;
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure('');
    setResult(null);
    const data = new FormData(event.currentTarget);
    const value = Object.fromEntries(
      [
        'name',
        'brand',
        'email',
        'whatsapp',
        'instagram',
        'business',
        'products',
        'budget',
        'description',
      ].map((key) => [key, String(data.get(key) ?? '').trim()]),
    ) as Omit<Inquiry, 'services'>;
    const inquiry: Inquiry = {
      ...value,
      services: data.getAll('services').map(String),
    };
    const nextErrors = validateInquiry(inquiry);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setLoading(true);
    try {
      setResult(
        await submitInquiry(inquiry, String(data.get('website') || '')),
      );
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please contact us directly.',
      );
    } finally {
      setLoading(false);
    }
  }
  function field(
    name: string,
    label: string,
    type = 'text',
    optional = false,
    autoComplete?: string,
  ) {
    return (
      <div className="form-field">
        <label htmlFor={`inquiry-${name}`}>
          {label}
          {optional ? (
            <span> (optional)</span>
          ) : (
            <span aria-hidden="true"> *</span>
          )}
        </label>
        <input
          id={`inquiry-${name}`}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={!optional}
          maxLength={name === 'email' ? 254 : 100}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <p className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  function select(name: string, label: string, options: string[]) {
    return (
      <div className="form-field">
        <label htmlFor={`inquiry-${name}`}>
          {label} <span aria-hidden="true">*</span>
        </label>
        <select
          id={`inquiry-${name}`}
          name={name}
          required
          defaultValue=""
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        {errors[name] && (
          <p className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  return (
    <section id="contact" className="contact section-pad light-section">
      <div className="section-kicker">
        <span>08 / START SOMETHING</span>
        <span>YOUR BRAND. OUR NEXT CONVERSATION.</span>
      </div>
      <div className="contact-layout">
        <div className="contact-copy">
          <h2 className="section-heading">
            A GOOD STORE
            <br />
            STARTS WITH
            <br />
            <span className="serif-word">a conversation.</span>
          </h2>
          <p>
            Tell us about your brand, your products, and what you want to build.
          </p>
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email} <Arrow />
          </a>
          <a
            className="text-link"
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Prefer WhatsApp? Let’s chat <Arrow />
          </a>
          <p className="form-note">
            {backend
              ? 'Your details are used only to respond to your project inquiry.'
              : 'This form prepares your project brief. You’ll review it and send it through WhatsApp. Nothing is submitted or stored on this website.'}
          </p>
        </div>
        <form
          ref={formRef}
          className="inquiry-form"
          onSubmit={handleSubmit}
          noValidate
          onChange={() => {
            if (result) setResult(null);
          }}
        >
          <div className="form-grid">
            {field('name', 'Your name', 'text', false, 'name')}
            {field('brand', 'Brand name', 'text', false, 'organization')}
            {field('email', 'Email address', 'email', false, 'email')}
            {field('whatsapp', 'WhatsApp number', 'tel', true, 'tel')}
            {field('instagram', 'Instagram handle', 'text', true)}
            {select('business', 'Type of business', [
              'Clothing brand',
              'Streetwear label',
              'Boutique',
              'Thrift store',
              'Instagram seller',
              'Other',
            ])}
            {select('products', 'Approximate product count', [
              '1–20',
              '21–50',
              '51–100',
              '100+',
              'Still planning',
            ])}
            {select('budget', 'Estimated budget', [
              'Under ₹15,000',
              '₹15,000–₹30,000',
              '₹30,000–₹60,000',
              '₹60,000+',
              'Let’s discuss',
            ])}
          </div>
          <fieldset
            aria-describedby={errors.services ? 'services-error' : undefined}
          >
            <legend>
              What do you need? <span aria-hidden="true">*</span>
            </legend>
            <div className="service-options">
              {services.map(([service]) => (
                <label key={service}>
                  <input
                    name="services"
                    value={service}
                    type="checkbox"
                    aria-invalid={!!errors.services}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="field-error" id="services-error">
                {errors.services}
              </p>
            )}
          </fieldset>
          <div className="form-field">
            <label htmlFor="inquiry-description">
              A little about your project <span aria-hidden="true">*</span>
            </label>
            <textarea
              name="description"
              id="inquiry-description"
              rows={3}
              required
              minLength={20}
              maxLength={4000}
              placeholder="The vision, the products, the possibilities…"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? 'description-error' : undefined
              }
            />
            {errors.description && (
              <p className="field-error" id="description-error">
                {errors.description}
              </p>
            )}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Leave this empty</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p className="form-note">
            Required fields are marked *. Please don’t include passwords or
            payment details.
          </p>
          <button
            className="button button-dark"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Preparing your inquiry…'
              : backend
                ? 'Send project inquiry'
                : 'Prepare project inquiry'}{' '}
            <Arrow />
          </button>
          <div aria-live="polite" aria-atomic="true">
            {failure && (
              <p className="form-error" role="alert">
                {failure} <a href={contact.whatsapp}>Chat on WhatsApp</a>
              </p>
            )}
            {result?.kind === 'submitted' && (
              <p className="form-success">
                Your inquiry has been received. Thank you for telling us about
                your brand.
              </p>
            )}
            {result?.kind === 'draft' && (
              <div className="inquiry-review">
                <h3>Your brief is ready. Not sent yet.</h3>
                <p>
                  Review your details below, then open WhatsApp and press Send
                  to complete your inquiry.
                </p>
                <pre>{result.message}</pre>
                <a
                  className="button button-dark"
                  href={`${contact.whatsapp}?text=${encodeURIComponent(result.message)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Continue on WhatsApp <Arrow />
                </a>
                <button
                  type="button"
                  className="text-link download-brief"
                  onClick={() => {
                    const url = URL.createObjectURL(
                      new Blob([result.message], { type: 'text/plain' }),
                    );
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'starterkart-project-brief.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download your brief ↓
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
