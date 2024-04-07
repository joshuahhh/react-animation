import * as d3 from "d3";
import { useEffect, useMemo } from "react";
import { Mount } from "./Mount";

export function LettersD3({ letters }: { letters: string[] }) {
  const [svg, update] = useMemo(() => {
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, 400, 33])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .style("display", "block");

    return [
      svg.node()!,
      (letters: string[]) => {
        const t = svg.transition().duration(750) as any;

        svg.selectAll("text")
          .data(letters, d => String(d))
          .join(
            enter => enter.append("text")
              .attr("y", -7)
              .attr("dy", "0.35em")
              .attr("x", (_d, i) => i * 17)
              .text(d => String(d)),
            update => update,
            exit => exit
              .call(text => text.transition(t).remove()
                .attr("y", 41))
          )
            .call(text => text.transition(t)
              .attr("y", 17)
              .attr("x", (_d, i) => i * 17));
      }
    ];
  }, []);

  useEffect(() => {
    update(letters);
  }, [letters, update]);

  return <Mount elem={svg} />;
}
