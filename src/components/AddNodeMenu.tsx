import { useState } from "react";
import type { NodeType } from "../types/workflow";
import "./AddNodeMenu.css";

interface AddNodeMenuProps {
  onSelect: (nodeType: NodeType, branchLabel?: string) => void;
  onCancel: () => void;
  parentType: NodeType;
}

export function AddNodeMenu({ onSelect, onCancel, parentType }: AddNodeMenuProps) {
  const [selectedType, setSelectedType] = useState<NodeType | null>(null);

  const canAddAction = parentType !== "end";
  const canAddBranch = parentType !== "end";
  const canAddEnd = parentType !== "end";

  const handleSelect = (type: NodeType) => {
    if (type === "start") return; // Cannot add Start nodes

    if (type === "branch") {
      // For branch, we need to add two children with labels
      setSelectedType(type);
    } else {
      onSelect(type);
    }
  };

  const handleBranchSelect = (label: string) => {
    if (selectedType === "branch") {
      onSelect("branch", label);
      setSelectedType(null);
    } else {
      onSelect(selectedType as NodeType, label);
    }
  };

  if (selectedType === "branch") {
    return (
      <div className="add-node-menu">
        <div className="menu-header">Select Branch Type</div>
        <button onClick={() => handleBranchSelect("True")} className="menu-button">
          True Branch
        </button>
        <button onClick={() => handleBranchSelect("False")} className="menu-button">
          False Branch
        </button>
        <button onClick={() => setSelectedType(null)} className="menu-button cancel">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="add-node-menu">
      <div className="menu-header">Add Node</div>
      {canAddAction && (
        <button onClick={() => handleSelect("action")} className="menu-button">
          Action
        </button>
      )}
      {canAddBranch && (
        <button onClick={() => handleSelect("branch")} className="menu-button">
          Branch
        </button>
      )}
      {canAddEnd && (
        <button onClick={() => handleSelect("end")} className="menu-button">
          End
        </button>
      )}
      <button onClick={onCancel} className="menu-button cancel">
        Cancel
      </button>
    </div>
  );
}
