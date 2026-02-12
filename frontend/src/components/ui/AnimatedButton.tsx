import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@mantine/core';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, ...props }) => {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        {...props}
        style={{
          background: props.variant === 'filled' 
            ? 'linear-gradient(135deg, #228be6 0%, #1971c2 100%)'
            : undefined,
          transition: 'all 0.2s ease',
          ...props.style
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};