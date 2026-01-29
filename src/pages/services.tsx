import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const serviceCategories = [
    {
        id: 'injectables',
        title: 'Injectables',
        description: 'Smooth wrinkles and restore volume with precision treatments.',
        services: [
            {
                name: 'Botox Cosmetic',
                description: 'FDA-approved treatment to temporarily reduce the appearance of fine lines and wrinkles. Perfect for forehead lines, crow\'s feet, and frown lines.',
                duration: '15-30 min',
                price: 'From $12/unit',
            },
            {
                name: 'Dermal Fillers',
                description: 'Hyaluronic acid-based fillers to restore volume, enhance facial contours, and smooth deep wrinkles. Options include Juvederm and Restylane.',
                duration: '30-60 min',
                price: 'From $650/syringe',
            },
            {
                name: 'Lip Enhancement',
                description: 'Achieve fuller, more defined lips with natural-looking augmentation using premium dermal fillers.',
                duration: '30-45 min',
                price: 'From $550',
            },
            {
                name: 'Kybella',
                description: 'FDA-approved injectable treatment to reduce moderate to severe submental fat (double chin) without surgery.',
                duration: '15-20 min',
                price: 'From $600/session',
            },
        ],
    },
    {
        id: 'laser',
        title: 'Laser Treatments',
        description: 'Advanced laser technology for skin rejuvenation and hair removal.',
        services: [
            {
                name: 'Laser Hair Removal',
                description: 'Permanent hair reduction using state-of-the-art laser technology. Safe for all skin types with minimal discomfort.',
                duration: '15-60 min',
                price: 'From $150/session',
            },
            {
                name: 'Laser Skin Resurfacing',
                description: 'Fractional laser treatment to improve skin texture, reduce wrinkles, and minimize scars and sun damage.',
                duration: '30-60 min',
                price: 'From $800/session',
            },
            {
                name: 'IPL Photofacial',
                description: 'Intense pulsed light therapy to treat sun damage, age spots, rosacea, and uneven skin tone.',
                duration: '30-45 min',
                price: 'From $350/session',
            },
            {
                name: 'Laser Tattoo Removal',
                description: 'Advanced Q-switched laser technology to safely remove unwanted tattoos with minimal scarring.',
                duration: '15-45 min',
                price: 'From $200/session',
            },
        ],
    },
    {
        id: 'facials',
        title: 'Facial Treatments',
        description: 'Customized treatments for radiant, healthy-looking skin.',
        services: [
            {
                name: 'HydraFacial',
                description: 'Multi-step treatment that cleanses, exfoliates, extracts, and hydrates. Suitable for all skin types with no downtime.',
                duration: '45-60 min',
                price: 'From $199',
            },
            {
                name: 'Chemical Peels',
                description: 'Professional-grade peels to improve skin texture, reduce hyperpigmentation, and stimulate collagen production.',
                duration: '30-45 min',
                price: 'From $150',
            },
            {
                name: 'Microneedling',
                description: 'Collagen induction therapy using fine needles to improve skin texture, reduce scars, and minimize pores.',
                duration: '45-60 min',
                price: 'From $300',
            },
            {
                name: 'Vampire Facial (PRP)',
                description: 'Microneedling combined with platelet-rich plasma for enhanced skin rejuvenation and natural glow.',
                duration: '60-90 min',
                price: 'From $750',
            },
        ],
    },
    {
        id: 'body',
        title: 'Body Contouring',
        description: 'Non-invasive treatments to sculpt and tone your body.',
        services: [
            {
                name: 'CoolSculpting',
                description: 'FDA-cleared fat-freezing technology to eliminate stubborn fat in areas like the abdomen, flanks, and thighs.',
                duration: '35-60 min',
                price: 'From $750/area',
            },
            {
                name: 'Radiofrequency Skin Tightening',
                description: 'Non-invasive treatment using RF energy to tighten loose skin and stimulate collagen production.',
                duration: '30-60 min',
                price: 'From $400/session',
            },
            {
                name: 'Cellulite Treatment',
                description: 'Advanced technology to reduce the appearance of cellulite and improve skin texture.',
                duration: '30-45 min',
                price: 'From $250/session',
            },
            {
                name: 'Body Sculpting Package',
                description: 'Customized combination of treatments designed to help you achieve your body goals.',
                duration: 'Varies',
                price: 'Custom pricing',
            },
        ],
    },
    {
        id: 'wellness',
        title: 'Wellness & IV Therapy',
        description: 'Boost your health and energy from the inside out.',
        services: [
            {
                name: 'IV Vitamin Therapy',
                description: 'Customized IV infusions to boost energy, immunity, hydration, and overall wellness.',
                duration: '30-60 min',
                price: 'From $150',
            },
            {
                name: 'B12 Injections',
                description: 'Quick vitamin B12 shots to increase energy levels and support healthy metabolism.',
                duration: '5-10 min',
                price: '$35/injection',
            },
            {
                name: 'Weight Management Program',
                description: 'Medically supervised weight loss program including metabolic testing, medication options, and nutritional guidance.',
                duration: 'Ongoing',
                price: 'Consultation required',
            },
            {
                name: 'Bioidentical Hormone Therapy',
                description: 'Personalized hormone replacement therapy to restore balance and vitality.',
                duration: 'Ongoing',
                price: 'Consultation required',
            },
        ],
    },
];

