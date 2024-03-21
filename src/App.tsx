import * as d3 from "d3"
import { AnimatePresence, motion, useAnimate } from "framer-motion"
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Animate } from "./Animate"
import { BarsDemoAnimateComponentAsync } from "./BarsDemoAnimateComponentAsync"
import { BarsDemoD3 } from "./BarsDemoD3"
import { BarsDemoFramer } from "./BarsDemoFramer"
import * as DemoAmelia from "./DemoAmelia"
import * as DemoD3 from "./DemoD3"
import * as DemoFramerAnimateComponent from "./DemoFramerAnimateComponent"
import * as DemoFramerDeclarative from "./DemoFramerDeclarative"
import * as DemoFramerFromSpring from "./DemoFramerFromSpring"
import * as DemoFramerUseAnimate from "./DemoFramerUseAnimate"
import { Mount } from "./Mount"
import { BarsDemoAnimateComponentSeq } from "./BarsDemoAnimateComponentSeq"


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

    <h2>Scratch space</h2>
    <ScratchSpace/>

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
  DemoFramerAnimateComponent,
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

  return <div className="relative">
    <div className="tool-bar navbar">
      <label className="f-row crowded"
        onClick={(e) => {
          e.preventDefault();
          setUpdateAutomatically((old) => !old);
        }}>
        <input type="checkbox" checked={updateAutomatically} onChange={e => setUpdateAutomatically(e.target.checked)} />
        Update automatically
      </label>
      <hr aria-orientation="vertical" />
      {['stacked', 'grouped'].map(l =>
        <label key={l} className="f-row crowded"
          onClick={(e) => {
            e.preventDefault();
            setLayout(l as 'stacked' | 'grouped');
          }}>
          <input type="radio" name="layout" value="stacked"
            checked={layout === l}
            onChange={() => setLayout(l as 'stacked' | 'grouped')}
          />
          {l[0].toUpperCase() + l.slice(1)}
        </label>
      )}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "auto 400px", gap: 10 }}>
      <h3>Original</h3>
      <BarsDemoD3 {...{xz, yz, layout}} />
      <h3>Framer Motion</h3>
      <BarsDemoFramer {...{xz, yz, layout}} />
      <h3>Josh's Animate component (async style)</h3>
      <BarsDemoAnimateComponentAsync {...{xz, yz, layout}} />
      <h3>Josh's Animate component (seq style)</h3>
      <BarsDemoAnimateComponentSeq {...{xz, yz, layout}} />
    </div>
  </div>;
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

// scratch space

function ScratchSpace() {
  const [x, setX] = useState(30);

  useInterval(() => {
    setX((old) => 100 - old);
  }, 1000);

  const [ scope, animate ] = useAnimate();

  useEffect(() => {
    animate(scope.current, { attrX: 100 - x, attrY: 0, width: 10, height: 10 }, { duration: 1 });
  }, [animate, scope, x]);

  return <svg viewBox="0 0 100 30">
    <rect ref={scope} fill="cornflowerblue" />
    <Animate
      animator={async ({ animate }) => {
        await animate([
          [".", { cx: x }, { duration: 1 }],
          [".", { r: 10 }, { duration: 0.5, at: 0 }],
          [".", { r: 5 }, { duration: 0.5 }],
        ])
        // await Promise.all([
        //   (async () => {
        //     await animate(".", { cx: x }, { duration: 1 });
        //   })(),
        //   (async () => {
        //     await animate(".", { r: 10 }, { duration: 0.5 });
        //     await animate(".", { r: 5 }, { duration: 0.5 });
        //   })(),
        // ])
      }}
    >
      <circle cx={x} cy="15" r="5" fill="cornflowerblue" />
    </Animate>
  </svg>;
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
