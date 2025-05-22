import React from "react";

import { Minus } from "lucide-react";

import Button from "./ui/Button";
import { useRuleBuilder } from "../context/RuleBuilderContext";

interface FilterProps {
  id: string;
  disabled?: boolean;
  locked?: boolean;
}

export const Filter: React.FC<FilterProps> = ({
  id,
  disabled = false,
  locked = false,
}) => {
  const { state, dispatch } = useRuleBuilder();
  const filter = state.nodes[id];

  if (!filter || filter.type !== "filter") return null;

  const handleChange =
    (field: "field" | "operator" | "value") =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      dispatch({
        type: "UPDATE_FILTER",
        payload: { id, field, value: e.target.value },
      });
    };

  const handleRemove = () => {
    dispatch({ type: "REMOVE_NODE", payload: { id } });
  };

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
      <select
        disabled={disabled}
        value={filter.field}
        onChange={handleChange("field")}
        className="border rounded px-2 py-1 text-sm">
        <option value="gender">Gender</option>
        <option value="age">Age</option>
      </select>
      <select
        disabled={disabled}
        value={filter.operator}
        onChange={handleChange("operator")}
        className="border rounded px-2 py-1 text-sm">
        <option value="equals">Equals</option>
        <option value="not_equals">Not Equals</option>
      </select>
      <input
        disabled={disabled}
        value={filter.value}
        onChange={handleChange("value")}
        className="border rounded px-2 py-1 text-sm"
        placeholder="Value"
      />
      <Button disabled={locked || disabled} onClick={handleRemove}>
        <Minus size={16} />
      </Button>
    </div>
  );
};
