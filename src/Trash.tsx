const TrashCan = () => {
    return (
      <svg viewBox="0 0 100 100" className="w-8 h-8 p-1">
        <defs>
          <radialGradient id="trash-gradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#bbb" />
          </radialGradient>
          <filter id="trash-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
          </filter>
        </defs>
  
        {/* Body of trash can */}
        <rect x="30" y="30" width="70" height="150" rx="4" fill="url(#trash-gradient)" filter="url(#trash-shadow)" />
  
        {/* Lid */}
        <rect x="25" y="20" width="150" height="30" rx="2" fill="url(#trash-gradient)" />
  
        {/* Handle */}
        <rect x="45" y="15" width="30" height="15" rx="1" fill="url(#trash-gradient)" />
      </svg>
    )
  }
  
  export default TrashCan  