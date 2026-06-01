import React, { useState, useRef, useEffect } from "react";
import "./AVLVisualizer.css";

interface Node {
  value: number;
  left: Node | null;
  right: Node | null;
  height: number;
  x?: number;
  y?: number;
}

const AVLVisualizer: React.FC = () => {

  const [root, setRoot] = useState<Node | null>(null);
  const [input, setInput] = useState("");
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [rotation, setRotation] = useState("");
  const [width, setWidth] = useState(800);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const height = (n: Node | null) => (n ? n.height : 0);

  const getBalance = (n: Node | null) =>
    n ? height(n.left) - height(n.right) : 0;

  const rightRotate = (y: Node): Node => {

    setRotation("LL Rotation");

    const x = y.left!;
    const t2 = x.right;

    x.right = y;
    y.left = t2;

    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;

    return x;
  };

  const leftRotate = (x: Node): Node => {

    setRotation("RR Rotation");

    const y = x.right!;
    const t2 = y.left;

    y.left = x;
    x.right = t2;

    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;

    return y;
  };

  const insert = (node: Node | null, val: number): Node => {

    if (!node)
      return { value: val, left: null, right: null, height: 1 };

    if (val < node.value)
      node.left = insert(node.left, val);
    else if (val > node.value)
      node.right = insert(node.right, val);
    else
      return node;

    node.height = 1 + Math.max(height(node.left), height(node.right));

    const balance = getBalance(node);

    if (balance > 1 && val < node.left!.value)
      return rightRotate(node);

    if (balance < -1 && val > node.right!.value)
      return leftRotate(node);

    if (balance > 1 && val > node.left!.value) {

      setRotation("LR Rotation");

      node.left = leftRotate(node.left!);
      return rightRotate(node);
    }

    if (balance < -1 && val < node.right!.value) {

      setRotation("RL Rotation");

      node.right = rightRotate(node.right!);
      return leftRotate(node);
    }

    return node;
  };

  const handleInsert = () => {

    const num = parseInt(input);
    if (isNaN(num)) return;

    const newRoot = insert(root, num);

    setRoot({ ...newRoot });
    setInput("");
  };

  const handleSearch = () => {

    const num = parseInt(input);
    if (isNaN(num)) return;

    setSearchValue(num);
  };

  const resetTree = () => {

    setRoot(null);
    setRotation("");
    setSearchValue(null);
  };

  /* -------- TREE LAYOUT -------- */

  const calculatePositions = (
    node: Node | null,
    depth = 0,
    left = 0,
    right = width
  ) => {

    if (!node) return;

    const mid = (left + right) / 2;

    node.x = mid;
    node.y = depth * 110 + 80;

    calculatePositions(node.left, depth + 1, left, mid);
    calculatePositions(node.right, depth + 1, mid, right);
  };

  const collectNodes = (node: Node | null, arr: Node[]) => {

    if (!node) return;

    arr.push(node);

    collectNodes(node.left, arr);
    collectNodes(node.right, arr);
  };

  const nodes: Node[] = [];

  if (root) {

    calculatePositions(root);

    collectNodes(root, nodes);
  }

  return (

    <div className="avl-wrapper">

      <h2 className="avl-title">AVL Tree Simulator</h2>

      <div className="controls">

        <input
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="insert-btn" onClick={handleInsert}>
          Insert
        </button>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

        <button className="reset-btn" onClick={resetTree}>
          Simulate / Reset
        </button>

      </div>

      {rotation && (
        <div className="rotation-info">{rotation}</div>
      )}

      <div ref={containerRef} className="tree-area">

        <svg width="100%" height="500">

          {nodes.map((node, i) => (

            <g key={i}>

              {node.left && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={node.left.x}
                  y2={node.left.y}
                  className="tree-edge"
                />
              )}

              {node.right && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={node.right.x}
                  y2={node.right.y}
                  className="tree-edge"
                />
              )}

            </g>
          ))}

        </svg>

        {nodes.map((node, i) => (

          <div
            key={i}
            className={`node ${
              node.value === searchValue ? "node-found" : ""
            }`}
            style={{
              left: node.x,
              top: node.y
            }}
          >
            {node.value}
          </div>

        ))}

        {!root && (
          <p className="empty-tree">Tree is empty</p>
        )}

      </div>

    </div>
  );
};

export default AVLVisualizer;