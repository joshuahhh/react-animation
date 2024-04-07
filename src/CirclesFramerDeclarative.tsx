import { AnimatePresence, motion } from "framer-motion";

export const description = <>
  <h3>Framer: Declarative API</h3>
  <small>
    The way you're supposed to use Framer Motion.
    To replicate the demo's "color during transition" behavior, we use some abrupt easing curves.
    Note different behavior: blue goes away when the animation ends.
    {/* That's because "enter animation" is different from "between enter and update". */}
    {/* Frankly, I think "between enter and update" is a weird thing to want */}
  </small>
</>;

function atEnd(t: number) {
  return t >= 1 ? 1 : 0;
}

function atStart(t: number) {
  return t <= 0 ? 0 : 1;
}

export function Demo ({ visibleCircles }: {
  visibleCircles: number[],
}) {
  const duration = 1.2;
  return <svg viewBox="0 0 100 20">
    <AnimatePresence initial={false}>
      {visibleCircles.map(d =>
        <motion.circle
          key={d}
          initial={{ r: 0, opacity: 0, fill: "#6495ED" }}
          animate={{ r: 6, opacity: 1, fill: "#D3D3D3", transition: { duration, fill: { ease: atEnd, duration } } }}
          exit={{ r: 0, opacity: 0, fill: "#FF6347", transition: { duration, fill: { ease: atStart, duration } } }}
          cx={d * 15 + 10}
          cy="10"
        />
      )}
    </AnimatePresence>
  </svg>
}
