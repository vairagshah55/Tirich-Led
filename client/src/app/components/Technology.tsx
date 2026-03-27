import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { SectionShell } from './SectionShell';

export function Technology() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationFrameId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawLEDChip = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Rotating 3D cube effect
      const rotation = frame * 0.01;
      const size = 150;

      // Draw circuit board base
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Shadow
      ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.fillRect(-size * 1.2, size * 0.8, size * 2.4, 10);

      // LED chip layers
      for (let i = 0; i < 3; i++) {
        const layerSize = size - i * 20;
        const y = -i * 15;
        
        ctx.save();
        ctx.rotate(rotation + i * 0.3);
        
        // Gradient fill
        const gradient = ctx.createLinearGradient(-layerSize, y, layerSize, y);
        if (i % 2 === 0) {
          gradient.addColorStop(0, '#0ea5e9');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#0ea5e9');
        } else {
          gradient.addColorStop(0, '#f97316');
          gradient.addColorStop(0.5, '#fb923c');
          gradient.addColorStop(1, '#f97316');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-layerSize, y - 10, layerSize * 2, 20);
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = i % 2 === 0 ? '#0ea5e9' : '#f97316';
        ctx.strokeStyle = i % 2 === 0 ? '#0ea5e9' : '#f97316';
        ctx.lineWidth = 2;
        ctx.strokeRect(-layerSize, y - 10, layerSize * 2, 20);
        ctx.shadowBlur = 0;
        
        ctx.restore();
      }

      // Connection points
      const points = 8;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 + rotation;
        const radius = size * 1.3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        // Connection line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(14, 165, 233, 0.3)' : 'rgba(249, 115, 22, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Point
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#0ea5e9' : '#f97316';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = i % 2 === 0 ? '#0ea5e9' : '#f97316';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Center core
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.5, '#0ea5e9');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      frame++;
      animationFrameId = requestAnimationFrame(drawLEDChip);
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    drawLEDChip();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <SectionShell id="technology" className="py-32 px-6 overflow-hidden scroll-mt-20 bg-slate-950">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Technology</motion.p>
            <motion.h2Pk variants={itemVariants} className="text-4xl md:text-5xl mb-4" style={{ fontWeight: 700 }}>
              The Engineering Behind Tirich
            </motion.h2Pk>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8">
              Our proprietary LED technology combines cutting-edge semiconductor engineering
              with AI-driven power management for unmatched performance.
            </motion.p>

            <div className="space-y-6">
              {[
                {
                  title: 'Quantum Dot Enhancement',
                  description: 'Advanced QD layer delivers superior color accuracy and brightness',
                  color: '#0ea5e9',
                },
                {
                  title: 'Adaptive Thermal Management',
                  description: 'Intelligent heat dissipation extends lifespan and maintains optimal performance',
                  color: '#f97316',
                },
                {
                  title: 'Precision Optics',
                  description: 'Custom-engineered lenses for perfect light distribution and efficiency',
                  color: '#3b82f6',
                },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <motion.div
                    className="w-1 h-auto rounded-full"
                    style={{ background: tech.color }}
                  />
                  <div>
                    <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>
                      {tech.title}
                    </h3>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-[360px] h-[360px] md:w-[460px] md:h-[460px]"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(14, 165, 233, 0.3))',
                }}
              />
              
              {/* Floating labels */}
              <motion.div
                className="absolute top-6 -left-6 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border border-primary/30"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-sm text-primary">Chip Layer</span>
              </motion.div>
              
              <motion.div
                className="absolute bottom-8 -right-6 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border border-secondary/30"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
              >
                <span className="text-sm text-secondary">Heat Sink</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
