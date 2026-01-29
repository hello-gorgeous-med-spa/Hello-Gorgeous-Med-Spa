import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const services = [
    {
        title: 'Botox & Fillers',
        description: 'Smooth wrinkles and restore volume with our expertly administered injectables for a refreshed, youthful appearance.',
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        title: 'Laser Treatments',
        description: 'Advanced laser technology for skin resurfacing, hair removal, and pigmentation correction with minimal downtime.',
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Facial Treatments',
        description: 'Customized facials including HydraFacial, chemical peels, and microneedling for radiant, healthy skin.',
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        title: 'Body Contouring',
        description: 'Non-invasive body sculpting treatments to help you achieve your ideal silhouette without surgery.',
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
    },
];

const testimonials = [
    {
        name: 'Sarah M.',
        role: 'Regular Client',
        content: 'Hello Gorgeous has completely transformed my skin! The staff is incredibly knowledgeable and the results speak for themselves. I feel like a new person.',
        rating: 5,
    },
    {
        name: 'Jennifer L.',
        role: 'First-time Client',
        content: 'From the moment I walked in, I felt welcomed and cared for. The consultation was thorough and the treatment exceeded my expectations.',
        rating: 5,
    },
    {
        name: 'Michelle K.',
        role: 'VIP Member',
        content: 'I\'ve been coming here for over a year and I wouldn\'t go anywhere else. The quality of care and attention to detail is unmatched.',
        rating: 5,
    },
];

const Home: React.FC = () => {
    return (
        <>
            <Head>
                <title>Hello Gorgeous Med Spa | Premium Aesthetic Treatments</title>
                <meta name="description" content="Experience luxury aesthetic treatments at Hello Gorgeous Med Spa. Botox, fillers, laser treatments, and more. Book your consultation today." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-200 rounded-full opacity-20 blur-3xl"></div>
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            Welcome to Hello Gorgeous
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            Discover Your
                            <span className="block text-primary-600">Natural Beauty</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                            Experience the perfect blend of medical expertise and spa luxury. 
                            Our personalized treatments help you look and feel your absolute best.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                                Book Consultation
                            </Link>
                            <Link href="/services" className="btn-secondary text-lg px-8 py-4">
                                Explore Services
                            </Link>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-primary-600">10+</p>
                                <p className="text-gray-600 text-sm md:text-base">Years Experience</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-primary-600">5000+</p>
                                <p className="text-gray-600 text-sm md:text-base">Happy Clients</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-primary-600">50+</p>
                                <p className="text-gray-600 text-sm md:text-base">Treatments</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Our Services</span>
                            <h2 className="section-heading mt-2">Premium Aesthetic Treatments</h2>
                            <p className="section-subheading">
                                From subtle enhancements to transformative treatments, we offer a comprehensive 
                                range of services tailored to your unique beauty goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, index) => (
                                <div 
                                    key={index} 
                                    className="card p-8 text-center group hover:bg-primary-50 transition-colors duration-300"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/services" className="btn-primary">
                                View All Services
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Preview Section */}
                <section className="py-20 bg-gradient-to-br from-secondary-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">About Us</span>
                                <h2 className="section-heading mt-2">Where Science Meets Beauty</h2>
                                <p className="text-gray-600 mb-6">
                                    At Hello Gorgeous Med Spa, we believe everyone deserves to feel confident and 
                                    beautiful in their own skin. Our team of board-certified professionals combines 
                                    cutting-edge technology with personalized care to deliver exceptional results.
                                </p>
                                <p className="text-gray-600 mb-8">
                                    From your first consultation to your final treatment, we&apos;re committed to 
                                    providing a luxurious, comfortable experience that exceeds your expectations.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Board-certified medical professionals
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        State-of-the-art technology
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Personalized treatment plans
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Luxurious, relaxing environment
                                    </li>
                                </ul>
                                <Link href="/about" className="btn-primary">
                                    Learn More About Us
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-primary-200 to-gold-200 rounded-2xl aspect-square flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-2xl font-serif font-semibold text-gray-800">
                                            &quot;Beauty begins the moment you decide to be yourself.&quot;
                                        </p>
                                        <p className="text-gray-600 mt-4">- Coco Chanel</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Testimonials</span>
                            <h2 className="section-heading mt-2">What Our Clients Say</h2>
                            <p className="section-subheading">
                                Don&apos;t just take our word for it. Here&apos;s what our amazing clients have to say about their experience.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="card p-8">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 italic">&quot;{testimonial.content}&quot;</p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-primary-600 font-semibold">{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Ready to Start Your Beauty Journey?
                        </h2>
                        <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10">
                            Book your complimentary consultation today and discover how we can help you 
                            achieve your aesthetic goals.
                        </p>
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50 transition-colors duration-200 text-lg">
                            Schedule Your Free Consultation
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Home;
