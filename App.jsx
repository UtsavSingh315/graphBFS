import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";

var nodeCount = 2;
var adjacencyMatrix = [];
const initialNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 150, y: 0 },
  },
];

const initialEdges = [];
const connectionLineStyle = {
  strokeWidth: 3,
  stroke: "black",
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

let defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: "purple" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "purple",
  },
};

const EasyConnectExample = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [startNodeIndex, setStartNodeIndex] = useState(0);
  const [endNodeIndex, setEndNodeIndex] = useState(1);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Adjacency matrix
  const createAdjacencyMatrix = () => {
    adjacencyMatrix = Array.from({ length: nodeCount }, () =>
      Array(nodeCount).fill(0)
    );

    edges.forEach((edge) => {
      const source = parseInt(edge.source) - 1;
      const target = parseInt(edge.target) - 1;
      adjacencyMatrix[source][target] = 1;
    });

    console.log(adjacencyMatrix);
  };

  const findShortestPath = (startNode, endNode) => {
    const numNodes = adjacencyMatrix.length;
    const visited = Array(numNodes).fill(false);
    const queue = [];
    const paths = Array(numNodes).fill(null);

    queue.push(startNode);
    visited[startNode] = true;
    paths[startNode] = [startNode];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode === endNode) {
        const path = paths[currentNode].map((node) => node + 1);
        const updatedEdges = edges.map((edge) => ({ ...edge }));

        for (let i = 0; i < path.length - 1; i++) {
          const source = path[i];
          const target = path[i + 1];
          const edgeIndex = updatedEdges.findIndex(
            (e) =>
              e.source === source.toString() && e.target === target.toString()
          );

          if (edgeIndex !== -1) {
            updatedEdges[edgeIndex] = {
              ...updatedEdges[edgeIndex],
              animated: true,
            };
          }
        }

        setEdges(updatedEdges);
        return path;
      }

      for (let neighbor = 0; neighbor < numNodes; neighbor++) {
        if (
          adjacencyMatrix[currentNode][neighbor] === 1 &&
          !visited[neighbor]
        ) {
          visited[neighbor] = true;
          queue.push(neighbor);
          paths[neighbor] = [...paths[currentNode], neighbor];
        }
      }
    }
    alert("No path found!");
    return null;
  };

  return (
    <>
      <div className="floating-box">
        <input
          type="number"
          value={startNodeIndex + 1}
          onChange={(e) => setStartNodeIndex(Number(e.target.value) - 1)}
          placeholder="Start Node (1-based)"
        />
        <input
          type="number"
          value={endNodeIndex + 1}
          onChange={(e) => setEndNodeIndex(Number(e.target.value) - 1)}
          placeholder="End Node (1-based)"
        />

        <button
          className="aButton add"
          onClick={() => {
            const lastNode = nodes[nodes.length - 1];
            const newPosition = {
              x: lastNode.position.x + 150,
              y: lastNode.position.y,
            };

            const newNode = {
              id: (nodeCount + 1).toString(),
              type: "custom",
              position: newPosition,
            };

            setNodes((prevNodes) => [...prevNodes, newNode]);
            nodeCount++;
          }}>
          +
        </button>

        <button
          className="aButton calc"
          onClick={() => {
            createAdjacencyMatrix();

            const shortestPath = findShortestPath(startNodeIndex, endNodeIndex);
            console.log(
              "Shortest Path from Node",
              startNodeIndex + 1,
              "to Node",
              endNodeIndex + 1,
              ": ",
              shortestPath.map((node) => node)
            );
            console.log("Updated Edges: ", edges);
          }}>
          ~
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}>
        <Background />
      </ReactFlow>
    </>
  );
};

export default EasyConnectExample;
