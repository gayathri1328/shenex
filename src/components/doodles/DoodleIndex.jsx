import React from 'react';

export const DoodleEye = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Cute upper and lower lid strokes with hand-drawn wobble */}
    <path 
      d="M16 52C28 34 72 32 84 52C70 68 30 70 16 52Z" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="#F8F4FF"
    />
    {/* Iris */}
    <ellipse cx="50" cy="51" rx="17" ry="17" fill={accent} fillOpacity="0.25" stroke={color} strokeWidth="3.5" />
    {/* Pupil */}
    <circle cx="51" cy="51" r="9" fill={color} />
    {/* Cute Sparkle Highlight */}
    <circle cx="47" cy="47" r="3.5" fill="#FFFFFF" />
    <circle cx="55" cy="54" r="1.5" fill="#FFFFFF" />
    {/* Eyelash doodles */}
    <path d="M50 31L50 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M68 35L75 26" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M32 35L25 26" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Soft pink blush underneath */}
    <ellipse cx="28" cy="67" rx="6" ry="3" fill="#FFB29A" fillOpacity="0.5" />
    <ellipse cx="72" cy="67" rx="6" ry="3" fill="#FFB29A" fillOpacity="0.5" />
  </svg>
);

export const DoodleCamera = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--peach-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Camera Body with soft hand-drawn curves */}
    <rect x="18" y="32" width="64" height="48" rx="14" fill="#F8F4FF" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    {/* Top flash prism */}
    <path d="M36 32L42 22C43 20 46 19 49 19H53C56 19 59 20 60 22L66 32" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Lens rings */}
    <circle cx="50" cy="56" r="18" fill={accent} fillOpacity="0.2" stroke={color} strokeWidth="3.5" />
    <circle cx="50" cy="56" r="11" fill={color} />
    <circle cx="47" cy="53" r="3" fill="#FFFFFF" />
    {/* Small cute flash button */}
    <circle cx="28" cy="42" r="3.5" fill="#FF9E7D" />
    {/* 360 degree panoramic indicator arc */}
    <path d="M12 60C8 50 12 40 20 34" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M88 60C92 50 88 40 80 34" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

export const DoodleCCTV = ({ size = 48, color = 'var(--plum-deep)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Ceiling mount base */}
    <path d="M35 15H65" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    <path d="M50 15V26" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Dome camera housing */}
    <path d="M24 38C24 28 36 26 50 26C64 26 76 28 76 38L78 45H22L24 38Z" fill="#F4EFFE" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    {/* 360 Fisheye glass dome */}
    <path d="M28 45C28 64 38 78 50 78C62 78 72 64 72 45Z" fill={accent} fillOpacity="0.18" stroke={color} strokeWidth="3.5" strokeLinejoin="round" />
    {/* Core sensor lens */}
    <ellipse cx="50" cy="54" rx="10" ry="8" fill={color} />
    <circle cx="47" cy="52" r="2.5" fill="#FFFFFF" />
    {/* Active blink LED */}
    <circle cx="63" cy="40" r="3" fill="#4ECCA3" />
    {/* Sensor scan cones */}
    <path d="M30 78L18 92" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
    <path d="M50 82L50 95" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
    <path d="M70 78L82 92" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
  </svg>
);

