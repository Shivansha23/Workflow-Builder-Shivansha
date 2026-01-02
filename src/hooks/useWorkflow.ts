import { useReducer } from "react";
import { workflowReducer } from "../reducer/workflowReducer";
import { initialWorkflowState } from "../types/workflow";
import { AddNodePayload } from "../types/workflow";

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);

  return {
    state,
    addNode: (payload: AddNodePayload) =>
      dispatch({ type: "ADD_NODE", payload }),
    deleteNode: (nodeId: string) =>
      dispatch({ type: "DELETE_NODE", payload: { nodeId } }),
    updateLabel: (nodeId: string, label: string) =>
      dispatch({ type: "UPDATE_LABEL", payload: { nodeId, label } }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
  };
}
