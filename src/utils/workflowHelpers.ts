import { WorkflowNode } from "../types/workflow";

export function generateUUID(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function canAddChild(node: WorkflowNode): boolean {
  return node.type !== "end";
}

export function canDelete(nodeId: string, rootId: string): boolean {
  return nodeId !== rootId;
}

export function getNodesByIds(
  nodes: Record<string, WorkflowNode>,
  ids: string[]
): WorkflowNode[] {
  return ids.map((id) => nodes[id]).filter(Boolean);
}
