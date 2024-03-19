export const description = <>
  {/* <h3>Static</h3> */}
  <small>
    Just draw the circles.
    For debugging, but also as a reminder of how simple things are without animation.
  </small>
</>;

export function Demo({ visibleCircles }: {
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
