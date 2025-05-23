import { DropResult } from "react-beautiful-dnd";

export type NodeType = "group" | "filter";

export interface NodeBase {
  id: string;
  type: NodeType;
  locked?: boolean;
  disabled?: boolean;
}

export interface FilterNode extends NodeBase {
  type: "filter";
  field: string;
  operator: string;
  value: string;
}

export interface GroupNode extends NodeBase {
  type: "group";
  logic: "AND" | "OR";
  name: string;
  children: string[];
  collapsed: boolean;
}

export type RuleNode = FilterNode | GroupNode;

export interface State {
  rootId: string;
  nodes: Record<string, RuleNode>;
}

export type Action =
  | { type: "ADD_FILTER"; payload: { parentId: string; id: string } }
  | { type: "ADD_GROUP"; payload: { parentId: string; id: string } }
  | { type: "DISABLE_GROUP"; payload: { groupId: string } }
  | { type: "LOCK_GROUP"; payload: { groupId: string } }
  | { type: "COLLAPSE_GROUP"; payload: { groupId: string } }
  | { type: "TOGGLE_LOGIC"; payload: { groupId: string } }
  | {
      type: "UPDATE_FILTER";
      payload: { id: string; field: string; value: string };
    }
  | { type: "REMOVE_NODE"; payload: { id: string } }
  | { type: "DRAG_END"; payload: DropResult }
  | { type: "CHANGE_NAME"; payload: { groupId: string; name: string } };
