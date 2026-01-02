import type {
  WorkflowState,
  WorkflowAction,
  WorkflowNode,
  AddNodePayload,
} from "../types/workflow";
import { generateUUID, canDelete } from "../utils/workflowHelpers";

function saveToHistory(state: WorkflowState): WorkflowState {
  return {
    ...state,
    history: [
      ...state.history,
      {
        nodes: { ...state.nodes },
        rootId: state.rootId,
        history: [],
        future: [],
      },
    ],
    future: [],
  };
}

function addNode(state: WorkflowState, payload: AddNodePayload): WorkflowState {
  const { parentId, nodeType, branchLabel } = payload;
  const parent = state.nodes[parentId];

  if (!parent) {
    console.error("Parent node not found");
    return state;
  }

  // End nodes cannot have children
  if (parent.type === "end") {
    console.error("Cannot add child to End node");
    return state;
  }

  const newNodeId = generateUUID();
  const newNode: WorkflowNode = {
    id: newNodeId,
    type: nodeType,
    label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
    children: [],
    parentId,
    branchLabel,
  };

  const newNodes = { ...state.nodes };
  newNodes[newNodeId] = newNode;

  // Update parent's children
  if (parent.type === "action") {
    // Action nodes can have only one child - replace or append
    newNodes[parentId] = {
      ...parent,
      children: [newNodeId],
    };
  } else if (parent.type === "branch") {
    // Branch nodes can have multiple children (True/False branches)
    newNodes[parentId] = {
      ...parent,
      children: [...parent.children, newNodeId],
    };
  } else {
    // Start nodes can have children
    newNodes[parentId] = {
      ...parent,
      children: [...parent.children, newNodeId],
    };
  }

  return {
    ...state,
    nodes: newNodes,
  };
}

function deleteNode(
  state: WorkflowState,
  nodeId: string
): WorkflowState {
  if (!canDelete(nodeId, state.rootId)) {
    console.error("Cannot delete root node");
    return state;
  }

  const targetNode = state.nodes[nodeId];
  if (!targetNode || !targetNode.parentId) {
    console.error("Node not found or has no parent");
    return state;
  }

  const parentNode = state.nodes[targetNode.parentId];
  if (!parentNode) {
    console.error("Parent node not found");
    return state;
  }

  const newNodes = { ...state.nodes };

  // Remove target from parent's children
  const parentChildren = parentNode.children.filter((id) => id !== nodeId);

  // Append target's children to parent's children
  const updatedChildren = [...parentChildren, ...targetNode.children];

  // Update parent
  newNodes[targetNode.parentId] = {
    ...parentNode,
    children: updatedChildren,
  };

  // Update each child's parentId
  targetNode.children.forEach((childId) => {
    if (newNodes[childId]) {
      newNodes[childId] = {
        ...newNodes[childId],
        parentId: targetNode.parentId,
        branchLabel: undefined, // Clear branch label when reparenting
      };
    }
  });

  // Delete the target node
  delete newNodes[nodeId];

  return {
    ...state,
    nodes: newNodes,
  };
}

function updateLabel(
  state: WorkflowState,
  nodeId: string,
  label: string
): WorkflowState {
  const node = state.nodes[nodeId];
  if (!node) {
    console.error("Node not found");
    return state;
  }

  const newNodes = { ...state.nodes };
  newNodes[nodeId] = {
    ...node,
    label,
  };

  return {
    ...state,
    nodes: newNodes,
  };
}

export function workflowReducer(
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState {
  switch (action.type) {
    case "ADD_NODE": {
      const newState = saveToHistory(state);
      return addNode(newState, action.payload);
    }

    case "DELETE_NODE": {
      const newState = saveToHistory(state);
      return deleteNode(newState, action.payload.nodeId);
    }

    case "UPDATE_LABEL": {
      const newState = saveToHistory(state);
      return updateLabel(newState, action.payload.nodeId, action.payload.label);
    }

    case "UNDO": {
      if (state.history.length === 0) {
        return state;
      }

      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      return {
        ...previousState,
        history: newHistory,
        future: [
          ...state.future,
          {
            nodes: { ...state.nodes },
            rootId: state.rootId,
            history: [],
            future: [],
          },
        ],
      };
    }

    case "REDO": {
      if (state.future.length === 0) {
        return state;
      }

      const nextState = state.future[state.future.length - 1];
      const newFuture = state.future.slice(0, -1);

      return {
        ...nextState,
        history: [
          ...state.history,
          {
            nodes: { ...state.nodes },
            rootId: state.rootId,
            history: [],
            future: [],
          },
        ],
        future: newFuture,
      };
    }

    default:
      return state;
  }
}
