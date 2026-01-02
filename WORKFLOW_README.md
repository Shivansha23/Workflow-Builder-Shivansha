# Workflow Builder

A deterministic workflow editor built with React, TypeScript, and useReducer. Features tree-based layout with recursive rendering, correct node manipulation, and undo/redo functionality.

## 🚀 Features

- **Tree-Based Layout**: Vertical flow with automatic node arrangement
- **Node Types**: Start, Action, Branch, and End nodes
- **Inline Editing**: Click any node label to edit
- **Add/Delete Nodes**: Context-aware node addition with proper validation
- **Branch Logic**: Support for True/False conditional branches
- **Undo/Redo**: Full history management with time-travel debugging
- **Save Workflow**: Export workflow state as JSON
- **Pure React**: No external UI or diagram libraries

## 🏗️ Architecture

### Data Model

The application uses a tree structure stored in a flat object for O(1) lookups:

```typescript
interface WorkflowNode {
  id: string;
  type: "start" | "action" | "branch" | "end";
  label: string;
  children: string[];
  parentId?: string;
  branchLabel?: string; // "True" or "False" for branch children
}

interface WorkflowState {
  nodes: Record<string, WorkflowNode>;
  rootId: string;
  history: WorkflowState[];
  future: WorkflowState[];
}
```

### State Management

Uses `useReducer` for predictable state updates with five actions:

1. **ADD_NODE**: Creates new node and links to parent
2. **DELETE_NODE**: Removes node and relinks children to parent
3. **UPDATE_LABEL**: Changes node label
4. **UNDO**: Restores previous state from history
5. **REDO**: Restores next state from future

### Delete Node Logic (Critical Algorithm)

The delete operation maintains tree integrity by:

1. Getting target node and its parent
2. Removing target from parent's children array
3. Appending target's children to parent's children
4. Updating each child's `parentId` to skip the deleted node
5. Removing target from nodes dictionary

```typescript
function deleteNode(state: WorkflowState, nodeId: string): WorkflowState {
  const targetNode = state.nodes[nodeId];
  const parentNode = state.nodes[targetNode.parentId];
  
  const newNodes = { ...state.nodes };
  
  // Remove target from parent's children
  const parentChildren = parentNode.children.filter(id => id !== nodeId);
  
  // Append target's children to parent
  const updatedChildren = [...parentChildren, ...targetNode.children];
  
  // Update parent
  newNodes[targetNode.parentId] = {
    ...parentNode,
    children: updatedChildren
  };
  
  // Update each child's parentId
  targetNode.children.forEach(childId => {
    newNodes[childId] = {
      ...newNodes[childId],
      parentId: targetNode.parentId,
      branchLabel: undefined // Clear branch labels when reparenting
    };
  });
  
  // Delete target node
  delete newNodes[nodeId];
  
  return { ...state, nodes: newNodes };
}
```

This ensures:
- No orphaned nodes
- Tree connectivity preserved
- Children correctly reparented
- Branch labels cleared when moving out of branch context

### Rendering Strategy

Uses recursive component rendering:

```tsx
<Node nodeId={state.rootId} />
  → renders children
    → each child renders as <Node nodeId={childId} />
      → recursively renders their children
```

Benefits:
- Natural tree traversal
- Automatic depth handling
- Simple mental model
- No manual tree walking

### Component Structure

```
src/
├── types/
│   └── workflow.ts          # Type definitions & initial state
├── reducer/
│   └── workflowReducer.ts   # State update logic
├── hooks/
│   ├── useWorkflow.ts       # Workflow hook wrapper
│   └── WorkflowContext.tsx  # Context provider
├── utils/
│   └── workflowHelpers.ts   # UUID generation, validation
├── components/
│   ├── Node/
│   │   ├── Node.tsx         # Recursive node component
│   │   └── Node.css         # Node styling
│   ├── AddNodeMenu.tsx      # Node type selector
│   ├── AddNodeMenu.css
│   ├── Toolbar.tsx          # Top bar with undo/redo/save
│   └── Toolbar.css
└── App.tsx                  # Root component with provider
```

## 🎯 Design Decisions & Trade-offs

### 1. Flat Node Storage vs Nested Tree
**Chosen**: Flat dictionary (`Record<string, WorkflowNode>`)

**Why**:
- O(1) node lookups by ID
- Easy to update any node without tree traversal
- Simpler delete logic (no recursive tree rebuilding)

**Trade-off**: Must maintain parent/child relationships manually

### 2. useReducer vs useState
**Chosen**: `useReducer`

**Why**:
- Centralized state logic
- Built-in action pattern for history
- Easier to test and debug
- Better for undo/redo implementation

**Trade-off**: More boilerplate for simple updates

### 3. Recursive Rendering vs Iterative
**Chosen**: Recursive components

**Why**:
- Matches tree structure naturally
- Automatic depth handling
- Cleaner code
- React handles the call stack

**Trade-off**: Deep trees could hit stack limits (unlikely in practice)

### 4. CSS vs Animation Libraries
**Chosen**: Pure CSS with transitions

**Why**:
- No dependencies
- Full control
- Lightweight
- Sufficient for this use case

**Trade-off**: Complex animations harder to implement

### 5. Inline Add Menu vs Modal
**Chosen**: Inline positioned menu

**Why**:
- Better UX (context-aware placement)
- No overlay management
- Feels more integrated

**Trade-off**: Positioning complexity near viewport edges

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 💻 Usage

1. **Add Node**: Click the `+` button on any node (except End nodes)
2. **Edit Label**: Click any node label to edit inline
3. **Delete Node**: Click the `×` button (except on Start node)
4. **Branch Node**: Select "Branch" → Choose "True" or "False" label
5. **Undo/Redo**: Use toolbar buttons
6. **Save**: Click "Save" to export JSON to console

## 🔒 Constraints & Validation

- Start node cannot be deleted
- End nodes cannot have children
- Action nodes can have one child (replaced on add)
- Branch nodes can have multiple children with labels
- Root node is always "start"

## 🧪 Testing Scenarios

1. **Add Action Chain**: Start → Action → Action → End
2. **Add Branch**: Start → Branch → (True: Action, False: End)
3. **Delete Middle Node**: Verify children reconnect to parent
4. **Undo/Redo**: Verify state restoration
5. **Edit Labels**: Verify persistence
6. **Deep Nesting**: Test recursive rendering

## 📝 Future Enhancements

- Drag-and-drop reordering
- Export as PNG/SVG
- Load workflow from JSON
- Keyboard shortcuts
- Node search/filter
- Workflow validation rules
- Zoom and pan controls

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- CSS3 (no preprocessors)

## 📄 License

MIT

## 👤 Author

Built following strict functional programming principles with React hooks.

---

**Key Achievement**: Clean separation of concerns with data model, state management, and presentation logic completely decoupled. The delete algorithm correctly handles all edge cases while maintaining tree integrity.
