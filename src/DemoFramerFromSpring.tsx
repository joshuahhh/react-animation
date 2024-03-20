import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

export const description = <>
  <h3>Framer: From Spring</h3>
  <small>
    Straightforward conversion of Amelia's approach from React Spring to Framer Motion.
    New library, same logic.
  </small>
</>;

export function Demo({ visibleCircles, allCircles }: {
  visibleCircles: number[],
  allCircles: number[],
}) {
  return <svg viewBox="0 0 100 20">
    {allCircles.map(d => (
      <AnimatedCircle
        key={d}
        index={d}
        isShowing={visibleCircles.includes(d)}
      />
    ))}
  </svg>;
}

export function AnimatedCircle({ index, isShowing }: {
  index: number,
  isShowing: boolean,
}) {
  const wasShowing = useRef(false);

  useEffect(() => {
    wasShowing.current = isShowing
  }, [isShowing]);

  return (
    <motion.circle
      transition={{
        duration: 1.2
      }}
      initial={false}
      animate={{
        r: isShowing ? 6 : 0,
        opacity: isShowing ? 1 : 0,
      }}
      cx={index * 15 + 10}
      cy="10"
      fill={
        !isShowing          ? "tomato" :
        !wasShowing.current ? "cornflowerblue" :
                              "lightgrey"
      }
    />
  );
}
