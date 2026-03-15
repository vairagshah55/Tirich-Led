import { ParticleBackground } from './components/ParticleBackground';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { Features } from './components/Features';
import { About } from './components/About';
import { Technology } from './components/Technology';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <Toaster richColors theme="dark" />
        <Navigation />
        
        <main className="pt-20 md:pt-24">
          <Hero />
          <About />
          <ProductShowcase />
          <Features />
          <Technology />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Global styles for smooth scrolling */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
