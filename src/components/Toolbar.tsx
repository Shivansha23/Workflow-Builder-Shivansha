import React from "react";
import "./Toolbar.css";

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-title">
        <h1>Workflow Builder</h1>
      </div>
      <div className="toolbar-actions">
        <button
          className="toolbar-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          className="toolbar-button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
        <button
          className="toolbar-button primary"
          onClick={onSave}
          title="Save workflow to console"
        >
          💾 Save
        </button>
      </div>
    </div>
  );
};
