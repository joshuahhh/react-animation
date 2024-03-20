import * as d3 from "d3"
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import * as DemoD3 from "./DemoD3"
import * as DemoAmelia from "./DemoAmelia"
import * as DemoFramerFromSpring from "./DemoFramerFromSpring"
import * as DemoFramerDeclarative from "./DemoFramerDeclarative"
import * as DemoFramerUseAnimate from "./DemoFramerUseAnimate"
import { AnimatePresence, animate, motion } from "framer-motion"
import { update } from "@react-spring/web"


export function App() {
  return <main>
    <h1>D3-style animation with React</h1>
    <i><a href="https://joshuahhh.com">Josh Horowitz</a></i>
    <p>
      Among its many features, D3 includes a way to bind data to DOM elements with selections and joins. D3 joins had their moment in the sun, but these days a lot of people (like me) prefer using React to define data-driven DOMs. But a big missing piece is <i>animation</i>.<sup>1</sup>
    </p>
    <p>
      How should a React developer add animations to a data visualization? Amelia Wattenberger touches on this a bit in her post on <a href="https://2019.wattenberger.com/blog/react-and-d3">React + D3.js</a>. She shows an example replacing D3 animations with React Spring. It's all right, but I wish it left D3 in the dust more decisively. I don't want to feel like I'm making animations harder for myself (in terms of DX or flexibility) by choosing React.
    </p>
    <p>
      As far as I can tell, the only contender for full-featured, fully-flexible, well-designed React animation library is Framer Motion. So I'm going to explore how to make Amelia's example animation with Framer Motion, in a variety of styles.
    </p>

    <CirclesDemos />

    <h2>Another small example</h2>
    <p>
      I don't think that was conclusive. Let's try another small example, this one from the <a href="https://observablehq.com/@d3/learn-d3-joins?collection=@d3/learn-d3">"Learn D3: Joins" notebook</a>.
    </p>

    <LettersDemos />

    <p>
      OK! I think Framer Motion comes out looking better in this one. The circles demo involved some kinda unnatural "be this color during this transition" behavior which wasn't a perfect fit for Framer. This demo involves more conventional use of transitions, and I think it shows off Framer Motion nicely.
    </p>

    <h2>A bigger example</h2>

    <BarsDemos />

    <p>
      Current stance: It's doable, but I think the sequencing API (that I'm using) is inferior to D3. Seems like I should use useAnimate for sequencing, but that requires making a per-rectangle component, which is unergonomic.
    </p>
    <p>
      Small difference in behavior when you change layout type faster than animations: D3 finishes the old animation before moving to the new one; Framer Motion cancels the old animation and starts the new one immediately. Can't say for sure which is preferable.
    </p>

    <h2>Notes</h2>
    <small>
      <sup>1</sup> I think there's actually a fundamental friction between React and animation. React says "the view is a function of the data". But animation requires that the view, for a short time, break away from the true data to effect a transition. And sure, you can get around this by suitably extending your definition of "the data". But when you want to sequence a series of animations and all you have are React's built-in primitives, you're working against React's strengths. Really, you want a higher-level abstraction to bridge the gap between React's functional approach and some alternative declarative or imperative specification of animations. That's what something like Framer Motion does! Hopefully!
    </small>
  </main>
}

// circles

function CirclesDemos() {
  // UI state
  const [updateAutomatically, setUpdateAutomatically] = useState(true);
  const [showStatic, setShowStatic] = useState(false);

  const allCircles = d3.range(0, 6);
  const generateCircles = () => allCircles.filter(() => Math.random() < 0.5);

  // make visible circles, change them every 2 seconds
  const [visibleCircles, setVisibleCircles] = useState(
    generateCircles()
  );
  useInterval(() => {
    if (updateAutomatically) {
      const newCircles = generateCircles();
      // console.log("new circles!", newCircles);
      setVisibleCircles(newCircles);
    }
  }, 2000);

  return <>
    {/* grid of demos */}
    <div style={{ display: "grid", gridTemplateColumns: "auto 400px", gap: 10 }}>
      {demos.map((demo, i) => (
        <Fragment key={i}>
          <div>{demo.description}</div>
          <demo.Demo visibleCircles={visibleCircles} allCircles={allCircles} />
        </Fragment>
      ))}
      <div>
        <h3 onClick={() => setShowStatic((old) => !old)} style={{marginLeft: -25, cursor: 'pointer'}}>
          <div style={{display: 'inline-block', width: 25}}>{ showStatic ? '▼' : '▶' }</div>
          Static
        </h3>
        { showStatic && <small>
          Just draw the circles.
          For debugging; also as a reminder of how simple things are without animation.
        </small> }
      </div>
      <div>
        { showStatic &&
          <svg viewBox="0 0 100 20">
            {visibleCircles.map(d => (
              <circle
                key={d}
                cx={d * 15 + 10}
                cy={10}
                r={6}
                fill="lightgrey"
              />
            ))}
          </svg>
        }
      </div>
    </div>

    {/* controls */}
    <div className="tool-bar">
      <label className="f-row crowded">
        <input type="checkbox" checked={updateAutomatically} onChange={e => setUpdateAutomatically(e.target.checked)} />
        Update automatically
      </label>
      { !updateAutomatically && <>
        <hr aria-orientation="vertical" />
        <button onClick={() => setVisibleCircles(generateCircles())}>Update now</button>
        <button onClick={() => setVisibleCircles([])}>Clear</button>
      </>}
    </div>
  </>;
}

