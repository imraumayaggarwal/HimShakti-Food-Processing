"use client";

import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          p-8
          w-full
          max-w-lg
        "
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}