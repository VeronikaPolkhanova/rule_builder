import React, { useState } from "react";

import { FolderPlus, Plus, RefreshCw, Edit } from "lucide-react";

import { cn } from "./lib/utils";
import Button from "./ui/Button";
import { useRuleBuilder } from "../context/RuleBuilderContext";
import { createPortal } from "react-dom";
import { ChangeNameModal } from "./ChangeNameModal";
import { DndList } from "./DndList";

interface GroupProps {
  id: string;
}

export const Group: React.FC<GroupProps> = ({ id }) => {
  const [isModal, setIsModal] = useState(false);
  const { state, dispatch } = useRuleBuilder();
  const group = state.nodes[id];

  if (!group || group.type !== "group") return null;

  const handleAddFilter = () =>
    dispatch({ type: "ADD_FILTER", payload: { parentId: id } });
  const handleAddGroup = () =>
    dispatch({ type: "ADD_GROUP", payload: { parentId: id } });
  const handleDisableGroup = () =>
    dispatch({ type: "DISABLE_GROUP", payload: { groupId: id } });
  const handleCollapseGroup = () =>
    dispatch({ type: "COLLAPSE_GROUP", payload: { groupId: id } });
  const handleLockGroup = () =>
    dispatch({ type: "LOCK_GROUP", payload: { groupId: id } });
  const handleToggleLogic = () =>
    dispatch({ type: "TOGGLE_LOGIC", payload: { groupId: id } });

  return (
    <div
      className={cn(
        group.logic === "OR" ? " border-green-500" : "border-blue-500",
        group.disabled || group.locked ? "bg-gray-200" : "bg-white",
        "border-x-4 rounded-xl p-4 space-y-4"
      )}>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          Name:
          <span className="text-gray-700">{group.name}</span>
          <Button
            onClick={() => setIsModal(true)}
            disabled={group.locked || group.disabled}>
            <Edit size={16} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLockGroup}>
            {group.locked ? "Unlock" : "Lock"}
          </Button>
          <Button onClick={handleDisableGroup}>
            {group.disabled ? "Enable" : "Disable"}
          </Button>
          <Button onClick={handleCollapseGroup}>
            {!group.collapsed ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      {!group.collapsed && (
        <>
          <div className="flex gap-2 items-center">
            Logic:
            <span className="text-gray-700">{group.logic}</span>
            <Button
              onClick={handleToggleLogic}
              disabled={group.locked || group.disabled}>
              <RefreshCw size={16} />
            </Button>
          </div>
          <DndList group={group} id={id} />
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleAddFilter}
              disabled={group.locked || group.disabled}>
              <Plus className="mr-1" size={16} /> Add Filter
            </Button>
            <Button
              onClick={handleAddGroup}
              disabled={group.locked || group.disabled}>
              <FolderPlus className="mr-1" size={16} /> Add Group
            </Button>
          </div>
        </>
      )}
      {isModal &&
        createPortal(
          <ChangeNameModal
            initialName={group.name}
            setIsModal={setIsModal}
            dispatch={dispatch}
            id={id}
          />,
          document.body
        )}
    </div>
  );
};
