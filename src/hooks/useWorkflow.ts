import { useReducer } from "react";
import type {
  AddNodePayload,
} from "../types/workflow";
import { initialWorkflowState } from "../types/workflow";
import { workflowReducer } from "../reducer/workflowReducer";

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);

  const addNode = (payload: AddNodePayload) => {
    dispatch({ type: "ADD_NODE", payload });
  };

  const deleteNode = (nodeId: string) => {
    dispatch({ type: "DELETE_NODE", payload: { nodeId } });
  };

  const updateLabel = (nodeId: string, label: string) => {
    dispatch({ type: "UPDATE_LABEL", payload: { nodeId, label } });
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };

  const saveWorkflow = () => {
    const workflowJson = JSON.stringify(state.nodes, null, 2);
    console.log("Current Workflow State:");
    console.log(workflowJson);
    return workflowJson;
  };

  return {
    state,
    addNode,
    deleteNode,
    updateLabel,
    undo,
    redo,
    saveWorkflow,
  };
}
