import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Star, ArrowRight, Zap, Crown, Gem } from "lucide-react";

const plans = [
  {
    name: "Basic Plan",
    icon: <Zap className="w-6 h-6" />,
    price: "5,499",
    tagline: "Perfect for new brands starting their online journey",
    delivery: "4 days",
    recommended: false,
    features: [
      "Modern basic website design",
      "Mobile responsive layout",
      "Product upload (20–40 products)",
      "Smooth & clean user experience",
      "Contact/WhatsApp integration",
      "Up to 10 requested changes",
      "Delivery within 4 days",
    ],
    bestFor: [
      "New clothing brands",
      "Instagram stores",
      "Small businesses wanting a professional online presence",
    ],
  },
  {
    name: "Growth Plan",
    icon: <Crown className="w-6 h-6" />,
    price: "6,999",
    tagline: "For growing brands that want premium, converting websites",
    delivery: "5 days",
    recommended: false,
    features: [
      "Everything in Basic Plan",
      "Professional high-converting design",
      "Improved branding & premium UI",
      "Advanced mobile optimization",
      "Product upload (50–70 products)",
      "Better product presentation layouts",
      "Faster & smoother experience",
      "Priority design structure",
      "Delivery within 5 days",
    ],
    bestFor: [
      "Growing fashion brands",
      "Cafe and restaurants",
      "Businesses wanting better trust & conversions",
      "Brands ready to scale online",
    ],
  },
  {
    name: "Premium Plan",
    icon: <Gem className="w-6 h-6" />,
    price: "9,999",
    tagline: "For serious brands wanting premium positioning",
    delivery: "3 days",
    recommended: true,
    features: [
      "Everything in Growth Plan",
      "Premium custom website experience",
      "Product upload (70–120 products)",
      "3 months support included",
      "Up to 25 requested changes",
      "Advanced brand-focused design",
      "Premium layout & interactions",
      "Priority delivery within 3 days",
    ],
    bestFor: [
      "Established clothing brands",
      "High-volume stores",
      "Brands wanting premium positioning online",
    ],
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <section id="pricing" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle parallax bg dots */}
      <motion.div className="absolute inset-0 grid-pattern pointer-events-none" style={{ y: bgY }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-4 block">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Invest in Your Brand's
            <br />
            <span className="gradient-text font-playfair italic">Online Future</span>
          </h2>
          <p className="text-dark-muted text-base sm:text-lg max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Every plan includes mobile optimization and modern responsive design.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.9, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className={`relative rounded-2xl overflow-hidden perspective-container ${
                plan.recommended ? "md:-mt-4 md:mb-0" : ""
              }`}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div className="shimmer-btn text-dark text-xs font-bold tracking-wider uppercase text-center py-2 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-dark" /> Recommended Plan
                </div>
              )}

              <div
                className={`bg-dark-card border rounded-2xl p-6 md:p-8 h-full ${
                  plan.recommended
                    ? "border-gold/40 glow-gold-strong rounded-t-none"
                    : "border-dark-border hover:border-gold/20"
                } transition-all duration-500`}
              >
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.recommended
                        ? "bg-gold/20 text-gold"
                        : "bg-dark-surface text-dark-muted"
                    }`}
                  >
                    {plan.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-dark-muted text-lg">₹</span>
                    <span
                      className={`text-4xl md:text-5xl font-extrabold ${
                        plan.recommended ? "gradient-text" : "text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-dark-muted text-sm mt-1">{plan.tagline}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-dark-border my-6" />

                {/* Features */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-4">
                    What's Included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fi) => (
                      <motion.li
                        key={fi}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: fi * 0.04 }}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            plan.recommended ? "text-gold" : "text-accent-green"
                          }`}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div className="mb-8">
                  <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                    Best For
                  </p>
                  <ul className="space-y-2">
                    {plan.bestFor.map((item, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2 text-sm text-dark-muted"
                      >
                        <span className="w-1 h-1 bg-gold rounded-full mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <motion.a
                  href={`https://wa.me/919818082449?text=Hi%20Starterkart!%20I'm%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20(₹${plan.price}).%20Let's%20discuss!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all duration-300 ${
                    plan.recommended
                      ? "shimmer-btn text-dark"
                      : "bg-dark-surface border border-dark-border text-white hover:border-gold/40 hover:bg-gold/5"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-dark-muted">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-gold" /> Custom quotations available
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-gold" /> Mobile optimization in every plan
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-gold" /> Fast delivery guaranteed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
