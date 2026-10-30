import Navigation from './components/Navigation';
import ExperienceJourney from './components/ExperienceJourney';
import Introduction from './components/sections/Introduction';
import Portfolio from './components/sections/Portfolio';
import Services from './components/sections/Services';
import Process from './components/sections/Process';
import About from './components/sections/About';
import Finale from './components/sections/Finale';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import useMotion from './hooks/useMotion';
export default function App() {
  useMotion();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <ExperienceJourney />
        <Introduction />
        <Portfolio />
        <Services />
        <Process />
        <About />
        <Finale />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
