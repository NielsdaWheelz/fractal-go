const PassButton = (props: { onClick: () => void }) => {
    return (
      <button onClick={props.onClick} className="w-16 h-16 p-1">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="pass-gradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#eee" />
              <stop offset="100%" stopColor="#ccc" />
            </radialGradient>
            <filter id="pass-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
            </filter>
          </defs>
  
          {/* Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#pass-gradient)"
            filter="url(#pass-shadow)"
          />
  
          {/* Pass text */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="20"
            fill="#333"
            fontWeight="bold"
            pointerEvents="none"
          >
            Pass
          </text>
        </svg>
      </button>
    )
  }
  
  export default PassButton  