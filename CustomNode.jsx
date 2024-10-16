import { Handle, Position, useConnection } from "@xyflow/react";

export default function CustomNode({ id }) {
  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  const label = id;

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        style={{
          borderStyle: isTarget ? "dashed" : "solid",
          backgroundColor: isTarget ? "#e2aaf3" : "#be60da",
        }}>
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}

        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Left}
            type="target"
            isConnectableStart={false}
          />
        )}
        {label}
      </div>
    </div>
  );
}
