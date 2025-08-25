// components/Modal.tsx
import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className={`modal ${isOpen ? "modal-open" : ""}`}
      onClose={onClose}
    >
      <div
        className={`modal-box w-11/12 ${sizeClasses[size]} rounded-lg shadow-lg border border-gray-200 bg-gray-50`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
