import React from "react";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Group } from "./Group";
import { Filter } from "./Filter";
import { GroupNode } from "../types";
import { useRuleBuilder } from "../context/RuleBuilderContext";

interface DndListProps {
  id: string;
  group: GroupNode;
}

export const DndList: React.FC<DndListProps> = ({ id, group }) => {
  const { state } = useRuleBuilder();

  return (
    <Droppable droppableId={id} type="RULE">
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
                    key={node.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    {node.type === "filter" ? (
                      <Filter
                        id={node.id}
                        disabled={group.disabled}
                        locked={group.locked}
                      />
                    ) : (
                      <Group id={node.id} />
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
