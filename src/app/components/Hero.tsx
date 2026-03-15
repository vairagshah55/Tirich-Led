import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useRef } from 'react';

export function Hero() {
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

    const project = (x: number, y: number, z: number) => {
      const depth = 520;
      const scale = depth / (depth + z);
      return { x: x * scale, y: y * scale, scale };
    };

    const rotate = (x: number, y: number, z: number, ax: number, ay: number) => {
      // Rotate around X then Y
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      let x1 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      return { x: x1, y: y1, z: z2 };
    };

    const cubePoints = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const drawHoloCore = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;

      const t = frame * 0.01;
      const ax = 0.6 + Math.sin(t * 0.7) * 0.1;
      const ay = t * 0.9;
      const size = 140;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Soft glow base
      const baseGlow = ctx.createRadialGradient(0, 0, 20, 0, 0, 220);
      baseGlow.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
      baseGlow.addColorStop(0.4, 'rgba(14, 165, 233, 0.12)');
      baseGlow.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = baseGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.fill();

      // Rotating cube wireframe
      const projected = cubePoints.map(([x, y, z]) => {
        const r = rotate(x * size, y * size, z * size, ax, ay);
        const p = project(r.x, r.y, r.z + 140);
        return { x: p.x, y: p.y, z: r.z, scale: p.scale };
      });

      ctx.lineWidth = 1.2;
      cubeEdges.forEach(([a, b], idx) => {
        const p1 = projected[a];
        const p2 = projected[b];
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, idx % 2 === 0 ? '#0ea5e9' : '#f97316');
        gradient.addColorStop(1, idx % 2 === 0 ? '#3b82f6' : '#fb923c');
        ctx.strokeStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = idx % 2 === 0 ? 'rgba(14, 165, 233, 0.6)' : 'rgba(249, 115, 22, 0.6)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Orbiting ring of particles
      const ringCount = 36;
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2 + t;
        const x = Math.cos(angle) * 200;
        const z = Math.sin(angle) * 200;
        const y = Math.sin(angle * 2 + t) * 30;
        const r = rotate(x, y, z, ax * 0.6, ay * 1.1);
        const p = project(r.x, r.y, r.z + 200);
        const radius = 2.2 + p.scale * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#f97316' : '#0ea5e9';
        ctx.globalAlpha = 0.6 + p.scale * 0.4;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Core sphere
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 45);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.4, '#0ea5e9');
      core.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      frame++;
      animationFrameId = requestAnimationFrame(drawHoloCore);
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    drawHoloCore();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
            y: yBackground 
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            y: useTransform(scrollY, [0, 1000], [0, -300])
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left">
            {/* Logo/Brand with glow effect */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-block"
            >
              {/* <motion.div
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
                whileHover={{ scale: 1.05, borderColor: 'rgba(14, 165, 233, 0.5)' }}
              >
               
              </motion.div> */}
            </motion.div>

            {/* Main heading with 3D effect */}
            <motion.div
              style={{ opacity: opacityText }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h1 className="text-6xl md:text-8xl mb-8 tracking-tighter relative z-20 font-bold">
                <motion.span
                  className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-2"
                  style={{
                    textShadow: '0 0 40px rgba(14, 165, 233, 0.2)'
                  }}
                >
                  Illuminate
                </motion.span>
                
                <motion.span
                  className="block relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary"
                  style={{ 
                    backgroundSize: '200% auto',
                  }}
                  animate={{
                    backgroundPosition: ['0% center', '200% center'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  The Future
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              style={{ opacity: opacityText }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Next-generation LED technology that transforms spaces with{' '}
              <span className="text-foreground font-semibold">intelligent lighting</span> and{' '}
              <span className="text-foreground font-semibold">infinite possibilities</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-20"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-lg px-8 py-7 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                onClick={(e) => handleCtaClick(e, '#products')}
              >
                Explore Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:text-white/80 text-lg px-8 py-7 rounded-full border border-white/10 hover:bg-white/5 backdrop-blur-sm transition-all hover:scale-105"
                onClick={(e) => handleCtaClick(e, '#technology')}
              >
                View Technology
              </Button>
            </motion.div>
          </div>

          {/* Right Column: 3D Animation */}
          <motion.div 
            className="hidden lg:flex justify-center items-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <canvas
              ref={canvasRef}
              width="500"
              height="500"
              className="max-w-full h-auto"
              style={{
                filter: 'drop-shadow(0 0 50px rgba(14, 165, 233, 0.4))',
              }}
            />
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
        </motion.div>
      </div>

      {/* Perspective Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{
            perspective: '500px',
          }}
        >
          <motion.div
            className="absolute inset-0 origin-bottom"
            style={{
              rotateX: '60deg',
              backgroundImage: 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.1) 50%, rgba(14, 165, 233, 0.3))',
              backgroundSize: '100% 100%',
            }}
          >
            <div 
              className="w-full h-[200%] absolute top-[-50%]"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'translateZ(0)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
