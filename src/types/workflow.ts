export type NodeType = "start" | "action" | "branch" | "end";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  children: string[];
  parentId?: string;
  branchLabel?: string; // used only for branch children
}

export interface WorkflowState {
  nodes: Record<string, WorkflowNode>;
  rootId: string;
  history: WorkflowState[];
  future: WorkflowState[];
}

export interface AddNodePayload {
  parentId: string;
  nodeType: NodeType;
  branchLabel?: string;
}

export type WorkflowAction =
  | { type: "ADD_NODE"; payload: AddNodePayload }
  | { type: "DELETE_NODE"; payload: { nodeId: string } }
  | { type: "UPDATE_LABEL"; payload: { nodeId: string; label: string } }
  | { type: "UNDO" }
  | { type: "REDO" };

export const initialWorkflowState: WorkflowState = {
  rootId: "start",
  nodes: {
    start: {
      id: "start",
      type: "start",
      label: "Start",
      children: [],
    },
  },
  history: [],
  future: [],
};
