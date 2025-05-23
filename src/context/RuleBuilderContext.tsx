import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { State, Action, FilterNode, GroupNode } from "../types/index";

const RuleBuilderContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const createInitialState = (): State => {
  const rootId = "rootGroup";
  return {
    rootId,
    nodes: {
      [rootId]: {
        id: "rootGroup",
        type: "group",
        name: "New group",
        logic: "AND",
        children: [
          "93aaea76-fe63-4016-9a11-396304014506",
          "6b06bad6-8221-474c-b128-62a09684eb20",
          "48cd03b1-a331-48e7-94ba-2f52691ef656",
        ],
        collapsed: false,
        locked: false,
        disabled: false,
      },
      "93aaea76-fe63-4016-9a11-396304014506": {
        id: "93aaea76-fe63-4016-9a11-396304014506",
        type: "filter",
        field: "gender",
        operator: "equals",
        value: "",
      },
      "6b06bad6-8221-474c-b128-62a09684eb20": {
        id: "6b06bad6-8221-474c-b128-62a09684eb20",
        type: "group",
        logic: "AND",
        name: "New GROUP",
        children: ["f4c697a4-5913-42ff-8840-2adea1eacf19"],
        collapsed: false,
        locked: false,
        disabled: false,
      },
      "f4c697a4-5913-42ff-8840-2adea1eacf19": {
        id: "f4c697a4-5913-42ff-8840-2adea1eacf19",
        type: "filter",
        field: "gender",
        operator: "equals",
        value: "",
      },
      "48cd03b1-a331-48e7-94ba-2f52691ef656": {
        id: "48cd03b1-a331-48e7-94ba-2f52691ef656",
        type: "group",
        logic: "AND",
        name: "New GROUP",
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
      const newFilter: FilterNode = {
        id: action.payload.id,
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
          [action.payload.id]: newFilter,
          [parent.id]: {
            ...parent,
            children: [...parent.children, action.payload.id],
          },
        },
      };
    }
    case "ADD_GROUP": {
      const newGroup: GroupNode = {
        id: action.payload.id,
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
          [action.payload.id]: newGroup,
          [parent.id]: {
            ...parent,
            children: [...parent.children, action.payload.id],
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

      const sourceId = source.droppableId;
      const destId = destination.droppableId;

      if (!state.nodes[sourceId] || !state.nodes[destId]) return state;

      const sourceGroup = state.nodes[sourceId] as GroupNode;
      const destGroup = state.nodes[destId] as GroupNode;

      if (!sourceGroup.children.includes(draggableId)) return state;

      const newSourceChildren = [...sourceGroup.children];
      newSourceChildren.splice(source.index, 1);

      const newDestChildren =
        sourceId === destId ? newSourceChildren : [...destGroup.children];

      newDestChildren.splice(destination.index, 0, draggableId);

      const updatedNodes = {
        ...state.nodes,
        [sourceId]: {
          ...sourceGroup,
          children: newSourceChildren,
        },
        [destId]: {
          ...destGroup,
          children: newDestChildren,
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
