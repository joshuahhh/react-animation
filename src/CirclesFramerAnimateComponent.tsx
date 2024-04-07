import { AnimatePresence } from "framer-motion";
import { Animate } from "./Animate";


export function CirclesFramerAnimateComponent ({ visibleCircles }: {
  visibleCircles: number[],
}) {
  return <svg viewBox="0 0 100 20">
    <AnimatePresence>
      {visibleCircles.map(d => (
        <Animate key={d}
          enter={async ({ animate }) => {
            await animate(".", { fill: "cornflowerblue", r: 6, opacity: 1 }, { duration: 1.2 });
            await animate(".", { fill: "lightgrey" });
          }}
          exit={async ({ animate }) => {
            await animate(".", { fill: "tomato" });
            await animate(".", { opacity: 0, r: 0 }, { duration: 1.2 });
          }}
        >
          <circle
            key="hi"
            cx={d * 15 + 10}
            cy="10"
            fill="cornflowerblue"
            r={0}
            opacity={0}
          />
        </Animate>
      ))}
    </AnimatePresence>
  </svg>;
}
