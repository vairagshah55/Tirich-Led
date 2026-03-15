import { motion } from 'motion/react';
import { Cpu, Lightbulb, Smartphone, Wifi, Palette, Shield } from 'lucide-react';
import { SectionShell } from './SectionShell';

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered',
    description: 'Smart algorithms adapt lighting to your preferences and environment',
    color: '#0ea5e9',
  },
  {
    icon: Lightbulb,
    title: 'Energy Efficient',
    description: 'Up to 90% energy savings compared to traditional lighting',
    color: '#f97316',
  },
  {
    icon: Smartphone,
    title: 'App Control',
    description: 'Full control from your smartphone with intuitive interface',
    color: '#3b82f6',
  },
  {
    icon: Wifi,
    title: 'IoT Ready',
    description: 'Seamless integration with smart home ecosystems',
    color: '#fb923c',
  },
  {
    icon: Palette,
    title: '16M Colors',
    description: 'Unlimited creative possibilities with RGB+W technology',
    color: '#0ea5e9',
  },
  {
    icon: Shield,
    title: 'Built to Last',
    description: '50,000+ hours lifespan with premium components',
    color: '#f97316',
  },
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <SectionShell id="features" className="py-32 px-6 scroll-mt-20 bg-slate-950">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Features</p>
              <h2 className="text-4xl md:text-5xl mb-4" style={{ fontWeight: 700 }}>
                Built for Real-World Performance
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Every system is engineered to deliver measurable efficiency, reliability, and control.
              </p>
            </div>
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Tested for commercial and residential deployments.
            </motion.div>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group h-full"
              >
                <motion.div
                  className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/70 overflow-hidden h-full"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}15 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon with glow effect */}
                  <motion.div
                    className="relative mb-6 inline-flex p-4 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: feature.color }} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl mb-3" style={{ fontWeight: 600 }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at top right, ${feature.color}20 0%, transparent 70%)`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500K+', label: 'Installations' },
            { value: '98%', label: 'Satisfaction' },
            { value: '24/7', label: 'Support' },
            { value: '10Y', label: 'Warranty' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                className="text-4xl md:text-5xl mb-2"
                style={{ 
                  fontWeight: 700,
                  color: index % 2 === 0 ? '#e2e8f0' : '#f8fafc',
                }}
                variants={itemVariants}
              >
                {stat.value}
              </motion.div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}
