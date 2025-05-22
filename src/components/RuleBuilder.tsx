import React from "react";

import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Group } from "./Group";
import { useRuleBuilder } from "../context/RuleBuilderContext";

export const RuleBuilder: React.FC = () => {
  const { state, dispatch } = useRuleBuilder();

  const onDragEnd = (result: DropResult) => {
    dispatch({ type: "DRAG_END", payload: result });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6 max-w-4xl mx-auto">
        <Group id={state.rootId} />
      </div>
    </DragDropContext>
  );
};
