import { themes } from './data/portfolio';
import { About } from './components/sections/About';
import { Achievements } from './components/sections/Achievements';
import { Building } from './components/sections/Building';
import { Coding } from './components/sections/Coding';
import { Education } from './components/sections/Education';
import { Experience } from './components/sections/Experience';
import { Extracurricular } from './components/sections/Extracurricular';
import { FeaturedProjects } from './components/sections/FeaturedProjects';
import { Footer } from './components/sections/Footer';
import { GithubProjects } from './components/sections/GithubProjects';
import { Hero } from './components/sections/Hero';
import { Responsibility } from './components/sections/Responsibility';
import { Skills } from './components/sections/Skills';
import { Nav } from './components/ui/Nav';
import { ScrollWorld } from './components/ScrollWorld';
import { SceneErrorBoundary } from './components/SceneErrorBoundary';
import { InteractionLayer } from './components/InteractionLayer';
import { StatementBand } from './components/StatementBand';

function App() {
  const theme = themes[0];

  return (
    <div className="studio-shell min-h-screen overflow-x-hidden text-white">
      <SceneErrorBoundary>
        <ScrollWorld />
      </SceneErrorBoundary>
      <InteractionLayer />
      <Nav theme={theme} />
      <main className="relative z-10">
        <Hero theme={theme} />
        <FeaturedProjects theme={theme} />
        <Building theme={theme} />
        <StatementBand
          eyebrow="Systems with a point of view"
          lineOne="Build for reality."
          lineTwo="Design for humans."
        />
        <Experience theme={theme} />
        <About theme={theme} />
        <StatementBand
          eyebrow="Range without losing depth"
          lineOne="Code. Models. Motion."
          lineTwo="One product mindset."
          reverse
        />
        <Skills theme={theme} />
        <Coding theme={theme} />
        <Achievements theme={theme} />
        <Education theme={theme} />
        <Responsibility theme={theme} />
        <Extracurricular theme={theme} />
        <GithubProjects theme={theme} />
        <Footer theme={theme} />
      </main>
    </div>
  );
}

export default App;