type CirclesDemo = {
  description: React.ReactNode,
  Demo: React.ComponentType<{ visibleCircles: number[], allCircles: number[] }>,
}

const demos: CirclesDemo[] = [
  DemoD3,
  DemoAmelia,
  DemoFramerFromSpring,
  DemoFramerDeclarative,
  DemoFramerUseAnimate,
]

// letters

function LettersDemos() {
  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const [randomLetters, setRandomLetters] = useState<string[]>([]);
  useInterval(() => {
    setRandomLetters(
      d3.shuffle(alphabet.slice())
        .slice(Math.floor(Math.random() * 10) + 5)
        .sort(d3.ascending)
    );
  }, 2000);

  return <div style={{ display: "grid", gridTemplateColumns: "auto 400px", gap: 10 }}>
    <div><h3>Original</h3></div>
    <LettersDemoD3 letters={randomLetters} />
    <div><h3>Framer</h3></div>
    <LettersDemoFramer letters={randomLetters} />
    {/* <div><h3>Data</h3></div>
    <div>{randomLetters.join("")}</div> */}
  </div>;
}

function LettersDemoD3({ letters }: { letters: string[] }) {
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

function LettersDemoFramer({ letters }: { letters: string[] }) {
  return (
    <svg
      viewBox="0 0 400 33"
      style={{
        display: "block",
        fontFamily: "sans-serif",
        fontSize: 10,
      }}
    >
      <AnimatePresence initial={true}>
        {letters.map((d, i) =>
          <motion.text
            key={d}
            dy="0.35em"
            initial={{ y: -7, x: i * 17 }}
            animate={{ y: 17, x: i * 17 }}
            exit={{ y: 41 }}
            transition={{ duration: 0.75 }}
          >
            {d}
          </motion.text>
        )}
      </AnimatePresence>
    </svg>
  );
}

// bars

function BarsDemos() {
  const n = 5;
  const m = 30;
  const xz = useMemo(() => d3.range(m), []);
  const yz = useMemo(() => d3.range(n).map(() => bumps(m)), []);
  const [layout, setLayout] = useState<'stacked' | 'grouped'>("stacked");

  const [updateAutomatically, setUpdateAutomatically] = useState(true);
  useInterval(() => {
    if (updateAutomatically) {
      setLayout(layout === "stacked" ? "grouped" : "stacked");
    }
  }, 3000);

  return <>
    <div className="tool-bar">
      <label className="f-row crowded">
        <input type="checkbox" checked={updateAutomatically} onChange={e => setUpdateAutomatically(e.target.checked)} />
        Update automatically
      </label>
      <hr aria-orientation="vertical" />
      {['stacked', 'grouped'].map(l =>
        <label key={l} className="f-row crowded">
          <input type="radio" name="layout" value="stacked"
            checked={layout === l}
            onChange={() => setLayout(l as 'stacked' | 'grouped')} />
          {l[0].toUpperCase() + l.slice(1)}
        </label>
      )}
    </div>
    <h3>Original</h3>
    <BarsDemoD3 {...{xz, yz, layout}} />
    <h3>Framer Motion</h3>
    <BarsDemoFramer {...{xz, yz, layout}} />
  </>;
}

function BarsDemoD3({ xz, yz, layout }: {
  xz: number[],
  yz: number[][],
  layout: 'stacked' | 'grouped',
}) {
  const [svg, update] = useMemo(() => {
    const n = yz.length;

    const width = 928;
    const height = 500;
    const marginTop = 0;
    const marginRight = 0;
    const marginBottom = 10;
    const marginLeft = 0;

    const y01z = d3.stack()
        .keys(d3.range(n).map(String))
      (d3.transpose(yz) as any) // stacked yz
      .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

    const yMax = d3.max(yz, y => d3.max(y))!;
    const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))!;

    const x = d3.scaleBand<number>()
        .domain(xz)
        .rangeRound([marginLeft, width - marginRight])
        .padding(0.08);

    const y = d3.scaleLinear<number>()
        .domain([0, y1Max])
        .range([height - marginBottom, marginTop]);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.5 * n, 1.5 * n]);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

    const rect = svg.selectAll("g")
      .data(y01z)
      .join("g")
        .attr("fill", (_d, i) => color(i))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", (_d, i) => x(i)!)
        .attr("y", height - marginBottom)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""));

    function transitionGrouped() {
      y.domain([0, yMax]);

      rect.transition()
          .duration(500)
          .delay((_d, i) => i * 20)
          .attr("x", (d, i) => x(i)! + x.bandwidth() / n * d[2])
          .attr("width", x.bandwidth() / n)
        .transition()
          .attr("y", d => y(d[1] - d[0]))
          .attr("height", d => y(0) - y(d[1] - d[0]));
    }

    function transitionStacked() {
      y.domain([0, y1Max]);

      rect.transition()
          .duration(500)
          .delay((_d, i) => i * 20)
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
        .transition()
          .attr("x", (_d, i) => x(i)!)
          .attr("width", x.bandwidth());
    }

    function update(layout: 'stacked' | 'grouped') {
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

function BarsDemoFramer({ xz, yz, layout }: {
  xz: number[],
  yz: number[][],
  layout: 'stacked' | 'grouped',
}) {
  const n = yz.length;

  const width = 928;
  const height = 500;
  const marginTop = 0;
  const marginRight = 0;
  const marginBottom = 10;
  const marginLeft = 0;

  const y01z = d3.stack()
      .keys(d3.range(n).map(String))
    (d3.transpose(yz) as any) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i] as const));

  const yMax = d3.max(yz, y => d3.max(y))!;
  const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))!;

  const x = d3.scaleBand<number>()
      .domain(xz)
      .rangeRound([marginLeft, width - marginRight])
      .padding(0.08);

  const y = d3.scaleLinear<number>()
      .range([height - marginBottom, marginTop]);
  if (layout === "grouped") {
    y.domain([0, yMax]);
  } else {
    y.domain([0, y1Max]);
  }

  const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * n, 1.5 * n]);

  return <svg
    viewBox={`0 0 ${width} ${height}`}
    width={width} height={height}
    style={{maxWidth: "100%", height: "auto"}}
  >
    {y01z.map((d, i) =>
      <g key={i} fill={color(i)}>
        {d.map((d, j) => {
          if (true) {
            const childDelay = j * 0.02;
            const stage1 = { delay: childDelay, duration: 0.5 };
            const stage2 = { delay: childDelay + 0.5, duration: 0.25 };
            return <motion.rect
              key={j}
              initial={{
                y: height - marginBottom,
                height: 0,
                x: x(j),
                width: x.bandwidth(),
              }}
              animate={layout === "stacked" ?
                {
                  y: y(d[1]),
                  height: y(d[0]) - y(d[1]),
                  x: x(j),
                  width: x.bandwidth(),
                } :
                {
                  y: y(d[1] - d[0]),
                  height: y(0) - y(d[1] - d[0]),
                  x: x(j)! + x.bandwidth() / n * d[2],
                  width: x.bandwidth() / n
                }
              }
              transition={layout === "stacked" ?
                {
                  y: stage1, height: stage1,
                  x: stage2, width: stage2,
                } :
                {
                  x: stage1, width: stage1,
                  y: stage2, height: stage2,
                }
              }
            />;
          }

          if (false) {
            const childDelay = j * 0.02;
            return <motion.rect
              key={j}
              initial={{
                y: height - marginBottom,
                height: 0,
                x: x(j),
                width: x.bandwidth(),
              }}
              animate={layout === "stacked" ?
                {
                  y: [null, y(d[1]), y(d[1])],
                  height: [null, y(d[0]) - y(d[1]), y(d[0]) - y(d[1])],
                  x: [null, null, x(j)],
                  width: [null, null, x.bandwidth()],
                } :
                {
                  x: [null, x(j)! + x.bandwidth() / n * d[2], undefined],
                  width: [null, x.bandwidth() / n, undefined],
                  y: [null, undefined, y(d[1] - d[0])],
                  height: [null, undefined, y(0) - y(d[1] - d[0])],
                }
              }
              transition={{
                duration: childDelay + 0.75,
                times: [childDelay / (childDelay + 0.75), (childDelay + 0.5) / (childDelay + 0.75), (childDelay + 0.75) / childDelay + 0.75],
              }}
            />;
          }

          if (false) {
            return <motion.rect
              key={j}
              initial={{
                y: height - marginBottom,
                height: 0,
                x: x(j),
                width: x.bandwidth(),
              }}
              animate={layout === "stacked" ?
                sequence([
                  [{}, { duration: j * 0.02 }],
                  [{ y: y(d[1]), height: y(d[0]) - y(d[1]) }, { duration: 0.5 }],
                  [{ x: x(j), width: x.bandwidth() }, { duration: 0.25 }],
                ]) :
                sequence([
                  [{}, { duration: j * 0.02 }],
                  [{ x: x(j)! + x.bandwidth() / n * d[2], width: x.bandwidth() / n }, { duration: 0.5 }],
                  [{ y: y(d[1] - d[0]), height: y(0) - y(d[1] - d[0]) }, { duration: 0.25 }],
                ])
              }
            />;
          }
        })}
      </g>
    )}

    <g
      ref={(elem) => elem &&
        d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => "")
          (d3.select(elem))
      }
      transform={`translate(0, ${height - marginBottom})`}
    />
  </svg>;
}

function sequence(sequence: any) {
  return animate('rect', [
    ...sequence.map(([to, transition]: any) => (
      ['rect', to, transition]
    )),
  ]);
}

// Returns an array of m pseudorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
function bumps(m: number) {
  const values: number[] = [];

  // Initialize with uniform random values in [0.1, 0.2).
  for (let i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (let j = 0; j < 5; ++j) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (let i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}


// common utilities

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current!();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Mount({ elem }: { elem: Element }) {
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
