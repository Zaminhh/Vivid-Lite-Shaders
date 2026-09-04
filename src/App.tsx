import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import PerformanceExplainer from './components/PerformanceExplainer';
import Compatibility from './components/Compatibility';
import Compare from './components/Compare';
import LagExplainer from './components/LagExplainer';
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
        <LagExplainer />
        <Compatibility />
        <Compare />
        <Builder />
        <InstallGuide />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
