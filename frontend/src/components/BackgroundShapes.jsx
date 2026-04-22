import React from 'react';
import { motion } from 'framer-motion';

const BackgroundShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mesh Shape 1 */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.03) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      {/* Mesh Shape 2 */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.02) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />
      
      {/* Center Depth Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
           style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, transparent 80%)' }} />
    </div>
  );
};

export default BackgroundShapes;
