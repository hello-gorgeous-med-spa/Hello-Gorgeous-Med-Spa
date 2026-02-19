import Link from "next/link";
import Image from "next/image";
import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { RxContactForm, RxCTASection } from "@/components/RxContactForm";

interface RxPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  heroImage?: string;
  children: React.ReactNode;
}

export function RxPageLayout({ title, subtitle, description, icon, heroImage, children }: RxPageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden bg-black text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#E6007E]/20" />
        <FadeUp>
          <div className={`relative z-10 max-w-7xl mx-auto ${heroImage ? 'grid lg:grid-cols-2 gap-8 lg:gap-12 items-center' : ''}`}>
            <div>
              <Link href="/rx" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Hello Gorgeous RX™
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{icon}</span>
                <div>
                  <p className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider">Hello Gorgeous RX™</p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h1>
                </div>
              </div>
              <p className="text-xl text-white/80 mb-2">{subtitle}</p>
              <p className="text-white/60 max-w-2xl">{description}</p>
            </div>
            {heroImage && (
              <div className="hidden lg:block">
                <Image
                  src={heroImage}
                  alt={`${title} - Hello Gorgeous RX`}
                  width={500}
                  height={350}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            )}
          </div>
        </FadeUp>
      </Section>

      {/* Compliance Banner */}
      <div className="bg-[#E6007E] text-white py-3 px-4 text-center text-sm">
        <p>All prescriptions require medical evaluation by <strong>Ryan Kent, FNP-C</strong>. Illinois residents only.</p>
      </div>

      {/* Content */}
      {children}

      {/* CTA Options Section */}
      <Section className="bg-gradient-to-b from-white to-pink-50/50">
        <FadeUp>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-4">
              Ready to <span className="text-[#E6007E]">Get Started?</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Choose how you&apos;d like to begin your medical optimization journey. All services require a consultation with our medical team.
            </p>
          </div>
          <RxCTASection />
        </FadeUp>
      </Section>

      {/* Contact Form Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">
                  Have <span className="text-[#E6007E]">Questions?</span>
                </h2>
                <p className="text-black/70 mb-6">
                  Submit an inquiry and our medical team will review your information and contact you within 24-48 hours to discuss your options.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">No commitment required</p>
                      <p className="text-sm text-black/60">Just an inquiry to learn more about your options</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Confidential & HIPAA compliant</p>
                      <p className="text-sm text-black/60">Your information is protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Illinois residents only</p>
                      <p className="text-sm text-black/60">We can only serve patients in Illinois</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black text-white">
                  <p className="font-semibold mb-1">Prefer to call?</p>
                  <a href="tel:6306366193" className="text-[#E6007E] text-xl font-bold hover:underline">(630) 636-6193</a>
                </div>
              </div>
              <div className="bg-pink-50/50 rounded-2xl p-6 border border-[#E6007E]/20">
                <h3 className="text-xl font-bold text-black mb-4">Submit an Inquiry</h3>
                <RxContactForm />
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Legal Footer */}
      <Section className="bg-black text-white/60 py-8">
        <div className="max-w-4xl mx-auto text-center text-xs space-y-2">
          <p>Prescription products are available only to qualified patients following medical evaluation.</p>
          <p>Individual results vary. Not all patients are candidates. Illinois residents only.</p>
          <p>This information does not replace primary medical care.</p>
          <div className="pt-4 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-[#E6007E] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#E6007E] transition-colors">Terms of Service</Link>
            <Link href="/hipaa" className="hover:text-[#E6007E] transition-colors">HIPAA Notice</Link>
          </div>
        </div>
      </Section>
    </>
  );
}

interface RxServiceCardProps {
  title: string;
  description: string;
  benefits?: string[];
}

export function RxServiceCard({ title, description, benefits }: RxServiceCardProps) {
  return (
    <div className="p-6 rounded-2xl border-2 border-black bg-white hover:border-[#E6007E] transition-all">
      <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
      <p className="text-black/70 text-sm mb-3">{description}</p>
      {benefits && benefits.length > 0 && (
        <ul className="text-sm text-black/60 space-y-1">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#E6007E]">•</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
