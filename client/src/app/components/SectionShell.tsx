import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type SectionShellProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  showBackground?: boolean;
  as?: 'section' | 'footer';
};

export function SectionShell({
  id,
  className,
  children,
  showBackground = true,
  as = 'section',
}: SectionShellProps) {
  const MotionTag = as === 'footer' ? motion.footer : motion.section;
  const classes = ['relative overflow-hidden', className].filter(Boolean).join(' ');

  return (
    <MotionTag
      id={id}
      className={classes}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {showBackground && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-24 -left-24 h-[40vw] w-[40vw] max-w-[520px] max-h-[520px] rounded-full blur-[120px] opacity-15"
            style={{
              background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 h-[45vw] w-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] opacity-15"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.16, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {children}
    </MotionTag>
  );
}