const Services: React.FC = () => {
    return (
        <>
            <Head>
                <title>Services | Hello Gorgeous Med Spa</title>
                <meta name="description" content="Explore our comprehensive range of medical spa services including Botox, fillers, laser treatments, facials, body contouring, and wellness therapies." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            Our Services
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
                            Premium Aesthetic Treatments
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            From subtle enhancements to transformative procedures, we offer a comprehensive 
                            range of treatments tailored to help you look and feel your absolute best.
                        </p>
                    </div>
                </section>

                {/* Quick Navigation */}
                <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-4">
                            {serviceCategories.map((category) => (
                                <a
                                    key={category.id}
                                    href={`#${category.id}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                                >
                                    {category.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Categories */}
                {serviceCategories.map((category, categoryIndex) => (
                    <section
                        key={category.id}
                        id={category.id}
                        className={`py-20 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-secondary-50 to-white'}`}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="section-heading">{category.title}</h2>
                                <p className="section-subheading">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {category.services.map((service, serviceIndex) => (
                                    <div key={serviceIndex} className="card p-6 hover:border-primary-200 border-2 border-transparent transition-colors duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                                            <span className="text-primary-600 font-semibold whitespace-nowrap ml-4">{service.price}</span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{service.description}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Duration: {service.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                {/* Packages Section */}
                <section className="py-20 bg-gradient-to-br from-primary-50 to-gold-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Special Offers</span>
                            <h2 className="section-heading mt-2">Treatment Packages</h2>
                            <p className="section-subheading">
                                Save more with our carefully curated treatment packages designed to give you optimal results.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card p-8 text-center border-2 border-transparent hover:border-primary-200 transition-colors duration-300">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">First-Time Client Special</h3>
                                <p className="text-3xl font-bold text-primary-600 mb-4">20% Off</p>
                                <p className="text-gray-600 mb-6">Enjoy 20% off your first treatment. New clients only.</p>
                                <Link href="/contact" className="btn-secondary w-full">
                                    Book Now
                                </Link>
                            </div>
                            <div className="card p-8 text-center border-2 border-primary-300 relative">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                                    Most Popular
                                </span>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Glow Package</h3>
                                <p className="text-3xl font-bold text-primary-600 mb-4">$499</p>
                                <p className="text-gray-600 mb-6">HydraFacial + Chemical Peel + LED Light Therapy. Save $150!</p>
                                <Link href="/contact" className="btn-primary w-full">
                                    Book Now
                                </Link>
                            </div>
                            <div className="card p-8 text-center border-2 border-transparent hover:border-primary-200 transition-colors duration-300">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">VIP Membership</h3>
                                <p className="text-3xl font-bold text-primary-600 mb-4">$199/mo</p>
                                <p className="text-gray-600 mb-6">Monthly treatments, exclusive discounts, and priority booking.</p>
                                <Link href="/contact" className="btn-secondary w-full">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">FAQ</span>
                            <h2 className="section-heading mt-2">Common Questions</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I know which treatment is right for me?</h3>
                                <p className="text-gray-600">We offer complimentary consultations where our experts will assess your concerns, discuss your goals, and recommend the most appropriate treatments for your unique needs.</p>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Are the treatments painful?</h3>
                                <p className="text-gray-600">Most of our treatments involve minimal discomfort. We use topical numbing agents and advanced techniques to ensure your comfort throughout the procedure.</p>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long do results last?</h3>
                                <p className="text-gray-600">Results vary by treatment. Botox typically lasts 3-4 months, fillers 6-18 months, and some laser treatments provide long-lasting results. We&apos;ll discuss specific expectations during your consultation.</p>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is financing available?</h3>
                                <p className="text-gray-600">Yes! We offer flexible financing options through CareCredit and Cherry, allowing you to achieve your aesthetic goals with affordable monthly payments.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10">
                            Book your complimentary consultation today and let us create a personalized 
                            treatment plan just for you.
                        </p>
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50 transition-colors duration-200 text-lg">
                            Schedule Your Consultation
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Services;
