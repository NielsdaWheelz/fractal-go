const Stone = (props: { colour }) => {
	const gradientId = `${props.colour}-gradient`

	return (
		<svg viewBox="0 0 100 100" className="w-full h-full p-1">
			<defs>
				<radialGradient id={gradientId} cx="30%" cy="30%" r="70%">
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
					<feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
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