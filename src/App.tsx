import { WorkflowProvider } from "./hooks/WorkflowContext";
import { Toolbar } from "./components/Toolbar";
import { Node } from "./components/Node/Node";
import { useWorkflowContext } from "./hooks/WorkflowContext";
import "./App.css";

function WorkflowContent() {
  const { state } = useWorkflowContext();

  return (
    <div className="app">
      <Toolbar />
      <div className="workflow-container">
        <Node nodeId={state.rootId} />
      </div>
    </div>
  );
}

function App() {
  return (
    <WorkflowProvider>
      <WorkflowContent />
    </WorkflowProvider>
  );
}

export default App;
