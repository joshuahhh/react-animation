import * as d3 from "d3";
import { motion } from "framer-motion";

export function BarsFramer({
  xz,
  yz,
  layout,
}: {
  xz: number[];
  yz: number[][];
  layout: "stacked" | "grouped";
}) {
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
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i] as const));

  const yMax = d3.max(yz, (y) => d3.max(y))!;
  const y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]))!;

  const x = d3
    .scaleBand<number>()
    .domain(xz)
    .rangeRound([marginLeft, width - marginRight])
    .padding(0.08);

  const y = d3.scaleLinear<number>().range([height - marginBottom, marginTop]);
  if (layout === "grouped") {
    y.domain([0, yMax]);
  } else {
    y.domain([0, y1Max]);
  }

  const color = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([-0.5 * n, 1.5 * n]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {y01z.map((d, i) => (
        <g key={i} fill={color(i)}>
          {d.map((d, j) => {
            const childDelay = j * 0.02;
            const stage1 = { delay: childDelay, duration: 0.5 };
            const stage2 = { delay: childDelay + 0.5, duration: 0.25 };
            return (
              <motion.rect
                key={j}
                initial={{
                  y: height - marginBottom,
                  height: 0,
                  x: x(j),
                  width: x.bandwidth(),
                }}
                animate={
                  layout === "stacked"
                    ? {
                        y: y(d[1]),
                        height: y(d[0]) - y(d[1]),
                        x: x(j),
                        width: x.bandwidth(),
                      }
                    : {
                        x: x(j)! + (x.bandwidth() / n) * d[2],
                        width: x.bandwidth() / n,
                        y: y(d[1] - d[0]),
                        height: y(0) - y(d[1] - d[0]),
                      }
                }
                transition={
                  layout === "stacked"
                    ? {
                        y: stage1,
                        height: stage1,
                        x: stage2,
                        width: stage2,
                      }
                    : {
                        x: stage1,
                        width: stage1,
                        y: stage2,
                        height: stage2,
                      }
                }
              />
            );
          })}
        </g>
      ))}

      <g
        ref={(elem) =>
          elem &&
          d3
            .axisBottom(x)
            .tickSizeOuter(0)
            .tickFormat(() => "")(d3.select(elem))
        }
        transform={`translate(0, ${height - marginBottom})`}
      />
    </svg>
  );
}