export const DoodlePerson = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--peach-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Cute head */}
    <circle cx="50" cy="30" r="14" fill="#FFF0EB" stroke={color} strokeWidth="4" />
    {/* Eyes & smile */}
    <circle cx="45" cy="29" r="2" fill={color} />
    <circle cx="55" cy="29" r="2" fill={color} />
    <path d="M47 35Q50 38 53 35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Torso / cute rounded body */}
    <path d="M30 68C30 52 40 48 50 48C60 48 70 52 70 68C70 74 66 76 50 76C34 76 30 74 30 68Z" fill="#F4EFFE" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    {/* Legs / walk stance */}
    <path d="M42 76V88" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M58 76V88" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Bounding box marker corners (representing CV detection) */}
    <path d="M20 30H14V36" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    <path d="M80 30H86V36" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    <path d="M14 74V80H20" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    <path d="M86 74V80H80" stroke={accent} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const DoodleFootprints = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Left footprint */}
    <g transform="translate(-4, 0)">
      <ellipse cx="36" cy="46" rx="8" ry="13" transform="rotate(-15 36 46)" fill="#F4EFFE" stroke={color} strokeWidth="3.5" />
      <circle cx="36" cy="65" r="5.5" stroke={color} strokeWidth="3.5" fill={accent} fillOpacity="0.3" />
      <circle cx="28" cy="30" r="2.2" fill={color} />
      <circle cx="33" cy="27" r="2.5" fill={color} />
      <circle cx="39" cy="28" r="2.2" fill={color} />
    </g>
    {/* Right footprint (shifted ahead) */}
    <g transform="translate(16, -18)">
      <ellipse cx="52" cy="46" rx="8" ry="13" transform="rotate(15 52 46)" fill="#F4EFFE" stroke={color} strokeWidth="3.5" />
      <circle cx="52" cy="65" r="5.5" stroke={color} strokeWidth="3.5" fill={accent} fillOpacity="0.3" />
      <circle cx="48" cy="28" r="2.2" fill={color} />
      <circle cx="54" cy="27" r="2.5" fill={color} />
      <circle cx="60" cy="30" r="2.2" fill={color} />
    </g>
    {/* Directional motion dots */}
    <circle cx="50" cy="88" r="2" fill={color} />
    <circle cx="50" cy="94" r="1.5" fill={color} opacity="0.6" />
  </svg>
);

export const DoodleClock = ({ size = 48, color = 'var(--plum-deep)', accent = 'var(--peach-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Outer clock ring */}
    <circle cx="50" cy="52" r="34" fill="#FFF0EB" stroke={color} strokeWidth="4" />
    {/* Top button for stopwatch look */}
    <path d="M44 14H56" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M50 14V18" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Clock center and dwell hand */}
    <circle cx="50" cy="52" r="4.5" fill={color} />
    <path d="M50 52L50 32" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 52L64 58" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
    {/* Dwell time sector pie */}
    <path d="M50 52L50 32A20 20 0 0 1 66 58Z" fill={accent} fillOpacity="0.25" />
    {/* Cute little tick marks */}
    <circle cx="50" cy="24" r="1.5" fill={color} />
    <circle cx="78" cy="52" r="1.5" fill={color} />
    <circle cx="50" cy="80" r="1.5" fill={color} />
    <circle cx="22" cy="52" r="1.5" fill={color} />
  </svg>
);

export const DoodleHeatmap = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--peach-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Map border frame */}
    <rect x="16" y="18" width="68" height="64" rx="12" fill="#FAF7F2" stroke={color} strokeWidth="4" />
    {/* Grid lines */}
    <path d="M16 40H84" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    <path d="M16 60H84" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    <path d="M40 18V82" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    <path d="M60 18V82" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    {/* Outer heat blob */}
    <path 
      d="M35 42C30 35 48 30 62 38C76 46 72 65 58 70C44 75 40 50 35 42Z" 
      fill="#FF9E7D" 
      fillOpacity="0.3" 
      stroke={accent} 
      strokeWidth="2.5" 
      strokeLinejoin="round" 
    />
    {/* Core heat peak hotspot */}
    <circle cx="52" cy="48" r="11" fill="#FF5252" fillOpacity="0.65" />
    <circle cx="52" cy="48" r="5" fill="#FFF275" />
    {/* Sparkle */}
    <path d="M74 24L75 27L78 28L75 29L74 32L73 29L70 28L73 27L74 24Z" fill={accent} />
  </svg>
);

