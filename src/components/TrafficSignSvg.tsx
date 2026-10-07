import React from 'react';

interface TrafficSignSvgProps {
  svgKey: string;
  size?: number | string;
  className?: string;
}

export const TrafficSignSvg: React.FC<TrafficSignSvgProps> = ({
  svgKey,
  size = 120,
  className = '',
}) => {
  const width = typeof size === 'number' ? `${size}px` : size;
  const height = width;

  switch (svgKey) {
    case 'stop':
      // Red Octagon with white STOP text and white inner border
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Stop Sign"
        >
          <polygon
            points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
            fill="#D32F2F"
            stroke="#B71C1C"
            strokeWidth="1.5"
          />
          <polygon
            points="31,8 69,8 92,31 92,69 69,92 31,92 8,69 8,31"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
          />
          <text
            x="50"
            y="58"
            fill="#FFFFFF"
            fontSize="22"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            letterSpacing="1"
          >
            STOP
          </text>
        </svg>
      );

    case 'give_way':
      // Inverted Triangle with red border and white center
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Give Way Sign"
        >
          <polygon
            points="10,12 90,12 50,88"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="12"
            strokeLinejoin="round"
          />
          <polygon points="22,18 78,18 50,72" fill="#FFFFFF" />
        </svg>
      );

    case 'no_entry':
      // Red circle with white horizontal rectangular bar
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="No Entry Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#D32F2F" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#B71C1C" strokeWidth="2" />
          <rect x="18" y="42" width="64" height="16" rx="2" fill="#FFFFFF" />
        </svg>
      );

    case 'one_way':
      // Red circle with white background, two arrows one barred
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="One Way Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          {/* Arrow pointing up */}
          <path d="M38,70 L38,36 L30,36 L40,20 L50,36 L42,36 L42,70 Z" fill="#1A1A1A" />
          {/* Arrow pointing down barred */}
          <path d="M62,30 L62,64 L70,64 L60,80 L50,64 L58,64 L58,30 Z" fill="#1A1A1A" opacity="0.3" />
          <line x1="22" y1="26" x2="78" y2="74" stroke="#D32F2F" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'speed_limit_50':
      // Red circle with white interior and black "50"
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Speed Limit 50 Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          <text
            x="50"
            y="62"
            fill="#1A1A1A"
            fontSize="38"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            50
          </text>
        </svg>
      );

    case 'no_parking':
      // Blue circle with red border and red diagonal slash
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="No Parking Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#1565C0" stroke="#D32F2F" strokeWidth="10" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="#D32F2F" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );

    case 'no_overtaking':
      // Red circle with black car and red overtaking car crossed out
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="No Overtaking Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          {/* Right car (black) */}
          <rect x="52" y="44" width="22" height="32" rx="4" fill="#1A1A1A" />
          <circle cx="50" cy="50" r="1" fill="#FFF" />
          {/* Left car (red) */}
          <rect x="26" y="32" width="22" height="32" rx="4" fill="#D32F2F" />
          <line x1="20" y1="80" x2="80" y2="20" stroke="#D32F2F" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );

    case 'compulsory_left':
      // Blue circle with white arrow pointing left
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Compulsory Left Turn Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#0D47A1" />
          <path
            d="M62,68 L62,50 C62,42 56,38 46,38 L36,38 L36,48 L18,34 L36,20 L36,30 L48,30 C64,30 72,40 72,52 L72,68 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'no_u_turn':
      // Red circle with inverted U-turn arrow crossed out
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="No U-Turn Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          <path
            d="M62,70 L62,45 C62,34 54,28 44,28 C34,28 26,34 26,45 L26,52 L18,52 L30,68 L42,52 L34,52 L34,45 C34,38 38,35 44,35 C50,35 54,38 54,45 L54,70 Z"
            fill="#1A1A1A"
          />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#D32F2F" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'horn_prohibited':
      // Red circle with horn crossed out
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Horn Prohibited Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          {/* Horn body */}
          <path d="M26,44 L36,44 L56,32 L56,68 L36,56 L26,56 Z" fill="#1A1A1A" />
          <ellipse cx="60" cy="50" rx="3" ry="16" fill="#1A1A1A" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#D32F2F" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'pedestrians_prohibited':
      // Red circle with pedestrian figure crossed out
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Pedestrians Prohibited Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="10" />
          {/* Head */}
          <circle cx="48" cy="28" r="6" fill="#1A1A1A" />
          {/* Body and legs */}
          <path d="M44,36 L52,36 L56,52 L48,54 L44,42 L40,56 L34,54 Z" fill="#1A1A1A" />
          <path d="M46,52 L54,76 L46,76 L42,60 L38,76 L30,74 L38,52 Z" fill="#1A1A1A" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#D32F2F" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'right_curve':
      // Warning Triangle with right curved arrow
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Right Hand Curve Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path
            d="M38,72 L46,72 C46,54 54,44 64,44 L64,36 L80,48 L64,60 L64,52 C50,52 38,62 38,72 Z"
            fill="#1A1A1A"
          />
        </svg>
      );

    case 'hairpin_bend':
      // Warning Triangle with hairpin shape
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Hairpin Bend Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path
            d="M34,74 L42,74 L42,46 C42,38 48,34 56,34 C64,34 70,38 70,46 L70,58 L62,58 L72,74 L82,58 L76,58 L76,46 C76,34 66,28 56,28 C46,28 34,34 34,46 Z"
            fill="#1A1A1A"
          />
        </svg>
      );

    case 'steep_ascent':
      // Warning Triangle with ramp ascending and car climbing
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Steep Ascent Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <polygon points="26,74 74,48 74,74" fill="#1A1A1A" />
          <rect x="42" y="44" width="16" height="8" rx="2" fill="#D32F2F" transform="rotate(-28 50 48)" />
        </svg>
      );

    case 'steep_descent':
      // Warning Triangle with ramp descending and car going down
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Steep Descent Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <polygon points="26,48 74,74 26,74" fill="#1A1A1A" />
          <rect x="42" y="44" width="16" height="8" rx="2" fill="#D32F2F" transform="rotate(28 50 48)" />
        </svg>
      );

    case 'narrow_bridge':
      // Warning Triangle with bridge constriction
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Narrow Bridge Ahead"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Bridge abutment left & right */}
          <path d="M30,34 L40,34 L40,46 L46,52 L46,62 L40,68 L40,76 L30,76 Z" fill="#1A1A1A" />
          <path d="M70,34 L60,34 L60,46 L54,52 L54,62 L60,68 L60,76 L70,76 Z" fill="#1A1A1A" />
        </svg>
      );

    case 'slippery_road':
      // Warning Triangle with skidding tire tracks
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Slippery Road Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Car body */}
          <rect x="40" y="38" width="20" height="14" rx="3" fill="#1A1A1A" transform="rotate(-12 50 45)" />
          {/* Wavy tracks */}
          <path d="M38,58 Q34,64 42,70 Q48,76 40,80" fill="none" stroke="#1A1A1A" strokeWidth="3" />
          <path d="M54,58 Q50,64 58,70 Q64,76 56,80" fill="none" stroke="#1A1A1A" strokeWidth="3" />
        </svg>
      );

    case 'school_ahead':
      // Warning Triangle with two children crossing
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="School Ahead Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Child 1 */}
          <circle cx="44" cy="40" r="5" fill="#1A1A1A" />
          <path d="M40,46 L48,46 L46,62 L48,74 L44,74 L42,64 L38,74 L34,74 L38,58 Z" fill="#1A1A1A" />
          {/* Child 2 (smaller with bag) */}
          <circle cx="58" cy="46" r="4" fill="#1A1A1A" />
          <path d="M55,51 L62,51 L60,64 L62,74 L58,74 L57,65 L55,74 L52,74 Z" fill="#1A1A1A" />
          <rect x="61" y="53" width="5" height="7" rx="1" fill="#D32F2F" />
        </svg>
      );

    case 'men_at_work':
      // Warning Triangle with worker with shovel
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Men at Work Warning"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="38" r="5" fill="#1A1A1A" />
          <path d="M45,45 L55,45 L52,60 L62,74 L56,76 L48,64 L44,74 L38,72 L44,56 Z" fill="#1A1A1A" />
          {/* Shovel */}
          <line x1="52" y1="52" x2="68" y2="70" stroke="#1A1A1A" strokeWidth="2.5" />
          <polygon points="68,68 74,74 70,78 64,72" fill="#1A1A1A" />
        </svg>
      );

    case 'speed_breaker':
      // Warning Triangle with speed bump
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Speed Breaker Ahead"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path d="M26,70 L38,70 Q50,46 62,70 L74,70" fill="none" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'roundabout_ahead':
      // Warning Triangle with circular arrows
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Roundabout Ahead"
        >
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#D32F2F"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="56" r="14" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeDasharray="18 8" />
          <polygon points="56,38 64,43 56,48" fill="#1A1A1A" />
          <polygon points="66,66 61,74 55,67" fill="#1A1A1A" />
          <polygon points="34,58 39,50 45,57" fill="#1A1A1A" />
        </svg>
      );

    case 'petrol_pump':
      // Blue rectangle with petrol dispenser
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Petrol Station"
        >
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#1976D2" stroke="#FFFFFF" strokeWidth="2" />
          {/* Pump body */}
          <rect x="28" y="32" width="28" height="42" rx="4" fill="#FFFFFF" />
          <rect x="34" y="38" width="16" height="12" fill="#1976D2" />
          {/* Nozzle hose */}
          <path d="M56,42 Q66,42 66,54 L66,64 L68,60" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'hospital':
      // Blue rectangle with white H and Red Cross
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Hospital Facility"
        >
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#1976D2" stroke="#FFFFFF" strokeWidth="2" />
          <text x="50" y="52" fill="#FFFFFF" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="Arial">
            H
          </text>
          {/* Red Cross */}
          <rect x="46" y="60" width="8" height="20" fill="#D32F2F" rx="1" />
          <rect x="40" y="66" width="20" height="8" fill="#D32F2F" rx="1" />
        </svg>
      );

    case 'parking_bike_car':
      // Blue square with large P
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Parking Zone"
        >
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#0D47A1" stroke="#FFFFFF" strokeWidth="3" />
          <text x="50" y="66" fill="#FFFFFF" fontSize="54" fontWeight="900" textAnchor="middle" fontFamily="Arial">
            P
          </text>
        </svg>
      );

    case 'first_aid':
      // Blue square with Green cross
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="First Aid Post"
        >
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#1976D2" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="24" y="24" width="52" height="52" rx="4" fill="#FFFFFF" />
          <rect x="44" y="32" width="12" height="36" fill="#2E7D32" rx="2" />
          <rect x="32" y="44" width="36" height="12" fill="#2E7D32" rx="2" />
        </svg>
      );

    case 'zebra_crossing':
      // Road surface with pedestrian stripes
      return (
        <svg
          viewBox="0 0 120 80"
          style={{ width: typeof size === 'number' ? `${size * 1.2}px` : size, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Pedestrian Zebra Crossing"
        >
          <rect width="120" height="80" rx="6" fill="#263238" />
          <rect x="15" y="15" width="12" height="50" fill="#FFFFFF" rx="1" />
          <rect x="35" y="15" width="12" height="50" fill="#FFFFFF" rx="1" />
          <rect x="55" y="15" width="12" height="50" fill="#FFFFFF" rx="1" />
          <rect x="75" y="15" width="12" height="50" fill="#FFFFFF" rx="1" />
          <rect x="95" y="15" width="12" height="50" fill="#FFFFFF" rx="1" />
        </svg>
      );

    case 'solid_double_yellow':
      // Dark asphalt with double continuous yellow lines
      return (
        <svg
          viewBox="0 0 120 80"
          style={{ width: typeof size === 'number' ? `${size * 1.2}px` : size, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Double Solid Yellow Line"
        >
          <rect width="120" height="80" rx="6" fill="#263238" />
          <line x1="10" y1="36" x2="110" y2="36" stroke="#FFC107" strokeWidth="5" />
          <line x1="10" y1="44" x2="110" y2="44" stroke="#FFC107" strokeWidth="5" />
        </svg>
      );

    case 'yellow_box_junction':
      // Yellow criss cross grid box
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Yellow Box Junction"
        >
          <rect x="10" y="10" width="80" height="80" rx="4" fill="#263238" stroke="#FFC107" strokeWidth="5" />
          <line x1="10" y1="10" x2="90" y2="90" stroke="#FFC107" strokeWidth="4" />
          <line x1="10" y1="90" x2="90" y2="10" stroke="#FFC107" strokeWidth="4" />
          <line x1="10" y1="50" x2="50" y2="10" stroke="#FFC107" strokeWidth="4" />
          <line x1="50" y1="90" x2="90" y2="50" stroke="#FFC107" strokeWidth="4" />
          <line x1="10" y1="50" x2="50" y2="90" stroke="#FFC107" strokeWidth="4" />
          <line x1="50" y1="10" x2="90" y2="50" stroke="#FFC107" strokeWidth="4" />
        </svg>
      );

    case 'traffic_light_signal':
      // Traffic light pole with red, amber, green lenses
      return (
        <svg
          viewBox="0 0 60 100"
          style={{ width: typeof size === 'number' ? `${(size * 60) / 100}px` : size, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Traffic Light Signal"
        >
          <rect x="12" y="8" width="36" height="84" rx="8" fill="#1A1A1A" stroke="#424242" strokeWidth="3" />
          {/* Red light */}
          <circle cx="30" cy="24" r="10" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
          <circle cx="28" cy="22" r="3" fill="#FFCDD2" opacity="0.8" />
          {/* Amber light */}
          <circle cx="30" cy="50" r="10" fill="#FFA000" stroke="#FF6F00" strokeWidth="2" />
          {/* Green light */}
          <circle cx="30" cy="76" r="10" fill="#43A047" stroke="#1B5E20" strokeWidth="2" />
        </svg>
      );

    default:
      // Fallback generic road sign
      return (
        <svg
          viewBox="0 0 100 100"
          style={{ width, height }}
          className={`shrink-0 drop-shadow-sm ${className}`}
          aria-label="Road Sign"
        >
          <circle cx="50" cy="50" r="45" fill="#FF6B35" stroke="#E85D04" strokeWidth="6" />
          <text x="50" y="58" fill="#FFFFFF" fontSize="24" fontWeight="bold" textAnchor="middle">
            SARTHI
          </text>
        </svg>
      );
  }
};
