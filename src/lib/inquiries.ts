export type Inquiry = {
  name: string;
  brand: string;
  email: string;
  whatsapp: string;
  instagram: string;
  business: string;
  products: string;
  services: string[];
  budget: string;
  description: string;
};
export type InquiryResult =
  { kind: 'submitted' } | { kind: 'draft'; message: string };
export function validateInquiry(value: Inquiry): Record<string, string> {
  const errors: Record<string, string> = {};
  if (value.name.trim().length < 2)
    errors.name = 'Please enter at least 2 characters.';
  if (!value.brand.trim()) errors.brand = 'Please tell us your brand name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    errors.email = 'Enter a valid email address.';
  if (value.whatsapp && !/^\+?[\d\s()-]{7,20}$/.test(value.whatsapp))
    errors.whatsapp = 'Enter a valid phone number, including country code.';
  if (!value.business) errors.business = 'Choose your type of business.';
  if (!value.products) errors.products = 'Choose an approximate product count.';
  if (!value.services.length) errors.services = 'Choose at least one service.';
  if (!value.budget)
    errors.budget = 'Choose a budget range, or select “Let’s discuss”.';
  if (value.description.trim().length < 20)
    errors.description = 'Tell us a little more (at least 20 characters).';
  return errors;
}
export function formatInquiry(value: Inquiry) {
  return `Hi Starterkart! I’d like to discuss a project.\n\nName: ${value.name}\nBrand: ${value.brand}\nEmail: ${value.email}\nWhatsApp: ${value.whatsapp || 'Not provided'}\nInstagram: ${value.instagram || 'Not provided'}\nBusiness: ${value.business}\nProducts: ${value.products}\nServices: ${value.services.join(', ')}\nBudget: ${value.budget}\n\n${value.description}`;
}
export async function submitInquiry(
  value: Inquiry,
  honeypot: string,
): Promise<InquiryResult> {
  if (honeypot)
    throw new Error(
      'Unable to prepare this inquiry. Please contact us directly.',
    );
  if (Object.keys(validateInquiry(value)).length)
    throw new Error('Please check the highlighted fields.');
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
  if (!endpoint) return { kind: 'draft', message: formatInquiry(value) };
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      'Your inquiry could not be sent. Please try again or contact us on WhatsApp.',
    );
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== 'object' ||
    !('success' in result) ||
    result.success !== true
  )
    throw new Error(
      'The server did not confirm receipt. Please contact us directly.',
    );
  return { kind: 'submitted' };
}