export const DoodleBrain = ({ size = 48, color = 'var(--plum-deep)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Left cerebral hemisphere */}
    <path 
      d="M48 24C40 22 34 26 32 32C28 32 24 38 25 44C22 48 22 56 26 62C24 68 28 74 34 76C40 78 46 74 48 68V24Z" 
      fill="#F4EFFE" 
      stroke={color} 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
    />
    {/* Right cerebral hemisphere */}
    <path 
      d="M52 24C60 22 66 26 68 32C72 32 76 38 75 44C78 48 78 56 74 62C76 68 72 74 66 76C60 78 54 74 52 68V24Z" 
      fill="#E4F8F1" 
      stroke={color} 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
    />
    {/* Brain folds */}
    <path d="M34 40C38 42 42 38 48 44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 58C38 56 42 62 48 58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M66 40C62 42 58 38 52 44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M68 58C62 56 58 62 52 58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* AI synapses / spark nodes */}
    <circle cx="18" cy="34" r="3" fill={accent} />
    <circle cx="82" cy="34" r="3" fill={accent} />
    <path d="M22 36L28 42" stroke={accent} strokeWidth="2" strokeDasharray="2 2" />
    <path d="M78 36L72 42" stroke={accent} strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

export const DoodleRadar = ({ size = 48, color = 'var(--purple-primary)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Outer radar screen */}
    <circle cx="50" cy="50" r="38" fill="#F8F4FF" stroke={color} strokeWidth="4" />
    <circle cx="50" cy="50" r="24" stroke={color} strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="2" opacity="0.6" />
    {/* Axis crosshairs */}
    <path d="M50 12V88" stroke={color} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
    <path d="M12 50H88" stroke={color} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
    {/* Radar sweep sector */}
    <path d="M50 50L76 24A38 38 0 0 0 50 12Z" fill={accent} fillOpacity="0.35" />
    {/* Detected blips */}
    <circle cx="62" cy="32" r="3.5" fill={color} />
    <circle cx="34" cy="60" r="3" fill={color} />
    <circle cx="50" cy="50" r="4.5" fill={color} />
  </svg>
);

export const DoodleZone = ({ size = 48, color = 'var(--plum-deep)', accent = 'var(--mint-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-wobble ${className}`}
  >
    {/* Indoor Zone Boundary Polygon */}
    <polygon 
      points="22,26 78,18 84,68 46,84 18,60" 
      fill="#E4F8F1" 
      fillOpacity="0.4" 
      stroke={color} 
      strokeWidth="3.5" 
      strokeDasharray="6 4" 
      strokeLinejoin="round" 
    />
    {/* Boundary Pin nodes */}
    <circle cx="22" cy="26" r="4.5" fill={accent} stroke={color} strokeWidth="2" />
    <circle cx="78" cy="18" r="4.5" fill={accent} stroke={color} strokeWidth="2" />
    <circle cx="84" cy="68" r="4.5" fill={accent} stroke={color} strokeWidth="2" />
    <circle cx="46" cy="84" r="4.5" fill={accent} stroke={color} strokeWidth="2" />
    <circle cx="18" cy="60" r="4.5" fill={accent} stroke={color} strokeWidth="2" />
    {/* Traffic density icon in center */}
    <circle cx="50" cy="48" r="10" fill={color} />
    <path d="M47 48L53 48" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DoodleSparkle = ({ size = 28, color = 'var(--peach-accent)', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`doodle-float ${className}`}
  >
    <path 
      d="M50 10C50 35 65 50 90 50C65 50 50 65 50 90C50 65 35 50 10 50C35 50 50 35 50 10Z" 
      fill={color} 
      stroke="var(--plum-deep)" 
      strokeWidth="3" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const DoodleArrow = ({ size = 36, color = 'var(--purple-primary)', direction = 'right', className = '' }) => {
  const rotation = direction === 'down' ? 90 : direction === 'left' ? 180 : direction === 'up' ? 270 : 0;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`doodle-wobble ${className}`}
    >
      <path 
        d="M15 50C35 48 55 52 75 50" 
        stroke={color} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M60 34C66 40 76 48 82 50C76 52 66 60 60 66" 
        stroke={color} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
