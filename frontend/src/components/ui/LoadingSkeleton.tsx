import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton, Stack, Group } from '@mantine/core';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'chart' | 'form';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1 
}) => {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear' as const
      }
    }
  };

  const renderCardSkeleton = () => (
    <motion.div
      variants={shimmer}
      animate="animate"
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '8px',
        padding: '16px'
      }}
    >
      <Stack gap="md">
        <Skeleton height={20} width="60%" />
        <Skeleton height={40} />
        <Group>
          <Skeleton height={16} width="30%" />
          <Skeleton height={16} width="40%" />
        </Group>
      </Stack>
    </motion.div>
  );

  const renderTableSkeleton = () => (
    <Stack gap="xs">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Group>
            <Skeleton height={16} width="20%" />
            <Skeleton height={16} width="30%" />
            <Skeleton height={16} width="25%" />
            <Skeleton height={16} width="15%" />
          </Group>
        </motion.div>
      ))}
    </Stack>
  );

  const renderChartSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stack gap="md">
        <Skeleton height={200} />
        <Group>
          <Skeleton height={12} width="15%" />
          <Skeleton height={12} width="20%" />
          <Skeleton height={12} width="18%" />
        </Group>
      </Stack>
    </motion.div>
  );

  const renderFormSkeleton = () => (
    <Stack gap="md">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Stack gap="xs">
            <Skeleton height={14} width="20%" />
            <Skeleton height={36} />
          </Stack>
        </motion.div>
      ))}
    </Stack>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'chart':
      return renderChartSkeleton();
    case 'form':
      return renderFormSkeleton();
    default:
      return renderCardSkeleton();
  }
};