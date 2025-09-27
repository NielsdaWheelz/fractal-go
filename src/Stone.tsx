const Stone = (props: { game, colour, cursor }) => {
	const gradientId = `${props.colour}-gradient`

	const colourToXO = `${props.colour === "black" ? "x" : "o"}`
	const stoneStyle = `w-full h-full translate-y-[-1px] scale-[1.02] ${!props.game?.winner ? "" : props.game?.winner == colourToXO ? "animate-ping" : "opacity-50" }`

	return (
		<svg viewBox="0 0 100 100" className={stoneStyle}>
			<defs>
				<radialGradient id={gradientId} cx="10%" cy="10%" r="90%">
					{props.colour === "black" ? (
						<>
							<stop offset="0%" stopColor="#555" />
							<stop offset="100%" stopColor="#000" />
						</>
					) : (
						<>
							<stop offset="0%" stopColor="#fff" />
							<stop offset="100%" stopColor="#ddd" />
						</>
					)}
				</radialGradient>

				<filter id="stone-shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow dx="2" dy="2" stdDeviation="4" floodOpacity="0.4" />
				</filter>
			</defs>

			<circle
				cx="50"
				cy="50"
				r="45"
				fill={`url(#${gradientId})`}
				filter="url(#stone-shadow)"
			/>
		</svg>
	)
}

export default Stone