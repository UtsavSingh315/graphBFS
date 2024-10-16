import React from "react";
import { getStraightPath } from "@xyflow/react";

function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle
        cx={toX}
        cy={toY}
        fill="purple"
        r={3}
        stroke="purple"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default CustomConnectionLine;
