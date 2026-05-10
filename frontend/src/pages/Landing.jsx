import React from 'react';
import { motion } from 'framer-motion';
import { useAuth, SignInButton } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play, Image, Film, Lightbulb } from 'lucide-react';
import FadingVideo from '../components/FadingVideo';
import BlurText from '../components/BlurText';

export default function Landing() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  if (isLoaded && isSignedIn) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="w-full text-white font-body selection:bg-white/30 relative">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-4 inset-x-0 px-4 md:px-8 lg:px-16 z-50 flex items-center justify-between box-border">
        <div className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center font-heading italic text-2xl">
          r
        </div>

        <div className="hidden lg:flex liquid-glass px-1.5 py-1.5 items-center gap-1">
          <a href="#" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">Home</a>
          <a href="#capabilities" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">Capabilities</a>
          <a href="#" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">Process</a>
          <a href="#" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">Impact</a>
          
          <SignInButton mode="modal">
            <button className="bg-white text-black ml-2 px-4 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1 hover:bg-white/90 transition-colors">
              Start Recycling <ArrowUpRight className="h-4 w-4" />
            </button>
          </SignInButton>
        </div>

        <div className="w-12 h-12 invisible"></div>
      </nav>

      {/* ─── Section 1: Hero ─── */}
      <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col">
        <FadingVideo 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: "120%", height: "120%" }}
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4">
          <motion.div 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="liquid-glass rounded-full flex items-center pr-3 mb-8"
          >
            <div className="bg-white text-black px-3 py-1 text-xs font-semibold mr-3">New</div>
            <span className="text-sm text-white/90">Smart AI E-Waste Classification Live</span>
          </motion.div>

          <BlurText 
            text="Transform E-Waste into Infinite Possibilities"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-4xl text-center tracking-[-4px] px-2"
          />

          <motion.p 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="mt-6 text-sm md:text-base text-white max-w-2xl text-center font-body font-light leading-tight"
          >
            Manage electronic waste in ways once unimaginable. Our AI-driven classification and instant buyer matching bring sustainable recycling within reach—secure and effortless.
          </motion.p>

          <motion.div 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 w-full sm:w-auto px-4"
          >
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto justify-center liquid-glass-strong px-5 py-3 sm:py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                Identify Your Device <ArrowUpRight className="h-5 w-5" />
              </button>
            </SignInButton>
            
            <button className="w-full sm:w-auto justify-center text-white text-sm font-medium flex items-center gap-2 py-2 hover:text-white/80 transition-colors">
              See How It Works <Play className="h-4 w-4 fill-current" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
            className="flex flex-col sm:flex-row items-stretch gap-4 mt-10 sm:mt-12 w-full max-w-xs sm:max-w-none"
          >
            <div className="liquid-glass p-5 w-full sm:w-[220px] rounded-[1.25rem]">
              <svg className="h-7 w-7 mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-heading italic text-4xl tracking-[-1px] leading-none text-white">&lt; 10s</div>
              <div className="text-xs text-white/80 font-light mt-2">Average Match Time</div>
            </div>
            
            <div className="liquid-glass p-5 w-full sm:w-[220px] rounded-[1.25rem]">
              <svg className="h-7 w-7 mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-heading italic text-4xl tracking-[-1px] leading-none text-white">12+</div>
              <div className="text-xs text-white/80 font-light mt-2">Verified Recyclers</div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="relative z-10 flex flex-col items-center gap-4 pb-8"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white/90">
            Collaborating with top recycling pioneers
          </div>
          <div className="flex flex-wrap justify-center font-heading italic text-white/80 text-xl sm:text-2xl md:text-3xl tracking-tight gap-4 sm:gap-8 md:gap-16 px-4">
            <span>GreenTech</span>
            <span>EcoMobile</span>
            <span>CircuitHarvest</span>
            <span>PowerCell</span>
            <span>ReUse</span>
          </div>
        </motion.div>
      </section>

      {/* ─── Section 2: Capabilities ─── */}
      <section id="capabilities" className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
        <FadingVideo 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 px-4 md:px-16 lg:px-20 pt-20 pb-10 flex flex-col min-h-screen">
          <div className="mb-auto">
            <p className="text-xs sm:text-sm font-body text-white/80 mb-4 sm:mb-6 uppercase tracking-widest">// Capabilities</p>
            <h2 className="font-heading italic text-white text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
              Recycling<br/>evolved
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Card 1 */}
            <div className="liquid-glass p-6 min-h-[360px] flex flex-col rounded-[1.25rem]">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center">
                  <Image className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Deep CNN</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Image Rec</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Real-time</span>
                </div>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">Instant Classification</h3>
                <p className="mt-3 text-sm text-white/90 font-light leading-snug max-w-[32ch]">
                  Our AI analyzes your e-waste photo in milliseconds, categorizing it perfectly from smartphones to complex circuit boards.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="liquid-glass p-6 min-h-[360px] flex flex-col rounded-[1.25rem]">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center">
                  <Film className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Smart Filter</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Specialized</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Geo-ready</span>
                </div>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">Buyer Matching</h3>
                <p className="mt-3 text-sm text-white/90 font-light leading-snug max-w-[32ch]">
                  Instantly filter through our directory to find verified recyclers and buyers specifically searching for your item category.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="liquid-glass p-6 min-h-[360px] flex flex-col rounded-[1.25rem]">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Circular Economy</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Zero Landfill</span>
                  <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90">Secure</span>
                </div>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">Sustainable Impact</h3>
                <p className="mt-3 text-sm text-white/90 font-light leading-snug max-w-[32ch]">
                  Join the circular economy. Securely dispose of lithium batteries and toxic components, preventing them from reaching landfills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
