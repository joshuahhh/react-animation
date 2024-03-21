import { useEffect, useState } from "react";

export function Mount({ elem }: { elem: Element }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (container) {
      container.appendChild(elem);
      return () => {
        container.removeChild(elem);
      };
    }
  }, [container, elem]);
  return <div ref={setContainer} />;
}
