# ✅ Frontend Workflow Builder – Complete Agentic Implementation Plan

---

## PHASE 0 — Guardrails (VERY IMPORTANT)

**Hard constraints the agent must follow**

* React **functional components only**
* Hooks only (`useReducer`, `useContext`)
* No UI libraries
* No workflow/diagram libraries
* CSS only (no animation libs)
* Tree-based layout (no drag & drop)

**Goal**

> Implement a deterministic workflow editor with correct data modeling, node manipulation, and rendering.

---

## PHASE 1 — Project Initialization

### Step 1.1: Bootstrap Project

* Use **Vite + React + TypeScript**
* Clean default boilerplate
* Remove unused assets

```bash
npm create vite@latest workflow-builder -- --template react-ts
cd workflow-builder
npm install
```

---

### Step 1.2: Folder Structure (STRICT)

```
src/
 ├── components/
 │   ├── Node/
 │   │   ├── Node.tsx
 │   │   └── Node.css
 │   ├── AddNodeMenu.tsx
 │   └── Toolbar.tsx
 │
 ├── hooks/
 │   └── useWorkflow.ts
 │
 ├── reducer/
 │   └── workflowReducer.ts
 │
 ├── types/
 │   └── workflow.ts
 │
 ├── utils/
 │   └── workflowHelpers.ts
 │
 ├── App.tsx
 └── main.tsx
```

---

## PHASE 2 — Data Modeling (FOUNDATION)

### Step 2.1: Define Node Types (`types/workflow.ts`)

```ts
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
```

---

### Step 2.2: Initial State

```ts
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
```

---

## PHASE 3 — State Management (useReducer)

### Step 3.1: Define Reducer Actions

```ts
type Action =
  | { type: "ADD_NODE"; payload: AddNodePayload }
  | { type: "DELETE_NODE"; payload: { nodeId: string } }
  | { type: "UPDATE_LABEL"; payload: { nodeId: string; label: string } }
  | { type: "UNDO" }
  | { type: "REDO" };
```

---

### Step 3.2: Reducer Rules (`workflowReducer.ts`)

**Global rules**

* Every mutation:

  * Push current state to `history`
  * Clear `future`
* Root node cannot be deleted
* End nodes cannot have children

---

### Step 3.3: ADD_NODE Logic

**Agent must do**

1. Create new node with UUID
2. Set `parentId`
3. Insert into parent’s `children`

**Special rules**

* Action → replace or append single child
* Branch → add child with `branchLabel` (“True” / “False”)
* End → no children allowed

---

### Step 3.4: DELETE_NODE Logic (CRITICAL)

**Algorithm**

1. Get target node
2. Get parent node
3. Remove target from parent.children
4. Append target.children to parent.children
5. Update each child’s `parentId`
6. Delete node from `nodes`

**Edge cases**

* Prevent deleting root
* Handle branch nodes with multiple children

---

## PHASE 4 — Workflow Hook

### Step 4.1: Create `useWorkflow.ts`

```ts
export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);

  return {
    state,
    addNode: (payload) => dispatch({ type: "ADD_NODE", payload }),
    deleteNode: (nodeId) =>
      dispatch({ type: "DELETE_NODE", payload: { nodeId } }),
    updateLabel: (nodeId, label) =>
      dispatch({ type: "UPDATE_LABEL", payload: { nodeId, label } }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
  };
}
```

---

## PHASE 5 — Rendering Strategy (Recursive)

### Step 5.1: App.tsx

* Initialize workflow hook
* Render `<Toolbar />`
* Render root node

```tsx
<Node nodeId={state.rootId} />
```

---

### Step 5.2: Node Component (`Node.tsx`)

**Responsibilities**

* Render node box
* Inline label edit
* Render add/delete buttons
* Recursively render children

**Render logic**

```tsx
children.map(childId => (
  <Node key={childId} nodeId={childId} />
))
```

---

### Step 5.3: Visual Layout Rules

* Vertical flow using flexbox
* Indent children
* Branch nodes:

  * Show “True” / “False” labels
  * Separate columns

---

## PHASE 6 — User Interactions

### Step 6.1: Edit Label

* Click label → input field
* On blur or Enter → dispatch UPDATE_LABEL

---

### Step 6.2: Add Node Menu

**AddNodeMenu.tsx**

* Appears on “+” click
* Context-aware:

  * Disable invalid node types
* Calls `addNode()`

---

### Step 6.3: Delete Node

* Show delete button except for Start
* Confirm optional
* Dispatch DELETE_NODE

---

## PHASE 7 — Styling (Minimal but Clean)

### Step 7.1: Node Styles

* Rounded card
* Border
* Subtle shadow
* Hover highlight

### Step 7.2: Connections

* CSS vertical lines OR
* Simple SVG lines

---

## PHASE 8 — Bonus Features (Optional but Strong)

### Step 8.1: Save Button

* Toolbar button
* Logs `JSON.stringify(state.nodes, null, 2)`

---

### Step 8.2: Undo / Redo

* Use history & future stacks
* Disable buttons when empty

---

## PHASE 9 — README (MANDATORY)

Agent must generate README with:

* Architecture explanation
* Data model
* Delete-node logic explanation
* Trade-offs
* Live demo link

---

## PHASE 10 — Deployment

### Step 10.1: GitHub

* Clean commit history
* Meaningful commit messages

### Step 10.2: Deploy

* Vercel or Netlify
* Ensure build passes