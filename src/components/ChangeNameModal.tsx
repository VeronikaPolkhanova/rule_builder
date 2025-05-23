import React, { useState } from "react";

import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { Action } from "../types/index";

interface ChangeNameModalProps {
  setIsModal: (isModal: boolean) => void;
  dispatch: (action: Action) => void;
  initialName: string;
  id: string;
}

export const ChangeNameModal: React.FC<ChangeNameModalProps> = ({
  setIsModal,
  initialName,
  dispatch,
  id,
}) => {
  const [name, setName] = useState(initialName);
  const handleChangeName = () => {
    dispatch({
      type: "CHANGE_NAME",
      payload: { groupId: id, name: name },
    });
    setIsModal(false);
  };

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  return (
    <Modal isOpen onClose={() => setIsModal(false)}>
      <div className="flex justify-between gap-2 items-center">
        <input
          value={name}
          onChange={onChangeName}
          className="border rounded px-2 py-1 text-sm w-full"
          placeholder="value"
        />
        <Button onClick={handleChangeName}>Save</Button>
      </div>
    </Modal>
  );
};
