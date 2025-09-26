import { useEffect, useState } from "react"
import Stone from "./Stone"

const CursorStone = (props: { enabled, colour, size }) => {
    const [position, setPosition] = useState({x: 0, y:0})
    useEffect(() => {
        if (!props.enabled) return

        const handleMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", handleMove)
        return () => window.removeEventListener("mousemove", handleMove)
    }, [props.enabled])

    return (
        <div className="pointer-events-none fixed z-50" style={{left: position.x - props.size / 2, top: position.y - props.size / 2, width: props.size, height: props.size}}>
            <Stone colour={props.colour} />
        </div>
    )
}

export default CursorStone