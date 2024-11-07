import { AnimatePresence, motion } from "framer-motion";

export function LettersFramer({ letters }: { letters: string[] }) {
  return (
    <svg
      viewBox="0 0 400 33"
      style={{
        display: "block",
        fontFamily: "sans-serif",
        fontSize: 10,
      }}
    >
      <AnimatePresence initial={true}>
        {letters.map((d, i) => (
          <motion.text
            key={d}
            dy="0.35em"
            initial={{ y: -7, x: i * 17 }}
            animate={{ y: 17, x: i * 17 }}
            exit={{ y: 41 }}
            transition={{ duration: 0.75 }}
          >
            {d}
          </motion.text>
        ))}
      </AnimatePresence>
    </svg>
  );
}
