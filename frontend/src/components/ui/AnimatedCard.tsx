import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardProps } from '@mantine/core';
import { cardHover } from '../../animations';

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  enableHover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  enableHover = true,
  ...props 
}) => {
  return (
    <motion.div
      variants={enableHover ? cardHover : undefined}
      whileHover={enableHover ? "hover" : undefined}
      style={{ height: '100%' }}
    >
      <Card
        {...props}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          height: '100%',
          ...props.style
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};