import type {
  WorkflowState,
  WorkflowNode,
  AddNodePayload,
} from "../types/workflow";
import { initialWorkflowState } from "../types/workflow";
import {
  generateNodeId,
  canHaveChildren,
  canDeleteNode,
  cloneState,
} from "../utils/workflowHelpers";

export type WorkflowAction =
  | { type: "ADD_NODE"; payload: AddNodePayload }
  | { type: "DELETE_NODE"; payload: { nodeId: string } }
  | { type: "UPDATE_LABEL"; payload: { nodeId: string; label: string } }
  | { type: "UNDO" }
  | { type: "REDO" };

/**
 * Save current state to history before mutation
 */
function saveToHistory(state: WorkflowState): WorkflowState {
  const currentSnapshot = {
    nodes: cloneState(state.nodes),
    rootId: state.rootId,
    history: [],
    future: [],
  };

  return {
    ...state,
    history: [...state.history, currentSnapshot],
    future: [],
  };
}

/**
 * Add a new node to the workflow
 */
function addNode(state: WorkflowState, payload: AddNodePayload): WorkflowState {
  const { parentId, nodeType, branchLabel } = payload;
  const parent = state.nodes[parentId];

  if (!parent) {
    console.error(`Parent node ${parentId} not found`);
    return state;
  }

  if (!canHaveChildren(parent.type)) {
    console.error(`Node type ${parent.type} cannot have children`);
    return state;
  }

  // Generate new node
  const newNodeId = generateNodeId();
  const newNode: WorkflowNode = {
    id: newNodeId,
    type: nodeType,
    label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
    children: [],
    parentId: parentId,
    branchLabel: branchLabel,
  };

  const newState = saveToHistory(state);
  const updatedNodes = { ...newState.nodes };

  // Add the new node
  updatedNodes[newNodeId] = newNode;

  // Update parent's children
  if (parent.type === "action") {
    // Action nodes: replace if exists, otherwise append
    if (parent.children.length > 0) {
      // Replace the first child
      const oldChildId = parent.children[0];
      updatedNodes[parentId] = {
        ...parent,
        children: [newNodeId],
      };
      // Update old child to point to new node as parent
      if (updatedNodes[oldChildId]) {
        updatedNodes[oldChildId] = {
          ...updatedNodes[oldChildId],
          parentId: newNodeId,
        };
        updatedNodes[newNodeId].children = [oldChildId];
      }
    } else {
      updatedNodes[parentId] = {
        ...parent,
        children: [newNodeId],
      };
    }
  } else {
    // Other nodes: append to children
    updatedNodes[parentId] = {
      ...parent,
      children: [...parent.children, newNodeId],
    };
  }

  return {
    ...newState,
    nodes: updatedNodes,
  };
}

/**
 * Delete a node from the workflow
 * Algorithm:
 * 1. Get target node and parent node
 * 2. Remove target from parent.children
 * 3. Append target.children to parent.children (in place of deleted node)
 * 4. Update each child's parentId to point to parent
 * 5. Delete node from nodes
 */
function deleteNode(
  state: WorkflowState,
  nodeId: string
): WorkflowState {
  if (!canDeleteNode(nodeId)) {
    console.error("Cannot delete root node");
    return state;
  }

  const targetNode = state.nodes[nodeId];
  if (!targetNode) {
    console.error(`Node ${nodeId} not found`);
    return state;
  }

  const parentId = targetNode.parentId;
  if (!parentId) {
    console.error("Cannot delete node without parent");
    return state;
  }

  const parent = state.nodes[parentId];
  if (!parent) {
    console.error(`Parent node ${parentId} not found`);
    return state;
  }

  const newState = saveToHistory(state);
  const updatedNodes = { ...newState.nodes };

  // Find the index of the target node in parent's children
  const targetIndex = parent.children.indexOf(nodeId);
  if (targetIndex === -1) {
    console.error(`Node ${nodeId} not found in parent's children`);
    return state;
  }

  // Remove target from parent's children and insert target's children in its place
  const newChildren = [
    ...parent.children.slice(0, targetIndex),
    ...targetNode.children,
    ...parent.children.slice(targetIndex + 1),
  ];

  updatedNodes[parentId] = {
    ...parent,
    children: newChildren,
  };

  // Update each of target's children to point to parent
  targetNode.children.forEach((childId) => {
    if (updatedNodes[childId]) {
      updatedNodes[childId] = {
        ...updatedNodes[childId],
        parentId: parentId,
        branchLabel: targetNode.branchLabel, // Preserve branch label if target was a branch child
      };
    }
  });

  // Delete the target node
  delete updatedNodes[nodeId];

  return {
    ...newState,
    nodes: updatedNodes,
  };
}

/**
 * Update a node's label
 */
function updateLabel(
  state: WorkflowState,
  nodeId: string,
  label: string
): WorkflowState {
  const node = state.nodes[nodeId];
  if (!node) {
    console.error(`Node ${nodeId} not found`);
    return state;
  }

  const newState = saveToHistory(state);
  const updatedNodes = { ...newState.nodes };

  updatedNodes[nodeId] = {
    ...node,
    label: label,
  };

  return {
    ...newState,
    nodes: updatedNodes,
  };
}

/**
 * Undo the last action
 */
function undo(state: WorkflowState): WorkflowState {
  if (state.history.length === 0) {
    return state;
  }

  const previousState = state.history[state.history.length - 1];
  const currentSnapshot = {
    nodes: cloneState(state.nodes),
    rootId: state.rootId,
    history: [],
    future: [],
  };

  return {
    nodes: previousState.nodes,
    rootId: previousState.rootId,
    history: state.history.slice(0, -1),
    future: [currentSnapshot, ...state.future],
  };
}

/**
 * Redo the last undone action
 */
function redo(state: WorkflowState): WorkflowState {
  if (state.future.length === 0) {
    return state;
  }

  const nextState = state.future[0];
  const currentSnapshot = {
    nodes: cloneState(state.nodes),
    rootId: state.rootId,
    history: [],
    future: [],
  };

  return {
    nodes: nextState.nodes,
    rootId: nextState.rootId,
    history: [...state.history, currentSnapshot],
    future: state.future.slice(1),
  };
}

/**
 * Main reducer function
 */
export function workflowReducer(
  state: WorkflowState = initialWorkflowState,
  action: WorkflowAction
): WorkflowState {
  switch (action.type) {
    case "ADD_NODE":
      return addNode(state, action.payload);

    case "DELETE_NODE":
      return deleteNode(state, action.payload.nodeId);

    case "UPDATE_LABEL":
      return updateLabel(state, action.payload.nodeId, action.payload.label);

    case "UNDO":
      return undo(state);

    case "REDO":
      return redo(state);

    default:
      return state;
  }
}
