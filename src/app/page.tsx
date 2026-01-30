import Mascot from '../components/mascots/Mascot';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Hello Gorgeous Med Spa</h1>
        <p className="text-lg text-center mb-12">
          Experience luxury and wellness in a premium medical spa environment.
        </p>
        <div className="text-center">
          <button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
            Book Your Appointment
          </button>
        </div>
      </main>
      <Mascot
        name="Peppi"
        imageSrc="https://via.placeholder.com/150x150.png?text=Peppi"
        ctaText="Ask Peppi a Question"
      />
    </div>
  );
}
