import React from "react";
import type { NodeType, WorkflowNode } from "../types/workflow";
import { getValidChildTypes } from "../utils/workflowHelpers";
import "./AddNodeMenu.css";

interface AddNodeMenuProps {
  parentNode: WorkflowNode;
  onAddNode: (nodeType: NodeType, branchLabel?: string) => void;
  onClose: () => void;
}

export const AddNodeMenu: React.FC<AddNodeMenuProps> = ({
  parentNode,
  onAddNode,
  onClose,
}) => {
  const validTypes = getValidChildTypes(parentNode);

  if (validTypes.length === 0) {
    return null;
  }

  const handleAddNode = (nodeType: NodeType) => {
    if (parentNode.type === "branch" && nodeType !== "end") {
      // For branch nodes, we need to ask which branch (True/False)
      // For simplicity, we'll add both branches automatically
      // or we can show additional options
      // Let's add to True branch by default
      onAddNode(nodeType, "True");
    } else {
      onAddNode(nodeType);
    }
    onClose();
  };

  const nodeTypeLabels: Record<NodeType, string> = {
    start: "Start",
    action: "Action",
    branch: "Branch",
    end: "End",
  };

  return (
    <div className="add-node-menu">
      <div className="add-node-menu-backdrop" onClick={onClose}></div>
      <div className="add-node-menu-content">
        <h3>Add Node</h3>
        <div className="node-type-buttons">
          {validTypes.map((type) => (
            <button
              key={type}
              className={`node-type-button ${type}`}
              onClick={() => handleAddNode(type)}
            >
              {nodeTypeLabels[type]}
            </button>
          ))}
        </div>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
