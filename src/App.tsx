import { useEffect } from "react";
import { useWorkflow } from "./hooks/useWorkflow";
import { Node } from "./components/Node/Node";
import { Toolbar } from "./components/Toolbar";
import type { NodeType } from "./types/workflow";
import "./App.css";

function App() {
  const {
    state,
    addNode,
    deleteNode,
    updateLabel,
    undo,
    redo,
    saveWorkflow,
  } = useWorkflow();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          saveWorkflow();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, saveWorkflow]);

  const handleAddNode = (
    parentId: string,
    nodeType: NodeType,
    branchLabel?: string
  ) => {
    addNode({ parentId, nodeType, branchLabel });
  };

  const handleSave = () => {
    saveWorkflow();
    alert("Workflow saved to console! Check the browser console (F12).");
  };

  const canUndo = state.history.length > 0;
  const canRedo = state.future.length > 0;

  return (
    <div className="app">
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onSave={handleSave}
      />
      <div className="workflow-container">
        <div className="workflow-canvas">
          <Node
            nodeId={state.rootId}
            nodes={state.nodes}
            onAddNode={handleAddNode}
            onDeleteNode={deleteNode}
            onUpdateLabel={updateLabel}
          />
        </div>
      </div>
      <div className="instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Click on a node label to edit it</li>
          <li>Click the <strong>+</strong> button to add a child node</li>
          <li>Click the <strong>×</strong> button to delete a node</li>
          <li>Use <strong>Ctrl+Z</strong> to undo and <strong>Ctrl+Y</strong> to redo</li>
          <li>Click <strong>Save</strong> to export workflow to console</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
