import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { State, Action, FilterNode, GroupNode } from "../types/index";

const RuleBuilderContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const createInitialState = (): State => {
  const rootId = uuidv4();
  return {
    rootId,
    nodes: {
      [rootId]: {
        id: rootId,
        type: "group",
        name: "New group",
        logic: "AND",
        children: [],
        collapsed: false,
        locked: false,
        disabled: false,
      },
    },
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FILTER": {
      const id = uuidv4();
      const newFilter: FilterNode = {
        id,
        type: "filter",
        field: "gender",
        operator: "equals",
        value: "",
      };
      const parent = state.nodes[action.payload.parentId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: newFilter,
          [parent.id]: {
            ...parent,
            children: [...parent.children, id],
          },
        },
      };
    }
    case "ADD_GROUP": {
      const id = uuidv4();
      const newGroup: GroupNode = {
        id,
        type: "group",
        logic: "AND",
        name: "New GROUP",
        children: [],
        collapsed: false,
        locked: false,
        disabled: false,
      };
      const parent = state.nodes[action.payload.parentId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: newGroup,
          [parent.id]: {
            ...parent,
            children: [...parent.children, id],
          },
        },
      };
    }
    case "LOCK_GROUP": {
      const { groupId } = action.payload;

      const newState = { ...state, nodes: { ...state.nodes } };

      const toggleLocked = !state.nodes[groupId].locked;

      const applyLockRecursively = (id: string, locked: boolean) => {
        const node = newState.nodes[id];
        if (!node) return;

        newState.nodes[id] = {
          ...node,
          locked,
        };

        if (
          node.type === "group" &&
          "children" in node &&
          node.children?.length
        ) {
          node.children.forEach((childId: string) =>
            applyLockRecursively(childId, locked)
          );
        }
      };

      applyLockRecursively(groupId, toggleLocked);

      return newState;
    }
    case "DISABLE_GROUP": {
      const group = state.nodes[action.payload.groupId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [group.id]: {
            ...group,
            disabled: !group.disabled,
          },
        },
      };
    }
    case "COLLAPSE_GROUP": {
      const group = state.nodes[action.payload.groupId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [group.id]: {
            ...group,
            collapsed: !group.collapsed,
          },
        },
      };
    }
    case "TOGGLE_LOGIC": {
      const group = state.nodes[action.payload.groupId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [group.id]: {
            ...group,
            logic: group.logic === "AND" ? "OR" : "AND",
          },
        },
      };
    }
    case "UPDATE_FILTER": {
      const filter = state.nodes[action.payload.id];
      if (!filter || filter.type !== "filter") return state;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [filter.id]: {
            ...filter,
            [action.payload.field]: action.payload.value,
          },
        },
      };
    }
    case "CHANGE_NAME": {
      const group = state.nodes[action.payload.groupId] as GroupNode;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [group.id]: {
            ...group,
            name: action.payload.name,
          },
        },
      };
    }
    case "REMOVE_NODE": {
      const id = action.payload.id;
      const newNodes = { ...state.nodes };
      delete newNodes[id];

      for (const node of Object.values(newNodes)) {
        if (node.type === "group") {
          node.children = node.children.filter((childId) => childId !== id);
        }
      }
      return { ...state, nodes: newNodes };
    }
    case "DRAG_END": {
      const { source, destination, draggableId } = action.payload;
      if (!destination) return state;

      const sourceGroup = state.nodes[source.droppableId] as GroupNode;
      const destGroup = state.nodes[destination.droppableId] as GroupNode;

      if (!sourceGroup || !destGroup) return state;

      const sourceChildren = [...sourceGroup.children];
      const destChildren = [...destGroup.children];

      sourceChildren.splice(source.index, 1);

      destChildren.splice(destination.index, 0, draggableId);

      const updatedNodes = {
        ...state.nodes,
        [sourceGroup.id]: {
          ...sourceGroup,
          children: sourceChildren,
        },
        [destGroup.id]: {
          ...destGroup,
          children: destChildren,
        },
      };

      return {
        ...state,
        nodes: updatedNodes,
      };
    }

    default:
      return state;
  }
}

export const RuleBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  return (
    <RuleBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </RuleBuilderContext.Provider>
  );
};

export const useRuleBuilder = () => {
  const context = useContext(RuleBuilderContext);
  if (!context)
    throw new Error("useRuleBuilder must be used within RuleBuilderProvider");
  return context;
};
