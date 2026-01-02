import React, { useState, useRef, useEffect } from "react";
import type { WorkflowNode, NodeType } from "../../types/workflow";
import { canDeleteNode, canHaveChildren } from "../../utils/workflowHelpers";
import { AddNodeMenu } from "../AddNodeMenu";
import "./Node.css";

interface NodeProps {
  nodeId: string;
  nodes: Record<string, WorkflowNode>;
  onAddNode: (parentId: string, nodeType: NodeType, branchLabel?: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateLabel: (nodeId: string, label: string) => void;
}

export const Node: React.FC<NodeProps> = ({
  nodeId,
  nodes,
  onAddNode,
  onDeleteNode,
  onUpdateLabel,
}) => {
  const node = nodes[nodeId];
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(node.label);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!node) {
    return null;
  }

  const handleLabelClick = () => {
    setIsEditing(true);
    setEditedLabel(node.label);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    if (editedLabel.trim() !== "" && editedLabel !== node.label) {
      onUpdateLabel(nodeId, editedLabel.trim());
    } else {
      setEditedLabel(node.label);
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLabelBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedLabel(node.label);
    }
  };

  const handleAddNodeClick = () => {
    setShowAddMenu(true);
  };

  const handleAddNode = (nodeType: NodeType, branchLabel?: string) => {
    onAddNode(nodeId, nodeType, branchLabel);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${node.label}"?`)) {
      onDeleteNode(nodeId);
    }
  };

  // Render branch children in separate columns
  const renderBranchChildren = () => {
    const trueChildren = node.children.filter(
      (childId) => nodes[childId]?.branchLabel === "True"
    );
    const falseChildren = node.children.filter(
      (childId) => nodes[childId]?.branchLabel === "False"
    );

    return (
      <div className="branch-children">
        <div className="branch-path">
          <div className="branch-label">True</div>
          <div className="branch-content">
            {trueChildren.map((childId) => (
              <Node
                key={childId}
                nodeId={childId}
                nodes={nodes}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onUpdateLabel={onUpdateLabel}
              />
            ))}
          </div>
        </div>
        <div className="branch-path">
          <div className="branch-label">False</div>
          <div className="branch-content">
            {falseChildren.map((childId) => (
              <Node
                key={childId}
                nodeId={childId}
                nodes={nodes}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onUpdateLabel={onUpdateLabel}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render regular children
  const renderChildren = () => {
    return (
      <div className="node-children">
        {node.children.map((childId) => (
          <Node
            key={childId}
            nodeId={childId}
            nodes={nodes}
            onAddNode={onAddNode}
            onDeleteNode={onDeleteNode}
            onUpdateLabel={onUpdateLabel}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="node-container">
      <div className={`node ${node.type}`}>
        <div className="node-header">
          <span className="node-type-badge">{node.type}</span>
          <div className="node-actions">
            {canHaveChildren(node.type) && (
              <button
                className="node-action-button add"
                onClick={handleAddNodeClick}
                title="Add child node"
              >
                +
              </button>
            )}
            {canDeleteNode(nodeId) && (
              <button
                className="node-action-button delete"
                onClick={handleDeleteClick}
                title="Delete node"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="node-content">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="node-label-input"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
            />
          ) : (
            <div className="node-label" onClick={handleLabelClick}>
              {node.label}
            </div>
          )}
        </div>
      </div>

      {node.children.length > 0 && (
        <>
          <div className="node-connector"></div>
          {node.type === "branch"
            ? renderBranchChildren()
            : renderChildren()}
        </>
      )}

      {showAddMenu && (
        <AddNodeMenu
          parentNode={node}
          onAddNode={handleAddNode}
          onClose={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
};
