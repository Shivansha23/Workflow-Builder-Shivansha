import { createContext, useContext, ReactNode } from "react";
import { useWorkflow } from "../hooks/useWorkflow";
import { WorkflowState, AddNodePayload } from "../types/workflow";

interface WorkflowContextType {
  state: WorkflowState;
  addNode: (payload: AddNodePayload) => void;
  deleteNode: (nodeId: string) => void;
  updateLabel: (nodeId: string, label: string) => void;
  undo: () => void;
  redo: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const workflow = useWorkflow();

  return (
    <WorkflowContext.Provider value={workflow}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflowContext must be used within WorkflowProvider");
  }
  return context;
}
