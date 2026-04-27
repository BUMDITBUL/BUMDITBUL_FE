"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface SaveButtonProps {
  title?: string;
  description?: string;
  onSave?: () => void;
}

export default function SaveButton({
  title = "저장하시겠습니까?",
  description,
  onSave,
}: SaveButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onSave?.();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity bg-brand-green-400"
        style={{ height: "46px", borderRadius: "14px" }}
      >
        저장
      </button>

      {open && (
        <ConfirmModal
          title={title}
          description={description}
          onConfirm={handleConfirm}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
