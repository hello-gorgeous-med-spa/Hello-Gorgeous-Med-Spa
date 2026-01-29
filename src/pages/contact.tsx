import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const services = [
    'Botox & Fillers',
    'Laser Hair Removal',
    'Laser Skin Resurfacing',
    'HydraFacial',
    'Chemical Peels',
    'Microneedling',
    'Body Contouring',
    'IV Therapy',
    'Other / Not Sure',
];

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        preferredContact: 'email',
        newsletter: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <>
            <Head>
                <title>Contact Us | Hello Gorgeous Med Spa</title>
                <meta name="description" content="Book your consultation at Hello Gorgeous Med Spa. Contact us today to start your journey to looking and feeling your best." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            Contact Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
                            Let&apos;s Start Your Journey
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Ready to discover your best self? Book your complimentary consultation today 
                            or reach out with any questions. We&apos;re here to help.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Contact Info */}
                            <div className="lg:col-span-1">
                                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">Get in Touch</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                                            <p className="text-gray-600">
                                                123 Beauty Lane, Suite 100<br />
                                                Los Angeles, CA 90001
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                                            <p className="text-gray-600">(555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                                            <p className="text-gray-600">hello@hellogorgeousmedspa.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                                            <p className="text-gray-600">
                                                Mon - Fri: 9:00 AM - 7:00 PM<br />
                                                Saturday: 9:00 AM - 5:00 PM<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mt-8">
                                    <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                                    <div className="flex space-x-4">
                                        <a href="#" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors duration-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors duration-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors duration-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="card p-8">
                                    {isSubmitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Thank You!</h2>
                                            <p className="text-gray-600 mb-6">
                                                Your message has been received. A member of our team will be in touch 
                                                within 24 hours to confirm your consultation.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setIsSubmitted(false);
                                                    setFormData({
                                                        firstName: '',
                                                        lastName: '',
                                                        email: '',
                                                        phone: '',
                                                        service: '',
                                                        message: '',
                                                        preferredContact: 'email',
                                                        newsletter: false,
                                                    });
                                                }}
                                                className="btn-primary"
                                            >
                                                Send Another Message
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                                                Book Your Free Consultation
                                            </h2>
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                                            First Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                            placeholder="Enter your first name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Last Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                            placeholder="Enter your last name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email Address *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                            placeholder="you@example.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone Number *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                            placeholder="(555) 123-4567"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Service of Interest
                                                    </label>
                                                    <select
                                                        id="service"
                                                        name="service"
                                                        value={formData.service}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                    >
                                                        <option value="">Select a service</option>
                                                        {services.map((service) => (
                                                            <option key={service} value={service}>
                                                                {service}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Message
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                                                        placeholder="Tell us about your goals or any questions you have..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Preferred Contact Method
                                                    </label>
                                                    <div className="flex space-x-6">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="preferredContact"
                                                                value="email"
                                                                checked={formData.preferredContact === 'email'}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                            />
                                                            <span className="ml-2 text-gray-700">Email</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="preferredContact"
                                                                value="phone"
                                                                checked={formData.preferredContact === 'phone'}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                            />
                                                            <span className="ml-2 text-gray-700">Phone</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="preferredContact"
                                                                value="text"
                                                                checked={formData.preferredContact === 'text'}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                            />
                                                            <span className="ml-2 text-gray-700">Text</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="flex items-start cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="newsletter"
                                                            checked={formData.newsletter}
                                                            onChange={handleChange}
                                                            className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            I&apos;d like to receive news about special offers, promotions, and beauty tips.
                                                        </span>
                                                    </label>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center justify-center">
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                            Submitting...
                                                        </span>
                                                    ) : (
                                                        'Request Consultation'
                                                    )}
                                                </button>

                                                <p className="text-sm text-gray-500 text-center">
                                                    By submitting this form, you agree to our privacy policy. 
                                                    We&apos;ll never share your information.
                                                </p>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-16 bg-gradient-to-br from-secondary-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="section-heading">Find Us</h2>
                            <p className="text-gray-600">
                                Conveniently located in the heart of Los Angeles with free parking available.
                            </p>
                        </div>
                        <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-gray-500">Interactive map would be displayed here</p>
                                <p className="text-gray-400 text-sm mt-2">123 Beauty Lane, Suite 100, Los Angeles, CA 90001</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Contact;
