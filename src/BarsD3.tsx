import * as d3 from "d3";
import { useEffect, useMemo } from "react";
import { Mount } from "./Mount";

export function BarsD3({
  xz,
  yz,
  layout,
}: {
  xz: number[];
  yz: number[][];
  layout: "stacked" | "grouped";
}) {
  const [svg, update] = useMemo(() => {
    const n = yz.length;

    const width = 928;
    const height = 500;
    const marginTop = 0;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 0;

    const y01z = d3
      .stack()
      .keys(d3.range(n).map(String))(d3.transpose(yz) as any) // stacked yz
      .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

    const yMax = d3.max(yz, (y) => d3.max(y))!;
    const y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]))!;

    const x = d3
      .scaleBand<number>()
      .domain(xz)
      .rangeRound([marginLeft, width - marginRight])
      .padding(0.08);

    const y = d3
      .scaleLinear<number>()
      .domain([0, y1Max])
      .range([height - marginBottom, marginTop]);

    const color = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * n, 1.5 * n]);

    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

    const rect = svg
      .selectAll("g")
      .data(y01z)
      .join("g")
      .attr("fill", (_d, i) => color(i))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (_d, i) => x(i)!)
      .attr("y", height - marginBottom)
      .attr("width", x.bandwidth())
      .attr("height", 0);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSizeOuter(0)
          .tickFormat(() => ""),
      );

    function transitionGrouped() {
      y.domain([0, yMax]);

      rect
        .transition()
        .duration(500)
        .delay((_d, i) => i * 20)
        .attr("x", (d, i) => x(i)! + (x.bandwidth() / n) * d[2])
        .attr("width", x.bandwidth() / n)
        .transition()
        .attr("y", (d) => y(d[1] - d[0]))
        .attr("height", (d) => y(0) - y(d[1] - d[0]));
    }

    function transitionStacked() {
      y.domain([0, y1Max]);

      rect
        .transition()
        .duration(500)
        .delay((_d, i) => i * 20)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .transition()
        .attr("x", (_d, i) => x(i)!)
        .attr("width", x.bandwidth());
    }

    function update(layout: "stacked" | "grouped") {
      if (layout === "stacked") transitionStacked();
      else transitionGrouped();
    }

    return [svg.node()!, update];
  }, [xz, yz]);

  useEffect(() => {
    update(layout);
  }, [layout, update]);

  return <Mount elem={svg} />;
}
