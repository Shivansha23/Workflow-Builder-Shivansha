import type { WorkflowNode, NodeType } from "../types/workflow";

/**
 * Generate a unique ID for a new node
 */
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a node type can have children
 */
export function canHaveChildren(nodeType: NodeType): boolean {
  return nodeType !== "end";
}

/**
 * Check if a node can be deleted
 */
export function canDeleteNode(nodeId: string): boolean {
  return nodeId !== "start";
}

/**
 * Get valid node types that can be added as children to a given parent
 */
export function getValidChildTypes(parent: WorkflowNode): NodeType[] {
  if (parent.type === "end") {
    return [];
  }

  if (parent.type === "start") {
    return ["action", "branch", "end"];
  }

  if (parent.type === "action") {
    return ["action", "branch", "end"];
  }

  if (parent.type === "branch") {
    return ["action", "branch", "end"];
  }

  return [];
}

/**
 * Deep clone a state object
 */
export function cloneState<T>(state: T): T {
  return JSON.parse(JSON.stringify(state));
}
