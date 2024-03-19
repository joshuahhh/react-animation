import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef } from "react";


export const description = <>
  <h3>Amelia's React version, using React Spring</h3>
  <small>
    The "after" from Amelia's post. No D3.
    Instead, draw a component in each postion
    which uses a React "ref" to detect when a circle enters or exits that position.
    The library React Spring handles animation.
  </small>
</>;

export function Demo ({ visibleCircles, allCircles }: {
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

function AnimatedCircle({ index, isShowing }: {
  index: number,
  isShowing: boolean,
}) {
  const wasShowing = useRef(false);

  useEffect(() => {
    wasShowing.current = isShowing
  }, [isShowing]);

  const style = useSpring({
    config: {
      duration: 1200,
    },
    r: isShowing ? 6 : 0,
    opacity: isShowing ? 1 : 0,
  });

  return (
    <animated.circle {...style}
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
