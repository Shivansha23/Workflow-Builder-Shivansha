import { useWorkflowContext } from "../hooks/WorkflowContext";
import "./Toolbar.css";

export function Toolbar() {
  const { state, undo, redo } = useWorkflowContext();

  const canUndo = state.history.length > 0;
  const canRedo = state.future.length > 0;

  const handleSave = () => {
    const workflowJSON = JSON.stringify(state.nodes, null, 2);
    console.log("=== Workflow JSON ===");
    console.log(workflowJSON);
    alert("Workflow saved to console! Check browser console (F12) for JSON output.");
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h1 className="toolbar-title">Workflow Builder</h1>
      </div>
      <div className="toolbar-section toolbar-actions">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="toolbar-btn"
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="toolbar-btn"
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
        <button onClick={handleSave} className="toolbar-btn save-btn">
          💾 Save
        </button>
      </div>
    </div>
  );
}
