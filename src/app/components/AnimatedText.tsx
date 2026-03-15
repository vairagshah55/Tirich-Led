import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  gradient: string;
  delay?: number;
}

export function AnimatedText({ text, className = '', gradient, delay = 0 }: AnimatedTextProps) {
  const letters = text.split('');

  return (
    <span className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ 
            opacity: 0, 
            y: 50,
            rotateX: -90,
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
            ease: 'easeOut',
          }}
          style={{
            display: 'inline-block',
            transformStyle: 'preserve-3d',
          }}
          whileHover={{
            scale: 1.2,
            rotateY: 360,
            transition: { duration: 0.5 },
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}
