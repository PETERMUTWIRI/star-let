'use client';

import { motion } from 'framer-motion';
import MusicVisualizer, { Equalizer, SoundWave } from '@/components/MusicVisualizer';
import AnimatedCounter, { StatCard } from '@/components/AnimatedCounter';
import MagneticButton, { GlowButton, FloatingButton } from '@/components/MagneticButton';
import TextScramble, { Typewriter, GradientText } from '@/components/TextScramble';
import { TiltCard, HoverRevealCard, BentoItem, ParallaxCard } from '@/components/AnimatedCard';
import LoadingSpinner, { MusicNoteLoader, DotsLoader } from '@/components/LoadingSpinner';
import ScrollReveal, { StaggerContainer, StaggerItem, ScaleIn } from '@/components/ScrollReveal';
import { FaMusic, FaUsers, FaCalendar, FaHeadphones } from 'react-icons/fa';

export default function DemoPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <ScaleIn>
            <h1 className="text-6xl font-bold mb-4">
              <GradientText>Animation Demo</GradientText>
            </h1>
          </ScaleIn>
          
          <StaggerContainer className="flex flex-wrap justify-center gap-4">
            <StaggerItem>
              <GlowButton>Primary Button</GlowButton>
            </StaggerItem>
            <StaggerItem>
              <GlowButton variant="secondary">Secondary</GlowButton>
            </StaggerItem>
            <StaggerItem>
              <GlowButton variant="outline">Outline</GlowButton>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Music Visualizers */}
        <section>
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center">Music Visualizers</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white/5 rounded-2xl p-8 text-center">
                <p className="text-sm text-gray-400 mb-4">Music Visualizer</p>
                <div className="flex justify-center">
                  <MusicVisualizer isPlaying barCount={7} />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <div className="bg-white/5 rounded-2xl p-8 text-center">
                <p className="text-sm text-gray-400 mb-4">Equalizer</p>
                <div className="flex justify-center">
                  <Equalizer />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <div className="bg-white/5 rounded-2xl p-8 text-center">
                <p className="text-sm text-gray-400 mb-4">Sound Wave</p>
                <div className="flex justify-center">
                  <SoundWave />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Animated Counters */}
        <section>
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center">Animated Counters</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FaMusic}
              value={42}
              label="Songs Released"
              suffix="+"
            />
            <StatCard
              icon={FaUsers}
              value={1250000}
              label="Monthly Listeners"
              suffix="+"
            />
            <StatCard
              icon={FaCalendar}
              value={156}
              label="Concerts Performed"
            />
            <StatCard
              icon={FaHeadphones}
              value={50}
              label="Million Streams"
              suffix="M+"
            />
          </div>
        </section>

        {/* Text Effects */}
        <section className="text-center space-y-12">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8">Text Effects</h2>
          </ScrollReveal>
          
          <div className="space-y-6">
            <div className="text-2xl">
              <span className="text-gray-400">Scramble: </span>
              <TextScramble text="STARLET MUSIC" className="text-cyan-400 font-bold" />
            </div>
            
            <div className="text-2xl">
              <span className="text-gray-400">Typewriter: </span>
              <Typewriter text="Creating soulful melodies..." className="text-purple-400" />
            </div>
            
            <div className="text-2xl">
              <span className="text-gray-400">Gradient: </span>
              <GradientText className="font-bold">Vibrant Colors</GradientText>
            </div>
          </div>
        </section>

        {/* Interactive Cards */}
        <section>
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center">Interactive Cards</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltCard className="h-64">
              <div className="h-full rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 p-6 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">3D Tilt Card</h3>
                  <p className="text-gray-400 text-sm">Hover to see the effect</p>
                </div>
              </div>
            </TiltCard>
            
            <HoverRevealCard
              image="/events/fillmore.jpg"
              title="The Fillmore"
              subtitle="San Francisco, CA"
            />
            
            <BentoItem className="h-64">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Bento Grid Item</h3>
                <p className="text-gray-400">Clean, modern card design with hover effects</p>
              </div>
            </BentoItem>
          </div>
        </section>

        {/* Loading States */}
        <section>
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center">Loading States</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white/5 rounded-2xl p-8 text-center space-y-4">
                <p className="text-sm text-gray-400">Spinner</p>
                <div className="flex justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <div className="bg-white/5 rounded-2xl p-8 text-center space-y-4">
                <p className="text-sm text-gray-400">Music Notes</p>
                <div className="flex justify-center">
                  <MusicNoteLoader />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <div className="bg-white/5 rounded-2xl p-8 text-center space-y-4">
                <p className="text-sm text-gray-400">Dots</p>
                <div className="flex justify-center">
                  <DotsLoader />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Magnetic Button Demo */}
        <section className="text-center space-y-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8">Magnetic Buttons</h2>
          </ScrollReveal>
          
          <div className="flex flex-wrap justify-center gap-8">
            <MagneticButton>
              <motion.button
                className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Magnetic Effect
              </motion.button>
            </MagneticButton>
            
            <FloatingButton>
              <FaMusic className="w-6 h-6" />
            </FloatingButton>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-white/5 rounded-2xl p-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`// Import components
import MusicVisualizer from '@/components/MusicVisualizer';
import AnimatedCounter from '@/components/AnimatedCounter';
import { GlowButton } from '@/components/MagneticButton';
import TextScramble from '@/components/TextScramble';

// Use in your JSX
<MusicVisualizer isPlaying barCount={5} />
<AnimatedCounter end={1000} suffix="+" />
<GlowButton variant="primary">Click Me</GlowButton>
<TextScramble text="Hello World" />`}</code>
            </pre>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
