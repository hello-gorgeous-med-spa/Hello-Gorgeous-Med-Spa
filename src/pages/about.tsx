import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const team = [
    {
        name: 'Dr. Emily Chen',
        role: 'Medical Director',
        bio: 'Board-certified dermatologist with over 15 years of experience in aesthetic medicine.',
    },
    {
        name: 'Jessica Martinez',
        role: 'Lead Aesthetician',
        bio: 'Licensed aesthetician specializing in advanced skincare treatments and laser therapy.',
    },
    {
        name: 'Dr. Michael Roberts',
        role: 'Cosmetic Physician',
        bio: 'Expert in injectable treatments with a focus on natural-looking results.',
    },
    {
        name: 'Amanda Thompson',
        role: 'Patient Coordinator',
        bio: 'Dedicated to ensuring every client receives personalized care and attention.',
    },
];

const values = [
    {
        title: 'Excellence',
        description: 'We are committed to providing the highest quality treatments using the latest technology and techniques.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
    },
    {
        title: 'Safety',
        description: 'Your safety is our top priority. All treatments are performed by licensed, certified professionals.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: 'Personalization',
        description: 'Every treatment plan is customized to your unique needs, goals, and lifestyle.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        title: 'Integrity',
        description: 'We provide honest recommendations and transparent pricing with no hidden fees.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
    },
];

const About: React.FC = () => {
    return (
        <>
            <Head>
                <title>About Us | Hello Gorgeous Med Spa</title>
                <meta name="description" content="Learn about Hello Gorgeous Med Spa, our team of experts, and our commitment to helping you achieve your aesthetic goals." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            About Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
                            Your Beauty, Our Passion
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            At Hello Gorgeous Med Spa, we combine medical expertise with spa luxury to create 
                            a transformative experience that leaves you looking and feeling your absolute best.
                        </p>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1">
                                <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Our Story</span>
                                <h2 className="section-heading mt-2">A Decade of Excellence in Aesthetic Care</h2>
                                <p className="text-gray-600 mb-6">
                                    Founded in 2014, Hello Gorgeous Med Spa was born from a vision to create a space 
                                    where cutting-edge aesthetic treatments meet the warmth and comfort of a luxury spa. 
                                    Our founder, Dr. Emily Chen, recognized that clients deserve more than just results 
                                    &mdash; they deserve an experience.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Today, we&apos;ve grown into one of the most trusted names in aesthetic medicine, 
                                    with thousands of satisfied clients and a reputation for excellence that speaks 
                                    for itself. Our state-of-the-art facility features the latest technology and a 
                                    serene environment designed to put you at ease from the moment you walk through 
                                    our doors.
                                </p>
                                <p className="text-gray-600">
                                    Whether you&apos;re seeking subtle enhancements or transformative treatments, our 
                                    team of experts is here to guide you every step of the way, ensuring natural-looking 
                                    results that enhance your unique beauty.
                                </p>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl aspect-[4/3] flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <p className="text-6xl font-serif font-bold text-primary-700 mb-2">10+</p>
                                        <p className="text-xl text-gray-700">Years of Excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-gradient-to-br from-secondary-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Our Values</span>
                            <h2 className="section-heading mt-2">What We Stand For</h2>
                            <p className="section-subheading">
                                Our core values guide everything we do, from the treatments we offer to the way 
                                we care for each and every client.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Our Team</span>
                            <h2 className="section-heading mt-2">Meet the Experts</h2>
                            <p className="section-subheading">
                                Our team of board-certified professionals brings decades of combined experience 
                                and a genuine passion for helping you achieve your aesthetic goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="card p-6 text-center">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-200 to-gold-200 rounded-full flex items-center justify-center mb-6">
                                        <span className="text-3xl font-serif font-bold text-primary-700">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-primary-600 text-sm font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">Why Choose Us</span>
                                <h2 className="section-heading mt-2">The Hello Gorgeous Difference</h2>
                                <div className="space-y-6 mt-8">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complimentary Consultations</h3>
                                            <p className="text-gray-600">Every journey begins with a free, no-pressure consultation to discuss your goals and create a personalized treatment plan.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                                            <p className="text-gray-600">We invest in the latest FDA-approved equipment and techniques to ensure optimal results and safety.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ongoing Support</h3>
                                            <p className="text-gray-600">Our relationship doesn&apos;t end after your treatment. We provide comprehensive follow-up care and support.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gold-200 to-primary-200 rounded-2xl p-8 text-center">
                                <p className="text-xl font-serif text-gray-800 mb-8">
                                    &quot;We believe that true beauty comes from confidence, and confidence comes 
                                    from feeling comfortable in your own skin.&quot;
                                </p>
                                <p className="font-semibold text-gray-700">Dr. Emily Chen</p>
                                <p className="text-sm text-gray-600">Founder & Medical Director</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Ready to Meet Our Team?
                        </h2>
                        <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10">
                            Schedule your complimentary consultation and discover how we can help you 
                            look and feel your best.
                        </p>
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50 transition-colors duration-200 text-lg">
                            Book Your Consultation
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default About;
