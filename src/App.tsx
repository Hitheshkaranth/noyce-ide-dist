import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import FeaturedVideoSection from './components/FeaturedVideoSection'
import PhilosophySection from './components/PhilosophySection'
import ServicesSection from './components/ServicesSection'

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  )
}

export default App
