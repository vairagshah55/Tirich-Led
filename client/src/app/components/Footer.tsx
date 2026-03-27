import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Linkedin, Instagram, Twitter, Zap } from 'lucide-react';
import { SectionShell } from './SectionShell';

export function Footer() {
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionShell
      as="footer"
      className="py-20 px-6 border-t border-border/50 bg-slate-950"
      showBackground
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-secondary/5 pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div variants={itemVariant}>
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="text-2xl font-semibold">
                <span className="text-primary">TIRI</span>
                <span className="text-secondary">CH</span>
              </span>
            </motion.div>
            <p className="text-muted-foreground mb-4">
              Illuminating the future with cutting-edge LED technology and innovative design.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: Twitter },
                { name: 'LinkedIn', icon: Linkedin },
                { name: 'Instagram', icon: Instagram },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className="group w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border flex items-center justify-center hover:border-primary transition-colors"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariant}>
            <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>Products</h3>
            <ul className="space-y-2">
              {['LED Strip Pro', 'Panel Matrix X', 'Smart Hub', 'Neon Flex'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#products"
                    onClick={(e) => handleNavClick(e, '#products')}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariant}>
            <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Installation Guide', 'Support', 'Downloads'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="text-muted-foreground hover:text-secondary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariant}>
            <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <span>info@brbled.com</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-secondary mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>123 Innovation Drive<br />Tech Valley, CA 94000</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div className="pt-8 border-t border-border/50" variants={itemVariant}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Tirich LED. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, #0ea5e9, #f97316, #0ea5e9)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
    </SectionShell>
  );
}
