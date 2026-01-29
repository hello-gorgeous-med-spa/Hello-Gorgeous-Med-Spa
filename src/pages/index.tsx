import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { FiArrowRight, FiPlay, FiUsers, FiShield, FiHeart } from 'react-icons/fi';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-pink-300/10" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">
                Hello Gorgeous
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Your journey to beauty and wellness starts here. Meet your expert care team and get personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/care-team"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
              >
                <FiUsers className="w-5 h-5" />
                Meet Your Care Team
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-pink-500">Hello Gorgeous</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We combine expert knowledge with personalized care to help you achieve your wellness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Care Team</h3>
              <p className="text-white/60">
                Meet our AI-powered specialists who provide personalized education on aesthetics, wellness, and more.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <FiShield className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Information</h3>
              <p className="text-white/60">
                Get honest, no-BS guidance from experts who tell it like it is. Education first, always.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <FiHeart className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Journey</h3>
              <p className="text-white/60">
                Every person is unique. Get guidance tailored to your specific goals and concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Connect with our expert care team and get the guidance you deserve.
          </p>
          <Link
            href="/care-team"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            <FiPlay className="w-5 h-5" />
            Watch Expert Intros
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-white/50 text-sm">
          <p>© 2026 Hello Gorgeous Med Spa. Education only—book a consult for medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
