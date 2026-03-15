import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SectionShell } from './SectionShell';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'LED Strip Pro',
    description: 'Flexible, intelligent lighting strips with 16 million color options',
    image: 'https://images.unsplash.com/photo-1772992552302-825bb23ffb1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMRUQlMjBzdHJpcCUyMGxpZ2h0cyUyMGJsdWV8ZW58MXx8fHwxNzczNTQ5MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#0ea5e9',
  },
  {
    id: 2,
    name: 'Panel Matrix X',
    description: 'Ultra-thin LED panels for modern architectural lighting',
    image: 'https://images.unsplash.com/photo-1584259432824-3d124136ea4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMRUQlMjBwYW5lbCUyMG1vZGVybiUyMG9yYW5nZXxlbnwxfHx8fDE3NzM1NDkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#f97316',
  },
  {
    id: 3,
    name: 'Smart Hub',
    description: 'AI-powered control center for your entire lighting ecosystem',
    image: 'https://images.unsplash.com/photo-1726638928109-93c8298ea2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGxpZ2h0aW5nJTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3NzM1NDkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#3b82f6',
  },
  {
    id: 4,
    name: 'Neon Flex',
    description: 'Customizable neon-style LED tubes for creative installations',
    image: 'https://images.unsplash.com/photo-1667670778881-537035257bd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzM1NDkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#fb923c',
  },
];

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/70"
        style={{
          rotateX: useTransform(rotateX, (v) => v * 0.6),
          rotateY: useTransform(rotateY, (v) => v * 0.6),
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 24px ${product.color}`,
          }}
        />

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
          
          {/* Border light */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${product.color}33 0%, transparent 50%, ${product.color}33 100%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-2xl mb-2" style={{ fontWeight: 600 }}>{product.name}</h3>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          
          <motion.div
            className="flex items-center gap-2 text-primary"
            animate={isHovered ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* 3D highlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            opacity: 0,
          }}
          animate={isHovered ? { opacity: 0.5 } : { opacity: 0 }}
        />
      </motion.div>
    </motion.div>
  );
}

export function ProductShowcase() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };
  return (
    <SectionShell id="products" className="py-32 px-6 scroll-mt-20 bg-slate-950">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Products</p>
              <h2 className="text-4xl md:text-5xl mb-4" style={{ fontWeight: 700 }}>
                Professional LED Systems
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A curated lineup engineered for performance, efficiency, and clean architectural integration.
              </p>
            </div>
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Certified components. Industry-grade quality.
            </motion.div>
          </div>
        </motion.div>

        {/* Products grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}
