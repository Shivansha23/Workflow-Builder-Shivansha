# 🔄 Workflow Builder

A deterministic, tree-based workflow editor built with React, TypeScript, and functional programming principles. This application allows users to create, edit, and manage complex workflow diagrams with support for different node types, branching logic, and full undo/redo functionality.

![Workflow Builder Demo](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## 🎯 Features

- **Node Types**: Start, Action, Branch, and End nodes
- **Inline Editing**: Click any node label to edit directly
- **Tree Layout**: Clean, hierarchical workflow visualization
- **Branch Logic**: True/False branching with visual separation
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Delete Nodes**: Smart deletion that preserves workflow integrity
- **Export**: Save workflow state to JSON
- **Pure CSS**: No external UI libraries
- **Type-Safe**: Full TypeScript implementation

## 🏗️ Architecture

### Data Model

The application is built around a tree-based data structure:

```typescript
interface WorkflowNode {
  id: string;              // Unique identifier
  type: NodeType;          // "start" | "action" | "branch" | "end"
  label: string;           // Display label (editable)
  children: string[];      // Array of child node IDs
  parentId?: string;       // Parent node ID (undefined for root)
  branchLabel?: string;    // "True" or "False" for branch children
}

interface WorkflowState {
  nodes: Record<string, WorkflowNode>;  // Node ID -> Node mapping
  rootId: string;                       // Always "start"
  history: WorkflowState[];             // Undo stack
  future: WorkflowState[];              // Redo stack
}
```

### State Management

The application uses React's `useReducer` hook with a centralized reducer pattern:

**Actions:**
- `ADD_NODE`: Add a new child node
- `DELETE_NODE`: Remove a node while preserving children
- `UPDATE_LABEL`: Edit node label
- `UNDO`: Revert last action
- `REDO`: Replay undone action

**Key Rules:**
- Every mutation saves current state to history
- History is cleared on new actions (after undo)
- Root node ("start") cannot be deleted
- End nodes cannot have children

### Delete Node Algorithm

The delete operation is particularly important and follows this algorithm:

```typescript
function deleteNode(state, nodeId) {
  1. Validate: Cannot delete root node
  2. Get target node and its parent
  3. Find target's index in parent.children
  4. Remove target from parent.children
  5. Insert target's children at that position
  6. Update each child's parentId to point to parent
  7. Preserve branchLabel if target was a branch child
  8. Delete target node from state
}
```

**Example:**
```
Before:  Start → Action1 → Action2 → End
Delete Action1:
After:   Start → Action2 → End
```

This ensures workflow continuity even when intermediate nodes are removed.

## 📁 Project Structure

```
src/
├── components/
│   ├── Node/
│   │   ├── Node.tsx          # Recursive node renderer
│   │   └── Node.css          # Node styling
│   ├── AddNodeMenu.tsx       # Modal for adding nodes
│   ├── AddNodeMenu.css       # Menu styling
│   ├── Toolbar.tsx           # Top navigation bar
│   └── Toolbar.css           # Toolbar styling
│
├── hooks/
│   └── useWorkflow.ts        # Main workflow hook (API)
│
├── reducer/
│   └── workflowReducer.ts    # State mutations
│
├── types/
│   └── workflow.ts           # TypeScript interfaces
│
├── utils/
│   └── workflowHelpers.ts    # Helper functions
│
├── App.tsx                   # Root component
├── App.css                   # App layout
├── index.css                 # Global styles
└── main.tsx                  # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd workflow-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage

### Basic Operations

1. **Add Node**: Click the `+` button on any node
2. **Edit Label**: Click on the node label text
3. **Delete Node**: Click the `×` button (not available on Start node)
4. **Undo**: Click Undo button or press `Ctrl+Z`
5. **Redo**: Click Redo button or press `Ctrl+Y`
6. **Save**: Click Save button or press `Ctrl+S` (exports to console)

### Node Types

- **Start**: Root node, cannot be deleted
- **Action**: Standard operation, can have one child
- **Branch**: Decision point, creates True/False paths
- **End**: Terminal node, cannot have children

### Keyboard Shortcuts

- `Ctrl+Z` - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` - Redo
- `Ctrl+S` - Save workflow
- `Enter` - Confirm label edit
- `Escape` - Cancel label edit

## 🎨 Design Decisions

### Why Tree Layout Instead of Drag & Drop?

1. **Deterministic**: Tree structure ensures consistent rendering
2. **Simpler Logic**: No complex collision detection or positioning
3. **Performance**: Recursive React components are efficient
4. **Accessibility**: Keyboard navigation is straightforward

### Why useReducer Instead of useState?

1. **Complex State**: Multiple interdependent state updates
2. **History Management**: Easy to implement undo/redo
3. **Testability**: Pure functions are easier to test
4. **Predictability**: Single source of truth for state changes

### Why No External Libraries?

1. **Learning**: Demonstrates core React/TypeScript skills
2. **Bundle Size**: Minimal dependencies
3. **Control**: Full control over behavior and styling
4. **Constraints**: Project requirements (no UI/diagram libs)

## 🔧 Trade-offs

### Advantages

✅ **Type Safety**: Full TypeScript coverage prevents runtime errors  
✅ **Maintainability**: Clear separation of concerns  
✅ **Extensibility**: Easy to add new node types or actions  
✅ **Predictability**: Immutable state updates  
✅ **Performance**: Efficient re-renders with React keys  

### Limitations

⚠️ **Scaling**: Large workflows (1000+ nodes) may impact performance  
⚠️ **Persistence**: No database, only console export  
⚠️ **Collaboration**: Single-user application  
⚠️ **Mobile**: Desktop-first design  
⚠️ **Validation**: No workflow validation rules (e.g., all paths lead to End)  

## 🧪 Testing Checklist

- [x] Add Start → Action → End workflow
- [x] Add Start → Branch → True/False → End
- [x] Edit node labels
- [x] Delete middle nodes (children reconnect)
- [x] Undo/Redo operations
- [x] Keyboard shortcuts
- [x] Prevent deleting Start node
- [x] Prevent adding children to End nodes
- [x] Save to console (JSON export)

## 🚧 Future Enhancements

Potential improvements (not implemented):

1. **Validation**: Ensure all branches lead to End nodes
2. **Export/Import**: Load workflows from JSON
3. **Zoom/Pan**: Navigate large workflows
4. **Multiple Roots**: Support sub-workflows
5. **Node Properties**: Add metadata (descriptions, conditions)
6. **Drag & Drop**: Optional repositioning
7. **Theming**: Dark mode support
8. **Backend**: Save workflows to database

## 📦 Technologies

- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 7.3** - Build tool
- **CSS3** - Styling (no preprocessors)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a demonstration of React functional components, TypeScript, and state management patterns.

---

**Live Demo**: [Add your deployment URL here]

**Repository**: [Add your GitHub URL here]

