import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { SectionShell } from './SectionShell';
import { CheckCircle2 } from 'lucide-react';

export function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <SectionShell id="about" className="py-24 px-6 bg-slate-950 relative overflow-hidden scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div ref={containerRef} className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image / Visual Side */}
          <motion.div 
            style={{ y }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
                alt="Tirich LED Research Lab" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Floating stats card */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-card/90 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl max-w-xs"
            >
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Years of pioneering research in semiconductor luminescence.</div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={itemVariants} className="text-sm uppercase tracking-[0.3em] text-primary mb-4">
              About Us
            </motion.p>
            
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              We don't just make lights. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                We engineer atmosphere.
              </span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Founded by a team of optical engineers and industrial designers, Tirich LED bridges the gap between commercial reliability and artistic expression. Our mission is to transform how people perceive and interact with their environments through intelligent, adaptive lighting solutions.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4">
              {[
                "Proprietary Color Rendering Engine",
                "Sustainable Manufacturing Processes",
                "End-to-End Smart Home Integration"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/90">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10">
              <button className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 transition-colors">
                Read our full story &rarr;
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
