import React, { useEffect, useState } from 'react';

const FloatingBubbles = ({ count = 15 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 20 + 15, // 15-35px
          duration: Math.random() * 10 + 15, // 15-25s
          delay: Math.random() * 10, // 0-10s delay
          opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7 opacity
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute animate-bubble gpu-accelerated"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            opacity: bubble.opacity,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.8), 
                rgba(236, 72, 153, ${bubble.opacity}), 
                rgba(190, 24, 93, ${bubble.opacity * 0.8})
              )`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(2px)',
              boxShadow: `
                0 0 10px rgba(236, 72, 153, 0.3),
                inset 0 0 5px rgba(255, 255, 255, 0.2)
              `,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingBubbles;
