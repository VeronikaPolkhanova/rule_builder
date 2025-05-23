import React from "react";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Group } from "./Group";
import { Filter } from "./Filter";
import { Action, GroupNode, State } from "../types";

interface DndListProps {
  id: string;
  group: GroupNode;
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const DndList: React.FC<DndListProps> = ({
  id,
  group,
  state,
  dispatch,
}) => {
  return (
    <Droppable droppableId={id} isDropDisabled={false} type="RULE">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-2">
          {group.children.map((childId, index) => {
            const node = state.nodes[childId];
            if (!node) return null;
            return (
              <Draggable key={node.id} draggableId={node.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    {node.type === "filter" ? (
                      <Filter
                        id={node.id}
                        disabled={group.disabled}
                        locked={group.locked}
                        state={state}
                        dispatch={dispatch}
                      />
                    ) : (
                      <Group id={node.id} state={state} dispatch={dispatch} />
                    )}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
