import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterEffectProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  className = "",
  style = {},
  onComplete,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (texts.length === 0 || isCompleted) return;

    const currentFullText = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentText.length < currentFullText.length) {
            setCurrentText(currentFullText.slice(0, currentText.length + 1));
          } else {
            // Finished typing, start pause before deleting
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            // Finished deleting
            setIsDeleting(false);
            const nextIndex = (currentTextIndex + 1) % texts.length;

            if (!loop && nextIndex === 0) {
              setIsCompleted(true);
              onComplete?.();
              return;
            }

            setCurrentTextIndex(nextIndex);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    texts,
    speed,
    deleteSpeed,
    pauseDuration,
    loop,
    isCompleted,
    onComplete,
  ]);

  return (
    <div className={`typewriter-effect ${className}`} style={style}>
      <span className="typewriter-text">
        {currentText}
        <motion.span
          className="typewriter-cursor"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            borderRight: "2px solid currentColor",
            paddingRight: "1px",
            marginLeft: "1px",
          }}
        >
          |
        </motion.span>
      </span>
    </div>
  );
};

export default TypewriterEffect;
