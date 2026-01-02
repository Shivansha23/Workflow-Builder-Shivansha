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
