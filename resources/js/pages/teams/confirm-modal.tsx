import Modal from "@/components/modal";
import { t } from "i18next";
import { Trash } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void,
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: "red" | "green";
  selected?: string;
  lucideIcon?: React.ReactNode;
  processing?: boolean;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmColor, selected, lucideIcon, processing }: ConfirmModalProps) => (
  console.log(processing),
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">

    <p className="flex justify-center">{lucideIcon}</p>
    <p className="py-4 text-center">{message}? <span className='text-red-600'>{selected}</span></p>

    <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-sm font-medium rounded hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-${confirmColor}-600 text-white text-sm font-medium rounded hover:bg-${confirmColor}-400 cursor-pointer 
            ${processing ? `cursor-none! bg-${confirmColor}-300! hover:bg-${confirmColor}-400!` : ''}`}
            disabled={processing}
            onClick={onConfirm}
          >
            {processing && (
              <span className="loading loading-spinner loading-xs mr-2"></span>
            )}
            {confirmLabel}
          </button>
    </div>
  </Modal>
);

export default ConfirmModal;
