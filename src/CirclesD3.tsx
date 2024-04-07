import * as d3 from "d3";
import { useEffect, useRef } from "react";


export function CirclesD3({ visibleCircles }: {
  visibleCircles: number[]
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svgElement = d3.select(svgRef.current)
    svgElement.selectAll("circle")
      .data(visibleCircles, (d) => String(d))
      .join(
        enter => (
          enter.append("circle")
              .attr("cx", d => d * 15 + 10)
              .attr("cy", 10)
              .attr("r", 0)
              .attr("fill", "cornflowerblue")
              .style("opacity", 0)  // note: missing from Amelia's post, but implied?
            .call(enter => (
              enter.transition().duration(1200)
                .attr("cy", 10)
                .attr("r", 6)
                .style("opacity", 1)
            ))
        ),
        update => (
          update.attr("fill", "lightgrey")
        ),
        exit => (
          exit.attr("fill", "tomato")
            .call(exit => (
              exit.transition().duration(1200)
                .attr("r", 0)
                .style("opacity", 0)
                .remove()
            ))
        ),
      )
  }, [visibleCircles]);

  return <svg viewBox="0 0 100 20" ref={svgRef} />;
}
