import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import PerformanceExplainer from './components/PerformanceExplainer';
import Compare from './components/Compare';
import Builder from './components/Builder';
import InstallGuide from './components/InstallGuide';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night-900 text-slate-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PerformanceExplainer />
        <Compare />
        <Builder />
        <InstallGuide />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
