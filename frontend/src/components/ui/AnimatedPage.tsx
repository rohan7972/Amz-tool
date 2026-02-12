import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
};