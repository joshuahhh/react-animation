import * as d3 from "d3"
import React, { Fragment, useEffect, useRef, useState } from 'react'
import * as DemoD3 from "./DemoD3"
import * as DemoAmelia from "./DemoAmelia"
import * as DemoFramerFromSpring from "./DemoFramerFromSpring"
import * as DemoFramerDeclarative from "./DemoFramerDeclarative"
import * as DemoFramerUseAnimate from "./DemoFramerUseAnimate"


type Demo = {
  description: React.ReactNode,
  Demo: React.ComponentType<{ visibleCircles: number[], allCircles: number[] }>,
}

const demos: Demo[] = [
  DemoD3,
  DemoAmelia,
  DemoFramerFromSpring,
  DemoFramerDeclarative,
  DemoFramerUseAnimate,
]

export function App() {
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

  return <main>
    <h1>D3-style animation with React</h1>
    <i><a href="https://joshuahhh.com">Josh Horowitz</a></i>
    <p>
      Among its many features,
        D3 includes a way to bind data to DOM elements with selections and joins.
      D3 joins had their moment in the sun, but these days a lot of people (like me)
        prefer using React to define data-driven DOMs.
      But a big missing piece is <i>animation</i>.<sup>1</sup>
    </p>
    <p>
      How should a React developer add animations to a data visualization?
      Amelia Wattenberger touches on this a bit in her post
        on <a href="https://2019.wattenberger.com/blog/react-and-d3">React + D3.js</a>.
      She shows an example replacing D3 animations with React Spring.
      It's all right, but I wish it left D3 in the dust more decisively.
      I don't want to feel like I'm making animations harder for myself
        (in terms of DX or flexibility) by choosing React.
    </p>
    <p>
      As far as I can tell, the only contender for full-featured, fully-flexible,
      well-designed React animation library is Framer Motion. So I'm going to explore how to
      make Amelia's example animation with Framer Motion, in a variety of styles.
    </p>

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
        { showStatic && <StaticCircles visibleCircles={visibleCircles} /> }
      </div>
    </div>

    {/* controls */}
    <div className="f-row box">
      <label className="f-row">
        <input type="checkbox" checked={updateAutomatically} onChange={e => setUpdateAutomatically(e.target.checked)} />
        Update automatically
      </label>
      { !updateAutomatically && <>
        <button onClick={() => setVisibleCircles(generateCircles())}>Update now</button>
        <button onClick={() => setVisibleCircles([])}>Clear</button>
      </>}
    </div>

    <h2>Notes</h2>
    <small>
      <sup>1</sup> I think there's actually a fundamental friction between React and animation.
      React says "the view is a function of the data".
      But animation requires that the view, for a short time,
        break away from the true data to effect a transition.
      And sure, you can get around this by suitably extending your definition of "the data".
      But when you want to sequence a series of animations and all you have are React's built-in
        primitives, you're working against React's strengths.
      Really, you want a higher-level abstraction to bridge the gap between React's functional approach
        and some alternative declarative or imperative specification of animations.
      That's what something like Framer Motion does!
      Hopefully!
    </small>
  </main>
}

export function StaticCircles({ visibleCircles }: {
  visibleCircles: number[]
}) {
  return <svg viewBox="0 0 100 20">
    {visibleCircles.map(d => (
      <circle
        key={d}
        cx={d * 15 + 10}
        cy={10}
        r={6}
        fill="lightgrey"
      />
    ))}
  </svg>;
}

// nice utilities

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
