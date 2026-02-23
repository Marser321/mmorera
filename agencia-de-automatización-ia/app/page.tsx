import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesBento from '@/components/ServicesBento';
import ProcessRoadmap from '@/components/ProcessRoadmap';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0e17] selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <ServicesBento />
      <ProcessRoadmap />
      <Footer />
    </main>
  );
}
