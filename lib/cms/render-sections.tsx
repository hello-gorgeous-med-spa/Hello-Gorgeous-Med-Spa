'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CMSSection, ServiceItem, TestimonialItem, ProviderItem, FAQItem, GalleryImage } from './section-types';

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection({ content }: { content: Record<string, unknown> }) {
  const headline = (content.headline as string) || 'Welcome to Hello Gorgeous';
  const subheadline = (content.subheadline as string) || '';
  const description = (content.description as string) || '';
  const background_image = (content.background_image as string) || '';
  const background_color = (content.background_color as string) || 'bg-gradient-to-br from-pink-100 via-white to-pink-50';
  const text_color = (content.text_color as string) || 'text-black';
  const cta_text = (content.cta_text as string) || 'Book Now';
  const cta_url = (content.cta_url as string) || '/book';
  const cta_secondary_text = (content.cta_secondary_text as string) || '';
  const cta_secondary_url = (content.cta_secondary_url as string) || '';
  const overlay = content.overlay as boolean;
  const alignment = (content.alignment as string) || 'center';
  const textAlign = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';

  return (
    <section 
      className={`relative min-h-[70vh] flex items-center justify-center py-20 px-6 ${background_color}`}
      style={background_image ? { backgroundImage: `url(${background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {overlay && background_image && <div className="absolute inset-0 bg-black/40" />}
      <div className={`relative z-10 max-w-4xl mx-auto ${textAlign}`}>
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold ${text_color} leading-tight`}>{headline}</h1>
        {subheadline && <p className={`mt-4 text-xl md:text-2xl ${text_color} opacity-80`}>{subheadline}</p>}
        {description && <p className={`mt-6 text-lg ${text_color} opacity-70 max-w-2xl ${alignment === 'center' ? 'mx-auto' : ''}`}>{description}</p>}
        <div className={`mt-8 flex gap-4 ${alignment === 'center' ? 'justify-center' : ''} flex-wrap`}>
          {cta_text && <Link href={cta_url} className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all shadow-lg">{cta_text}</Link>}
          {cta_secondary_text && <Link href={cta_secondary_url} className="px-8 py-4 bg-white/90 hover:bg-white text-black font-semibold rounded-lg transition-all shadow border">{cta_secondary_text}</Link>}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TEXT BLOCK SECTION
// ============================================================
function TextSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || '';
  const body = (content.body as string) || '';
  const alignment = (content.alignment as string) || 'left';
  const background_color = (content.background_color as string) || 'bg-white';
  const text_color = (content.text_color as string) || 'text-black';
  const max_width = (content.max_width as string) || 'max-w-4xl';
  const textAlign = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';

  return (
    <section className={`py-16 px-6 ${background_color}`}>
      <div className={`${max_width} mx-auto ${textAlign}`}>
        {title && <h2 className={`text-3xl md:text-4xl font-bold ${text_color} mb-6`}>{title}</h2>}
        {body && <div className={`prose prose-lg ${text_color} max-w-none`} dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    </section>
  );
}

// ============================================================
// SERVICES GRID SECTION
// ============================================================
function ServicesGridSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Our Services';
  const subtitle = (content.subtitle as string) || '';
  const services = (content.services as ServiceItem[]) || [];
  const columns = (content.columns as number) || 3;
  const show_prices = content.show_prices !== false;
  const show_cta = content.show_cta !== false;
  const cta_text = (content.cta_text as string) || 'Learn More';
  const gridCols: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-black">{subtitle}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[columns] || 'md:grid-cols-3'} gap-8`}>
          {services.map((service, idx) => (
            <div key={idx} className="bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pink-100 p-6 hover:shadow-lg transition-all">
              {service.image && <div className="relative h-48 mb-4 rounded-xl overflow-hidden"><Image src={service.image} alt={service.name} fill className="object-cover" /></div>}
              {service.icon && !service.image && <span className="text-4xl mb-4 block">{service.icon}</span>}
              <h3 className="text-xl font-bold text-black">{service.name}</h3>
              {service.description && <p className="mt-2 text-black">{service.description}</p>}
              {show_prices && service.price && <p className="mt-3 text-lg font-semibold text-pink-600">{service.price}</p>}
              {show_cta && service.url && <Link href={service.url} className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-medium">{cta_text} →</Link>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS SECTION
// ============================================================
function TestimonialsSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'What Our Clients Say';
  const subtitle = (content.subtitle as string) || '';
  const testimonials = (content.testimonials as TestimonialItem[]) || [];
  const display = (content.display as string) || 'grid';

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-black">{subtitle}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${display === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <div className="flex gap-1 mb-4">{[...Array(t.rating || 5)].map((_, i) => <span key={i} className="text-yellow-400">⭐</span>)}</div>
              <p className="text-black italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="font-semibold text-black">{t.name}</p>
                {t.location && <p className="text-sm text-black">{t.location}</p>}
                {t.service && <p className="text-sm text-pink-600">{t.service}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROMO BANNER SECTION
// ============================================================
function PromoBannerSection({ content }: { content: Record<string, unknown> }) {
  const headline = (content.headline as string) || '';
  const subheadline = (content.subheadline as string) || '';
  const background_color = (content.background_color as string) || 'bg-gradient-to-r from-pink-500 to-rose-500';
  const text_color = (content.text_color as string) || 'text-white';
  const cta_text = (content.cta_text as string) || '';
  const cta_url = (content.cta_url as string) || '/book';
  const code = (content.code as string) || '';

  return (
    <section className={`py-12 px-6 ${background_color}`}>
      <div className="max-w-4xl mx-auto text-center">
        {headline && <h2 className={`text-2xl md:text-3xl font-bold ${text_color}`}>{headline}</h2>}
        {subheadline && <p className={`mt-2 text-lg ${text_color} opacity-90`}>{subheadline}</p>}
        {code && <p className={`mt-4 inline-block px-4 py-2 bg-white/20 rounded-lg font-mono font-bold ${text_color}`}>Use code: {code}</p>}
        {cta_text && <div className="mt-6"><Link href={cta_url} className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-pink-50">{cta_text}</Link></div>}
      </div>
    </section>
  );
}

// ============================================================
// PROVIDERS SECTION
// ============================================================
function ProvidersSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Meet Our Team';
  const subtitle = (content.subtitle as string) || '';
  const providers = (content.providers as ProviderItem[]) || [];
  const display = (content.display as string) || 'grid';

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-black">{subtitle}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${display === 'grid' ? 'md:grid-cols-2' : ''} gap-8`}>
          {providers.map((p, idx) => (
            <div key={idx} className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-pink-100">
              <div className="flex flex-col md:flex-row gap-6">
                {p.image && <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-pink-200"><Image src={p.image} alt={p.name} fill className="object-cover" /></div>}
                <div>
                  <h3 className="text-xl font-bold text-black">{p.name}</h3>
                  {p.credentials && <p className="text-pink-600 font-medium">{p.credentials}</p>}
                  {p.bio && <p className="mt-3 text-black">{p.bio}</p>}
                  {p.url && <Link href={p.url} className="mt-4 inline-block text-pink-600 hover:text-pink-700 font-medium">View Profile →</Link>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ SECTION
// ============================================================
function FAQSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Frequently Asked Questions';
  const subtitle = (content.subtitle as string) || '';
  const faqs = (content.faqs as FAQItem[]) || [];
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{title}</h2>
            {subtitle && <p className="mt-4 text-lg text-black">{subtitle}</p>}
          </div>
        )}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-pink-100 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full px-6 py-4 text-left flex items-center justify-between bg-gradient-to-r from-pink-50 to-white hover:from-pink-100">
                <span className="font-semibold text-black">{faq.question}</span>
                <span className="text-pink-500">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && <div className="px-6 py-4 bg-white"><p className="text-black">{faq.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// IMAGE SECTION
// ============================================================
function ImageSection({ content }: { content: Record<string, unknown> }) {
  const image_url = (content.image_url as string) || '';
  const alt = (content.alt as string) || '';
  const caption = (content.caption as string) || '';
  const full_width = content.full_width as boolean;
  const rounded = content.rounded !== false;
  if (!image_url) return null;

  return (
    <section className={`py-12 px-6 ${full_width ? '' : 'max-w-4xl mx-auto'}`}>
      <div className={`relative ${full_width ? 'aspect-[21/9]' : 'aspect-video'} ${rounded ? 'rounded-2xl' : ''} overflow-hidden`}>
        <Image src={image_url} alt={alt || 'Image'} fill className="object-cover" />
      </div>
      {caption && <p className="mt-4 text-center text-black text-sm">{caption}</p>}
    </section>
  );
}

// ============================================================
// VIDEO SECTION
// ============================================================
function VideoSection({ content }: { content: Record<string, unknown> }) {
  const video_url = (content.video_url as string) || '';
  const title = (content.title as string) || '';
  const autoplay = content.autoplay as boolean;
  const muted = content.muted !== false;
  const loop = content.loop as boolean;
  if (!video_url) return null;

  if (video_url.includes('youtube') || video_url.includes('vimeo')) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {title && <h3 className="text-xl font-bold text-black mb-4">{title}</h3>}
          <div className="aspect-video rounded-2xl overflow-hidden"><iframe src={video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {title && <h3 className="text-xl font-bold text-black mb-4">{title}</h3>}
        <video src={video_url} className="w-full rounded-2xl" autoPlay={autoplay} muted={muted} loop={loop} controls={!autoplay} playsInline />
      </div>
    </section>
  );
}

// ============================================================
// GALLERY SECTION
// ============================================================
function GallerySection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || '';
  const images = (content.images as (GalleryImage | string)[]) || [];
  const columns = (content.columns as number) || 3;
  const gridCols: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl font-bold text-black mb-8 text-center">{title}</h2>}
        <div className={`grid grid-cols-1 ${gridCols[columns] || 'md:grid-cols-3'} gap-4`}>
          {images.map((img, idx) => {
            const imgUrl = typeof img === 'string' ? img : img.url;
            const imgAlt = typeof img === 'string' ? `Gallery image ${idx + 1}` : (img.alt || `Gallery image ${idx + 1}`);
            return <div key={idx} className="relative aspect-square rounded-xl overflow-hidden"><Image src={imgUrl} alt={imgAlt} fill className="object-cover hover:scale-105 transition-transform" /></div>;
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA SECTION
// ============================================================
function CTASection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || '';
  const subtitle = (content.subtitle as string) || '';
  const cta_text = (content.cta_text as string) || 'Book Now';
  const cta_url = (content.cta_url as string) || '/book';
  const background_color = (content.background_color as string) || 'bg-gradient-to-r from-pink-500 to-rose-500';
  const text_color = (content.text_color as string) || 'text-white';

  return (
    <section className={`py-16 px-6 ${background_color}`}>
      <div className="max-w-4xl mx-auto text-center">
        {title && <h2 className={`text-3xl md:text-4xl font-bold ${text_color}`}>{title}</h2>}
        {subtitle && <p className={`mt-4 text-lg ${text_color} opacity-90`}>{subtitle}</p>}
        <div className="mt-8"><Link href={cta_url} className="inline-block px-10 py-4 bg-white text-pink-600 font-bold rounded-lg hover:bg-pink-50 shadow-lg">{cta_text}</Link></div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT SECTION
// ============================================================
function ContactSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Contact Us';
  const phone = (content.phone as string) || '(630) 636-6193';
  const email = (content.email as string) || 'hellogorgeousskin@yahoo.com';
  const address = (content.address as string) || '74 W. Washington Street, Oswego, IL 60543';
  const show_map = content.show_map !== false;
  const show_hours = content.show_hours as boolean;
  const hours = (content.hours as Record<string, string>) || {};

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4"><span className="text-2xl">📍</span><div><p className="font-semibold text-black">Address</p><p className="text-black">{address}</p></div></div>
            <div className="flex items-start gap-4"><span className="text-2xl">📞</span><div><p className="font-semibold text-black">Phone</p><a href={`tel:${phone}`} className="text-pink-600 hover:text-pink-700">{phone}</a></div></div>
            <div className="flex items-start gap-4"><span className="text-2xl">✉️</span><div><p className="font-semibold text-black">Email</p><a href={`mailto:${email}`} className="text-pink-600 hover:text-pink-700">{email}</a></div></div>
            {show_hours && Object.keys(hours).length > 0 && (
              <div className="mt-8"><h3 className="font-semibold text-black mb-4">Hours</h3><div className="space-y-2 text-black">{Object.entries(hours).map(([day, time]) => <div key={day} className="flex justify-between"><span>{day}</span><span>{time}</span></div>)}</div></div>
            )}
          </div>
          {show_map && <div className="rounded-xl overflow-hidden h-[300px]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2961.7!2d-88.3515!3d41.6828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e5!5e0!3m2!1sen!2sus!4v1" className="w-full h-full border-0" loading="lazy" allowFullScreen /></div>}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// DIVIDER SECTION
// ============================================================
function DividerSection({ content }: { content: Record<string, unknown> }) {
  const style = (content.style as string) || 'line';
  const spacing = (content.spacing as string) || 'medium';
  const spacingClasses: Record<string, string> = { small: 'py-4', medium: 'py-8', large: 'py-16' };
  if (style === 'blank') return <div className={spacingClasses[spacing] || 'py-8'} />;
  return <div className={`${spacingClasses[spacing] || 'py-8'} px-6`}><hr className="max-w-xl mx-auto border-t-2 border-pink-200" /></div>;
}

// ============================================================
// BOOKING SECTION
// ============================================================
function BookingSection({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Schedule Your Appointment';
  const subtitle = (content.subtitle as string) || '';
  const cta_text = (content.cta_text as string) || 'Book Now';
  const cta_url = (content.cta_url as string) || '/book';

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-4 text-lg text-white/90">{subtitle}</p>}
        <div className="mt-8"><Link href={cta_url} className="inline-block px-12 py-5 bg-white text-pink-600 font-bold text-lg rounded-xl hover:bg-pink-50 shadow-xl">{cta_text}</Link></div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION RENDERER
// ============================================================
const SECTION_COMPONENTS: Record<string, React.FC<{ content: Record<string, unknown> }>> = {
  hero: HeroSection,
  text: TextSection,
  services_grid: ServicesGridSection,
  testimonials: TestimonialsSection,
  promo_banner: PromoBannerSection,
  providers: ProvidersSection,
  faq: FAQSection,
  image: ImageSection,
  video: VideoSection,
  gallery: GallerySection,
  cta: CTASection,
  contact: ContactSection,
  divider: DividerSection,
  booking: BookingSection,
};

export function renderSection(section: CMSSection): React.ReactNode {
  if (!section.visible) return null;
  const Component = SECTION_COMPONENTS[section.type];
  if (!Component) { console.warn(`Unknown section type: ${section.type}`); return null; }
  return <Component key={section.id} content={section.content} />;
}

export function renderSections(sections: CMSSection[]): React.ReactNode {
  return sections.map(section => renderSection(section));
}

export { SECTION_COMPONENTS };
