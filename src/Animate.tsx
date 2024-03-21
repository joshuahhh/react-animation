import { AnimationPlaybackControls, AnimationSequence, useAnimate, usePresence } from "framer-motion";
import { ReactElement, cloneElement, useEffect, useMemo } from "react";


export function Animate({ children, sequence, animator, enter, exit }: {
  children: ReactElement,
  sequence?: AnimationSequence,
  animator?: (props: {
    animate: ReturnType<typeof useAnimate>[1],
    presence: ReturnType<typeof usePresence>,
  }) => Promise<void>,
  enter?: (props: { animate: ReturnType<typeof useAnimate>[1] }) => Promise<void>,
  exit?: (props: { animate: ReturnType<typeof useAnimate>[1] }) => Promise<void>,
}) {
  const presence = usePresence();
  const [scope, animate] = useAnimate();

  const child = useMemo(() => (
    cloneElement(children, { ref: scope })
  ), [children, scope]);

  useEffect(() => {
    if (animator) {
      let cancelled = false;
      const animateWithDot = addDotToAnimate(animate, scope.current);
      let activeAnimations: AnimationPlaybackControls[] = [];
      function animatePatched(...args: any) {
        if (cancelled) {
          throw new Error("Animation was cancelled");
        }
        const controls = animateWithDot.apply(null, args);
        activeAnimations.push(controls);
        return controls;
      }
      // do something when it's done? idk
      animator({ animate: animatePatched, presence });
      return () => {
        activeAnimations.forEach((controls) => controls.stop());
      }
    }
  }, [animate, animator, presence, scope]);

  useEffect(() => {
    if (sequence) {
      const animateWithDot = addDotToAnimate(animate, scope.current);
      const controls = animateWithDot(sequence);
      return () => {
        controls.stop();
      }
    }
  }, [animate, scope, sequence])

  useEffect(() => {
    if (presence[0] && enter) {  // "enter"
      enter({ animate: addDotToAnimate(animate, scope.current) });
    }
  }, [animate, enter, presence, scope]);

  useEffect(() => {
    if (!presence[0] && exit) {  // "exit"
      exit({ animate: addDotToAnimate(animate, scope.current) }).then(() => {
        presence[1]();
      })
    }
  }, [animate, exit, presence, scope]);

  return child;
}

function addDotToAnimate(animate: ReturnType<typeof useAnimate>[1], element: HTMLElement) {
  return (...args: any) => {
    // handle animate(".", ...)
    if (args[0] === ".") {
      args[0] = element;
    }
    // handle animation sequences
    if (Array.isArray(args[0])) {
      for (const elem of args[0]) {
        if (elem[0] === ".") {
          elem[0] = element;
        }
      }
    }
    return animate.apply(null, args);
  }
};

export function sequence(...args: AnimationSequence) {
  return args;
}

export function delay(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, duration * 1000);
  });
}
