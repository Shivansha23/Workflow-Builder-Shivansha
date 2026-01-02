import { useState, useRef, useEffect } from "react";
import type { NodeType } from "../../types/workflow";
import { AddNodeMenu } from "../AddNodeMenu";
import { useWorkflowContext } from "../../hooks/WorkflowContext";
import "./Node.css";

interface NodeProps {
  nodeId: string;
}

export function Node({ nodeId }: NodeProps) {
  const { state, addNode, deleteNode, updateLabel } = useWorkflowContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const node = state.nodes[nodeId];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as HTMLElement)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  if (!node) {
    return null;
  }

  const handleLabelClick = () => {
    setEditValue(node.label);
    setIsEditing(true);
  };

  const handleLabelSubmit = () => {
    if (editValue.trim()) {
      updateLabel(nodeId, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLabelSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleAddNode = (nodeType: NodeType, branchLabel?: string) => {
    addNode({
      parentId: nodeId,
      nodeType,
      branchLabel,
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (node.id !== state.rootId) {
      deleteNode(nodeId);
    }
  };

  const canAddChildren = node.type !== "end";
  const canDelete = node.id !== state.rootId;

  const getNodeClass = () => {
    const baseClass = "node";
    return `${baseClass} ${baseClass}--${node.type}`;
  };

  return (
    <div className="node-container">
      <div className={getNodeClass()}>
        {node.branchLabel && (
          <div className="node-branch-label">{node.branchLabel}</div>
        )}
        <div className="node-content">
          <div className="node-type-badge">{node.type}</div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyDown={handleKeyDown}
              className="node-label-input"
            />
          ) : (
            <div className="node-label" onClick={handleLabelClick}>
              {node.label}
            </div>
          )}
        </div>
        <div className="node-actions">
          {canAddChildren && (
            <button
              className="node-action-btn add-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="Add child node"
            >
              +
            </button>
          )}
          {canDelete && (
            <button
              className="node-action-btn delete-btn"
              onClick={handleDelete}
              title="Delete node"
            >
              ×
            </button>
          )}
        </div>
        {showMenu && (
          <div ref={menuRef} className="node-menu-wrapper">
            <AddNodeMenu
              onSelect={handleAddNode}
              onCancel={() => setShowMenu(false)}
              parentType={node.type}
            />
          </div>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="node-children">
          {node.type === "branch" ? (
            <div className="branch-children">
              {node.children.map((childId) => (
                <div key={childId} className="branch-child">
                  <Node nodeId={childId} />
                </div>
              ))}
            </div>
          ) : (
            node.children.map((childId) => (
              <div key={childId} className="node-child">
                <Node nodeId={childId} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
