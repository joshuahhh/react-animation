import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { useEffect } from "react";

export const description = <>
  <h3>Framer: useAnimate</h3>
  <small>
    Using Framer Motion's "useAnimate", an imperative API similar to D3's transitions.
  </small>
</>;

export function Demo ({ visibleCircles }: {
  visibleCircles: number[],
}) {
  return <svg viewBox="0 0 100 20">
    <AnimatePresence>
      {visibleCircles.map(d => (
        <AnimatedCircle
          key={d}
          index={d}
        />
      ))}
    </AnimatePresence>
  </svg>;
}

export function AnimatedCircle({ index }: {
  index: number,
}) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    (async function () {
      if (isPresent) {  // "enter"
        await animate(scope.current,
          { fill: "cornflowerblue", r: 6, opacity: 1 },
          { duration: 1.2 });
        await animate(scope.current,
          { fill: "lightgrey" });
      } else {  // "exit"
        await animate(scope.current,
          { fill: "tomato" });
        await animate(scope.current,
          { opacity: 0, r: 0 },
          { duration: 1.2 });
        safeToRemove();
      }
    })();
  }, [animate, isPresent, safeToRemove, scope]);

  return (
    <circle ref={scope}
      cx={index * 15 + 10}
      cy="10"
      fill="cornflowerblue"
      r={0}
      opacity={0}
    />
  );
}
