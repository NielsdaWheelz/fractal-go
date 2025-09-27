import { useEffect, useRef, useState } from "react"
import type { GameState } from "./types"
import Stone from "./Stone"

const ExplodingStone = (props: {game, row, col, colour, onDone}) => {
  const [explode, setExplode] = useState(false)
  const explodedRef = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => setExplode(true), 20)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!explodedRef.current) {
        explodedRef.current = true
        props.onDone()
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [props])

  const base = "absolute inset-0 z-10 pointer-events-none will-change-transform will-change-opacity"
  const initial = "opacity-100 scale-100"
  const exploding = "opacity-0 scale-150 blur-[1px] transition-[transform,opacity,filter] duration-300 ease-out"

  return (
    <span className={base}>
      <span
        className={`${explode ? exploding : initial} block w-full h-full`}
        onTransitionEnd={() => {
          if (!explodedRef.current) {
            explodedRef.current = true
            props.onDone()
          }
        }}
      >
        <Stone game={props.game} row={props.row} col={props.col} colour={props.colour} cursor={false} />
      </span>
      <span className="absolute inset-0 rounded-full ring-2 ring-white/70 animate-ping" />
    </span>
  )
}

export default ExplodingStone


